import { INodeProperties } from 'n8n-workflow';

export const databaseOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['database'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new database',
				action: 'Create a database',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a database',
				action: 'Delete a database',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a database',
				action: 'Get a database',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all databases',
				action: 'List all databases',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a database',
				action: 'Update a database',
			},
		],
		default: 'list',
	},
];

export const databaseFields: INodeProperties[] = [
	{
		displayName: 'Database ID',
		name: 'databaseId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['database'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the database',
	},
	{
		displayName: 'Database ID',
		name: 'databaseId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['database'],
				operation: ['create'],
			},
		},
		default: 'unique()',
		description: 'The ID of the database. Use unique() to generate a unique ID.',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['database'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Database name',
	},
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['database'],
				operation: ['create', 'update'],
			},
		},
		default: true,
		description: 'Whether the database is enabled',
	},
];
