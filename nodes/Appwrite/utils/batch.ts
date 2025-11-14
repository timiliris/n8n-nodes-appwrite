/**
 * Batch operations utilities for Appwrite
 * Provides batch processing with error handling, progress tracking, and retry logic
 */

import { withRetry, RetryOptions } from './retry';
import { ValidationError } from './errors';

/**
 * Batch operation options
 */
export interface BatchOptions {
	continueOnError?: boolean;
	batchSize?: number;
	parallel?: boolean;
	maxConcurrency?: number;
	retryOptions?: RetryOptions;
}

/**
 * Individual batch item result
 */
export interface BatchItemResult<T = unknown> {
	success: boolean;
	index: number;
	data?: T;
	error?: {
		message: string;
		code?: number;
		type?: string;
	};
}

/**
 * Complete batch operation result
 */
export interface BatchResult<T = unknown> {
	total: number;
	successful: number;
	failed: number;
	results: BatchItemResult<T>[];
	errors: Array<{
		index: number;
		message: string;
		code?: number;
		type?: string;
	}>;
	duration: number;
	metadata?: {
		startTime: Date;
		endTime: Date;
		batchSize: number;
		continueOnError: boolean;
	};
}

/**
 * Batch item for create operations
 */
export interface BatchCreateItem {
	documentId?: string;
	data: Record<string, unknown>;
	permissions?: string[];
}

/**
 * Batch item for update operations
 */
export interface BatchUpdateItem {
	documentId: string;
	data: Record<string, unknown>;
	permissions?: string[];
}

/**
 * Batch item for delete operations
 */
export interface BatchDeleteItem {
	documentId: string;
}

/**
 * Default batch options
 */
const DEFAULT_BATCH_OPTIONS: Required<BatchOptions> = {
	continueOnError: true,
	batchSize: 10,
	parallel: false,
	maxConcurrency: 5,
	retryOptions: {
		maxRetries: 3,
		initialDelayMs: 1000,
		maxDelayMs: 10000,
		backoffMultiplier: 2,
		retryableErrors: [429, 500, 502, 503, 504],
	},
};

/**
 * Validates batch options
 */
export function validateBatchOptions(options: BatchOptions): void {
	if (options.batchSize !== undefined) {
		if (typeof options.batchSize !== 'number' || options.batchSize < 1) {
			throw new ValidationError('batchSize must be a positive number');
		}
		if (options.batchSize > 100) {
			throw new ValidationError('batchSize cannot exceed 100');
		}
	}

	if (options.maxConcurrency !== undefined) {
		if (typeof options.maxConcurrency !== 'number' || options.maxConcurrency < 1) {
			throw new ValidationError('maxConcurrency must be a positive number');
		}
		if (options.maxConcurrency > 20) {
			throw new ValidationError('maxConcurrency cannot exceed 20');
		}
	}
}

/**
 * Validates batch create items
 */
export function validateBatchCreateItems(items: unknown): BatchCreateItem[] {
	if (!Array.isArray(items)) {
		throw new ValidationError('Batch items must be an array');
	}

	if (items.length === 0) {
		throw new ValidationError('Batch items array cannot be empty');
	}

	if (items.length > 1000) {
		throw new ValidationError('Cannot process more than 1000 items in a single batch');
	}

	return items.map((item, index) => {
		if (typeof item !== 'object' || item === null) {
			throw new ValidationError(`Item at index ${index} must be an object`);
		}

		const batchItem = item as Partial<BatchCreateItem>;

		if (!batchItem.data || typeof batchItem.data !== 'object') {
			throw new ValidationError(`Item at index ${index} must have a 'data' property that is an object`);
		}

		return {
			documentId: batchItem.documentId || 'unique()',
			data: batchItem.data,
			permissions: batchItem.permissions || [],
		};
	});
}

/**
 * Validates batch update items
 */
export function validateBatchUpdateItems(items: unknown): BatchUpdateItem[] {
	if (!Array.isArray(items)) {
		throw new ValidationError('Batch items must be an array');
	}

	if (items.length === 0) {
		throw new ValidationError('Batch items array cannot be empty');
	}

	if (items.length > 1000) {
		throw new ValidationError('Cannot process more than 1000 items in a single batch');
	}

	return items.map((item, index) => {
		if (typeof item !== 'object' || item === null) {
			throw new ValidationError(`Item at index ${index} must be an object`);
		}

		const batchItem = item as Partial<BatchUpdateItem>;

		if (!batchItem.documentId || typeof batchItem.documentId !== 'string') {
			throw new ValidationError(`Item at index ${index} must have a 'documentId' property that is a string`);
		}

		if (!batchItem.data || typeof batchItem.data !== 'object') {
			throw new ValidationError(`Item at index ${index} must have a 'data' property that is an object`);
		}

		return {
			documentId: batchItem.documentId,
			data: batchItem.data,
			permissions: batchItem.permissions || [],
		};
	});
}

/**
 * Validates batch delete items
 */
export function validateBatchDeleteItems(items: unknown): BatchDeleteItem[] {
	if (!Array.isArray(items)) {
		throw new ValidationError('Batch items must be an array');
	}

	if (items.length === 0) {
		throw new ValidationError('Batch items array cannot be empty');
	}

	if (items.length > 1000) {
		throw new ValidationError('Cannot process more than 1000 items in a single batch');
	}

	return items.map((item, index) => {
		if (typeof item !== 'object' || item === null) {
			throw new ValidationError(`Item at index ${index} must be an object`);
		}

		const batchItem = item as Partial<BatchDeleteItem>;

		if (!batchItem.documentId || typeof batchItem.documentId !== 'string') {
			throw new ValidationError(`Item at index ${index} must have a 'documentId' property that is a string`);
		}

		return {
			documentId: batchItem.documentId,
		};
	});
}

/**
 * Splits an array into chunks of specified size
 */
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
	const chunks: T[][] = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		chunks.push(array.slice(i, i + chunkSize));
	}
	return chunks;
}

/**
 * Processes a single batch item with error handling
 */
async function processItem<T, R>(
	item: T,
	index: number,
	operation: (item: T) => Promise<R>,
	retryOptions?: RetryOptions,
): Promise<BatchItemResult<R>> {
	try {
		const data = await withRetry(() => operation(item), retryOptions || {});
		return {
			success: true,
			index,
			data,
		};
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		const errorObj: BatchItemResult<R>['error'] = { message: errorMessage };

		// Extract Appwrite error details
		if (error && typeof error === 'object') {
			if ('code' in error && typeof error.code === 'number') {
				errorObj.code = error.code;
			}
			if ('type' in error && typeof error.type === 'string') {
				errorObj.type = error.type;
			}
		}

		return {
			success: false,
			index,
			error: errorObj,
		};
	}
}

/**
 * Processes items in parallel with concurrency limit
 */
async function processParallel<T, R>(
	items: T[],
	operation: (item: T) => Promise<R>,
	maxConcurrency: number,
	retryOptions?: RetryOptions,
): Promise<BatchItemResult<R>[]> {
	const results: BatchItemResult<R>[] = [];
	const executing: Map<number, Promise<void>> = new Map();

	for (let i = 0; i < items.length; i++) {
		const index = i;
		const promise = processItem(items[i], i, operation, retryOptions).then((result) => {
			results.push(result);
			executing.delete(index);
		});

		executing.set(index, promise);

		if (executing.size >= maxConcurrency) {
			await Promise.race(executing.values());
		}
	}

	await Promise.all(executing.values());
	return results.sort((a, b) => a.index - b.index);
}

/**
 * Processes items sequentially
 */
async function processSequential<T, R>(
	items: T[],
	operation: (item: T) => Promise<R>,
	retryOptions?: RetryOptions,
): Promise<BatchItemResult<R>[]> {
	const results: BatchItemResult<R>[] = [];

	for (let i = 0; i < items.length; i++) {
		const result = await processItem(items[i], i, operation, retryOptions);
		results.push(result);
	}

	return results;
}

/**
 * Main batch processing function
 * @param items - Array of items to process
 * @param operation - Async function to execute for each item
 * @param options - Batch processing options
 * @returns BatchResult with detailed statistics and results
 */
export async function processBatch<T, R>(
	items: T[],
	operation: (item: T) => Promise<R>,
	options: BatchOptions = {},
): Promise<BatchResult<R>> {
	const startTime = new Date();
	const finalOptions = { ...DEFAULT_BATCH_OPTIONS, ...options };

	// Validate options
	validateBatchOptions(finalOptions);

	// Split items into batches
	const batches = chunkArray(items, finalOptions.batchSize);
	const allResults: BatchItemResult<R>[] = [];

	// Process each batch
	for (const batch of batches) {
		let batchResults: BatchItemResult<R>[];

		if (finalOptions.parallel) {
			batchResults = await processParallel(
				batch,
				operation,
				finalOptions.maxConcurrency,
				finalOptions.retryOptions,
			);
		} else {
			batchResults = await processSequential(batch, operation, finalOptions.retryOptions);
		}

		allResults.push(...batchResults);

		// Stop processing if continueOnError is false and there are errors
		if (!finalOptions.continueOnError && batchResults.some((r) => !r.success)) {
			break;
		}
	}

	const endTime = new Date();
	const duration = endTime.getTime() - startTime.getTime();

	// Calculate statistics
	const successful = allResults.filter((r) => r.success).length;
	const failed = allResults.filter((r) => !r.success).length;

	// Extract errors
	const errors = allResults
		.filter((r) => !r.success && r.error)
		.map((r) => ({
			index: r.index,
			message: r.error!.message,
			code: r.error!.code,
			type: r.error!.type,
		}));

	return {
		total: items.length,
		successful,
		failed,
		results: allResults,
		errors,
		duration,
		metadata: {
			startTime,
			endTime,
			batchSize: finalOptions.batchSize,
			continueOnError: finalOptions.continueOnError,
		},
	};
}

/**
 * Formats batch result for user-friendly display
 */
export function formatBatchResult<T>(result: BatchResult<T>): {
	summary: string;
	details: Record<string, unknown>;
} {
	const { total, successful, failed, duration } = result;
	const successRate = total > 0 ? ((successful / total) * 100).toFixed(2) : '0';

	const summary = `Batch completed: ${successful}/${total} successful (${successRate}%), ${failed} failed, ${duration}ms`;

	const details = {
		total,
		successful,
		failed,
		successRate: `${successRate}%`,
		duration: `${duration}ms`,
		averageTimePerItem: total > 0 ? `${(duration / total).toFixed(2)}ms` : '0ms',
		errors: result.errors.length > 0 ? result.errors : undefined,
	};

	return { summary, details };
}
