/**
 * Retry logic with exponential backoff for handling rate limiting and transient failures
 */

export interface RetryOptions {
	maxRetries?: number;
	initialDelayMs?: number;
	maxDelayMs?: number;
	backoffMultiplier?: number;
	retryableErrors?: number[]; // HTTP status codes
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
	maxRetries: 3,
	initialDelayMs: 1000,
	maxDelayMs: 10000,
	backoffMultiplier: 2,
	retryableErrors: [429, 500, 502, 503, 504], // Rate limit + server errors
};

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate delay with exponential backoff
 */
function calculateDelay(attempt: number, options: Required<RetryOptions>): number {
	const delay = Math.min(
		options.initialDelayMs * Math.pow(options.backoffMultiplier, attempt),
		options.maxDelayMs,
	);
	// Add jitter to prevent thundering herd
	return delay + Math.random() * 1000;
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: unknown, options: Required<RetryOptions>): boolean {
	if (!error || typeof error !== 'object') {
		return false;
	}

	// Check for Appwrite error with status code
	if ('code' in error && typeof error.code === 'number') {
		return options.retryableErrors.includes(error.code);
	}

	// Check for HTTP response errors
	if ('response' in error && error.response && typeof error.response === 'object') {
		const response = error.response as { status?: number };
		if (response.status && options.retryableErrors.includes(response.status)) {
			return true;
		}
	}

	return false;
}

/**
 * Execute operation with retry logic and exponential backoff
 */
export async function withRetry<T>(
	operation: () => Promise<T>,
	options: RetryOptions = {},
): Promise<T> {
	const finalOptions: Required<RetryOptions> = {
		...DEFAULT_RETRY_OPTIONS,
		...options,
	};

	let lastError: unknown;

	for (let attempt = 0; attempt <= finalOptions.maxRetries; attempt++) {
		try {
			return await operation();
		} catch (error) {
			lastError = error;

			// Don't retry if it's the last attempt
			if (attempt === finalOptions.maxRetries) {
				break;
			}

			// Check if error is retryable
			if (!isRetryableError(error, finalOptions)) {
				throw error; // Non-retryable error, throw immediately
			}

			// Calculate delay and wait
			const delay = calculateDelay(attempt, finalOptions);
			await sleep(delay);

			// Continue to next attempt
		}
	}

	// All retries exhausted, throw the last error
	throw lastError;
}

/**
 * Execute operation with timeout
 */
export async function withTimeout<T>(
	operation: () => Promise<T>,
	timeoutMs: number,
	timeoutMessage = 'Operation timed out',
): Promise<T> {
	return Promise.race([
		operation(),
		new Promise<T>((_, reject) =>
			setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs),
		),
	]);
}

/**
 * Execute operation with both retry and timeout
 */
export async function withRetryAndTimeout<T>(
	operation: () => Promise<T>,
	retryOptions: RetryOptions = {},
	timeoutMs = 30000,
): Promise<T> {
	return withRetry(
		() => withTimeout(operation, timeoutMs),
		retryOptions,
	);
}
