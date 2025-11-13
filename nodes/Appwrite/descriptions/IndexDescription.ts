import { INodeProperties } from 'n8n-workflow';

export const indexOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['index'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new index',
				action: 'Create an index',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an index',
				action: 'Delete an index',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all indexes',
				action: 'List all indexes',
			},
		],
		default: 'list',
	},
];

export const indexFields: INodeProperties[] = [
	{
		displayName: 'Database ID',
		name: 'databaseId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['index'],
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
				resource: ['index'],
			},
		},
		default: '',
		description: 'The ID of the collection',
	},
	{
		displayName: 'Index Key',
		name: 'key',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['index'],
				operation: ['create', 'delete'],
			},
		},
		default: '',
		description: 'Index key',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['index'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Key',
				value: 'key',
			},
			{
				name: 'Fulltext',
				value: 'fulltext',
			},
			{
				name: 'Unique',
				value: 'unique',
			},
		],
		default: 'key',
		description: 'Index type',
	},
	{
		displayName: 'Attributes',
		name: 'attributes',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['index'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Array of attribute keys in one string separated by commas',
		placeholder: 'attribute1,attribute2',
	},
	{
		displayName: 'Orders',
		name: 'orders',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['index'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Array of sort orders separated by commas (ASC or DESC). Leave empty for default.',
		placeholder: 'ASC,DESC',
	},
];
