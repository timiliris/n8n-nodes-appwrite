/**
 * TypeScript interfaces for Appwrite operations
 */

/**
 * Storage bucket options
 */
export interface BucketOptions {
	maximumFileSize?: number;
	allowedFileExtensions?: string;
	compression?: string;
	encryption?: boolean;
	antivirus?: boolean;
}

/**
 * File preview options
 */
export interface FilePreviewOptions {
	width?: number;
	height?: number;
	gravity?: string;
	quality?: number;
	borderWidth?: number;
	borderColor?: string;
	borderRadius?: number;
	opacity?: number;
	rotation?: number;
	background?: string;
	output?: string;
}

/**
 * File download options
 */
export interface FileDownloadOptions {
	binaryPropertyName?: string;
}

/**
 * Attribute definition for bulk creation
 */
export interface AttributeDefinition {
	type: 'string' | 'integer' | 'boolean' | 'email' | 'enum' | 'float' | 'datetime';
	key: string;
	size?: number;
	required?: boolean;
	defaultValue?: string | number | boolean;
	array?: boolean;
	elements?: string | string[];
	min?: number;
	max?: number;
}

/**
 * Attributes list container
 */
export interface AttributesList {
	attributes?: AttributeDefinition[];
}

/**
 * Appwrite error structure
 */
export interface AppwriteError {
	code: number;
	type: string;
	message: string;
	response?: {
		message?: string;
		code?: number;
		type?: string;
		version?: string;
	};
}

/**
 * Type guard for Appwrite errors
 */
export function isAppwriteError(error: unknown): error is AppwriteError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		'type' in error &&
		'message' in error
	);
}
