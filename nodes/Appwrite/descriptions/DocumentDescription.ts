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
];
