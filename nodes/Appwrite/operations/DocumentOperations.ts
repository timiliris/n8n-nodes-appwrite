import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Databases } from 'node-appwrite';
import { getDatabaseParameters, getRequiredParameter } from '../utils/helpers';
import { safeJsonParse, safeJsonArrayParse } from '../utils/validators';
import { ValidationError } from '../utils/errors';

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
	}

	throw new Error(`Unknown document operation: ${operation}`);
}
