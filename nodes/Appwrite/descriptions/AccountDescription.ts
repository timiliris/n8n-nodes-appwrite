import { INodeProperties } from 'n8n-workflow';

export const accountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['account'],
			},
		},
		options: [
			// Account Management
			{
				name: 'Get Account',
				value: 'get',
				description: 'Get current account details',
				action: 'Get current account',
			},
			{
				name: 'Create Account',
				value: 'create',
				description: 'Create a new account',
				action: 'Create a new account',
			},
			{
				name: 'Update Email',
				value: 'updateEmail',
				description: 'Update account email',
				action: 'Update account email',
			},
			{
				name: 'Update Name',
				value: 'updateName',
				description: 'Update account name',
				action: 'Update account name',
			},
			{
				name: 'Update Password',
				value: 'updatePassword',
				description: 'Update account password',
				action: 'Update account password',
			},
			{
				name: 'Update Phone',
				value: 'updatePhone',
				description: 'Update account phone number',
				action: 'Update account phone',
			},
			{
				name: 'Update Status',
				value: 'updateStatus',
				description: 'Update account status',
				action: 'Update account status',
			},
			{
				name: 'Get Preferences',
				value: 'getPrefs',
				description: 'Get account preferences',
				action: 'Get account preferences',
			},
			{
				name: 'Update Preferences',
				value: 'updatePrefs',
				description: 'Update account preferences',
				action: 'Update account preferences',
			},
			// Session Management
			{
				name: 'List Sessions',
				value: 'listSessions',
				description: 'List all account sessions',
				action: 'List all sessions',
			},
			{
				name: 'Delete Sessions',
				value: 'deleteSessions',
				description: 'Delete all account sessions',
				action: 'Delete all sessions',
			},
			{
				name: 'Get Session',
				value: 'getSession',
				description: 'Get a specific session',
				action: 'Get a session',
			},
			{
				name: 'Update Session',
				value: 'updateSession',
				description: 'Update a session',
				action: 'Update a session',
			},
			{
				name: 'Delete Session',
				value: 'deleteSession',
				description: 'Delete a specific session',
				action: 'Delete a session',
			},
			{
				name: 'Create Anonymous Session',
				value: 'createAnonymousSession',
				description: 'Create an anonymous session',
				action: 'Create anonymous session',
			},
			{
				name: 'Create Email/Password Session',
				value: 'createEmailPasswordSession',
				description: 'Create email/password session',
				action: 'Create email/password session',
			},
			{
				name: 'Create Magic URL Session',
				value: 'updateMagicURLSession',
				description: 'Create magic URL session',
				action: 'Create magic URL session',
			},
			{
				name: 'Create OAuth2 Session',
				value: 'createOAuth2Session',
				description: 'Create OAuth2 session',
				action: 'Create OAuth2 session',
			},
			{
				name: 'Create Phone Session',
				value: 'createPhoneSession',
				description: 'Create phone session',
				action: 'Create phone session',
			},
			{
				name: 'Create Session from Token',
				value: 'createSession',
				description: 'Create session from token',
				action: 'Create session from token',
			},
			// JWT
			{
				name: 'Create JWT',
				value: 'createJWT',
				description: 'Create JWT token',
				action: 'Create JWT token',
			},
			// Magic URL
			{
				name: 'Create Magic URL',
				value: 'updateMagicURL',
				description: 'Create magic URL token',
				action: 'Create magic URL token',
			},
			// Phone Token
			{
				name: 'Create Phone Token',
				value: 'createPhoneToken',
				description: 'Create phone token',
				action: 'Create phone token',
			},
			// Email Verification
			{
				name: 'Create Email Verification',
				value: 'createEmailVerification',
				description: 'Create email verification',
				action: 'Create email verification',
			},
			{
				name: 'Update Email Verification',
				value: 'updateEmailVerification',
				description: 'Complete email verification',
				action: 'Complete email verification',
			},
			// Phone Verification
			{
				name: 'Create Phone Verification',
				value: 'createPhoneVerification',
				description: 'Create phone verification',
				action: 'Create phone verification',
			},
			{
				name: 'Update Phone Verification',
				value: 'updatePhoneVerification',
				description: 'Complete phone verification',
				action: 'Complete phone verification',
			},
			// Password Recovery
			{
				name: 'Create Password Recovery',
				value: 'createPasswordRecovery',
				description: 'Initiate password recovery',
				action: 'Create password recovery',
			},
			{
				name: 'Update Password Recovery',
				value: 'updatePasswordRecovery',
				description: 'Complete password recovery',
				action: 'Complete password recovery',
			},
			// Recovery (alternate)
			{
				name: 'Create Recovery',
				value: 'createRecovery',
				description: 'Create recovery token',
				action: 'Create recovery token',
			},
			{
				name: 'Update Recovery',
				value: 'updateRecovery',
				description: 'Complete recovery',
				action: 'Complete recovery',
			},
			// MFA
			{
				name: 'Update MFA',
				value: 'updateMfa',
				description: 'Enable/disable MFA',
				action: 'Update MFA status',
			},
			{
				name: 'Create MFA Authenticator',
				value: 'createMfaAuthenticator',
				description: 'Add MFA authenticator',
				action: 'Create MFA authenticator',
			},
			{
				name: 'Update MFA Authenticator',
				value: 'updateMfaAuthenticator',
				description: 'Verify MFA authenticator',
				action: 'Verify MFA authenticator',
			},
			{
				name: 'Delete MFA Authenticator',
				value: 'deleteMfaAuthenticator',
				description: 'Remove MFA authenticator',
				action: 'Delete MFA authenticator',
			},
			{
				name: 'Create MFA Challenge',
				value: 'createMfaChallenge',
				description: 'Create MFA challenge',
				action: 'Create MFA challenge',
			},
			{
				name: 'Update MFA Challenge',
				value: 'updateMfaChallenge',
				description: 'Complete MFA challenge',
				action: 'Complete MFA challenge',
			},
		],
		default: 'get',
	},
];

export const accountFields: INodeProperties[] = [
	// Create Account fields
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['create'],
			},
		},
		default: 'unique()',
		description: 'User ID. Use unique() to generate a unique ID automatically.',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['create', 'updateEmail', 'createEmailPasswordSession'],
			},
		},
		default: '',
		description: 'User email address',
	},
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['create', 'updatePassword', 'createEmailPasswordSession'],
			},
		},
		default: '',
		description: 'User password (minimum 8 characters)',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['create', 'updateName'],
			},
		},
		default: '',
		description: 'User name',
	},
	// Update Email fields
	{
		displayName: 'Current Password',
		name: 'currentPassword',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['updateEmail', 'updatePhone'],
			},
		},
		default: '',
		description: 'Current password for verification',
	},
	// Update Password fields
	{
		displayName: 'Old Password',
		name: 'oldPassword',
		type: 'string',
		typeOptions: {
			password: true,
		},
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['updatePassword'],
			},
		},
		default: '',
		description: 'Old password (optional, leave empty if unknown)',
	},
	// Update Phone fields
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['updatePhone', 'createPhoneSession', 'createPhoneToken'],
			},
		},
		default: '',
		placeholder: '+14155552671',
		description: 'Phone number in E.164 format',
	},
	// Preferences fields
	{
		displayName: 'Preferences',
		name: 'preferences',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['updatePrefs'],
			},
		},
		default: '{}',
		placeholder: '{"theme": "dark", "language": "en"}',
		description: 'User preferences as JSON object',
	},
	// Session fields
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getSession', 'updateSession', 'deleteSession'],
			},
		},
		default: '',
		description: 'Session ID',
	},
	// OAuth2 fields
	{
		displayName: 'Provider',
		name: 'provider',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['createOAuth2Session'],
			},
		},
		options: [
			{ name: 'Amazon', value: 'amazon' },
			{ name: 'Apple', value: 'apple' },
			{ name: 'Auth0', value: 'auth0' },
			{ name: 'Authentik', value: 'authentik' },
			{ name: 'Autodesk', value: 'autodesk' },
			{ name: 'Bitbucket', value: 'bitbucket' },
			{ name: 'Bitly', value: 'bitly' },
			{ name: 'Box', value: 'box' },
			{ name: 'Discord', value: 'discord' },
			{ name: 'Disqus', value: 'disqus' },
			{ name: 'Dropbox', value: 'dropbox' },
			{ name: 'Etsy', value: 'etsy' },
			{ name: 'Facebook', value: 'facebook' },
			{ name: 'GitHub', value: 'github' },
			{ name: 'GitLab', value: 'gitlab' },
			{ name: 'Google', value: 'google' },
			{ name: 'LinkedIn', value: 'linkedin' },
			{ name: 'Microsoft', value: 'microsoft' },
			{ name: 'Notion', value: 'notion' },
			{ name: 'Slack', value: 'slack' },
			{ name: 'Spotify', value: 'spotify' },
			{ name: 'Stripe', value: 'stripe' },
			{ name: 'Tradeshift', value: 'tradeshift' },
			{ name: 'Twitch', value: 'twitch' },
			{ name: 'WordPress', value: 'wordpress' },
			{ name: 'Yahoo', value: 'yahoo' },
			{ name: 'Yandex', value: 'yandex' },
			{ name: 'Zoom', value: 'zoom' },
		],
		default: 'google',
		description: 'OAuth2 provider',
	},
	{
		displayName: 'Success URL',
		name: 'successUrl',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['createOAuth2Session', 'updateMagicURL', 'updateMagicURLSession'],
			},
		},
		default: '',
		placeholder: 'https://example.com/success',
		description: 'URL to redirect to after successful authentication',
	},
	{
		displayName: 'Failure URL',
		name: 'failureUrl',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['createOAuth2Session', 'updateMagicURL', 'updateMagicURLSession'],
			},
		},
		default: '',
		placeholder: 'https://example.com/failure',
		description: 'URL to redirect to after failed authentication',
	},
	{
		displayName: 'Scopes',
		name: 'scopes',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['createOAuth2Session'],
			},
		},
		default: '',
		placeholder: 'email,profile',
		description: 'Comma-separated list of OAuth2 scopes',
	},
	// Token fields
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['createSession', 'createPhoneSession', 'updateEmailVerification', 'updatePhoneVerification', 'updatePasswordRecovery', 'updateRecovery'],
			},
		},
		default: '',
		description: 'User ID',
	},
	{
		displayName: 'Secret',
		name: 'secret',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: [
					'createSession',
					'updateEmailVerification',
					'updatePhoneVerification',
					'updatePasswordRecovery',
					'updateRecovery',
				],
			},
		},
		default: '',
		description: 'Secret token for verification',
	},
	// Verification fields
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: [
					'createEmailVerification',
					'createPasswordRecovery',
					'createRecovery',
					'updateMagicURL',
				],
			},
		},
		default: '',
		placeholder: 'https://example.com/verify',
		description: 'Verification callback URL',
	},
	// Password Recovery fields
	{
		displayName: 'New Password',
		name: 'newPassword',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['updatePasswordRecovery', 'updateRecovery'],
			},
		},
		default: '',
		description: 'New password (minimum 8 characters)',
	},
	// MFA fields
	{
		displayName: 'MFA Type',
		name: 'mfaType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['createMfaAuthenticator', 'updateMfaAuthenticator', 'deleteMfaAuthenticator', 'createMfaChallenge'],
			},
		},
		options: [
			{ name: 'TOTP (Authenticator App)', value: 'totp' },
		],
		default: 'totp',
		description: 'MFA type',
	},
	{
		displayName: 'OTP Code',
		name: 'otp',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['updateMfaAuthenticator', 'updateMfaChallenge'],
			},
		},
		default: '',
		placeholder: '123456',
		description: 'One-time password from authenticator app',
	},
	{
		displayName: 'Challenge ID',
		name: 'challengeId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['updateMfaChallenge'],
			},
		},
		default: '',
		description: 'MFA challenge ID',
	},
];
