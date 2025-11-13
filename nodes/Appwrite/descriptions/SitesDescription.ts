import { INodeProperties } from 'n8n-workflow';

export const sitesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['sites'],
			},
		},
		options: [
			// Site Operations
			{
				name: 'Create Site',
				value: 'create',
				description: 'Create a new site',
				action: 'Create a site',
			},
			{
				name: 'Delete Site',
				value: 'delete',
				description: 'Delete a site',
				action: 'Delete a site',
			},
			{
				name: 'Get Site',
				value: 'get',
				description: 'Get a site',
				action: 'Get a site',
			},
			{
				name: 'List Sites',
				value: 'list',
				description: 'List all sites',
				action: 'List all sites',
			},
			{
				name: 'Update Site',
				value: 'update',
				description: 'Update a site',
				action: 'Update a site',
			},
			// Deployment Operations
			{
				name: 'Create Deployment',
				value: 'createDeployment',
				description: 'Create a new deployment',
				action: 'Create deployment',
			},
			{
				name: 'Get Deployment',
				value: 'getDeployment',
				description: 'Get deployment details',
				action: 'Get deployment',
			},
			{
				name: 'List Deployments',
				value: 'listDeployments',
				description: 'List all deployments',
				action: 'List deployments',
			},
			{
				name: 'Update Active Deployment',
				value: 'updateActiveDeployment',
				description: 'Switch active deployment',
				action: 'Update active deployment',
			},
			{
				name: 'Delete Deployment',
				value: 'deleteDeployment',
				description: 'Delete a deployment',
				action: 'Delete deployment',
			},
			// Environment Variables
			{
				name: 'Create Variable',
				value: 'createVariable',
				description: 'Create environment variable',
				action: 'Create variable',
			},
			{
				name: 'Delete Variable',
				value: 'deleteVariable',
				description: 'Delete environment variable',
				action: 'Delete variable',
			},
			{
				name: 'Get Variable',
				value: 'getVariable',
				description: 'Get environment variable',
				action: 'Get variable',
			},
			{
				name: 'List Variables',
				value: 'listVariables',
				description: 'List environment variables',
				action: 'List variables',
			},
			{
				name: 'Update Variable',
				value: 'updateVariable',
				description: 'Update environment variable',
				action: 'Update variable',
			},
			// Discovery
			{
				name: 'List Frameworks',
				value: 'listFrameworks',
				description: 'List supported frameworks',
				action: 'List frameworks',
			},
			{
				name: 'List Specifications',
				value: 'listSpecifications',
				description: 'List runtime specifications',
				action: 'List specifications',
			},
		],
		default: 'list',
	},
];

export const sitesFields: INodeProperties[] = [
	// Site ID
	{
		displayName: 'Site ID',
		name: 'siteId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sites'],
				operation: [
					'get',
					'update',
					'delete',
					'createDeployment',
					'listDeployments',
					'getDeployment',
					'updateActiveDeployment',
					'deleteDeployment',
					'createVariable',
					'listVariables',
					'getVariable',
					'updateVariable',
					'deleteVariable',
				],
			},
		},
		default: '',
		description: 'The ID of the site',
	},
	{
		displayName: 'Site ID',
		name: 'siteId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['sites'],
				operation: ['create'],
			},
		},
		default: 'unique()',
		description: 'The ID of the site. Use unique() to generate a unique ID.',
	},
	// Site Name
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sites'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Site name',
	},
	// Framework
	{
		displayName: 'Framework',
		name: 'framework',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sites'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: 'next',
		description: 'Framework identifier (e.g., next, react, vue, svelte)',
	},
	// Build Runtime
	{
		displayName: 'Build Runtime',
		name: 'buildRuntime',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['sites'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Static', value: 'static' },
			{ name: 'Node.js 22', value: 'node-22' },
			{ name: 'Flutter 3.29', value: 'flutter-3.29' },
		],
		default: 'static',
		description: 'Runtime for building the site',
	},
	// Site Configuration Options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['sites'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the site is enabled',
			},
			{
				displayName: 'Logging',
				name: 'logging',
				type: 'boolean',
				default: true,
				description: 'Whether to enable logging',
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 15,
				description: 'Request timeout in seconds',
			},
			{
				displayName: 'Install Command',
				name: 'installCommand',
				type: 'string',
				default: '',
				placeholder: 'npm install',
				description: 'Command to install dependencies',
			},
			{
				displayName: 'Build Command',
				name: 'buildCommand',
				type: 'string',
				default: '',
				placeholder: 'npm run build',
				description: 'Command to build the site',
			},
			{
				displayName: 'Output Directory',
				name: 'outputDirectory',
				type: 'string',
				default: '',
				placeholder: 'dist',
				description: 'Directory containing build output',
			},
			{
				displayName: 'Adapter',
				name: 'adapter',
				type: 'options',
				options: [
					{ name: 'Static', value: 'static' },
					{ name: 'SSR (Server-Side Rendering)', value: 'ssr' },
				],
				default: 'static',
				description: 'Site rendering mode',
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
				resource: ['sites'],
				operation: ['getDeployment', 'updateActiveDeployment', 'deleteDeployment'],
			},
		},
		default: '',
		description: 'The ID of the deployment',
	},
	// Deployment Code (for create deployment)
	{
		displayName: 'Deployment Source',
		name: 'deploymentSource',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['sites'],
				operation: ['createDeployment'],
			},
		},
		options: [
			{ name: 'Upload Code', value: 'upload' },
			{ name: 'Git Repository', value: 'git' },
		],
		default: 'upload',
		description: 'How to deploy the site',
	},
	{
		displayName: 'Code Archive Field',
		name: 'codeArchiveField',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['sites'],
				operation: ['createDeployment'],
				deploymentSource: ['upload'],
			},
		},
		default: 'data',
		description: 'Binary field containing the gzipped code archive',
	},
	{
		displayName: 'Git Options',
		name: 'gitOptions',
		type: 'collection',
		placeholder: 'Add Git Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['sites'],
				operation: ['createDeployment'],
				deploymentSource: ['git'],
			},
		},
		options: [
			{
				displayName: 'Branch',
				name: 'branch',
				type: 'string',
				default: 'main',
				description: 'Git branch to deploy',
			},
			{
				displayName: 'Commit Hash',
				name: 'commit',
				type: 'string',
				default: '',
				description: 'Specific commit to deploy (optional)',
			},
		],
	},
	{
		displayName: 'Deployment Options',
		name: 'deploymentOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['sites'],
				operation: ['createDeployment'],
			},
		},
		options: [
			{
				displayName: 'Activate',
				name: 'activate',
				type: 'boolean',
				default: true,
				description: 'Whether to activate deployment after creation',
			},
			{
				displayName: 'Install Command',
				name: 'installCommand',
				type: 'string',
				default: '',
				placeholder: 'npm install',
				description: 'Override install command',
			},
			{
				displayName: 'Build Command',
				name: 'buildCommand',
				type: 'string',
				default: '',
				placeholder: 'npm run build',
				description: 'Override build command',
			},
			{
				displayName: 'Output Directory',
				name: 'outputDirectory',
				type: 'string',
				default: '',
				placeholder: 'dist',
				description: 'Override output directory',
			},
		],
	},
	// Variable Fields
	{
		displayName: 'Variable ID',
		name: 'variableId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sites'],
				operation: ['getVariable', 'updateVariable', 'deleteVariable'],
			},
		},
		default: '',
		description: 'The ID of the variable',
	},
	{
		displayName: 'Variable ID',
		name: 'variableId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['sites'],
				operation: ['createVariable'],
			},
		},
		default: 'unique()',
		description: 'The ID of the variable. Use unique() to generate a unique ID.',
	},
	{
		displayName: 'Key',
		name: 'key',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sites'],
				operation: ['createVariable', 'updateVariable'],
			},
		},
		default: '',
		description: 'Variable key name',
	},
	{
		displayName: 'Value',
		name: 'value',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sites'],
				operation: ['createVariable', 'updateVariable'],
			},
		},
		default: '',
		description: 'Variable value',
	},
	{
		displayName: 'Is Secret',
		name: 'isSecret',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['sites'],
				operation: ['createVariable'],
			},
		},
		default: false,
		description: 'Whether the variable is a secret (will be encrypted)',
	},
];
