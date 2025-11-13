import { INodeProperties } from 'n8n-workflow';

export const storageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['storage'],
			},
		},
		options: [
			{
				name: 'Create Bucket',
				value: 'createBucket',
				description: 'Create a new storage bucket',
				action: 'Create a bucket',
			},
			{
				name: 'Delete Bucket',
				value: 'deleteBucket',
				description: 'Delete a storage bucket',
				action: 'Delete a bucket',
			},
			{
				name: 'Delete File',
				value: 'deleteFile',
				description: 'Delete a file',
				action: 'Delete a file',
			},
			{
				name: 'Download File',
				value: 'downloadFile',
				description: 'Get a file content for download',
				action: 'Download a file',
			},
			{
				name: 'Get Bucket',
				value: 'getBucket',
				description: 'Get a storage bucket',
				action: 'Get a bucket',
			},
			{
				name: 'Get File',
				value: 'getFile',
				description: 'Get file information',
				action: 'Get file information',
			},
			{
				name: 'Get File Preview',
				value: 'getFilePreview',
				description: 'Get a file preview image',
				action: 'Get file preview',
			},
			{
				name: 'Get File View',
				value: 'getFileView',
				description: 'Get a file content for view',
				action: 'View a file',
			},
			{
				name: 'List Buckets',
				value: 'listBuckets',
				description: 'List all storage buckets',
				action: 'List all buckets',
			},
			{
				name: 'List Files',
				value: 'listFiles',
				description: 'List all files in a bucket',
				action: 'List all files',
			},
			{
				name: 'Update Bucket',
				value: 'updateBucket',
				description: 'Update a storage bucket',
				action: 'Update a bucket',
			},
			{
				name: 'Update File',
				value: 'updateFile',
				description: 'Update file information',
				action: 'Update a file',
			},
			{
				name: 'Upload File',
				value: 'uploadFile',
				description: 'Upload a new file',
				action: 'Upload a file',
			},
		],
		default: 'listFiles',
	},
];

export const storageFields: INodeProperties[] = [
	// Bucket ID for bucket operations
	{
		displayName: 'Bucket ID',
		name: 'bucketId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['storage'],
				operation: ['getBucket', 'updateBucket', 'deleteBucket'],
			},
		},
		default: '',
		description: 'The ID of the storage bucket',
	},
	{
		displayName: 'Bucket ID',
		name: 'bucketId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['storage'],
				operation: ['createBucket'],
			},
		},
		default: 'unique()',
		description: 'The ID of the storage bucket. Use unique() to generate a unique ID.',
	},
	// Bucket ID for file operations
	{
		displayName: 'Bucket ID',
		name: 'bucketId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['storage'],
				operation: ['uploadFile', 'listFiles', 'getFile', 'updateFile', 'deleteFile', 'downloadFile', 'getFilePreview', 'getFileView'],
			},
		},
		default: '',
		description: 'The ID of the storage bucket',
	},
	// Bucket Name
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['storage'],
				operation: ['createBucket', 'updateBucket'],
			},
		},
		default: '',
		description: 'Bucket name',
	},
	// Bucket Permissions
	{
		displayName: 'Permissions',
		name: 'permissions',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['storage'],
				operation: ['createBucket', 'updateBucket'],
			},
		},
		default: '[]',
		description: 'An array of permission strings for the bucket',
		placeholder: '["read(\\"any\\")"]',
	},
	// Bucket File Security
	{
		displayName: 'File Security',
		name: 'fileSecurity',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['storage'],
				operation: ['createBucket', 'updateBucket'],
			},
		},
		default: true,
		description: 'Whether to enable file-level security',
	},
	// Bucket Enabled
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['storage'],
				operation: ['createBucket', 'updateBucket'],
			},
		},
		default: true,
		description: 'Whether the bucket is enabled',
	},
	// Bucket options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['storage'],
				operation: ['createBucket', 'updateBucket'],
			},
		},
		options: [
			{
				displayName: 'Maximum File Size',
				name: 'maximumFileSize',
				type: 'number',
				default: 30000000,
				description: 'Maximum file size allowed in bytes (default: 30MB)',
			},
			{
				displayName: 'Allowed File Extensions',
				name: 'allowedFileExtensions',
				type: 'string',
				default: '',
				placeholder: 'jpg,png,gif',
				description: 'Comma-separated list of allowed file extensions. Leave empty to allow all.',
			},
			{
				displayName: 'Compression',
				name: 'compression',
				type: 'options',
				options: [
					{ name: 'None', value: 'none' },
					{ name: 'Gzip', value: 'gzip' },
					{ name: 'Zstd', value: 'zstd' },
				],
				default: 'none',
				description: 'Compression algorithm for the bucket',
			},
			{
				displayName: 'Encryption',
				name: 'encryption',
				type: 'boolean',
				default: true,
				description: 'Whether to encrypt files in this bucket',
			},
			{
				displayName: 'Antivirus',
				name: 'antivirus',
				type: 'boolean',
				default: true,
				description: 'Whether to scan files for viruses',
			},
		],
	},
	// File ID
	{
		displayName: 'File ID',
		name: 'fileId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['storage'],
				operation: ['getFile', 'updateFile', 'deleteFile', 'downloadFile', 'getFilePreview', 'getFileView'],
			},
		},
		default: '',
		description: 'The ID of the file',
	},
	{
		displayName: 'File ID',
		name: 'fileId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['storage'],
				operation: ['uploadFile'],
			},
		},
		default: 'unique()',
		description: 'The ID of the file. Use unique() to generate a unique ID.',
	},
	// Upload File - Input Binary Field
	{
		displayName: 'Input Binary Field',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['storage'],
				operation: ['uploadFile'],
			},
		},
		default: 'data',
		description: 'The name of the input binary field containing the file to upload',
	},
	// File Permissions
	{
		displayName: 'Permissions',
		name: 'permissions',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['storage'],
				operation: ['uploadFile', 'updateFile'],
			},
		},
		default: '[]',
		description: 'An array of permission strings for the file',
		placeholder: '["read(\\"any\\")"]',
	},
	// File Name (for update)
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['storage'],
				operation: ['updateFile'],
			},
		},
		default: '',
		description: 'File name',
	},
	// Preview Options
	{
		displayName: 'Preview Options',
		name: 'previewOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['storage'],
				operation: ['getFilePreview'],
			},
		},
		options: [
			{
				displayName: 'Width',
				name: 'width',
				type: 'number',
				default: 0,
				description: 'Preview width in pixels (0 for original)',
			},
			{
				displayName: 'Height',
				name: 'height',
				type: 'number',
				default: 0,
				description: 'Preview height in pixels (0 for original)',
			},
			{
				displayName: 'Gravity',
				name: 'gravity',
				type: 'options',
				options: [
					{ name: 'Center', value: 'center' },
					{ name: 'Top Left', value: 'top-left' },
					{ name: 'Top', value: 'top' },
					{ name: 'Top Right', value: 'top-right' },
					{ name: 'Left', value: 'left' },
					{ name: 'Right', value: 'right' },
					{ name: 'Bottom Left', value: 'bottom-left' },
					{ name: 'Bottom', value: 'bottom' },
					{ name: 'Bottom Right', value: 'bottom-right' },
				],
				default: 'center',
				description: 'Crop gravity',
			},
			{
				displayName: 'Quality',
				name: 'quality',
				type: 'number',
				default: 100,
				description: 'Preview quality between 0-100',
			},
			{
				displayName: 'Border Width',
				name: 'borderWidth',
				type: 'number',
				default: 0,
				description: 'Border width in pixels',
			},
			{
				displayName: 'Border Color',
				name: 'borderColor',
				type: 'string',
				default: '',
				placeholder: 'FFFFFF',
				description: 'Border color in hex (without #)',
			},
			{
				displayName: 'Border Radius',
				name: 'borderRadius',
				type: 'number',
				default: 0,
				description: 'Border radius in pixels',
			},
			{
				displayName: 'Opacity',
				name: 'opacity',
				type: 'number',
				default: 1,
				description: 'Opacity between 0-1',
			},
			{
				displayName: 'Rotation',
				name: 'rotation',
				type: 'number',
				default: 0,
				description: 'Rotation in degrees (0-360)',
			},
			{
				displayName: 'Background',
				name: 'background',
				type: 'string',
				default: '',
				placeholder: 'FFFFFF',
				description: 'Background color in hex (without #)',
			},
			{
				displayName: 'Output Format',
				name: 'output',
				type: 'options',
				options: [
					{ name: 'JPG', value: 'jpg' },
					{ name: 'JPEG', value: 'jpeg' },
					{ name: 'PNG', value: 'png' },
					{ name: 'GIF', value: 'gif' },
					{ name: 'WebP', value: 'webp' },
				],
				default: 'jpg',
				description: 'Output format',
			},
		],
	},
	// Download/View options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['storage'],
				operation: ['downloadFile', 'getFileView'],
			},
		},
		options: [
			{
				displayName: 'Put Output in Field',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				description: 'The name of the output binary field',
			},
		],
	},
];
