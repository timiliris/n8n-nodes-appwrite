import { INodeProperties } from 'n8n-workflow';

export const attributeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['attribute'],
			},
		},
		options: [
			{
				name: 'Create Multiple',
				value: 'createMultiple',
				description: 'Create multiple attributes at once',
				action: 'Create multiple attributes',
			},
			{
				name: 'Create String',
				value: 'createString',
				description: 'Create a string attribute',
				action: 'Create string attribute',
			},
			{
				name: 'Create Integer',
				value: 'createInteger',
				description: 'Create an integer attribute',
				action: 'Create integer attribute',
			},
			{
				name: 'Create Boolean',
				value: 'createBoolean',
				description: 'Create a boolean attribute',
				action: 'Create boolean attribute',
			},
			{
				name: 'Create Email',
				value: 'createEmail',
				description: 'Create an email attribute',
				action: 'Create email attribute',
			},
			{
				name: 'Create Enum',
				value: 'createEnum',
				description: 'Create an enum attribute',
				action: 'Create enum attribute',
			},
			{
				name: 'Create Float',
				value: 'createFloat',
				description: 'Create a float attribute',
				action: 'Create float attribute',
			},
			{
				name: 'Create DateTime',
				value: 'createDateTime',
				description: 'Create a datetime attribute',
				action: 'Create datetime attribute',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an attribute',
				action: 'Delete attribute',
			},
		],
		default: 'createString',
	},
];

export const attributeFields: INodeProperties[] = [
	{
		displayName: 'Database ID',
		name: 'databaseId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['attribute'],
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
				resource: ['attribute'],
			},
		},
		default: '',
		description: 'The ID of the collection',
	},
	{
		displayName: 'Input Mode',
		name: 'inputMode',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['attribute'],
				operation: ['createMultiple'],
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
		description: 'How to provide the attributes',
	},
	{
		displayName: 'Attributes',
		name: 'attributesList',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['attribute'],
				operation: ['createMultiple'],
				inputMode: ['form'],
			},
		},
		default: {},
		placeholder: 'Add Attribute',
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
						displayName: 'Default Value',
						name: 'defaultValue',
						type: 'string',
						displayOptions: {
							show: {
								type: ['string', 'email', 'enum', 'datetime'],
							},
						},
						default: '',
						description: 'Default value for the attribute',
					},
					{
						displayName: 'Default Value',
						name: 'defaultValue',
						type: 'boolean',
						displayOptions: {
							show: {
								type: ['boolean'],
							},
						},
						default: false,
						description: 'Default value for the attribute',
					},
					{
						displayName: 'Default Value',
						name: 'defaultValue',
						type: 'number',
						displayOptions: {
							show: {
								type: ['integer', 'float'],
							},
						},
						default: undefined,
						description: 'Default value for the attribute',
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
		displayName: 'Attributes (JSON)',
		name: 'attributesJson',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['attribute'],
				operation: ['createMultiple'],
				inputMode: ['json'],
			},
		},
		default: '[]',
		description: 'Array of attributes to create as JSON',
		placeholder: '[{"type": "string", "key": "name", "size": 255, "required": true}, {"type": "integer", "key": "age", "required": false}]',
	},
	{
		displayName: 'Attribute Key',
		name: 'key',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['attribute'],
				operation: ['createString', 'createInteger', 'createBoolean', 'createEmail', 'createEnum', 'createFloat', 'createDateTime', 'delete'],
			},
		},
		default: '',
		description: 'Attribute key',
	},
	{
		displayName: 'Size',
		name: 'size',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['attribute'],
				operation: ['createString', 'createEmail'],
			},
		},
		default: 255,
		description: 'Maximum length of the attribute value',
	},
	{
		displayName: 'Required',
		name: 'required',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['attribute'],
				operation: [
					'createString',
					'createInteger',
					'createBoolean',
					'createEmail',
					'createEnum',
					'createFloat',
					'createDateTime',
				],
			},
		},
		default: false,
		description: 'Whether the attribute is required',
	},
	{
		displayName: 'Default Value',
		name: 'defaultValue',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['attribute'],
				operation: [
					'createString',
					'createInteger',
					'createBoolean',
					'createEmail',
					'createEnum',
					'createFloat',
					'createDateTime',
				],
			},
		},
		default: '',
		description: 'Default value for the attribute',
	},
	{
		displayName: 'Array',
		name: 'array',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['attribute'],
				operation: [
					'createString',
					'createInteger',
					'createBoolean',
					'createEmail',
					'createEnum',
					'createFloat',
					'createDateTime',
				],
			},
		},
		default: false,
		description: 'Whether the attribute is an array',
	},
	{
		displayName: 'Elements',
		name: 'elements',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['attribute'],
				operation: ['createEnum'],
			},
		},
		default: '',
		description: 'Array of elements in one string separated by commas (e.g., "option1,option2,option3")',
		placeholder: 'option1,option2,option3',
	},
	{
		displayName: 'Min',
		name: 'min',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['attribute'],
				operation: ['createInteger', 'createFloat'],
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
				resource: ['attribute'],
				operation: ['createInteger', 'createFloat'],
			},
		},
		default: undefined,
		description: 'Maximum value',
	},
];
