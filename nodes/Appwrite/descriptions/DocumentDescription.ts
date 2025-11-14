import { INodeProperties } from 'n8n-workflow';

export const documentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['document'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new document',
				action: 'Create a document',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a document',
				action: 'Delete a document',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a document',
				action: 'Get a document',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all documents',
				action: 'List all documents',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a document',
				action: 'Update a document',
			},
			{
				name: 'Batch Create',
				value: 'batchCreate',
				description: 'Create multiple documents in one operation',
				action: 'Batch create documents',
			},
			{
				name: 'Batch Update',
				value: 'batchUpdate',
				description: 'Update multiple documents in one operation',
				action: 'Batch update documents',
			},
			{
				name: 'Batch Delete',
				value: 'batchDelete',
				description: 'Delete multiple documents in one operation',
				action: 'Batch delete documents',
			},
		],
		default: 'list',
	},
];

export const documentFields: INodeProperties[] = [
	{
		displayName: 'Database ID',
		name: 'databaseId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
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
				resource: ['document'],
			},
		},
		default: '',
		description: 'The ID of the collection',
	},
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the document',
	},
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['create'],
			},
		},
		default: 'unique()',
		description: 'The ID of the document. Use unique() to generate a unique ID.',
	},
	{
		displayName: 'Data',
		name: 'data',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['create', 'update'],
			},
		},
		default: '{}',
		description: 'The document data as JSON',
	},
	{
		displayName: 'Permissions',
		name: 'permissions',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['create', 'update'],
			},
		},
		default: '[]',
		description: 'An array of permission strings',
		placeholder: '["read(\\"any\\")"]',
	},
	// Batch Operations Fields
	{
		displayName: 'Batch Items',
		name: 'batchItems',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['batchCreate'],
			},
		},
		default: '[]',
		description: 'Array of documents to create',
		placeholder: '[{"documentId": "unique()", "data": {"name": "Item 1"}, "permissions": []}]',
		hint: 'Each item should have: documentId (optional, defaults to unique()), data (required), permissions (optional)',
	},
	{
		displayName: 'Batch Items',
		name: 'batchItems',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['batchUpdate'],
			},
		},
		default: '[]',
		description: 'Array of documents to update',
		placeholder: '[{"documentId": "doc123", "data": {"name": "Updated Item"}, "permissions": []}]',
		hint: 'Each item must have: documentId (required), data (required), permissions (optional)',
	},
	{
		displayName: 'Batch Items',
		name: 'batchItems',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['batchDelete'],
			},
		},
		default: '[]',
		description: 'Array of documents to delete',
		placeholder: '[{"documentId": "doc123"}, {"documentId": "doc456"}]',
		hint: 'Each item must have: documentId (required)',
	},
	{
		displayName: 'Continue on Error',
		name: 'continueOnError',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['batchCreate', 'batchUpdate', 'batchDelete'],
			},
		},
		default: true,
		description: 'Whether to continue processing if some items fail',
	},
	{
		displayName: 'Batch Size',
		name: 'batchSize',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['batchCreate', 'batchUpdate', 'batchDelete'],
			},
		},
		default: 10,
		description: 'Number of items to process in each batch (1-100)',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
	},
	{
		displayName: 'Parallel Processing',
		name: 'parallel',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['batchCreate', 'batchUpdate', 'batchDelete'],
			},
		},
		default: false,
		description: 'Whether to process items in parallel (faster but may cause rate limiting)',
	},
];
