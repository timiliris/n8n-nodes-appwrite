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
			{
				name: 'Permission Preset',
				value: 'permissionPreset',
				description: 'Generate common permission presets',
				action: 'Generate permission preset',
			},
			{
				name: 'Detect Permission Conflicts',
				value: 'detectConflicts',
				description: 'Find redundant or conflicting permissions',
				action: 'Detect permission conflicts',
			},
			{
				name: 'Generate ID',
				value: 'generateId',
				description: 'Generate unique IDs in various formats',
				action: 'Generate ID',
			},
			{
				name: 'Validate ID',
				value: 'validateId',
				description: 'Validate ID format and Appwrite constraints',
				action: 'Validate ID',
			},
			{
				name: 'Format Date/Time',
				value: 'formatDateTime',
				description: 'Format dates for Appwrite (ISO 8601, timestamps)',
				action: 'Format date/time',
			},
			{
				name: 'CSV to Documents',
				value: 'csvToDocuments',
				description: 'Convert CSV data to Appwrite document format',
				action: 'Convert CSV to documents',
			},
			{
				name: 'Extract File Metadata',
				value: 'extractMetadata',
				description: 'Extract metadata from binary files',
				action: 'Extract file metadata',
			},
			{
				name: 'AI Filter Items',
				value: 'aiFilterItems',
				description: 'Filter a list of items using AI with preset or custom prompts',
				action: 'Filter items with AI',
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
	// Permission Preset fields
	{
		displayName: 'Preset Name',
		name: 'presetName',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['permissionPreset'],
			},
		},
		options: [
			{
				name: 'Public Read',
				value: 'publicRead',
				description: 'Anyone can read (read("any"))',
			},
			{
				name: 'Public Read, Users Write',
				value: 'publicReadUserWrite',
				description: 'Public read, authenticated users can write',
			},
			{
				name: 'Private',
				value: 'private',
				description: 'Only authenticated users can read and write',
			},
			{
				name: 'User Owned',
				value: 'userOwned',
				description: 'Full CRUD for authenticated users',
			},
			{
				name: 'Team Collaborative',
				value: 'teamCollaborative',
				description: 'Team members can collaborate',
			},
			{
				name: 'Admin Only',
				value: 'adminOnly',
				description: 'Only admins can read and write',
			},
			{
				name: 'Public Read, Admin Write',
				value: 'publicReadAdminWrite',
				description: 'Public read, only admins can write',
			},
			{
				name: 'Guests Read',
				value: 'guestsRead',
				description: 'Only guests can read',
			},
		],
		default: 'publicRead',
		description: 'Select a permission preset',
	},
	// Detect Conflicts fields
	{
		displayName: 'Permissions (JSON Array)',
		name: 'permissionsInput',
		type: 'json',
		displayOptions: {
			show: {
				operation: ['detectConflicts'],
			},
		},
		default: '[]',
		description: 'Array of permission strings to analyze',
		placeholder: '["read(\\"any\\")", "read(\\"users\\")", "write(\\"users\\")"]',
	},
	// Generate ID fields
	{
		displayName: 'ID Format',
		name: 'idFormat',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['generateId'],
			},
		},
		options: [
			{
				name: 'UUID v4',
				value: 'uuid',
				description: 'Standard UUID v4 (e.g., 550e8400-e29b-41d4-a716-446655440000)',
			},
			{
				name: 'Nanoid',
				value: 'nanoid',
				description: 'URL-friendly unique ID (e.g., V1StGXR8_Z5jdHi6B-myT)',
			},
			{
				name: 'Timestamp',
				value: 'timestamp',
				description: 'Timestamp-based ID (e.g., 1699876543210-abc123def)',
			},
			{
				name: 'Slug',
				value: 'slug',
				description: 'URL-friendly slug from text (e.g., my-document-name)',
			},
			{
				name: 'Short ID',
				value: 'shortid',
				description: 'Short alphanumeric ID (e.g., aBc123Xy)',
			},
			{
				name: 'Custom Pattern',
				value: 'custom',
				description: 'Custom pattern with X as placeholders',
			},
		],
		default: 'nanoid',
		description: 'Format for the generated ID',
	},
	{
		displayName: 'Length',
		name: 'idLength',
		type: 'number',
		displayOptions: {
			show: {
				operation: ['generateId'],
				idFormat: ['nanoid', 'shortid'],
			},
		},
		default: 21,
		description: 'Length of the generated ID',
		typeOptions: {
			minValue: 1,
			maxValue: 36,
		},
	},
	{
		displayName: 'Text to Slugify',
		name: 'idText',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['generateId'],
				idFormat: ['slug'],
			},
		},
		default: '',
		description: 'Text to convert to a slug',
		placeholder: 'My Document Name',
	},
	{
		displayName: 'Custom Pattern',
		name: 'idPattern',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['generateId'],
				idFormat: ['custom'],
			},
		},
		default: 'ID-XXXX',
		description: 'Custom pattern (use X for random digits)',
		placeholder: 'USER-XXXX-XXXX',
	},
	// Validate ID fields
	{
		displayName: 'ID to Validate',
		name: 'idToValidate',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['validateId'],
			},
		},
		default: '',
		description: 'The ID to validate',
		placeholder: 'my-document-id',
	},
	{
		displayName: 'Validation Pattern',
		name: 'validationPattern',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['validateId'],
			},
		},
		options: [
			{
				name: 'Appwrite Only',
				value: 'none',
				description: 'Only validate Appwrite constraints (36 chars, alphanumeric with .-_)',
			},
			{
				name: 'UUID v4',
				value: 'uuid',
				description: 'Validate as UUID v4 format',
			},
			{
				name: 'Nanoid',
				value: 'nanoid',
				description: 'Validate as Nanoid format (A-Z, a-z, 0-9, _, -)',
			},
			{
				name: 'Slug',
				value: 'slug',
				description: 'Validate as URL-friendly slug',
			},
			{
				name: 'Alphanumeric',
				value: 'alphanumeric',
				description: 'Validate as alphanumeric only',
			},
			{
				name: 'Numeric',
				value: 'numeric',
				description: 'Validate as numeric only',
			},
		],
		default: 'none',
		description: 'Validation pattern to apply',
	},
	// Format Date/Time fields
	{
		displayName: 'Date Input',
		name: 'dateInput',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['formatDateTime'],
			},
		},
		default: '',
		description: 'Input date (ISO string, timestamp, or Date object)',
		placeholder: '2024-01-15T10:30:00Z or 1705315800000',
	},
	{
		displayName: 'Output Format',
		name: 'dateFormat',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['formatDateTime'],
			},
		},
		options: [
			{
				name: 'ISO 8601',
				value: 'iso8601',
				description: 'Full ISO 8601 format (2024-01-15T10:30:00.000Z)',
			},
			{
				name: 'Date Only',
				value: 'date',
				description: 'Date only (2024-01-15)',
			},
			{
				name: 'Time Only',
				value: 'time',
				description: 'Time only (10:30:00)',
			},
			{
				name: 'Date Time',
				value: 'datetime',
				description: 'Date and time (2024-01-15 10:30:00)',
			},
			{
				name: 'Timestamp (ms)',
				value: 'timestamp',
				description: 'Unix timestamp in milliseconds',
			},
			{
				name: 'Unix Timestamp',
				value: 'unix',
				description: 'Unix timestamp in seconds',
			},
			{
				name: 'Relative',
				value: 'relative',
				description: 'Relative time (e.g., "5 minutes ago")',
			},
		],
		default: 'iso8601',
		description: 'Output format for the date',
	},
	// CSV to Documents fields
	{
		displayName: 'CSV Input',
		name: 'csvInput',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['csvToDocuments'],
			},
		},
		typeOptions: {
			rows: 10,
		},
		default: '',
		description: 'CSV data to convert',
		placeholder: 'name,email,age\nJohn Doe,john@example.com,30\nJane Smith,jane@example.com,25',
	},
	{
		displayName: 'Auto-Detect Types',
		name: 'autoDetectTypes',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['csvToDocuments'],
			},
		},
		default: true,
		description: 'Whether to automatically detect and convert data types (numbers, booleans, dates)',
	},
	{
		displayName: 'Generate IDs',
		name: 'generateIds',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['csvToDocuments'],
			},
		},
		default: true,
		description: 'Whether to generate unique IDs for each document',
	},
	{
		displayName: 'ID Field',
		name: 'idField',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['csvToDocuments'],
				generateIds: [false],
			},
		},
		default: '',
		description: 'Name of the CSV field to use as document ID (if not generating IDs)',
		placeholder: 'id',
	},
	{
		displayName: 'Delimiter',
		name: 'delimiter',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['csvToDocuments'],
			},
		},
		default: ',',
		description: 'CSV delimiter character',
		placeholder: ',',
	},
	{
		displayName: 'Field Mapping (JSON)',
		name: 'fieldMapping',
		type: 'json',
		displayOptions: {
			show: {
				operation: ['csvToDocuments'],
			},
		},
		default: '{}',
		description: 'Map CSV column names to different field names',
		placeholder: '{"old_name": "new_name", "email_address": "email"}',
	},
	// Extract Metadata fields
	{
		displayName: 'Binary Property Name',
		name: 'binaryPropertyName',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['extractMetadata'],
			},
		},
		default: 'data',
		description: 'Name of the binary property containing the file',
		placeholder: 'data',
	},
	// AI Filter Items fields
	{
		displayName: 'Items to Filter',
		name: 'itemsInput',
		type: 'json',
		displayOptions: {
			show: {
				operation: ['aiFilterItems'],
			},
		},
		default: '[]',
		description: 'Array of items to filter (can be objects or strings)',
		placeholder: '[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]',
		typeOptions: {
			rows: 10,
		},
	},
	{
		displayName: 'Filter Mode',
		name: 'filterMode',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['aiFilterItems'],
			},
		},
		options: [
			{
				name: 'Preset Filter',
				value: 'preset',
				description: 'Use a pre-defined filter template',
			},
			{
				name: 'Custom Prompt',
				value: 'custom',
				description: 'Write a custom filtering prompt',
			},
		],
		default: 'preset',
		description: 'Choose between preset filters or custom prompt',
	},
	{
		displayName: 'Preset Filter',
		name: 'presetFilter',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['aiFilterItems'],
				filterMode: ['preset'],
			},
		},
		options: [
			{
				name: 'Keep Valid Items',
				value: 'validItems',
				description: 'Remove invalid, incomplete, or malformed items',
			},
			{
				name: 'Remove Duplicates',
				value: 'removeDuplicates',
				description: 'Keep only unique items (based on AI semantic comparison)',
			},
			{
				name: 'Keep Complete Records',
				value: 'completeRecords',
				description: 'Remove items with missing or empty required fields',
			},
			{
				name: 'Filter by Quality',
				value: 'qualityFilter',
				description: 'Keep only high-quality items (well-formatted, meaningful data)',
			},
			{
				name: 'Remove Test Data',
				value: 'removeTestData',
				description: 'Remove test/dummy data (e.g., "test@example.com", "John Doe")',
			},
			{
				name: 'Keep Active Items',
				value: 'activeItems',
				description: 'Keep only active/enabled items (remove inactive, disabled, archived)',
			},
			{
				name: 'Filter by Relevance',
				value: 'relevanceFilter',
				description: 'Keep items relevant to a specific topic or context',
			},
		],
		default: 'validItems',
		description: 'Select a preset filter',
	},
	{
		displayName: 'Relevance Context',
		name: 'relevanceContext',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['aiFilterItems'],
				filterMode: ['preset'],
				presetFilter: ['relevanceFilter'],
			},
		},
		default: '',
		description: 'Context or topic for relevance filtering',
		placeholder: 'e.g., "technology", "sales leads", "recent events"',
	},
	{
		displayName: 'Custom Filter Prompt',
		name: 'customPrompt',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['aiFilterItems'],
				filterMode: ['custom'],
			},
		},
		typeOptions: {
			rows: 5,
		},
		default: '',
		description: 'Custom prompt to filter items. The AI will keep items that match your criteria.',
		placeholder: 'Keep only items where the price is less than $100 and the status is "in stock"',
	},
	{
		displayName: 'AI Provider',
		name: 'aiProvider',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['aiFilterItems'],
			},
		},
		options: [
			{
				name: 'OpenAI',
				value: 'openai',
				description: 'Use OpenAI models (GPT-4, GPT-3.5)',
			},
			{
				name: 'Anthropic',
				value: 'anthropic',
				description: 'Use Anthropic Claude models',
			},
			{
				name: 'Google',
				value: 'google',
				description: 'Use Google Gemini models',
			},
		],
		default: 'openai',
		description: 'AI provider to use for filtering',
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
				operation: ['aiFilterItems'],
			},
		},
		default: '',
		required: true,
		description: 'API key for the selected AI provider. Can also be set via environment variable (OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_API_KEY).',
		placeholder: 'sk-...',
	},
	{
		displayName: 'Model',
		name: 'aiModel',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['aiFilterItems'],
				aiProvider: ['openai'],
			},
		},
		default: 'gpt-4-turbo-preview',
		description: 'OpenAI model to use',
		placeholder: 'gpt-4-turbo-preview, gpt-3.5-turbo',
	},
	{
		displayName: 'Model',
		name: 'aiModel',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['aiFilterItems'],
				aiProvider: ['anthropic'],
			},
		},
		default: 'claude-3-5-sonnet-20241022',
		description: 'Anthropic Claude model to use',
		placeholder: 'claude-3-5-sonnet-20241022, claude-3-opus-20240229',
	},
	{
		displayName: 'Model',
		name: 'aiModel',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['aiFilterItems'],
				aiProvider: ['google'],
			},
		},
		default: 'gemini-pro',
		description: 'Google Gemini model to use',
		placeholder: 'gemini-pro, gemini-pro-vision',
	},
	{
		displayName: 'Return Mode',
		name: 'returnMode',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['aiFilterItems'],
			},
		},
		options: [
			{
				name: 'Filtered Items Only',
				value: 'filtered',
				description: 'Return only items that match the filter',
			},
			{
				name: 'With Statistics',
				value: 'withStats',
				description: 'Return filtered items + statistics (count, removed count, reasoning)',
			},
			{
				name: 'Both Filtered and Removed',
				value: 'both',
				description: 'Return both filtered items and removed items separately',
			},
		],
		default: 'withStats',
		description: 'What to return in the output',
	},
	{
		displayName: 'Explain Decisions',
		name: 'explainDecisions',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['aiFilterItems'],
				returnMode: ['withStats', 'both'],
			},
		},
		default: false,
		description: 'Whether to include AI explanations for why items were kept/removed',
	},
];
