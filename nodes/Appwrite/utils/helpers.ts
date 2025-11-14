/**
 * Helper utilities for Appwrite operations
 */

import { IExecuteFunctions } from 'n8n-workflow';
import { validateId } from './validators';

/**
 * Gets a required parameter with validation
 */
export function getRequiredParameter(
	context: IExecuteFunctions,
	name: string,
	index: number,
	validate = true,
): string {
	const value = context.getNodeParameter(name, index) as string;

	if (!value) {
		throw new Error(`${name} is required`);
	}

	if (validate) {
		const validation = validateId(value, name);
		if (!validation.valid) {
			throw new Error(validation.error);
		}
	}

	return value;
}

/**
 * Gets an optional parameter
 */
export function getOptionalParameter<T = string>(
	context: IExecuteFunctions,
	name: string,
	index: number,
	defaultValue?: T,
): T {
	return context.getNodeParameter(name, index, defaultValue) as T;
}

/**
 * Gets common database parameters (databaseId and collectionId)
 */
export function getDatabaseParameters(
	context: IExecuteFunctions,
	index: number,
): { databaseId: string; collectionId: string } {
	const databaseId = getRequiredParameter(context, 'databaseId', index);
	const collectionId = getRequiredParameter(context, 'collectionId', index);

	return { databaseId, collectionId };
}

/**
 * Gets database and document parameters
 */
export function getDocumentParameters(
	context: IExecuteFunctions,
	index: number,
): { databaseId: string; collectionId: string; documentId: string } {
	const { databaseId, collectionId } = getDatabaseParameters(context, index);
	const documentId = getRequiredParameter(context, 'documentId', index);

	return { databaseId, collectionId, documentId };
}
