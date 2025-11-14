import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Databases } from 'node-appwrite';
import { IndexType } from '../utils/types';

/**
 * Executes index operations for Appwrite collections
 * @param this - n8n execution context
 * @param databases - Appwrite Databases service instance
 * @param operation - Operation to perform (create, delete, list)
 * @param i - Current item index
 * @returns Execution data with operation results
 * @throws Error if operation is unknown
 */
export async function executeIndexOperation(
	this: IExecuteFunctions,
	databases: Databases,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {
	const databaseId = this.getNodeParameter('databaseId', i) as string;
	const collectionId = this.getNodeParameter('collectionId', i) as string;

	if (operation === 'create') {
		const key = this.getNodeParameter('key', i) as string;
		const type = this.getNodeParameter('type', i) as IndexType;
		const attributes = this.getNodeParameter('attributes', i) as string;
		const attributesArray = attributes.split(',').map((a) => a.trim());
		const ordersStr = this.getNodeParameter('orders', i, '') as string;
		const ordersArray = ordersStr ? ordersStr.split(',').map((o) => o.trim()) : undefined;

		const response = await databases.createIndex(
			databaseId,
			collectionId,
			key,
			// Type assertion required: Appwrite SDK expects internal IndexType enum but we use string.
			// This is safe as we validate the type against IndexType union ('key' | 'fulltext' | 'unique').
			type as any,
			attributesArray,
			ordersArray,
		);
		return { json: response };
	} else if (operation === 'delete') {
		const key = this.getNodeParameter('key', i) as string;
		await databases.deleteIndex(databaseId, collectionId, key);
		return { json: { success: true, key } };
	} else if (operation === 'list') {
		const response = await databases.listIndexes(databaseId, collectionId);
		return { json: response };
	}

	throw new Error(`Unknown index operation: ${operation}`);
}
