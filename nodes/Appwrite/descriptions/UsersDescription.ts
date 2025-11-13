import { INodeProperties } from 'n8n-workflow';

export const usersOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['users'],
			},
		},
		options: [
			{
				name: 'Create User',
				value: 'createUser',
				description: 'Create a new user',
				action: 'Create a user',
			},
			{
				name: 'Delete User',
				value: 'deleteUser',
				description: 'Delete a user',
				action: 'Delete a user',
			},
			{
				name: 'Get User',
				value: 'getUser',
				description: 'Get a user',
				action: 'Get a user',
			},
			{
				name: 'List Users',
				value: 'listUsers',
				description: 'List all users',
				action: 'List all users',
			},
			{
				name: 'Update User',
				value: 'updateUser',
				description: 'Update a user',
				action: 'Update a user',
			},
		],
		default: 'listUsers',
	},
];

export const usersFields: INodeProperties[] = [
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['users'],
				operation: ['getUser', 'updateUser', 'deleteUser'],
			},
		},
		default: '',
		description: 'The ID of the user',
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['users'],
				operation: ['createUser'],
			},
		},
		default: 'unique()',
		description: 'The ID of the user. Use unique() to generate a unique ID.',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['users'],
				operation: ['createUser'],
			},
		},
		default: '',
		description: 'User email address',
	},
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: {
			password: true,
		},
		displayOptions: {
			show: {
				resource: ['users'],
				operation: ['createUser'],
			},
		},
		default: '',
		description: 'User password',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['users'],
				operation: ['createUser', 'updateUser'],
			},
		},
		default: '',
		description: 'User name',
	},
];
