import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Databases } from 'node-appwrite';

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
		const type = this.getNodeParameter('type', i) as string;
		const attributes = this.getNodeParameter('attributes', i) as string;
		const attributesArray = attributes.split(',').map((a) => a.trim());
		const ordersStr = this.getNodeParameter('orders', i, '') as string;
		const ordersArray = ordersStr ? ordersStr.split(',').map((o) => o.trim()) : undefined;

		const response = await databases.createIndex(
			databaseId,
			collectionId,
			key,
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
