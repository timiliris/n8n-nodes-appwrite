import { INodeProperties } from 'n8n-workflow';

export const messagingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['messaging'],
			},
		},
		options: [
			{
				name: 'Send Email',
				value: 'sendEmail',
				description: 'Send a transactional email message',
				action: 'Send email',
			},
			{
				name: 'Send SMS',
				value: 'sendSMS',
				description: 'Send an SMS message',
				action: 'Send SMS',
			},
			{
				name: 'Send Push Notification',
				value: 'sendPush',
				description: 'Send a push notification',
				action: 'Send push notification',
			},
			{
				name: 'List Messages',
				value: 'listMessages',
				description: 'List all sent messages',
				action: 'List messages',
			},
			{
				name: 'Get Message',
				value: 'getMessage',
				description: 'Get message details',
				action: 'Get message',
			},
			{
				name: 'Create Provider',
				value: 'createProvider',
				description: 'Create a messaging provider',
				action: 'Create provider',
			},
			{
				name: 'List Providers',
				value: 'listProviders',
				description: 'List all messaging providers',
				action: 'List providers',
			},
			{
				name: 'Get Provider',
				value: 'getProvider',
				description: 'Get provider details',
				action: 'Get provider',
			},
			{
				name: 'Update Provider',
				value: 'updateProvider',
				description: 'Update a messaging provider',
				action: 'Update provider',
			},
			{
				name: 'Delete Provider',
				value: 'deleteProvider',
				description: 'Delete a messaging provider',
				action: 'Delete provider',
			},
			{
				name: 'Create Topic',
				value: 'createTopic',
				description: 'Create a messaging topic',
				action: 'Create topic',
			},
			{
				name: 'List Topics',
				value: 'listTopics',
				description: 'List all messaging topics',
				action: 'List topics',
			},
			{
				name: 'Get Topic',
				value: 'getTopic',
				description: 'Get topic details',
				action: 'Get topic',
			},
			{
				name: 'Update Topic',
				value: 'updateTopic',
				description: 'Update a messaging topic',
				action: 'Update topic',
			},
			{
				name: 'Delete Topic',
				value: 'deleteTopic',
				description: 'Delete a messaging topic',
				action: 'Delete topic',
			},
			{
				name: 'Create Subscriber',
				value: 'createSubscriber',
				description: 'Add a subscriber to a topic',
				action: 'Create subscriber',
			},
			{
				name: 'List Subscribers',
				value: 'listSubscribers',
				description: 'List all topic subscribers',
				action: 'List subscribers',
			},
			{
				name: 'Delete Subscriber',
				value: 'deleteSubscriber',
				description: 'Remove a subscriber from a topic',
				action: 'Delete subscriber',
			},
		],
		default: 'sendEmail',
	},
];

export const messagingFields: INodeProperties[] = [
	// ==========================================
	//         Email Message Fields
	// ==========================================
	{
		displayName: 'Message ID',
		name: 'messageId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendEmail'],
			},
		},
		default: 'unique()',
		description: 'Message ID. Use unique() to generate a unique ID.',
	},
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendEmail'],
			},
		},
		default: '',
		description: 'Email subject line',
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendEmail', 'sendSMS'],
			},
		},
		default: '',
		description: 'Email body content or SMS message text',
	},
	{
		displayName: 'Topics',
		name: 'topics',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendEmail', 'sendSMS', 'sendPush'],
			},
		},
		default: '',
		description: 'Comma-separated list of topic IDs to send the message to',
		placeholder: 'topic1,topic2,topic3',
	},
	{
		displayName: 'Users',
		name: 'users',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendEmail', 'sendSMS', 'sendPush'],
			},
		},
		default: '',
		description: 'Comma-separated list of user IDs to send the message to',
		placeholder: 'user1,user2,user3',
	},
	{
		displayName: 'Targets',
		name: 'targets',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendEmail', 'sendSMS', 'sendPush'],
			},
		},
		default: '',
		description: 'Comma-separated list of target IDs to send the message to',
		placeholder: 'target1,target2,target3',
	},
	{
		displayName: 'Draft',
		name: 'draft',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendEmail', 'sendSMS', 'sendPush'],
			},
		},
		default: false,
		description: 'Whether to save as draft instead of sending immediately',
	},
	{
		displayName: 'HTML',
		name: 'html',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendEmail'],
			},
		},
		default: false,
		description: 'Whether the email content is HTML',
	},
	{
		displayName: 'CC',
		name: 'cc',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendEmail'],
			},
		},
		default: '',
		description: 'Comma-separated list of CC email addresses',
		placeholder: 'cc1@example.com,cc2@example.com',
	},
	{
		displayName: 'BCC',
		name: 'bcc',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendEmail'],
			},
		},
		default: '',
		description: 'Comma-separated list of BCC email addresses',
		placeholder: 'bcc1@example.com,bcc2@example.com',
	},

	// ==========================================
	//         SMS Message Fields
	// ==========================================
	{
		displayName: 'Message ID',
		name: 'messageId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendSMS'],
			},
		},
		default: 'unique()',
		description: 'Message ID. Use unique() to generate a unique ID.',
	},

	// ==========================================
	//         Push Notification Fields
	// ==========================================
	{
		displayName: 'Message ID',
		name: 'messageId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendPush'],
			},
		},
		default: 'unique()',
		description: 'Message ID. Use unique() to generate a unique ID.',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendPush'],
			},
		},
		default: '',
		description: 'Push notification title',
	},
	{
		displayName: 'Body',
		name: 'body',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendPush'],
			},
		},
		default: '',
		description: 'Push notification body text',
	},
	{
		displayName: 'Data',
		name: 'data',
		type: 'string',
		typeOptions: {
			rows: 2,
		},
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendPush'],
			},
		},
		default: '{}',
		description: 'Additional data as JSON object',
		placeholder: '{"key": "value"}',
	},
	{
		displayName: 'Action',
		name: 'action',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendPush'],
			},
		},
		default: '',
		description: 'Action to perform when notification is clicked',
	},
	{
		displayName: 'Image',
		name: 'image',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendPush'],
			},
		},
		default: '',
		description: 'Image URL for the notification',
	},
	{
		displayName: 'Icon',
		name: 'icon',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendPush'],
			},
		},
		default: '',
		description: 'Icon URL for the notification',
	},
	{
		displayName: 'Sound',
		name: 'sound',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendPush'],
			},
		},
		default: '',
		description: 'Sound to play when notification is received',
	},
	{
		displayName: 'Color',
		name: 'color',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendPush'],
			},
		},
		default: '',
		description: 'Notification color in hex format',
		placeholder: '#FF0000',
	},
	{
		displayName: 'Tag',
		name: 'tag',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendPush'],
			},
		},
		default: '',
		description: 'Notification tag for grouping',
	},
	{
		displayName: 'Badge',
		name: 'badge',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['sendPush'],
			},
		},
		default: '',
		description: 'Badge count for iOS',
	},

	// ==========================================
	//         Message Query Fields
	// ==========================================
	{
		displayName: 'Message ID',
		name: 'messageId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['getMessage'],
			},
		},
		default: '',
		description: 'The ID of the message to retrieve',
	},
	{
		displayName: 'Queries',
		name: 'queries',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['listMessages'],
			},
		},
		default: '',
		description: 'Comma-separated list of query strings for filtering messages',
		placeholder: 'equal("status","sent"),limit(25)',
	},

	// ==========================================
	//         Provider Fields
	// ==========================================
	{
		displayName: 'Provider ID',
		name: 'providerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['getProvider', 'updateProvider', 'deleteProvider'],
			},
		},
		default: '',
		description: 'The ID of the provider',
	},
	{
		displayName: 'Provider ID',
		name: 'providerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createProvider'],
			},
		},
		default: 'unique()',
		description: 'Provider ID. Use unique() to generate a unique ID.',
	},
	{
		displayName: 'Provider Type',
		name: 'providerType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createProvider', 'updateProvider'],
			},
		},
		options: [
			{
				name: 'Sendgrid (Email)',
				value: 'sendgrid',
			},
			{
				name: 'Mailgun (Email)',
				value: 'mailgun',
			},
			{
				name: 'Twilio (SMS)',
				value: 'twilio',
			},
			{
				name: 'FCM (Push)',
				value: 'fcm',
			},
			{
				name: 'APNS (Push)',
				value: 'apns',
			},
		],
		default: 'sendgrid',
		description: 'Type of messaging provider',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createProvider'],
			},
		},
		default: '',
		description: 'Provider name',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['updateProvider'],
			},
		},
		default: '',
		description: 'Provider name (leave empty to keep current value)',
	},
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createProvider', 'updateProvider'],
			},
		},
		default: true,
		description: 'Whether the provider is enabled',
	},
	{
		displayName: 'API Key',
		name: 'apiKey',
		type: 'string',
		typeOptions: {
			password: true,
		},
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createProvider', 'updateProvider'],
				providerType: ['sendgrid', 'mailgun'],
			},
		},
		default: '',
		description: 'API key for email provider',
	},
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createProvider', 'updateProvider'],
				providerType: ['mailgun'],
			},
		},
		default: '',
		description: 'Mailgun domain',
		placeholder: 'mg.example.com',
	},
	{
		displayName: 'From Email',
		name: 'fromEmail',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createProvider', 'updateProvider'],
				providerType: ['sendgrid', 'mailgun'],
			},
		},
		default: '',
		description: 'Sender email address',
		placeholder: 'noreply@example.com',
	},
	{
		displayName: 'From Name',
		name: 'fromName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createProvider', 'updateProvider'],
				providerType: ['sendgrid', 'mailgun'],
			},
		},
		default: '',
		description: 'Sender name',
		placeholder: 'My App',
	},
	{
		displayName: 'From',
		name: 'from',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createProvider', 'updateProvider'],
				providerType: ['twilio'],
			},
		},
		default: '',
		description: 'Sender phone number for SMS',
		placeholder: '+1234567890',
	},
	{
		displayName: 'Account SID',
		name: 'accountSid',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createProvider', 'updateProvider'],
				providerType: ['twilio'],
			},
		},
		default: '',
		description: 'Twilio Account SID',
	},
	{
		displayName: 'Auth Token',
		name: 'authToken',
		type: 'string',
		typeOptions: {
			password: true,
		},
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createProvider', 'updateProvider'],
				providerType: ['twilio'],
			},
		},
		default: '',
		description: 'Twilio Auth Token',
	},
	{
		displayName: 'Server Key',
		name: 'serverKey',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createProvider', 'updateProvider'],
				providerType: ['fcm'],
			},
		},
		default: '{}',
		description: 'FCM service account JSON object',
		placeholder: '{"type": "service_account", "project_id": "..."}',
	},
	{
		displayName: 'Auth Key',
		name: 'authKey',
		type: 'string',
		typeOptions: {
			password: true,
		},
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createProvider', 'updateProvider'],
				providerType: ['apns'],
			},
		},
		default: '',
		description: 'APNS authentication key',
	},
	{
		displayName: 'Auth Key ID',
		name: 'authKeyId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createProvider', 'updateProvider'],
				providerType: ['apns'],
			},
		},
		default: '',
		description: 'APNS authentication key ID',
	},
	{
		displayName: 'Team ID',
		name: 'teamId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createProvider', 'updateProvider'],
				providerType: ['apns'],
			},
		},
		default: '',
		description: 'APNS team ID',
	},
	{
		displayName: 'Bundle ID',
		name: 'bundleId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createProvider', 'updateProvider'],
				providerType: ['apns'],
			},
		},
		default: '',
		description: 'APNS bundle ID',
	},
	{
		displayName: 'Sandbox',
		name: 'sandbox',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createProvider', 'updateProvider'],
				providerType: ['apns'],
			},
		},
		default: false,
		description: 'Whether to use APNS sandbox environment',
	},
	{
		displayName: 'Queries',
		name: 'queries',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['listProviders'],
			},
		},
		default: '',
		description: 'Comma-separated list of query strings for filtering providers',
		placeholder: 'equal("enabled",true),limit(25)',
	},

	// ==========================================
	//         Topic Fields
	// ==========================================
	{
		displayName: 'Topic ID',
		name: 'topicId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['getTopic', 'updateTopic', 'deleteTopic', 'createSubscriber', 'listSubscribers', 'deleteSubscriber'],
			},
		},
		default: '',
		description: 'The ID of the topic',
	},
	{
		displayName: 'Topic ID',
		name: 'topicId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createTopic'],
			},
		},
		default: 'unique()',
		description: 'Topic ID. Use unique() to generate a unique ID.',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createTopic'],
			},
		},
		default: '',
		description: 'Topic name',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['updateTopic'],
			},
		},
		default: '',
		description: 'Topic name (leave empty to keep current value)',
	},
	{
		displayName: 'Subscribe Permissions',
		name: 'subscribe',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createTopic', 'updateTopic'],
			},
		},
		default: '',
		description: 'Comma-separated list of subscribe permissions',
		placeholder: 'users,guests',
	},
	{
		displayName: 'Queries',
		name: 'queries',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['listTopics'],
			},
		},
		default: '',
		description: 'Comma-separated list of query strings for filtering topics',
		placeholder: 'search("name","newsletter"),limit(25)',
	},

	// ==========================================
	//         Subscriber Fields
	// ==========================================
	{
		displayName: 'Subscriber ID',
		name: 'subscriberId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createSubscriber'],
			},
		},
		default: 'unique()',
		description: 'Subscriber ID. Use unique() to generate a unique ID.',
	},
	{
		displayName: 'Subscriber ID',
		name: 'subscriberId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['deleteSubscriber'],
			},
		},
		default: '',
		description: 'The ID of the subscriber to remove',
	},
	{
		displayName: 'Target ID',
		name: 'targetId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['createSubscriber'],
			},
		},
		default: '',
		description: 'Target ID (user ID or device ID)',
	},
	{
		displayName: 'Queries',
		name: 'queries',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['messaging'],
				operation: ['listSubscribers'],
			},
		},
		default: '',
		description: 'Comma-separated list of query strings for filtering subscribers',
		placeholder: 'limit(25)',
	},
];
