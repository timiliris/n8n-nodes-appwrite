import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Teams } from 'node-appwrite';
import { safeJsonParse } from '../utils/validators';

/**
 * Executes team operations for Appwrite
 * @param this - n8n execution context
 * @param teams - Appwrite Teams service instance
 * @param operation - Operation to perform (create, get, list, update, delete, listMemberships, updatePreferences, getPreferences)
 * @param i - Current item index
 * @returns Execution data with operation results
 * @throws Error if operation is unknown or JSON parsing fails
 */
export async function executeTeamsOperation(
	this: IExecuteFunctions,
	teams: Teams,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {
	// Team Operations
	if (operation === 'create') {
		const teamId = this.getNodeParameter('teamId', i) as string;
		const name = this.getNodeParameter('name', i) as string;
		const rolesStr = this.getNodeParameter('roles', i, '') as string;
		const roles = rolesStr ? rolesStr.split(',').map((role) => role.trim()) : undefined;

		const response = await teams.create(teamId, name, roles);
		return { json: response };
	} else if (operation === 'get') {
		const teamId = this.getNodeParameter('teamId', i) as string;
		const response = await teams.get(teamId);
		return { json: response };
	} else if (operation === 'list') {
		const response = await teams.list();
		return { json: response };
	} else if (operation === 'update') {
		const teamId = this.getNodeParameter('teamId', i) as string;
		const name = this.getNodeParameter('name', i) as string;

		const response = await teams.updateName(teamId, name);
		return { json: response };
	} else if (operation === 'delete') {
		const teamId = this.getNodeParameter('teamId', i) as string;
		await teams.delete(teamId);
		return { json: { success: true, teamId } };
	}
	// Membership Operations
	else if (operation === 'createMembership') {
		const teamId = this.getNodeParameter('teamId', i) as string;
		const email = this.getNodeParameter('email', i, '') as string;
		const userId = this.getNodeParameter('userId', i, '') as string;
		const rolesStr = this.getNodeParameter('roles', i) as string;
		const roles = rolesStr.split(',').map((role) => role.trim());
		const url = this.getNodeParameter('url', i, '') as string;

		// Must provide either email or userId
		if (!email && !userId) {
			throw new Error('Either Email or User ID must be provided');
		}

		let response;
		if (email) {
			response = await teams.createMembership(
				teamId,
				roles,
				email,
				userId || undefined,
				undefined,
				url || undefined,
			);
		} else {
			response = await teams.createMembership(
				teamId,
				roles,
				undefined,
				userId,
				undefined,
				url || undefined,
			);
		}

		return { json: response };
	} else if (operation === 'getMembership') {
		const teamId = this.getNodeParameter('teamId', i) as string;
		const membershipId = this.getNodeParameter('membershipId', i) as string;

		const response = await teams.getMembership(teamId, membershipId);
		return { json: response };
	} else if (operation === 'listMemberships') {
		const teamId = this.getNodeParameter('teamId', i) as string;

		const response = await teams.listMemberships(teamId);
		return { json: response };
	} else if (operation === 'updateMembership') {
		const teamId = this.getNodeParameter('teamId', i) as string;
		const membershipId = this.getNodeParameter('membershipId', i) as string;
		const rolesStr = this.getNodeParameter('roles', i) as string;
		const roles = rolesStr.split(',').map((role) => role.trim());

		const response = await teams.updateMembership(teamId, membershipId, roles);
		return { json: response };
	} else if (operation === 'deleteMembership') {
		const teamId = this.getNodeParameter('teamId', i) as string;
		const membershipId = this.getNodeParameter('membershipId', i) as string;

		await teams.deleteMembership(teamId, membershipId);
		return { json: { success: true, membershipId } };
	}
	// Preferences Operations
	else if (operation === 'getPreferences') {
		const teamId = this.getNodeParameter('teamId', i) as string;

		const response = await teams.getPrefs(teamId);
		return { json: response };
	} else if (operation === 'updatePreferences') {
		const teamId = this.getNodeParameter('teamId', i) as string;
		const preferencesStr = this.getNodeParameter('preferences', i) as string;
		const parseResult = safeJsonParse<Record<string, unknown>>(preferencesStr, 'preferences');
		if (!parseResult.success) {
			throw new Error(parseResult.error);
		}
		const preferences = parseResult.data as object;

		const response = await teams.updatePrefs(teamId, preferences);
		return { json: response };
	}

	throw new Error(`Unknown teams operation: ${operation}`);
}
