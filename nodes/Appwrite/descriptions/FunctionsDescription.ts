import { INodeProperties } from 'n8n-workflow';

export const functionsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['functions'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new serverless function',
				action: 'Create a function',
			},
			{
				name: 'Create Deployment',
				value: 'createDeployment',
				description: 'Create a new function deployment',
				action: 'Create a deployment',
			},
			{
				name: 'Create Execution',
				value: 'createExecution',
				description: 'Execute a function',
				action: 'Execute a function',
			},
			{
				name: 'Create Variable',
				value: 'createVariable',
				description: 'Create an environment variable',
				action: 'Create a variable',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a function',
				action: 'Delete a function',
			},
			{
				name: 'Delete Deployment',
				value: 'deleteDeployment',
				description: 'Delete a deployment',
				action: 'Delete a deployment',
			},
			{
				name: 'Delete Variable',
				value: 'deleteVariable',
				description: 'Delete an environment variable',
				action: 'Delete a variable',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get function details',
				action: 'Get a function',
			},
			{
				name: 'Get Deployment',
				value: 'getDeployment',
				description: 'Get deployment details',
				action: 'Get a deployment',
			},
			{
				name: 'Get Execution',
				value: 'getExecution',
				description: 'Get execution details',
				action: 'Get an execution',
			},
			{
				name: 'Get Variable',
				value: 'getVariable',
				description: 'Get environment variable details',
				action: 'Get a variable',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all functions',
				action: 'List functions',
			},
			{
				name: 'List Deployments',
				value: 'listDeployments',
				description: 'List all deployments for a function',
				action: 'List deployments',
			},
			{
				name: 'List Executions',
				value: 'listExecutions',
				description: 'List all executions for a function',
				action: 'List executions',
			},
			{
				name: 'List Variables',
				value: 'listVariables',
				description: 'List all environment variables for a function',
				action: 'List variables',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a function',
				action: 'Update a function',
			},
			{
				name: 'Update Deployment',
				value: 'updateDeployment',
				description: 'Activate a deployment',
				action: 'Update a deployment',
			},
			{
				name: 'Update Variable',
				value: 'updateVariable',
				description: 'Update an environment variable',
				action: 'Update a variable',
			},
		],
		default: 'list',
	},
];

export const functionsFields: INodeProperties[] = [
	// Function ID (for most operations)
	{
		displayName: 'Function ID',
		name: 'functionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['functions'],
				operation: [
					'get',
					'update',
					'delete',
					'createDeployment',
					'listDeployments',
					'getDeployment',
					'updateDeployment',
					'deleteDeployment',
					'createExecution',
					'listExecutions',
					'getExecution',
					'createVariable',
					'listVariables',
					'getVariable',
					'updateVariable',
					'deleteVariable',
				],
			},
		},
		default: '',
		description: 'The ID of the function',
	},
	{
		displayName: 'Function ID',
		name: 'functionId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['functions'],
				operation: ['create'],
			},
		},
		default: 'unique()',
		description: 'The ID of the function. Use unique() to generate a unique ID.',
	},

	// Function Name
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['functions'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Function name (max 128 characters)',
	},

	// Runtime (for create)
	{
		displayName: 'Runtime',
		name: 'runtime',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['functions'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Node.js 18', value: 'node-18.0' },
			{ name: 'Node.js 19', value: 'node-19.0' },
			{ name: 'Node.js 20', value: 'node-20.0' },
			{ name: 'Node.js 21', value: 'node-21.0' },
			{ name: 'PHP 8.0', value: 'php-8.0' },
			{ name: 'PHP 8.1', value: 'php-8.1' },
			{ name: 'PHP 8.2', value: 'php-8.2' },
			{ name: 'PHP 8.3', value: 'php-8.3' },
			{ name: 'Python 3.8', value: 'python-3.8' },
			{ name: 'Python 3.9', value: 'python-3.9' },
			{ name: 'Python 3.10', value: 'python-3.10' },
			{ name: 'Python 3.11', value: 'python-3.11' },
			{ name: 'Python 3.12', value: 'python-3.12' },
			{ name: 'Ruby 3.0', value: 'ruby-3.0' },
			{ name: 'Ruby 3.1', value: 'ruby-3.1' },
			{ name: 'Ruby 3.2', value: 'ruby-3.2' },
			{ name: 'Ruby 3.3', value: 'ruby-3.3' },
			{ name: 'Dart 2.15', value: 'dart-2.15' },
			{ name: 'Dart 2.16', value: 'dart-2.16' },
			{ name: 'Dart 2.17', value: 'dart-2.17' },
			{ name: 'Dart 2.18', value: 'dart-2.18' },
			{ name: 'Dart 3.0', value: 'dart-3.0' },
			{ name: 'Dart 3.1', value: 'dart-3.1' },
			{ name: 'Dart 3.3', value: 'dart-3.3' },
			{ name: '.NET 6.0', value: 'dotnet-6.0' },
			{ name: '.NET 7.0', value: 'dotnet-7.0' },
			{ name: 'Java 8', value: 'java-8.0' },
			{ name: 'Java 11', value: 'java-11.0' },
			{ name: 'Java 17', value: 'java-17.0' },
			{ name: 'Java 18', value: 'java-18.0' },
			{ name: 'Java 21', value: 'java-21.0' },
			{ name: 'Swift 5.5', value: 'swift-5.5' },
			{ name: 'Swift 5.8', value: 'swift-5.8' },
			{ name: 'Swift 5.9', value: 'swift-5.9' },
			{ name: 'Kotlin 1.6', value: 'kotlin-1.6' },
			{ name: 'Kotlin 1.8', value: 'kotlin-1.8' },
			{ name: 'Kotlin 1.9', value: 'kotlin-1.9' },
			{ name: 'C++ 17', value: 'cpp-17' },
			{ name: 'C++ 20', value: 'cpp-20' },
			{ name: 'Bun 1.0', value: 'bun-1.0' },
			{ name: 'Deno 1.21', value: 'deno-1.21' },
			{ name: 'Deno 1.24', value: 'deno-1.24' },
			{ name: 'Deno 1.35', value: 'deno-1.35' },
			{ name: 'Deno 1.40', value: 'deno-1.40' },
		],
		default: 'node-20.0',
		description: 'Execution runtime for the function',
	},

	// Runtime (for update - optional)
	{
		displayName: 'Runtime',
		name: 'runtime',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['functions'],
				operation: ['update'],
			},
		},
		options: [
			{ name: 'Node.js 18', value: 'node-18.0' },
			{ name: 'Node.js 19', value: 'node-19.0' },
			{ name: 'Node.js 20', value: 'node-20.0' },
			{ name: 'Node.js 21', value: 'node-21.0' },
			{ name: 'PHP 8.0', value: 'php-8.0' },
			{ name: 'PHP 8.1', value: 'php-8.1' },
			{ name: 'PHP 8.2', value: 'php-8.2' },
			{ name: 'PHP 8.3', value: 'php-8.3' },
			{ name: 'Python 3.8', value: 'python-3.8' },
			{ name: 'Python 3.9', value: 'python-3.9' },
			{ name: 'Python 3.10', value: 'python-3.10' },
			{ name: 'Python 3.11', value: 'python-3.11' },
			{ name: 'Python 3.12', value: 'python-3.12' },
			{ name: 'Ruby 3.0', value: 'ruby-3.0' },
			{ name: 'Ruby 3.1', value: 'ruby-3.1' },
			{ name: 'Ruby 3.2', value: 'ruby-3.2' },
			{ name: 'Ruby 3.3', value: 'ruby-3.3' },
			{ name: 'Dart 2.15', value: 'dart-2.15' },
			{ name: 'Dart 2.16', value: 'dart-2.16' },
			{ name: 'Dart 2.17', value: 'dart-2.17' },
			{ name: 'Dart 2.18', value: 'dart-2.18' },
			{ name: 'Dart 3.0', value: 'dart-3.0' },
			{ name: 'Dart 3.1', value: 'dart-3.1' },
			{ name: 'Dart 3.3', value: 'dart-3.3' },
			{ name: '.NET 6.0', value: 'dotnet-6.0' },
			{ name: '.NET 7.0', value: 'dotnet-7.0' },
			{ name: 'Java 8', value: 'java-8.0' },
			{ name: 'Java 11', value: 'java-11.0' },
			{ name: 'Java 17', value: 'java-17.0' },
			{ name: 'Java 18', value: 'java-18.0' },
			{ name: 'Java 21', value: 'java-21.0' },
			{ name: 'Swift 5.5', value: 'swift-5.5' },
			{ name: 'Swift 5.8', value: 'swift-5.8' },
			{ name: 'Swift 5.9', value: 'swift-5.9' },
			{ name: 'Kotlin 1.6', value: 'kotlin-1.6' },
			{ name: 'Kotlin 1.8', value: 'kotlin-1.8' },
			{ name: 'Kotlin 1.9', value: 'kotlin-1.9' },
			{ name: 'C++ 17', value: 'cpp-17' },
			{ name: 'C++ 20', value: 'cpp-20' },
			{ name: 'Bun 1.0', value: 'bun-1.0' },
			{ name: 'Deno 1.21', value: 'deno-1.21' },
			{ name: 'Deno 1.24', value: 'deno-1.24' },
			{ name: 'Deno 1.35', value: 'deno-1.35' },
			{ name: 'Deno 1.40', value: 'deno-1.40' },
		],
		default: '',
		description: 'Execution runtime for the function (leave empty to keep current)',
	},

	// Function Options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['functions'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Execute Permissions',
				name: 'execute',
				type: 'json',
				default: '["any"]',
				description: 'Array of permissions strings for function execution',
				placeholder: '["any"]',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'json',
				default: '[]',
				description: 'Array of event strings that trigger the function',
				placeholder: '["users.*.create"]',
			},
			{
				displayName: 'Schedule',
				name: 'schedule',
				type: 'string',
				default: '',
				description: 'Cron schedule for automatic execution',
				placeholder: '0 0 * * *',
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 15,
				description: 'Maximum execution time in seconds (max 900)',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the function is enabled',
			},
			{
				displayName: 'Logging',
				name: 'logging',
				type: 'boolean',
				default: true,
				description: 'Whether logging is enabled',
			},
			{
				displayName: 'Entrypoint',
				name: 'entrypoint',
				type: 'string',
				default: '',
				description: 'Entrypoint file for the function',
				placeholder: 'index.js',
			},
			{
				displayName: 'Commands',
				name: 'commands',
				type: 'string',
				default: '',
				description: 'Build commands to execute',
				placeholder: 'npm install',
			},
			{
				displayName: 'Installation ID',
				name: 'installationId',
				type: 'string',
				default: '',
				description: 'VCS installation ID for Git integration',
			},
			{
				displayName: 'Repository ID',
				name: 'providerRepositoryId',
				type: 'string',
				default: '',
				description: 'VCS repository ID',
			},
			{
				displayName: 'Branch',
				name: 'providerBranch',
				type: 'string',
				default: '',
				description: 'VCS branch name',
				placeholder: 'main',
			},
			{
				displayName: 'Silent Mode',
				name: 'providerSilentMode',
				type: 'boolean',
				default: false,
				description: 'Whether to skip commit status updates',
			},
			{
				displayName: 'Root Directory',
				name: 'providerRootDirectory',
				type: 'string',
				default: '',
				description: 'Path to function code in repository',
				placeholder: '/',
			},
			{
				displayName: 'Template Repository',
				name: 'templateRepository',
				type: 'string',
				default: '',
				description: 'Template repository URL',
			},
			{
				displayName: 'Template Owner',
				name: 'templateOwner',
				type: 'string',
				default: '',
				description: 'Template repository owner ID',
			},
			{
				displayName: 'Template Root Directory',
				name: 'templateRootDirectory',
				type: 'string',
				default: '',
				description: 'Path to template in repository',
			},
			{
				displayName: 'Template Branch',
				name: 'templateBranch',
				type: 'string',
				default: '',
				description: 'Template branch name',
			},
		],
	},

	// List Options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['functions'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Queries',
				name: 'queries',
				type: 'json',
				default: '[]',
				description: 'Array of query strings for filtering results',
				placeholder: '["equal(\\"enabled\\", true)"]',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search term to filter functions by name',
			},
		],
	},

	// Deployment ID
	{
		displayName: 'Deployment ID',
		name: 'deploymentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['functions'],
				operation: ['getDeployment', 'updateDeployment', 'deleteDeployment'],
			},
		},
		default: '',
		description: 'The ID of the deployment',
	},
	{
		displayName: 'Deployment ID',
		name: 'deploymentId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['functions'],
				operation: ['createDeployment'],
			},
		},
		default: 'unique()',
		description: 'The ID of the deployment. Use unique() to generate a unique ID.',
	},

	// Entrypoint (for deployment)
	{
		displayName: 'Entrypoint',
		name: 'entrypoint',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['functions'],
				operation: ['createDeployment'],
			},
		},
		default: '',
		description: 'Entrypoint file for the deployment (optional, uses function entrypoint if not specified)',
	},

	// Binary Property Name (for deployment)
	{
		displayName: 'Input Binary Field',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['functions'],
				operation: ['createDeployment'],
			},
		},
		default: 'data',
		description: 'Name of the input binary field containing the code archive (tar.gz)',
	},

	// Deployment Options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['functions'],
				operation: ['createDeployment'],
			},
		},
		options: [
			{
				displayName: 'Activate',
				name: 'activate',
				type: 'boolean',
				default: true,
				description: 'Whether to automatically activate the deployment',
			},
		],
	},

	// List Deployments Options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['functions'],
				operation: ['listDeployments'],
			},
		},
		options: [
			{
				displayName: 'Queries',
				name: 'queries',
				type: 'json',
				default: '[]',
				description: 'Array of query strings for filtering results',
				placeholder: '["equal(\\"activate\\", true)"]',
			},
		],
	},

	// Execution Options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['functions'],
				operation: ['createExecution'],
			},
		},
		options: [
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				default: '',
				description: 'Request body data to pass to the function',
				placeholder: '{"key": "value"}',
			},
			{
				displayName: 'Async',
				name: 'async',
				type: 'boolean',
				default: false,
				description: 'Whether to execute asynchronously (returns immediately)',
			},
			{
				displayName: 'Path',
				name: 'path',
				type: 'string',
				default: '/',
				description: 'HTTP request path',
			},
			{
				displayName: 'Method',
				name: 'method',
				type: 'options',
				options: [
					{ name: 'GET', value: 'GET' },
					{ name: 'POST', value: 'POST' },
					{ name: 'PUT', value: 'PUT' },
					{ name: 'PATCH', value: 'PATCH' },
					{ name: 'DELETE', value: 'DELETE' },
					{ name: 'OPTIONS', value: 'OPTIONS' },
				],
				default: 'POST',
				description: 'HTTP request method',
			},
			{
				displayName: 'Headers',
				name: 'headers',
				type: 'json',
				default: '{}',
				description: 'HTTP headers as JSON object',
				placeholder: '{"Content-Type": "application/json"}',
			},
		],
	},

	// Execution ID
	{
		displayName: 'Execution ID',
		name: 'executionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['functions'],
				operation: ['getExecution'],
			},
		},
		default: '',
		description: 'The ID of the execution',
	},

	// List Executions Options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['functions'],
				operation: ['listExecutions'],
			},
		},
		options: [
			{
				displayName: 'Queries',
				name: 'queries',
				type: 'json',
				default: '[]',
				description: 'Array of query strings for filtering results',
				placeholder: '["equal(\\"status\\", \\"completed\\")"]',
			},
		],
	},

	// Variable ID
	{
		displayName: 'Variable ID',
		name: 'variableId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['functions'],
				operation: ['getVariable', 'updateVariable', 'deleteVariable'],
			},
		},
		default: '',
		description: 'The ID of the environment variable',
	},

	// Variable Key
	{
		displayName: 'Key',
		name: 'key',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['functions'],
				operation: ['createVariable', 'updateVariable'],
			},
		},
		default: '',
		description: 'Environment variable key name',
		placeholder: 'API_KEY',
	},

	// Variable Value
	{
		displayName: 'Value',
		name: 'value',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['functions'],
				operation: ['createVariable'],
			},
		},
		default: '',
		description: 'Environment variable value',
	},

	// Variable Value (for update - optional)
	{
		displayName: 'Value',
		name: 'value',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['functions'],
				operation: ['updateVariable'],
			},
		},
		default: '',
		description: 'New environment variable value (leave empty to keep current value)',
	},
];
