/**
 * Centralized error handling for Appwrite operations
 */

import { NodeApiError, INode } from 'n8n-workflow';
import { isAppwriteError, AppwriteError } from './types';

/**
 * Custom error class for validation errors
 */
export class ValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ValidationError';
	}
}

/**
 * Custom error class for parsing errors
 */
export class ParseError extends Error {
	constructor(message: string, public readonly originalError?: Error) {
		super(message);
		this.name = 'ParseError';
	}
}

/**
 * Formats an Appwrite error into a user-friendly message
 */
export function formatAppwriteError(error: AppwriteError): string {
	const parts: string[] = [];

	if (error.type) {
		parts.push(`[${error.type}]`);
	}

	if (error.code) {
		parts.push(`(Code: ${error.code})`);
	}

	parts.push(error.message || 'An unknown error occurred');

	if (error.response?.message && error.response.message !== error.message) {
		parts.push(`- ${error.response.message}`);
	}

	return parts.join(' ');
}

/**
 * Handles errors and converts them to NodeApiError
 */
export function handleError(error: unknown, node: INode, context?: string): NodeApiError {
	let errorMessage: string;
	let errorDetails: Record<string, unknown> = {};

	// Handle Appwrite errors
	if (isAppwriteError(error)) {
		errorMessage = formatAppwriteError(error);
		errorDetails = {
			code: error.code,
			type: error.type,
			appwriteMessage: error.message,
		};
	}
	// Handle validation errors
	else if (error instanceof ValidationError) {
		errorMessage = `Validation Error: ${error.message}`;
		errorDetails = {
			type: 'ValidationError',
		};
	}
	// Handle parse errors
	else if (error instanceof ParseError) {
		errorMessage = `Parse Error: ${error.message}`;
		errorDetails = {
			type: 'ParseError',
			originalError: error.originalError?.message,
		};
	}
	// Handle standard errors
	else if (error instanceof Error) {
		errorMessage = error.message;
		errorDetails = {
			name: error.name,
			stack: error.stack,
		};
	}
	// Handle unknown errors
	else {
		errorMessage = 'An unknown error occurred';
		errorDetails = {
			error: String(error),
		};
	}

	// Add context if provided
	if (context) {
		errorMessage = `${context}: ${errorMessage}`;
		errorDetails.context = context;
	}

	return new NodeApiError(node, {
		message: errorMessage,
		...errorDetails,
	});
}

/**
 * Wraps an async operation with error handling
 */
export async function withErrorHandling<T>(
	operation: () => Promise<T>,
	node: INode,
	context?: string,
): Promise<T> {
	try {
		return await operation();
	} catch (error) {
		throw handleError(error, node, context);
	}
}
