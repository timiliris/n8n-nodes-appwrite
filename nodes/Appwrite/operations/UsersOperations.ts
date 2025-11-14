import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Users } from 'node-appwrite';
import { safeJsonParse } from '../utils/validators';

/**
 * Executes user operations for Appwrite
 * @param this - n8n execution context
 * @param users - Appwrite Users service instance
 * @param operation - Operation to perform
 * @param i - Current item index
 * @returns Execution data with operation results
 * @throws Error if operation is unknown or validation fails
 */
export async function executeUsersOperation(
	this: IExecuteFunctions,
	users: Users,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {
	// Basic User Operations
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
	// Email Operations
	else if (operation === 'updateEmail') {
		/**
		 * Update user email address
		 * Requires user ID and new email address
		 */
		const userId = this.getNodeParameter('userId', i) as string;
		const email = this.getNodeParameter('email', i) as string;

		const response = await users.updateEmail(userId, email);
		return { json: response };
	}
	// Phone Operations
	else if (operation === 'updatePhone') {
		/**
		 * Update user phone number
		 * Requires user ID and new phone number in E.164 format
		 */
		const userId = this.getNodeParameter('userId', i) as string;
		const phone = this.getNodeParameter('phone', i) as string;

		const response = await users.updatePhone(userId, phone);
		return { json: response };
	}
	// Password Operations
	else if (operation === 'updatePassword') {
		/**
		 * Update user password
		 * Requires user ID and new password
		 */
		const userId = this.getNodeParameter('userId', i) as string;
		const password = this.getNodeParameter('password', i) as string;

		const response = await users.updatePassword(userId, password);
		return { json: response };
	}
	// Verification Operations
	else if (operation === 'updateEmailVerification') {
		/**
		 * Update email verification status
		 * Directly sets the user's email verification status (admin operation)
		 */
		const userId = this.getNodeParameter('userId', i) as string;
		const emailVerified = this.getNodeParameter('emailVerified', i) as boolean;

		const response = await users.updateEmailVerification(userId, emailVerified);
		return { json: response };
	} else if (operation === 'updatePhoneVerification') {
		/**
		 * Update phone verification status
		 * Directly sets the user's phone verification status (admin operation)
		 */
		const userId = this.getNodeParameter('userId', i) as string;
		const phoneVerified = this.getNodeParameter('phoneVerified', i) as boolean;

		const response = await users.updatePhoneVerification(userId, phoneVerified);
		return { json: response };
	}
	// Preferences Operations
	else if (operation === 'getPrefs') {
		/**
		 * Get user preferences
		 * Returns custom preferences object for the user
		 */
		const userId = this.getNodeParameter('userId', i) as string;

		const response = await users.getPrefs(userId);
		return { json: response };
	} else if (operation === 'updatePrefs') {
		/**
		 * Update user preferences
		 * Stores custom key-value pairs for the user
		 */
		const userId = this.getNodeParameter('userId', i) as string;
		const preferencesStr = this.getNodeParameter('preferences', i) as string;
		const parseResult = safeJsonParse<Record<string, unknown>>(preferencesStr, 'preferences');
		if (!parseResult.success) {
			throw new Error(parseResult.error);
		}
		const preferences = parseResult.data as object;

		const response = await users.updatePrefs(userId, preferences);
		return { json: response };
	}
	// Session Operations
	else if (operation === 'listSessions') {
		/**
		 * List all user sessions
		 * Returns all active sessions for the user
		 */
		const userId = this.getNodeParameter('userId', i) as string;

		const response = await users.listSessions(userId);
		return { json: response };
	} else if (operation === 'deleteSessions') {
		/**
		 * Delete all user sessions
		 * Logs out the user from all devices by deleting all sessions
		 */
		const userId = this.getNodeParameter('userId', i) as string;

		await users.deleteSessions(userId);
		return { json: { success: true, userId, message: 'All sessions deleted' } };
	} else if (operation === 'deleteSession') {
		/**
		 * Delete specific user session
		 * Logs out the user from a specific device by deleting one session
		 */
		const userId = this.getNodeParameter('userId', i) as string;
		const sessionId = this.getNodeParameter('sessionId', i) as string;

		await users.deleteSession(userId, sessionId);
		return { json: { success: true, userId, sessionId } };
	}
	// Logs Operations
	else if (operation === 'listLogs') {
		/**
		 * List user activity logs
		 * Returns user's recent activity and security events
		 */
		const userId = this.getNodeParameter('userId', i) as string;

		const response = await users.listLogs(userId);
		return { json: response };
	}
	// Labels Operations
	else if (operation === 'updateLabels') {
		/**
		 * Update user labels
		 * Sets custom labels for user organization and filtering
		 */
		const userId = this.getNodeParameter('userId', i) as string;
		const labelsStr = this.getNodeParameter('labels', i) as string;
		const labels = labelsStr ? labelsStr.split(',').map((label) => label.trim()) : [];

		const response = await users.updateLabels(userId, labels);
		return { json: response };
	}
	// Memberships Operations
	else if (operation === 'listMemberships') {
		/**
		 * List user team memberships
		 * Returns all teams the user is a member of
		 */
		const userId = this.getNodeParameter('userId', i) as string;

		const response = await users.listMemberships(userId);
		return { json: response };
	}
	// MFA Operations
	else if (operation === 'updateMfa') {
		/**
		 * Update user MFA (Multi-Factor Authentication) status
		 * Enables or disables MFA for the user account
		 */
		const userId = this.getNodeParameter('userId', i) as string;
		const mfaEnabled = this.getNodeParameter('mfaEnabled', i) as boolean;

		const response = await users.updateMFA(userId, mfaEnabled);
		return { json: response };
	}

	throw new Error(`Unknown users operation: ${operation}`);
}
