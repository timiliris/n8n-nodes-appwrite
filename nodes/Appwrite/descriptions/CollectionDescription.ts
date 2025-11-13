import { INodeProperties } from 'n8n-workflow';

export const collectionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['collection'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new collection',
				action: 'Create a collection',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a collection',
				action: 'Delete a collection',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a collection',
				action: 'Get a collection',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all collections',
				action: 'List all collections',
			},
			{
				name: 'List Attributes',
				value: 'listAttributes',
				description: 'List all attributes in a collection',
				action: 'List collection attributes',
			},
			{
				name: 'List Indexes',
				value: 'listIndexes',
				description: 'List all indexes in a collection',
				action: 'List collection indexes',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a collection',
				action: 'Update a collection',
			},
		],
		default: 'list',
	},
];

export const collectionFields: INodeProperties[] = [
	{
		displayName: 'Database ID',
		name: 'databaseId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['collection'],
			},
		},
		default: '',
		description: 'The ID of the database',
	},
	{
		displayName: 'Collection ID',
		name: 'collectionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['get', 'update', 'delete', 'listAttributes', 'listIndexes'],
			},
		},
		default: '',
		description: 'The ID of the collection',
	},
	{
		displayName: 'Collection ID',
		name: 'collectionId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['create'],
			},
		},
		default: 'unique()',
		description: 'The ID of the collection. Use unique() to generate a unique ID.',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Collection name',
	},
	{
		displayName: 'Permissions',
		name: 'permissions',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['create', 'update'],
			},
		},
		default: '[]',
		description: 'An array of permission strings',
		placeholder: '["read(\\"any\\")"]',
	},
	{
		displayName: 'Document Security',
		name: 'documentSecurity',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['create', 'update'],
			},
		},
		default: false,
		description: 'Whether to enable document-level security',
	},
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['create', 'update'],
			},
		},
		default: true,
		description: 'Whether the collection is enabled',
	},
];
