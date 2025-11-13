import { INodeProperties } from 'n8n-workflow';

export const teamsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['teams'],
			},
		},
		options: [
			{
				name: 'Create Team',
				value: 'create',
				description: 'Create a new team',
				action: 'Create a team',
			},
			{
				name: 'Delete Team',
				value: 'delete',
				description: 'Delete a team',
				action: 'Delete a team',
			},
			{
				name: 'Get Team',
				value: 'get',
				description: 'Get a team',
				action: 'Get a team',
			},
			{
				name: 'List Teams',
				value: 'list',
				description: 'List all teams',
				action: 'List all teams',
			},
			{
				name: 'Update Team',
				value: 'update',
				description: 'Update a team',
				action: 'Update a team',
			},
			{
				name: 'Create Membership',
				value: 'createMembership',
				description: 'Create a team membership',
				action: 'Create team membership',
			},
			{
				name: 'Delete Membership',
				value: 'deleteMembership',
				description: 'Delete a team membership',
				action: 'Delete team membership',
			},
			{
				name: 'Get Membership',
				value: 'getMembership',
				description: 'Get a team membership',
				action: 'Get team membership',
			},
			{
				name: 'List Memberships',
				value: 'listMemberships',
				description: 'List all team memberships',
				action: 'List team memberships',
			},
			{
				name: 'Update Membership',
				value: 'updateMembership',
				description: 'Update a team membership',
				action: 'Update team membership',
			},
			{
				name: 'Get Preferences',
				value: 'getPreferences',
				description: 'Get team preferences',
				action: 'Get team preferences',
			},
			{
				name: 'Update Preferences',
				value: 'updatePreferences',
				description: 'Update team preferences',
				action: 'Update team preferences',
			},
		],
		default: 'list',
	},
];

export const teamsFields: INodeProperties[] = [
	// Team ID
	{
		displayName: 'Team ID',
		name: 'teamId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['teams'],
				operation: ['get', 'update', 'delete', 'createMembership', 'listMemberships', 'getMembership', 'updateMembership', 'deleteMembership', 'getPreferences', 'updatePreferences'],
			},
		},
		default: '',
		description: 'The ID of the team',
	},
	{
		displayName: 'Team ID',
		name: 'teamId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['teams'],
				operation: ['create'],
			},
		},
		default: 'unique()',
		description: 'The ID of the team. Use unique() to generate a unique ID.',
	},
	// Team Name
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['teams'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Team name',
	},
	// Team Roles (for create)
	{
		displayName: 'Roles',
		name: 'roles',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['teams'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: 'owner,admin',
		description: 'Comma-separated list of roles for the team creator',
	},
	// Membership ID
	{
		displayName: 'Membership ID',
		name: 'membershipId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['teams'],
				operation: ['getMembership', 'updateMembership', 'deleteMembership'],
			},
		},
		default: '',
		description: 'The ID of the membership',
	},
	// Email (for creating membership)
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['teams'],
				operation: ['createMembership'],
			},
		},
		default: '',
		description: 'Email of the user to invite. Leave empty to use User ID instead.',
	},
	// User ID (for creating membership)
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['teams'],
				operation: ['createMembership'],
			},
		},
		default: '',
		description: 'ID of the user to add. Leave empty to use Email instead.',
	},
	// Roles (for membership)
	{
		displayName: 'Roles',
		name: 'roles',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['teams'],
				operation: ['createMembership', 'updateMembership'],
			},
		},
		default: '',
		placeholder: 'member,contributor',
		description: 'Comma-separated list of roles for the membership',
	},
	// URL (for creating membership)
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['teams'],
				operation: ['createMembership'],
			},
		},
		default: '',
		description: 'URL to redirect the user back to after accepting the invitation',
	},
	// Preferences
	{
		displayName: 'Preferences',
		name: 'preferences',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['teams'],
				operation: ['updatePreferences'],
			},
		},
		default: '{}',
		description: 'Team preferences as JSON',
		placeholder: '{"theme": "dark", "notifications": true}',
	},
];
