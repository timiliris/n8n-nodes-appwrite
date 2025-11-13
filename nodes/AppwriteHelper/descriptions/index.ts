import { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Build Permissions',
				value: 'buildPermissions',
				description: 'Build Appwrite permission strings',
				action: 'Build permissions',
			},
			{
				name: 'Build Query',
				value: 'buildQuery',
				description: 'Build Appwrite query array',
				action: 'Build query',
			},
			{
				name: 'Build Schema',
				value: 'buildSchema',
				description: 'Build collection schema from attributes',
				action: 'Build schema',
			},
		],
		default: 'buildPermissions',
	},
	// Permission Builder fields
	{
		displayName: 'Permissions',
		name: 'permissionsList',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				operation: ['buildPermissions'],
			},
		},
		default: {},
		placeholder: 'Add Permission',
		description: 'List of permissions to create',
		options: [
			{
				name: 'permissions',
				displayName: 'Permission',
				values: [
					{
						displayName: 'Permission Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'Read', value: 'read' },
							{ name: 'Create', value: 'create' },
							{ name: 'Update', value: 'update' },
							{ name: 'Delete', value: 'delete' },
							{ name: 'Write', value: 'write' },
						],
						default: 'read',
						description: 'Type of permission',
					},
					{
						displayName: 'Role',
						name: 'role',
						type: 'options',
						options: [
							{ name: 'Any', value: 'any', description: 'Anyone (including guests)' },
							{ name: 'Guests', value: 'guests', description: 'Guest users only' },
							{ name: 'Users', value: 'users', description: 'Any authenticated user' },
							{ name: 'User', value: 'user', description: 'Specific user by ID' },
							{ name: 'Team', value: 'team', description: 'Team members by team ID' },
							{ name: 'Member', value: 'member', description: 'Specific team member' },
							{ name: 'Label', value: 'label', description: 'Users with specific label' },
						],
						default: 'any',
						description: 'Who has this permission',
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						displayOptions: {
							show: {
								role: ['user', 'team', 'member', 'label'],
							},
						},
						default: '',
						description: 'User ID, Team ID, or Label depending on role type',
						placeholder: 'user123 or team456',
					},
				],
			},
		],
	},
	// Query Builder fields
	{
		displayName: 'Queries',
		name: 'queriesList',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				operation: ['buildQuery'],
			},
		},
		default: {},
		placeholder: 'Add Query',
		description: 'List of queries to build',
		options: [
			{
				name: 'queries',
				displayName: 'Query',
				values: [
					{
						displayName: 'Query Type',
						name: 'queryType',
						type: 'options',
						options: [
							{ name: 'Equal', value: 'equal' },
							{ name: 'Not Equal', value: 'notEqual' },
							{ name: 'Less Than', value: 'lessThan' },
							{ name: 'Less Than or Equal', value: 'lessThanEqual' },
							{ name: 'Greater Than', value: 'greaterThan' },
							{ name: 'Greater Than or Equal', value: 'greaterThanEqual' },
							{ name: 'Search', value: 'search' },
							{ name: 'Is Null', value: 'isNull' },
							{ name: 'Is Not Null', value: 'isNotNull' },
							{ name: 'Between', value: 'between' },
							{ name: 'Starts With', value: 'startsWith' },
							{ name: 'Ends With', value: 'endsWith' },
							{ name: 'Select', value: 'select' },
							{ name: 'Order Desc', value: 'orderDesc' },
							{ name: 'Order Asc', value: 'orderAsc' },
							{ name: 'Limit', value: 'limit' },
							{ name: 'Offset', value: 'offset' },
						],
						default: 'equal',
						description: 'Type of query',
					},
					{
						displayName: 'Attribute',
						name: 'attribute',
						type: 'string',
						displayOptions: {
							show: {
								queryType: ['equal', 'notEqual', 'lessThan', 'lessThanEqual', 'greaterThan', 'greaterThanEqual', 'search', 'isNull', 'isNotNull', 'between', 'startsWith', 'endsWith', 'select', 'orderDesc', 'orderAsc'],
							},
						},
						default: '',
						description: 'Attribute name to query',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						displayOptions: {
							show: {
								queryType: ['equal', 'notEqual', 'lessThan', 'lessThanEqual', 'greaterThan', 'greaterThanEqual', 'search', 'startsWith', 'endsWith'],
							},
						},
						default: '',
						description: 'Value to compare',
					},
					{
						displayName: 'Values',
						name: 'values',
						type: 'string',
						displayOptions: {
							show: {
								queryType: ['select'],
							},
						},
						default: '',
						description: 'Comma-separated list of attributes to select',
						placeholder: 'name,email,age',
					},
					{
						displayName: 'Start Value',
						name: 'startValue',
						type: 'string',
						displayOptions: {
							show: {
								queryType: ['between'],
							},
						},
						default: '',
						description: 'Start value for range',
					},
					{
						displayName: 'End Value',
						name: 'endValue',
						type: 'string',
						displayOptions: {
							show: {
								queryType: ['between'],
							},
						},
						default: '',
						description: 'End value for range',
					},
					{
						displayName: 'Limit',
						name: 'limitValue',
						type: 'number',
						displayOptions: {
							show: {
								queryType: ['limit'],
							},
						},
						default: 25,
						description: 'Maximum number of documents to return',
					},
					{
						displayName: 'Offset',
						name: 'offsetValue',
						type: 'number',
						displayOptions: {
							show: {
								queryType: ['offset'],
							},
						},
						default: 0,
						description: 'Number of documents to skip',
					},
				],
			},
		],
	},
	// Schema Builder fields
	{
		displayName: 'Input Mode',
		name: 'schemaInputMode',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['buildSchema'],
			},
		},
		options: [
			{
				name: 'Form',
				value: 'form',
				description: 'Use a user-friendly form to add attributes',
			},
			{
				name: 'JSON',
				value: 'json',
				description: 'Provide attributes as JSON',
			},
		],
		default: 'form',
		description: 'How to provide the schema attributes',
	},
	{
		displayName: 'Schema Attributes',
		name: 'schemaAttributesList',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				operation: ['buildSchema'],
				schemaInputMode: ['form'],
			},
		},
		default: {},
		placeholder: 'Add Attribute',
		description: 'List of attributes for the schema',
		options: [
			{
				name: 'attributes',
				displayName: 'Attribute',
				values: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'String', value: 'string' },
							{ name: 'Integer', value: 'integer' },
							{ name: 'Boolean', value: 'boolean' },
							{ name: 'Email', value: 'email' },
							{ name: 'Enum', value: 'enum' },
							{ name: 'Float', value: 'float' },
							{ name: 'DateTime', value: 'datetime' },
						],
						default: 'string',
						description: 'The type of attribute',
					},
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
						required: true,
						description: 'Attribute key',
					},
					{
						displayName: 'Size',
						name: 'size',
						type: 'number',
						displayOptions: {
							show: {
								type: ['string', 'email'],
							},
						},
						default: 255,
						description: 'Maximum length',
					},
					{
						displayName: 'Required',
						name: 'required',
						type: 'boolean',
						default: false,
						description: 'Whether the attribute is required',
					},
					{
						displayName: 'Array',
						name: 'array',
						type: 'boolean',
						default: false,
						description: 'Whether the attribute is an array',
					},
					{
						displayName: 'Elements',
						name: 'elements',
						type: 'string',
						displayOptions: {
							show: {
								type: ['enum'],
							},
						},
						default: '',
						placeholder: 'option1,option2,option3',
						description: 'Comma-separated enum values',
					},
					{
						displayName: 'Min',
						name: 'min',
						type: 'number',
						displayOptions: {
							show: {
								type: ['integer', 'float'],
							},
						},
						default: undefined,
						description: 'Minimum value',
					},
					{
						displayName: 'Max',
						name: 'max',
						type: 'number',
						displayOptions: {
							show: {
								type: ['integer', 'float'],
							},
						},
						default: undefined,
						description: 'Maximum value',
					},
				],
			},
		],
	},
	{
		displayName: 'Schema Input (JSON)',
		name: 'schemaInputJson',
		type: 'json',
		displayOptions: {
			show: {
				operation: ['buildSchema'],
				schemaInputMode: ['json'],
			},
		},
		default: '[]',
		description: 'Array of attributes in JSON format',
		placeholder: '[{"type": "string", "key": "name", "size": 255, "required": true}]',
	},
];
