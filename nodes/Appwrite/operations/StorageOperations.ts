import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Storage } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import { getRequiredParameter, getOptionalParameter } from '../utils/helpers';
import { safeJsonArrayParse, validateName } from '../utils/validators';
import { ValidationError } from '../utils/errors';
import { BucketOptions, FilePreviewOptions, FileDownloadOptions } from '../utils/types';

/**
 * Executes storage operations for Appwrite
 * @param this - n8n execution context
 * @param storage - Appwrite Storage service instance
 * @param operation - Operation to perform (createBucket, getBucket, listBuckets, updateBucket, deleteBucket, createFile, getFile, listFiles, updateFile, deleteFile, getFilePreview, getFileDownload)
 * @param i - Current item index
 * @returns Execution data with operation results
 * @throws ValidationError if validation fails
 * @throws Error if operation is unknown or binary data is invalid
 */
export async function executeStorageOperation(
	this: IExecuteFunctions,
	storage: Storage,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {
	// Bucket Operations
	if (operation === 'createBucket') {
		const bucketId = getRequiredParameter(this, 'bucketId', i);
		const name = this.getNodeParameter('name', i) as string;

		// Validate name
		const nameValidation = validateName(name, 'Bucket name');
		if (!nameValidation.valid) {
			throw new ValidationError(nameValidation.error!);
		}

		// Safely parse permissions
		const permissionsStr = this.getNodeParameter('permissions', i, '[]') as string;
		const permissionsResult = safeJsonArrayParse(permissionsStr, 'permissions');
		if (!permissionsResult.success) {
			throw new ValidationError(permissionsResult.error);
		}
		const permissions = permissionsResult.data;

		const fileSecurity = this.getNodeParameter('fileSecurity', i) as boolean;
		const enabled = this.getNodeParameter('enabled', i) as boolean;
		const options = getOptionalParameter<BucketOptions>(this, 'options', i, {});

		const response = await storage.createBucket(
			bucketId,
			name,
			permissions,
			fileSecurity,
			enabled,
			options.maximumFileSize,
			options.allowedFileExtensions ? options.allowedFileExtensions.split(',').map((ext: string) => ext.trim()) : undefined,
			// Type assertion required: Appwrite SDK expects internal Compression enum.
		// This is safe as the value comes from validated n8n dropdown options.
		options.compression as any,
			options.encryption,
			options.antivirus,
		);
		return { json: response };
	} else if (operation === 'getBucket') {
		const bucketId = getRequiredParameter(this, 'bucketId', i);
		const response = await storage.getBucket(bucketId);
		return { json: response };
	} else if (operation === 'listBuckets') {
		const response = await storage.listBuckets();
		return { json: response };
	} else if (operation === 'updateBucket') {
		const bucketId = getRequiredParameter(this, 'bucketId', i);
		const name = this.getNodeParameter('name', i) as string;

		// Validate name
		const nameValidation = validateName(name, 'Bucket name');
		if (!nameValidation.valid) {
			throw new ValidationError(nameValidation.error!);
		}

		// Safely parse permissions
		const permissionsStr = this.getNodeParameter('permissions', i, '[]') as string;
		const permissionsResult = safeJsonArrayParse(permissionsStr, 'permissions');
		if (!permissionsResult.success) {
			throw new ValidationError(permissionsResult.error);
		}
		const permissions = permissionsResult.data;

		const fileSecurity = this.getNodeParameter('fileSecurity', i) as boolean;
		const enabled = this.getNodeParameter('enabled', i) as boolean;
		const options = getOptionalParameter<BucketOptions>(this, 'options', i, {});

		const response = await storage.updateBucket(
			bucketId,
			name,
			permissions,
			fileSecurity,
			enabled,
			options.maximumFileSize,
			options.allowedFileExtensions ? options.allowedFileExtensions.split(',').map((ext: string) => ext.trim()) : undefined,
			// Type assertion required: Appwrite SDK expects internal Compression enum.
		// This is safe as the value comes from validated n8n dropdown options.
		options.compression as any,
			options.encryption,
			options.antivirus,
		);
		return { json: response };
	} else if (operation === 'deleteBucket') {
		const bucketId = getRequiredParameter(this, 'bucketId', i);
		await storage.deleteBucket(bucketId);
		return { json: { success: true, bucketId } };
	}

	// File Operations
	const bucketId = getRequiredParameter(this, 'bucketId', i);

	if (operation === 'uploadFile') {
		const fileId = getRequiredParameter(this, 'fileId', i);
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

		// Safely parse permissions
		const permissionsStr = this.getNodeParameter('permissions', i, '[]') as string;
		const permissionsResult = safeJsonArrayParse(permissionsStr, 'permissions');
		if (!permissionsResult.success) {
			throw new ValidationError(permissionsResult.error);
		}
		const permissions = permissionsResult.data;

		const items = this.getInputData();
		const binaryData = items[i].binary?.[binaryPropertyName];

		if (!binaryData) {
			throw new Error(`No binary data found in field "${binaryPropertyName}"`);
		}

		// Get the binary data buffer
		const binaryDataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

		// Create InputFile from buffer
		const file = InputFile.fromBuffer(
			binaryDataBuffer,
			binaryData.fileName || 'file',
		);

		const response = await storage.createFile(
			bucketId,
			fileId,
			file,
			permissions.length > 0 ? permissions : undefined,
		);
		return { json: response };
	} else if (operation === 'getFile') {
		const fileId = getRequiredParameter(this, 'fileId', i);
		const response = await storage.getFile(bucketId, fileId);
		return { json: response };
	} else if (operation === 'listFiles') {
		const response = await storage.listFiles(bucketId);
		return { json: response };
	} else if (operation === 'updateFile') {
		const fileId = getRequiredParameter(this, 'fileId', i);
		const name = getOptionalParameter(this, 'name', i, '');

		// Safely parse permissions
		const permissionsStr = this.getNodeParameter('permissions', i, '[]') as string;
		const permissionsResult = safeJsonArrayParse(permissionsStr, 'permissions');
		if (!permissionsResult.success) {
			throw new ValidationError(permissionsResult.error);
		}
		const permissions = permissionsResult.data;

		const response = await storage.updateFile(
			bucketId,
			fileId,
			name || undefined,
			permissions.length > 0 ? permissions : undefined,
		);
		return { json: response };
	} else if (operation === 'deleteFile') {
		const fileId = getRequiredParameter(this, 'fileId', i);
		await storage.deleteFile(bucketId, fileId);
		return { json: { success: true, fileId } };
	} else if (operation === 'downloadFile') {
		const fileId = getRequiredParameter(this, 'fileId', i);
		const options = getOptionalParameter<FileDownloadOptions>(this, 'options', i, {});
		const binaryPropertyName = options.binaryPropertyName || 'data';

		const fileBuffer = await storage.getFileDownload(bucketId, fileId);

		// Performance optimization: Use fileId as filename to avoid extra API call
		// Users can rename the file in n8n if needed, avoiding the getFile() overhead
		const fileName = `${fileId}.bin`;

		const binaryData = await this.helpers.prepareBinaryData(
			Buffer.from(fileBuffer as ArrayBuffer),
			fileName,
		);

		return {
			json: { success: true, fileId },
			binary: {
				[binaryPropertyName]: binaryData,
			},
		};
	} else if (operation === 'getFileView') {
		const fileId = getRequiredParameter(this, 'fileId', i);
		const options = getOptionalParameter<FileDownloadOptions>(this, 'options', i, {});
		const binaryPropertyName = options.binaryPropertyName || 'data';

		const fileBuffer = await storage.getFileView(bucketId, fileId);

		// Performance optimization: Use fileId as filename to avoid extra API call
		// Users can rename the file in n8n if needed, avoiding the getFile() overhead
		const fileName = `${fileId}.view`;

		const binaryData = await this.helpers.prepareBinaryData(
			Buffer.from(fileBuffer as ArrayBuffer),
			fileName,
		);

		return {
			json: { success: true, fileId },
			binary: {
				[binaryPropertyName]: binaryData,
			},
		};
	} else if (operation === 'getFilePreview') {
		const fileId = getRequiredParameter(this, 'fileId', i);
		const previewOptions = getOptionalParameter<FilePreviewOptions>(this, 'previewOptions', i, {});

		const fileBuffer = await storage.getFilePreview(
			bucketId,
			fileId,
			previewOptions.width,
			previewOptions.height,
			// Type assertion required: Appwrite SDK expects internal Gravity enum.
		// This is safe as the value comes from validated n8n dropdown options.
		previewOptions.gravity as any,
			previewOptions.quality,
			previewOptions.borderWidth,
			previewOptions.borderColor,
			previewOptions.borderRadius,
			previewOptions.opacity,
			previewOptions.rotation,
			previewOptions.background,
			// Type assertion required: Appwrite SDK expects internal ImageFormat enum.
		// This is safe as the value comes from validated n8n dropdown options.
		previewOptions.output as any,
		);

		// Performance optimization: Use fileId for filename to avoid extra API call
		// Generate filename based on output format instead of fetching file metadata
		const outputFormat = previewOptions.output || 'jpg';
		const fileName = `${fileId}_preview.${outputFormat}`;

		const binaryData = await this.helpers.prepareBinaryData(
			Buffer.from(fileBuffer as ArrayBuffer),
			fileName,
		);

		return {
			json: { success: true, fileId },
			binary: {
				data: binaryData,
			},
		};
	}

	throw new Error(`Unknown storage operation: ${operation}`);
}
