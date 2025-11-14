import { INodeProperties } from 'n8n-workflow';

export const usersOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['users'],
			},
		},
		options: [
			{
				name: 'Create User',
				value: 'createUser',
				description: 'Create a new user',
				action: 'Create a user',
			},
			{
				name: 'Delete User',
				value: 'deleteUser',
				description: 'Delete a user',
				action: 'Delete a user',
			},
			{
				name: 'Get User',
				value: 'getUser',
				description: 'Get a user',
				action: 'Get a user',
			},
			{
				name: 'List Users',
				value: 'listUsers',
				description: 'List all users',
				action: 'List all users',
			},
			{
				name: 'Update User',
				value: 'updateUser',
				description: 'Update a user name',
				action: 'Update a user',
			},
			{
				name: 'Update Email',
				value: 'updateEmail',
				description: 'Update user email address',
				action: 'Update user email',
			},
			{
				name: 'Update Phone',
				value: 'updatePhone',
				description: 'Update user phone number',
				action: 'Update user phone',
			},
			{
				name: 'Update Password',
				value: 'updatePassword',
				description: 'Update user password',
				action: 'Update user password',
			},
			{
				name: 'Update Email Verification',
				value: 'updateEmailVerification',
				description: 'Set email verification status',
				action: 'Update email verification',
			},
			{
				name: 'Update Phone Verification',
				value: 'updatePhoneVerification',
				description: 'Set phone verification status',
				action: 'Update phone verification',
			},
			{
				name: 'Get Preferences',
				value: 'getPrefs',
				description: 'Get user preferences',
				action: 'Get user preferences',
			},
			{
				name: 'Update Preferences',
				value: 'updatePrefs',
				description: 'Update user preferences',
				action: 'Update user preferences',
			},
			{
				name: 'List Sessions',
				value: 'listSessions',
				description: 'List all user sessions',
				action: 'List user sessions',
			},
			{
				name: 'Delete Sessions',
				value: 'deleteSessions',
				description: 'Delete all user sessions',
				action: 'Delete all sessions',
			},
			{
				name: 'Delete Session',
				value: 'deleteSession',
				description: 'Delete a specific user session',
				action: 'Delete a session',
			},
			{
				name: 'List Logs',
				value: 'listLogs',
				description: 'List user activity logs',
				action: 'List user logs',
			},
			{
				name: 'Update Labels',
				value: 'updateLabels',
				description: 'Update user labels',
				action: 'Update user labels',
			},
			{
				name: 'List Memberships',
				value: 'listMemberships',
				description: 'List user team memberships',
				action: 'List user memberships',
			},
			{
				name: 'Update MFA',
				value: 'updateMfa',
				description: 'Update MFA status',
				action: 'Update MFA status',
			},
		],
		default: 'listUsers',
	},
];

export const usersFields: INodeProperties[] = [
	// User ID fields for various operations
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['users'],
				operation: [
					'getUser',
					'updateUser',
					'deleteUser',
					'updateEmail',
					'updatePhone',
					'updatePassword',
					'updateEmailVerification',
					'updatePhoneVerification',
					'getPrefs',
					'updatePrefs',
					'listSessions',
					'deleteSessions',
					'deleteSession',
					'listLogs',
					'updateLabels',
					'listMemberships',
					'updateMfa',
				],
			},
		},
		default: '',
		description: 'The ID of the user',
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['users'],
				operation: ['createUser'],
			},
		},
		default: 'unique()',
		description: 'The ID of the user. Use unique() to generate a unique ID.',
	},
	// Email field
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['users'],
				operation: ['createUser', 'updateEmail'],
			},
		},
		default: '',
		description: 'User email address',
	},
	// Phone field
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['users'],
				operation: ['updatePhone'],
			},
		},
		default: '',
		placeholder: '+14155552671',
		description: 'User phone number in E.164 format (e.g., +14155552671)',
	},
	// Password fields
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: {
			password: true,
		},
		displayOptions: {
			show: {
				resource: ['users'],
				operation: ['createUser'],
			},
		},
		default: '',
		description: 'User password',
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
				resource: ['users'],
				operation: ['updatePassword'],
			},
		},
		default: '',
		description: 'New password for the user (minimum 8 characters)',
	},
	// Name field
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['users'],
				operation: ['createUser', 'updateUser'],
			},
		},
		default: '',
		description: 'User name',
	},
	// Email Verified field
	{
		displayName: 'Email Verified',
		name: 'emailVerified',
		type: 'boolean',
		required: true,
		displayOptions: {
			show: {
				resource: ['users'],
				operation: ['updateEmailVerification'],
			},
		},
		default: true,
		description: 'Whether the user email should be marked as verified',
	},
	// Phone Verified field
	{
		displayName: 'Phone Verified',
		name: 'phoneVerified',
		type: 'boolean',
		required: true,
		displayOptions: {
			show: {
				resource: ['users'],
				operation: ['updatePhoneVerification'],
			},
		},
		default: true,
		description: 'Whether the user phone should be marked as verified',
	},
	// Preferences field
	{
		displayName: 'Preferences',
		name: 'preferences',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['users'],
				operation: ['updatePrefs'],
			},
		},
		default: '{}',
		placeholder: '{"theme": "dark", "language": "en"}',
		description: 'User preferences as JSON object',
	},
	// Session ID field
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['users'],
				operation: ['deleteSession'],
			},
		},
		default: '',
		description: 'The ID of the session to delete',
	},
	// Labels field
	{
		displayName: 'Labels',
		name: 'labels',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['users'],
				operation: ['updateLabels'],
			},
		},
		default: '',
		placeholder: 'premium,beta-tester,vip',
		description: 'Comma-separated list of labels to assign to the user',
	},
	// MFA enabled field
	{
		displayName: 'MFA Enabled',
		name: 'mfaEnabled',
		type: 'boolean',
		required: true,
		displayOptions: {
			show: {
				resource: ['users'],
				operation: ['updateMfa'],
			},
		},
		default: false,
		description: 'Whether to enable or disable Multi-Factor Authentication for the user',
	},
];
