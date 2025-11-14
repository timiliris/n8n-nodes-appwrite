import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Account } from 'node-appwrite';
import { safeJsonParse } from '../utils/validators';

/**
 * Executes account operations for Appwrite
 * This handles client-side authentication and account management operations
 *
 * @param this - n8n execution context
 * @param account - Appwrite Account service instance
 * @param operation - Operation to perform
 * @param i - Current item index
 * @returns Execution data with operation results
 * @throws Error if operation is unknown or validation fails
 */
export async function executeAccountOperation(
	this: IExecuteFunctions,
	account: Account,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {

	// Account Management Operations
	if (operation === 'get') {
		/**
		 * Get current account details
		 * Returns information about the currently logged-in user
		 */
		const response = await account.get();
		return { json: response };
	}
	else if (operation === 'create') {
		/**
		 * Create a new account
		 * Registers a new user with email and password
		 */
		const userId = this.getNodeParameter('userId', i) as string;
		const email = this.getNodeParameter('email', i) as string;
		const password = this.getNodeParameter('password', i) as string;
		const name = this.getNodeParameter('name', i, '') as string;

		const response = await account.create(
			userId,
			email,
			password,
			name || undefined,
		);
		return { json: response };
	}
	else if (operation === 'updateEmail') {
		/**
		 * Update account email
		 * Changes the user's email address (requires password verification)
		 */
		const email = this.getNodeParameter('email', i) as string;
		const currentPassword = this.getNodeParameter('currentPassword', i) as string;

		const response = await account.updateEmail(email, currentPassword);
		return { json: response };
	}
	else if (operation === 'updateName') {
		/**
		 * Update account name
		 * Updates the user's display name
		 */
		const name = this.getNodeParameter('name', i) as string;

		const response = await account.updateName(name);
		return { json: response };
	}
	else if (operation === 'updatePassword') {
		/**
		 * Update account password
		 * Changes the user's password
		 */
		const password = this.getNodeParameter('password', i) as string;
		const oldPassword = this.getNodeParameter('oldPassword', i, '') as string;

		const response = await account.updatePassword(
			password,
			oldPassword || undefined,
		);
		return { json: response };
	}
	else if (operation === 'updatePhone') {
		/**
		 * Update account phone number
		 * Changes the user's phone number (requires password verification)
		 */
		const phone = this.getNodeParameter('phone', i) as string;
		const currentPassword = this.getNodeParameter('currentPassword', i) as string;

		const response = await account.updatePhone(phone, currentPassword);
		return { json: response };
	}
	else if (operation === 'updateStatus') {
		/**
		 * Update account status
		 * Blocks or unblocks the user account
		 */
		const response = await account.updateStatus();
		return { json: response };
	}

	// Preferences Operations
	else if (operation === 'getPrefs') {
		/**
		 * Get account preferences
		 * Returns custom user preferences stored as key-value pairs
		 */
		const response = await account.getPrefs();
		return { json: response };
	}
	else if (operation === 'updatePrefs') {
		/**
		 * Update account preferences
		 * Stores custom key-value pairs for the user
		 */
		const preferencesStr = this.getNodeParameter('preferences', i) as string;
		const parseResult = safeJsonParse<Record<string, unknown>>(preferencesStr, 'preferences');
		if (!parseResult.success) {
			throw new Error(parseResult.error);
		}
		const preferences = parseResult.data as object;

		const response = await account.updatePrefs(preferences);
		return { json: response };
	}

	// Session Management Operations
	else if (operation === 'listSessions') {
		/**
		 * List all account sessions
		 * Returns all active sessions for the current user
		 */
		const response = await account.listSessions();
		return { json: response };
	}
	else if (operation === 'deleteSessions') {
		/**
		 * Delete all account sessions
		 * Logs out the user from all devices
		 */
		await account.deleteSessions();
		return { json: { success: true, message: 'All sessions deleted' } };
	}
	else if (operation === 'getSession') {
		/**
		 * Get a specific session
		 * Returns details about a specific session
		 */
		const sessionId = this.getNodeParameter('sessionId', i) as string;

		const response = await account.getSession(sessionId);
		return { json: response };
	}
	else if (operation === 'updateSession') {
		/**
		 * Update a session
		 * Extends or refreshes a session
		 */
		const sessionId = this.getNodeParameter('sessionId', i) as string;

		const response = await account.updateSession(sessionId);
		return { json: response };
	}
	else if (operation === 'deleteSession') {
		/**
		 * Delete a specific session
		 * Logs out the user from a specific device
		 */
		const sessionId = this.getNodeParameter('sessionId', i) as string;

		await account.deleteSession(sessionId);
		return { json: { success: true, sessionId } };
	}

	// Session Creation Operations
	else if (operation === 'createAnonymousSession') {
		/**
		 * Create an anonymous session
		 * Registers an anonymous user without credentials
		 */
		const response = await account.createAnonymousSession();
		return { json: response };
	}
	else if (operation === 'createEmailPasswordSession') {
		/**
		 * Create email/password session
		 * Standard login with email and password
		 */
		const email = this.getNodeParameter('email', i) as string;
		const password = this.getNodeParameter('password', i) as string;

		const response = await account.createEmailPasswordSession(email, password);
		return { json: response };
	}
	else if (operation === 'updateMagicURLSession') {
		/**
		 * Create magic URL session
		 * Creates a session using a magic URL token
		 */
		const userId = this.getNodeParameter('userId', i) as string;
		const secret = this.getNodeParameter('secret', i) as string;

		const response = await account.updateMagicURLSession(userId, secret);
		return { json: response };
	}
	else if (operation === 'createOAuth2Session') {
		/**
		 * Create OAuth2 session
		 * Authenticates user via OAuth2 provider
		 */
		const provider = this.getNodeParameter('provider', i) as string;
		const successUrl = this.getNodeParameter('successUrl', i, '') as string;
		const failureUrl = this.getNodeParameter('failureUrl', i, '') as string;
		const scopesStr = this.getNodeParameter('scopes', i, '') as string;
		const scopes = scopesStr ? scopesStr.split(',').map((s) => s.trim()) : undefined;

		// Note: OAuth2Token returns a redirect URL string
		const redirectUrl = await account.createOAuth2Token(
			provider as any,
			successUrl || undefined,
			failureUrl || undefined,
			scopes,
		);
		return { json: { redirectUrl } };
	}
	else if (operation === 'createPhoneSession') {
		/**
		 * Create phone session
		 * Creates a session using phone number and verification code
		 */
		const userId = this.getNodeParameter('userId', i) as string;
		const phone = this.getNodeParameter('phone', i) as string;

		const response = await account.updatePhoneSession(userId, phone);
		return { json: response };
	}
	else if (operation === 'createSession') {
		/**
		 * Create session from token
		 * Creates a session from a secret token
		 */
		const userId = this.getNodeParameter('userId', i) as string;
		const secret = this.getNodeParameter('secret', i) as string;

		const response = await account.createSession(userId, secret);
		return { json: response };
	}

	// JWT Operation
	else if (operation === 'createJWT') {
		/**
		 * Create JWT token
		 * Generates a JSON Web Token for the current user
		 */
		const response = await account.createJWT();
		return { json: response };
	}

	// Magic URL Operations
	else if (operation === 'updateMagicURL') {
		/**
		 * Create magic URL token
		 * Sends a magic URL for passwordless login
		 */
		const userId = this.getNodeParameter('userId', i) as string;
		const email = this.getNodeParameter('email', i) as string;
		const url = this.getNodeParameter('url', i, '') as string;

		const response = await account.createMagicURLToken(
			userId,
			email,
			url || undefined,
		);
		return { json: response };
	}

	// Phone Token Operation
	else if (operation === 'createPhoneToken') {
		/**
		 * Create phone token
		 * Sends an SMS with a verification token
		 */
		const userId = this.getNodeParameter('userId', i) as string;
		const phone = this.getNodeParameter('phone', i) as string;

		const response = await account.createPhoneToken(userId, phone);
		return { json: response };
	}

	// Email Verification Operations
	else if (operation === 'createEmailVerification') {
		/**
		 * Create email verification
		 * Sends an email verification link to the user
		 */
		const url = this.getNodeParameter('url', i) as string;

		const response = await account.createVerification(url);
		return { json: response };
	}
	else if (operation === 'updateEmailVerification') {
		/**
		 * Complete email verification
		 * Confirms the user's email using verification token
		 */
		const userId = this.getNodeParameter('userId', i) as string;
		const secret = this.getNodeParameter('secret', i) as string;

		const response = await account.updateVerification(userId, secret);
		return { json: response };
	}

	// Phone Verification Operations
	else if (operation === 'createPhoneVerification') {
		/**
		 * Create phone verification
		 * Sends an SMS verification code to the user
		 */
		const response = await account.createPhoneVerification();
		return { json: response };
	}
	else if (operation === 'updatePhoneVerification') {
		/**
		 * Complete phone verification
		 * Confirms the user's phone using verification code
		 */
		const userId = this.getNodeParameter('userId', i) as string;
		const secret = this.getNodeParameter('secret', i) as string;

		const response = await account.updatePhoneVerification(userId, secret);
		return { json: response };
	}

	// Password Recovery Operations
	else if (operation === 'createPasswordRecovery') {
		/**
		 * Create password recovery
		 * Initiates password reset by sending recovery email
		 */
		const email = this.getNodeParameter('email', i) as string;
		const url = this.getNodeParameter('url', i) as string;

		const response = await account.createRecovery(email, url);
		return { json: response };
	}
	else if (operation === 'updatePasswordRecovery') {
		/**
		 * Complete password recovery
		 * Resets the password using recovery token
		 */
		const userId = this.getNodeParameter('userId', i) as string;
		const secret = this.getNodeParameter('secret', i) as string;
		const newPassword = this.getNodeParameter('newPassword', i) as string;

		const response = await account.updateRecovery(userId, secret, newPassword);
		return { json: response };
	}

	// Recovery Operations (alternate API)
	else if (operation === 'createRecovery') {
		/**
		 * Create recovery token
		 * Generates a recovery token for account recovery
		 */
		const email = this.getNodeParameter('email', i) as string;
		const url = this.getNodeParameter('url', i) as string;

		const response = await account.createRecovery(email, url);
		return { json: response };
	}
	else if (operation === 'updateRecovery') {
		/**
		 * Complete recovery
		 * Completes account recovery using token
		 */
		const userId = this.getNodeParameter('userId', i) as string;
		const secret = this.getNodeParameter('secret', i) as string;
		const newPassword = this.getNodeParameter('newPassword', i) as string;

		const response = await account.updateRecovery(userId, secret, newPassword);
		return { json: response };
	}

	// MFA Operations
	else if (operation === 'updateMfa') {
		/**
		 * Update MFA status
		 * Enables or disables Multi-Factor Authentication
		 */
		const response = await account.updateMFA(true);
		return { json: response };
	}
	else if (operation === 'createMfaAuthenticator') {
		/**
		 * Create MFA authenticator
		 * Adds a new MFA authenticator (e.g., TOTP)
		 */
		const mfaType = this.getNodeParameter('mfaType', i) as string;

		const response = await account.createMfaAuthenticator(mfaType as any);
		return { json: response };
	}
	else if (operation === 'updateMfaAuthenticator') {
		/**
		 * Verify MFA authenticator
		 * Confirms the MFA authenticator setup
		 */
		const mfaType = this.getNodeParameter('mfaType', i) as string;
		const otp = this.getNodeParameter('otp', i) as string;

		const response = await account.updateMfaAuthenticator(mfaType as any, otp);
		return { json: response };
	}
	else if (operation === 'deleteMfaAuthenticator') {
		/**
		 * Delete MFA authenticator
		 * Removes an MFA authenticator
		 */
		const mfaType = this.getNodeParameter('mfaType', i) as string;

		await account.deleteMfaAuthenticator(mfaType as any);
		return { json: { success: true, mfaType } };
	}
	else if (operation === 'createMfaChallenge') {
		/**
		 * Create MFA challenge
		 * Initiates an MFA verification challenge
		 */
		const mfaType = this.getNodeParameter('mfaType', i) as string;

		const response = await account.createMfaChallenge(mfaType as any);
		return { json: response };
	}
	else if (operation === 'updateMfaChallenge') {
		/**
		 * Complete MFA challenge
		 * Completes the MFA verification with OTP code
		 */
		const challengeId = this.getNodeParameter('challengeId', i) as string;
		const otp = this.getNodeParameter('otp', i) as string;

		const response = await account.updateMfaChallenge(challengeId, otp);
		return { json: response };
	}

	throw new Error(`Unknown account operation: ${operation}`);
}
