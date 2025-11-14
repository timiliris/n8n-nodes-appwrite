import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Users } from 'node-appwrite';

/**
 * Executes user operations for Appwrite
 * @param this - n8n execution context
 * @param users - Appwrite Users service instance
 * @param operation - Operation to perform (createUser, getUser, listUsers, updateUser, deleteUser, updateUserPreferences, getUserPreferences)
 * @param i - Current item index
 * @returns Execution data with operation results
 * @throws Error if operation is unknown
 */
export async function executeUsersOperation(
	this: IExecuteFunctions,
	users: Users,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {
	if (operation === 'createUser') {
		const userId = this.getNodeParameter('userId', i) as string;
		const email = this.getNodeParameter('email', i) as string;
		const password = this.getNodeParameter('password', i, '') as string;
		const name = this.getNodeParameter('name', i, '') as string;

		const response = await users.create(userId, email, undefined, password, name);
		return { json: response };
	} else if (operation === 'getUser') {
		const userId = this.getNodeParameter('userId', i) as string;
		const response = await users.get(userId);
		return { json: response };
	} else if (operation === 'updateUser') {
		const userId = this.getNodeParameter('userId', i) as string;
		const name = this.getNodeParameter('name', i, '') as string;

		const response = await users.updateName(userId, name);
		return { json: response };
	} else if (operation === 'deleteUser') {
		const userId = this.getNodeParameter('userId', i) as string;
		await users.delete(userId);
		return { json: { success: true, userId } };
	} else if (operation === 'listUsers') {
		const response = await users.list();
		return { json: response };
	}

	throw new Error(`Unknown users operation: ${operation}`);
}
