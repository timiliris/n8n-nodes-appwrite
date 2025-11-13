import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Databases } from 'node-appwrite';

export async function executeDatabaseOperation(
	this: IExecuteFunctions,
	databases: Databases,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {
	if (operation === 'create') {
		const databaseId = this.getNodeParameter('databaseId', i) as string;
		const name = this.getNodeParameter('name', i) as string;
		const enabled = this.getNodeParameter('enabled', i, true) as boolean;

		const response = await databases.create(databaseId, name, enabled);
		return { json: response };
	} else if (operation === 'get') {
		const databaseId = this.getNodeParameter('databaseId', i) as string;
		const response = await databases.get(databaseId);
		return { json: response };
	} else if (operation === 'list') {
		const response = await databases.list();
		return { json: response };
	} else if (operation === 'update') {
		const databaseId = this.getNodeParameter('databaseId', i) as string;
		const name = this.getNodeParameter('name', i) as string;
		const enabled = this.getNodeParameter('enabled', i, true) as boolean;

		const response = await databases.update(databaseId, name, enabled);
		return { json: response };
	} else if (operation === 'delete') {
		const databaseId = this.getNodeParameter('databaseId', i) as string;
		await databases.delete(databaseId);
		return { json: { success: true, databaseId } };
	}

	throw new Error(`Unknown database operation: ${operation}`);
}
