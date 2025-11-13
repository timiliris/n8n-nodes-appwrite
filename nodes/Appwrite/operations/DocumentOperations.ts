import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Databases } from 'node-appwrite';

export async function executeDocumentOperation(
	this: IExecuteFunctions,
	databases: Databases,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {
	const databaseId = this.getNodeParameter('databaseId', i) as string;
	const collectionId = this.getNodeParameter('collectionId', i) as string;

	if (operation === 'create') {
		const documentId = this.getNodeParameter('documentId', i) as string;
		const data = this.getNodeParameter('data', i) as string;
		const documentData = typeof data === 'string' ? JSON.parse(data) : data;
		const permissionsStr = this.getNodeParameter('permissions', i, '[]') as string;
		const permissions =
			typeof permissionsStr === 'string' ? JSON.parse(permissionsStr) : permissionsStr;

		const response = await databases.createDocument(
			databaseId,
			collectionId,
			documentId,
			documentData,
			permissions,
		);
		return { json: response };
	} else if (operation === 'get') {
		const documentId = this.getNodeParameter('documentId', i) as string;
		const response = await databases.getDocument(databaseId, collectionId, documentId);
		return { json: response };
	} else if (operation === 'list') {
		const response = await databases.listDocuments(databaseId, collectionId);
		return { json: response };
	} else if (operation === 'update') {
		const documentId = this.getNodeParameter('documentId', i) as string;
		const data = this.getNodeParameter('data', i) as string;
		const documentData = typeof data === 'string' ? JSON.parse(data) : data;
		const permissionsStr = this.getNodeParameter('permissions', i, '[]') as string;
		const permissions =
			typeof permissionsStr === 'string' ? JSON.parse(permissionsStr) : permissionsStr;

		const response = await databases.updateDocument(
			databaseId,
			collectionId,
			documentId,
			documentData,
			permissions,
		);
		return { json: response };
	} else if (operation === 'delete') {
		const documentId = this.getNodeParameter('documentId', i) as string;
		await databases.deleteDocument(databaseId, collectionId, documentId);
		return { json: { success: true, documentId } };
	}

	throw new Error(`Unknown document operation: ${operation}`);
}
