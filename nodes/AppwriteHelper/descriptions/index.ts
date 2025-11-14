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
		displayName: 'Query Template',
		name: 'queryTemplate',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['buildQuery'],
			},
		},
		options: [
			{
				name: 'Custom (Manual)',
				value: 'custom',
				description: 'Build queries manually',
			},
			{
				name: 'Active Users',
				value: 'activeUsers',
				description: 'Filter for active users (status = "active")',
			},
			{
				name: 'Recent Documents',
				value: 'recentDocuments',
				description: 'Get most recent documents with limit',
			},
			{
				name: 'Search by Name',
				value: 'searchName',
				description: 'Search documents by name field',
			},
			{
				name: 'Date Range',
				value: 'dateRange',
				description: 'Filter documents between two dates',
			},
			{
				name: 'Paginated Results',
				value: 'paginatedResults',
				description: 'Get paginated results with limit and offset',
			},
		],
		default: 'custom',
		description: 'Select a pre-built query template or create custom queries',
	},
	{
		displayName: 'Template Info',
		name: 'templateInfo',
		type: 'notice',
		displayOptions: {
			show: {
				operation: ['buildQuery'],
				queryTemplate: ['activeUsers'],
			},
		},
		default: '',
		description: 'This template creates: Query.equal("status", "active")',
	},
	{
		displayName: 'Template Info',
		name: 'templateInfo',
		type: 'notice',
		displayOptions: {
			show: {
				operation: ['buildQuery'],
				queryTemplate: ['recentDocuments'],
			},
		},
		default: '',
		description: 'This template creates: Query.orderDesc("$createdAt"), Query.limit(25)',
	},
	{
		displayName: 'Template Info',
		name: 'templateInfo',
		type: 'notice',
		displayOptions: {
			show: {
				operation: ['buildQuery'],
				queryTemplate: ['searchName'],
			},
		},
		default: '',
		description: 'This template creates: Query.search("name", "search_term")',
	},
	{
		displayName: 'Template Info',
		name: 'templateInfo',
		type: 'notice',
		displayOptions: {
			show: {
				operation: ['buildQuery'],
				queryTemplate: ['dateRange'],
			},
		},
		default: '',
		description: 'This template creates: Query.between("$createdAt", "start_date", "end_date")',
	},
	{
		displayName: 'Template Info',
		name: 'templateInfo',
		type: 'notice',
		displayOptions: {
			show: {
				operation: ['buildQuery'],
				queryTemplate: ['paginatedResults'],
			},
		},
		default: '',
		description: 'This template creates: Query.limit(25), Query.offset(0)',
	},
	// Template-specific parameters
	{
		displayName: 'Search Term',
		name: 'templateSearchTerm',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['buildQuery'],
				queryTemplate: ['searchName'],
			},
		},
		default: '',
		description: 'The search term to look for in the name field',
		placeholder: 'John',
	},
	{
		displayName: 'Start Date',
		name: 'templateStartDate',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['buildQuery'],
				queryTemplate: ['dateRange'],
			},
		},
		default: '',
		description: 'Start date for the range (ISO format)',
		placeholder: '2024-01-01T00:00:00.000Z',
	},
	{
		displayName: 'End Date',
		name: 'templateEndDate',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['buildQuery'],
				queryTemplate: ['dateRange'],
			},
		},
		default: '',
		description: 'End date for the range (ISO format)',
		placeholder: '2024-12-31T23:59:59.999Z',
	},
	{
		displayName: 'Page Size',
		name: 'templatePageSize',
		type: 'number',
		displayOptions: {
			show: {
				operation: ['buildQuery'],
				queryTemplate: ['paginatedResults', 'recentDocuments'],
			},
		},
		default: 25,
		description: 'Number of results per page',
		typeOptions: {
			minValue: 1,
			maxValue: 5000,
		},
	},
	{
		displayName: 'Page Number',
		name: 'templatePageNumber',
		type: 'number',
		displayOptions: {
			show: {
				operation: ['buildQuery'],
				queryTemplate: ['paginatedResults'],
			},
		},
		default: 1,
		description: 'Page number to retrieve (1-based)',
		typeOptions: {
			minValue: 1,
		},
	},
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
				queryTemplate: ['custom'],
			},
		},
		default: {},
		placeholder: 'Add Query',
		description: 'Build custom queries using the query builder. Queries are combined with AND logic.',
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
							{
								name: 'Equal',
								value: 'equal',
								description: 'Match exact value (e.g., status = "active")'
							},
							{
								name: 'Not Equal',
								value: 'notEqual',
								description: 'Exclude specific value (e.g., status != "deleted")'
							},
							{
								name: 'Less Than',
								value: 'lessThan',
								description: 'Match values less than specified (e.g., age < 65)'
							},
							{
								name: 'Less Than or Equal',
								value: 'lessThanEqual',
								description: 'Match values less than or equal to specified (e.g., price <= 100)'
							},
							{
								name: 'Greater Than',
								value: 'greaterThan',
								description: 'Match values greater than specified (e.g., age > 18)'
							},
							{
								name: 'Greater Than or Equal',
								value: 'greaterThanEqual',
								description: 'Match values greater than or equal to specified (e.g., score >= 50)'
							},
							{
								name: 'Search',
								value: 'search',
								description: 'Full-text search in attribute (e.g., search in description)'
							},
							{
								name: 'Is Null',
								value: 'isNull',
								description: 'Match documents where attribute is null or missing'
							},
							{
								name: 'Is Not Null',
								value: 'isNotNull',
								description: 'Match documents where attribute exists and is not null'
							},
							{
								name: 'Between',
								value: 'between',
								description: 'Match values in range (e.g., date between Jan-1 and Dec-31)'
							},
							{
								name: 'Starts With',
								value: 'startsWith',
								description: 'Match strings starting with value (e.g., name starts with "John")'
							},
							{
								name: 'Ends With',
								value: 'endsWith',
								description: 'Match strings ending with value (e.g., email ends with "@example.com")'
							},
							{
								name: 'Select',
								value: 'select',
								description: 'Specify which attributes to return (improves performance)'
							},
							{
								name: 'Order Desc',
								value: 'orderDesc',
								description: 'Sort results descending (newest/highest first)'
							},
							{
								name: 'Order Asc',
								value: 'orderAsc',
								description: 'Sort results ascending (oldest/lowest first)'
							},
							{
								name: 'Limit',
								value: 'limit',
								description: 'Maximum number of results to return (1-5000, default: 25)'
							},
							{
								name: 'Offset',
								value: 'offset',
								description: 'Skip first N results (for pagination)'
							},
						],
						default: 'equal',
						description: 'Type of query to build',
					},
					{
						displayName: 'Attribute',
						name: 'attribute',
						type: 'string',
						displayOptions: {
							show: {
								queryType: ['equal', 'notEqual', 'lessThan', 'lessThanEqual', 'greaterThan', 'greaterThanEqual', 'search', 'isNull', 'isNotNull', 'between', 'startsWith', 'endsWith', 'orderDesc', 'orderAsc'],
							},
						},
						default: '',
						description: 'Name of the attribute to query. Common attributes: $id, $createdAt, $updatedAt, or custom fields like name, status, email.',
						placeholder: 'status',
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
						description: 'Value to compare against. For dates use ISO format (e.g., 2024-01-01T00:00:00.000Z), for numbers use numeric strings.',
						placeholder: 'active',
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
						description: 'Comma-separated list of attributes to include in results. Only these fields will be returned, improving query performance.',
						placeholder: '$id,name,email,status',
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
						description: 'Start value for range (inclusive). For dates use ISO format.',
						placeholder: '2024-01-01T00:00:00.000Z',
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
						description: 'End value for range (inclusive). For dates use ISO format.',
						placeholder: '2024-12-31T23:59:59.999Z',
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
						description: 'Maximum number of documents to return (1-5000). Default: 25. Use with offset for pagination.',
						typeOptions: {
							minValue: 1,
							maxValue: 5000,
						},
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
						description: 'Number of documents to skip. Use with limit for pagination (e.g., offset: 25, limit: 25 for page 2).',
						typeOptions: {
							minValue: 0,
						},
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
