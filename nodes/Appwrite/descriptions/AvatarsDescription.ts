import { INodeProperties } from 'n8n-workflow';

export const avatarsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['avatars'],
			},
		},
		options: [
			{
				name: 'Get Browser Icon',
				value: 'getBrowser',
				description: 'Get browser icon image',
				action: 'Get browser icon',
			},
			{
				name: 'Get Credit Card Icon',
				value: 'getCreditCard',
				description: 'Get credit card provider icon',
				action: 'Get credit card icon',
			},
			{
				name: 'Get Favicon',
				value: 'getFavicon',
				description: 'Get website favicon',
				action: 'Get website favicon',
			},
			{
				name: 'Get Country Flag',
				value: 'getFlag',
				description: 'Get country flag image',
				action: 'Get country flag',
			},
			{
				name: 'Get Image',
				value: 'getImage',
				description: 'Get and crop image from URL',
				action: 'Get image from URL',
			},
			{
				name: 'Get Initials Avatar',
				value: 'getInitials',
				description: 'Get user initials avatar image',
				action: 'Get initials avatar',
			},
			{
				name: 'Get QR Code',
				value: 'getQR',
				description: 'Generate QR code image from text',
				action: 'Generate QR code',
			},
		],
		default: 'getInitials',
	},
];

export const avatarsFields: INodeProperties[] = [
	// Browser Icon - Code
	{
		displayName: 'Browser Code',
		name: 'code',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['avatars'],
				operation: ['getBrowser'],
			},
		},
		options: [
			{ name: 'Avant Browser', value: 'aa' },
			{ name: 'Android WebView Beta', value: 'an' },
			{ name: 'Google Chrome', value: 'ch' },
			{ name: 'Google Chrome iOS', value: 'ci' },
			{ name: 'Google Chrome Mobile', value: 'cm' },
			{ name: 'Chromium', value: 'cr' },
			{ name: 'Mozilla Firefox', value: 'ff' },
			{ name: 'Safari', value: 'sf' },
			{ name: 'Mobile Safari', value: 'mf' },
			{ name: 'Microsoft Edge', value: 'ps' },
			{ name: 'Microsoft Edge iOS', value: 'oi' },
			{ name: 'Opera Mini', value: 'om' },
			{ name: 'Opera', value: 'op' },
			{ name: 'Opera Next', value: 'on' },
		],
		default: 'ch',
		description: 'Browser code identifier',
	},
	// Credit Card - Code
	{
		displayName: 'Card Type',
		name: 'code',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['avatars'],
				operation: ['getCreditCard'],
			},
		},
		options: [
			{ name: 'American Express', value: 'amex' },
			{ name: 'Argencard', value: 'argencard' },
			{ name: 'Cabal', value: 'cabal' },
			{ name: 'Cencosud', value: 'cencosud' },
			{ name: 'Diners Club', value: 'diners' },
			{ name: 'Discover', value: 'discover' },
			{ name: 'Elo', value: 'elo' },
			{ name: 'Hipercard', value: 'hipercard' },
			{ name: 'JCB', value: 'jcb' },
			{ name: 'Maestro', value: 'maestro' },
			{ name: 'Mastercard', value: 'mastercard' },
			{ name: 'MIR', value: 'mir' },
			{ name: 'Naranja', value: 'naranja' },
			{ name: 'Rupay', value: 'rupay' },
			{ name: 'Targeta Shopping', value: 'targeta-shopping' },
			{ name: 'UnionPay', value: 'unionpay' },
			{ name: 'Visa', value: 'visa' },
		],
		default: 'visa',
		description: 'Credit card provider code',
	},
	// Favicon - URL
	{
		displayName: 'Website URL',
		name: 'url',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['avatars'],
				operation: ['getFavicon'],
			},
		},
		default: '',
		placeholder: 'https://example.com',
		description: 'Website URL to fetch favicon from',
	},
	// Country Flag - Code
	{
		displayName: 'Country Code',
		name: 'code',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['avatars'],
				operation: ['getFlag'],
			},
		},
		default: '',
		placeholder: 'us',
		description: 'ISO Alpha-2 country code (e.g., us, gb, de, fr, jp)',
	},
	// Get Image - URL
	{
		displayName: 'Image URL',
		name: 'url',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['avatars'],
				operation: ['getImage'],
			},
		},
		default: '',
		placeholder: 'https://example.com/image.jpg',
		description: 'Remote image URL to fetch and crop',
	},
	// Get Initials - Name
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['avatars'],
				operation: ['getInitials'],
			},
		},
		default: '',
		placeholder: 'John Doe',
		description: 'Full name for initials. Leave empty to use current user name or email. Max 128 characters.',
	},
	// QR Code - Text
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['avatars'],
				operation: ['getQR'],
			},
		},
		default: '',
		placeholder: 'https://example.com',
		description: 'Plain text to convert to QR code',
	},
	// Width parameter (common for multiple operations)
	{
		displayName: 'Width',
		name: 'width',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['avatars'],
				operation: ['getBrowser', 'getCreditCard', 'getFlag', 'getImage', 'getInitials'],
			},
		},
		default: 100,
		description: 'Image width in pixels (0-2000). Use 0 for original width.',
	},
	// Height parameter (common for multiple operations)
	{
		displayName: 'Height',
		name: 'height',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['avatars'],
				operation: ['getBrowser', 'getCreditCard', 'getFlag', 'getImage', 'getInitials'],
			},
		},
		default: 100,
		description: 'Image height in pixels (0-2000). Use 0 for original height.',
	},
	// Quality parameter (for browser, credit card, and flag)
	{
		displayName: 'Quality',
		name: 'quality',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['avatars'],
				operation: ['getBrowser', 'getCreditCard', 'getFlag'],
			},
		},
		default: 100,
		description: 'Image quality (0-100). Higher values produce better quality images.',
	},
	// Background parameter (for initials)
	{
		displayName: 'Background Color',
		name: 'background',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['avatars'],
				operation: ['getInitials'],
			},
		},
		default: '',
		placeholder: 'FF5733',
		description: 'Background color in hex format (without #). Leave empty for random color.',
	},
	// QR Code - Size
	{
		displayName: 'Size',
		name: 'size',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['avatars'],
				operation: ['getQR'],
			},
		},
		default: 400,
		description: 'QR code size in pixels (1-1000)',
	},
	// QR Code - Margin
	{
		displayName: 'Margin',
		name: 'margin',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['avatars'],
				operation: ['getQR'],
			},
		},
		default: 1,
		description: 'Margin from edge in units (0-10)',
	},
	// QR Code - Download
	{
		displayName: 'Download',
		name: 'download',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['avatars'],
				operation: ['getQR'],
			},
		},
		default: false,
		description: 'Whether to return with Content-Disposition attachment headers',
	},
];
