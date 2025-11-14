import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Databases } from 'node-appwrite';
import { getDatabaseParameters, getRequiredParameter } from '../utils/helpers';
import { safeJsonParse, safeJsonArrayParse } from '../utils/validators';
import { ValidationError } from '../utils/errors';
import {
	processBatch,
	validateBatchCreateItems,
	validateBatchUpdateItems,
	validateBatchDeleteItems,
	formatBatchResult,
	BatchOptions,
} from '../utils/batch';

/**
 * Executes document operations for Appwrite
 * @param this - n8n execution context
 * @param databases - Appwrite Databases service instance
 * @param operation - Operation to perform (create, get, list, update, delete)
 * @param i - Current item index
 * @returns Execution data with operation results
 * @throws ValidationError if data validation fails
 * @throws Error if operation is unknown
 */
export async function executeDocumentOperation(
	this: IExecuteFunctions,
	databases: Databases,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {
	const { databaseId, collectionId } = getDatabaseParameters(this, i);

	if (operation === 'create') {
		const documentId = getRequiredParameter(this, 'documentId', i);
		const data = this.getNodeParameter('data', i) as string;

		// Safely parse document data
		const dataResult = safeJsonParse(data, 'document data');
		if (!dataResult.success) {
			throw new ValidationError(dataResult.error);
		}
		const documentData = dataResult.data;

		// Safely parse permissions array
		const permissionsStr = this.getNodeParameter('permissions', i, '[]') as string;
		const permissionsResult = safeJsonArrayParse(permissionsStr, 'permissions');
		if (!permissionsResult.success) {
			throw new ValidationError(permissionsResult.error);
		}
		const permissions = permissionsResult.data;

		const response = await databases.createDocument(
			databaseId,
			collectionId,
			documentId,
			documentData as Record<string, unknown>,
			permissions,
		);
		return { json: response };
	} else if (operation === 'get') {
		const documentId = getRequiredParameter(this, 'documentId', i);
		const response = await databases.getDocument(databaseId, collectionId, documentId);
		return { json: response };
	} else if (operation === 'list') {
		const response = await databases.listDocuments(databaseId, collectionId);
		return { json: response };
	} else if (operation === 'update') {
		const documentId = getRequiredParameter(this, 'documentId', i);
		const data = this.getNodeParameter('data', i) as string;

		// Safely parse document data
		const dataResult = safeJsonParse(data, 'document data');
		if (!dataResult.success) {
			throw new ValidationError(dataResult.error);
		}
		const documentData = dataResult.data;

		// Safely parse permissions array
		const permissionsStr = this.getNodeParameter('permissions', i, '[]') as string;
		const permissionsResult = safeJsonArrayParse(permissionsStr, 'permissions');
		if (!permissionsResult.success) {
			throw new ValidationError(permissionsResult.error);
		}
		const permissions = permissionsResult.data;

		const response = await databases.updateDocument(
			databaseId,
			collectionId,
			documentId,
			documentData as Record<string, unknown>,
			permissions,
		);
		return { json: response };
	} else if (operation === 'delete') {
		const documentId = getRequiredParameter(this, 'documentId', i);
		await databases.deleteDocument(databaseId, collectionId, documentId);
		return { json: { success: true, documentId } };
	} else if (operation === 'batchCreate') {
		// Get batch items
		const itemsStr = this.getNodeParameter('batchItems', i) as string;
		const itemsResult = safeJsonParse(itemsStr, 'batch items');
		if (!itemsResult.success) {
			throw new ValidationError(itemsResult.error);
		}

		// Validate batch items
		const items = validateBatchCreateItems(itemsResult.data);

		// Get batch options
		const continueOnError = this.getNodeParameter('continueOnError', i, true) as boolean;
		const batchSize = this.getNodeParameter('batchSize', i, 10) as number;
		const parallel = this.getNodeParameter('parallel', i, false) as boolean;

		const batchOptions: BatchOptions = {
			continueOnError,
			batchSize,
			parallel,
			maxConcurrency: 5,
		};

		// Process batch
		const batchResult = await processBatch(
			items,
			async (item) => {
				return await databases.createDocument(
					databaseId,
					collectionId,
					item.documentId || 'unique()',
					item.data,
					item.permissions || [],
				);
			},
			batchOptions,
		);

		// Format and return result
		const { summary, details } = formatBatchResult(batchResult);
		return {
			json: {
				...batchResult,
				summary,
				details,
			},
		};
	} else if (operation === 'batchUpdate') {
		// Get batch items
		const itemsStr = this.getNodeParameter('batchItems', i) as string;
		const itemsResult = safeJsonParse(itemsStr, 'batch items');
		if (!itemsResult.success) {
			throw new ValidationError(itemsResult.error);
		}

		// Validate batch items
		const items = validateBatchUpdateItems(itemsResult.data);

		// Get batch options
		const continueOnError = this.getNodeParameter('continueOnError', i, true) as boolean;
		const batchSize = this.getNodeParameter('batchSize', i, 10) as number;
		const parallel = this.getNodeParameter('parallel', i, false) as boolean;

		const batchOptions: BatchOptions = {
			continueOnError,
			batchSize,
			parallel,
			maxConcurrency: 5,
		};

		// Process batch
		const batchResult = await processBatch(
			items,
			async (item) => {
				return await databases.updateDocument(
					databaseId,
					collectionId,
					item.documentId,
					item.data,
					item.permissions || [],
				);
			},
			batchOptions,
		);

		// Format and return result
		const { summary, details } = formatBatchResult(batchResult);
		return {
			json: {
				...batchResult,
				summary,
				details,
			},
		};
	} else if (operation === 'batchDelete') {
		// Get batch items
		const itemsStr = this.getNodeParameter('batchItems', i) as string;
		const itemsResult = safeJsonParse(itemsStr, 'batch items');
		if (!itemsResult.success) {
			throw new ValidationError(itemsResult.error);
		}

		// Validate batch items
		const items = validateBatchDeleteItems(itemsResult.data);

		// Get batch options
		const continueOnError = this.getNodeParameter('continueOnError', i, true) as boolean;
		const batchSize = this.getNodeParameter('batchSize', i, 10) as number;
		const parallel = this.getNodeParameter('parallel', i, false) as boolean;

		const batchOptions: BatchOptions = {
			continueOnError,
			batchSize,
			parallel,
			maxConcurrency: 5,
		};

		// Process batch
		const batchResult = await processBatch(
			items,
			async (item) => {
				await databases.deleteDocument(databaseId, collectionId, item.documentId);
				return { success: true, documentId: item.documentId };
			},
			batchOptions,
		);

		// Format and return result
		const { summary, details } = formatBatchResult(batchResult);
		return {
			json: {
				...batchResult,
				summary,
				details,
			},
		};
	}

	throw new Error(`Unknown document operation: ${operation}`);
}
