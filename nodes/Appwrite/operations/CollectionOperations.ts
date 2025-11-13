import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Databases } from 'node-appwrite';

export async function executeCollectionOperation(
	this: IExecuteFunctions,
	databases: Databases,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {
	const databaseId = this.getNodeParameter('databaseId', i) as string;

	if (operation === 'create') {
		const collectionId = this.getNodeParameter('collectionId', i) as string;
		const name = this.getNodeParameter('name', i) as string;
		const permissionsStr = this.getNodeParameter('permissions', i, '[]') as string;
		const permissions =
			typeof permissionsStr === 'string' ? JSON.parse(permissionsStr) : permissionsStr;
		const documentSecurity = this.getNodeParameter('documentSecurity', i, false) as boolean;
		const enabled = this.getNodeParameter('enabled', i, true) as boolean;

		const response = await databases.createCollection(
			databaseId,
			collectionId,
			name,
			permissions,
			documentSecurity,
			enabled,
		);
		return { json: response };
	} else if (operation === 'get') {
		const collectionId = this.getNodeParameter('collectionId', i) as string;
		const response = await databases.getCollection(databaseId, collectionId);
		return { json: response };
	} else if (operation === 'list') {
		const response = await databases.listCollections(databaseId);
		return { json: response };
	} else if (operation === 'update') {
		const collectionId = this.getNodeParameter('collectionId', i) as string;
		const name = this.getNodeParameter('name', i) as string;
		const permissionsStr = this.getNodeParameter('permissions', i, '[]') as string;
		const permissions =
			typeof permissionsStr === 'string' ? JSON.parse(permissionsStr) : permissionsStr;
		const documentSecurity = this.getNodeParameter('documentSecurity', i, false) as boolean;
		const enabled = this.getNodeParameter('enabled', i, true) as boolean;

		const response = await databases.updateCollection(
			databaseId,
			collectionId,
			name,
			permissions,
			documentSecurity,
			enabled,
		);
		return { json: response };
	} else if (operation === 'delete') {
		const collectionId = this.getNodeParameter('collectionId', i) as string;
		await databases.deleteCollection(databaseId, collectionId);
		return { json: { success: true, collectionId } };
	} else if (operation === 'listAttributes') {
		const collectionId = this.getNodeParameter('collectionId', i) as string;
		const response = await databases.listAttributes(databaseId, collectionId);
		return { json: response };
	} else if (operation === 'listIndexes') {
		const collectionId = this.getNodeParameter('collectionId', i) as string;
		const response = await databases.listIndexes(databaseId, collectionId);
		return { json: response };
	}

	throw new Error(`Unknown collection operation: ${operation}`);
}
