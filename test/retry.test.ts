import { withRetry, withTimeout, withRetryAndTimeout } from '../nodes/Appwrite/utils/retry';

describe('Retry Logic', () => {
	describe('withRetry', () => {
		it('should succeed on first attempt', async () => {
			const operation = jest.fn().mockResolvedValue('success');
			const result = await withRetry(operation);
			expect(result).toBe('success');
			expect(operation).toHaveBeenCalledTimes(1);
		});

		it('should retry on 429 rate limit error', async () => {
			const operation = jest
				.fn()
				.mockRejectedValueOnce({ code: 429 })
				.mockResolvedValueOnce('success');

			const result = await withRetry(operation, { maxRetries: 1, initialDelayMs: 10 });
			expect(result).toBe('success');
			expect(operation).toHaveBeenCalledTimes(2);
		});

		it('should retry on 500 server error', async () => {
			const operation = jest
				.fn()
				.mockRejectedValueOnce({ code: 500 })
				.mockResolvedValueOnce('success');

			const result = await withRetry(operation, { maxRetries: 1, initialDelayMs: 10 });
			expect(result).toBe('success');
			expect(operation).toHaveBeenCalledTimes(2);
		});

		it('should not retry on 400 client error', async () => {
			const operation = jest.fn().mockRejectedValue({ code: 400, message: 'Bad Request' });

			await expect(withRetry(operation, { maxRetries: 3 })).rejects.toEqual({
				code: 400,
				message: 'Bad Request',
			});
			expect(operation).toHaveBeenCalledTimes(1);
		});

		it('should exhaust retries and throw last error', async () => {
			const operation = jest.fn().mockRejectedValue({ code: 429, message: 'Rate limited' });

			await expect(withRetry(operation, { maxRetries: 2, initialDelayMs: 10 })).rejects.toEqual({
				code: 429,
				message: 'Rate limited',
			});
			expect(operation).toHaveBeenCalledTimes(3); // initial + 2 retries
		});

		it('should use exponential backoff', async () => {
			const operation = jest
				.fn()
				.mockRejectedValueOnce({ code: 429 })
				.mockRejectedValueOnce({ code: 429 })
				.mockResolvedValueOnce('success');

			const startTime = Date.now();
			await withRetry(operation, {
				maxRetries: 2,
				initialDelayMs: 100,
				backoffMultiplier: 2,
			});
			const duration = Date.now() - startTime;

			// Should take at least 100ms + 200ms (with jitter tolerance)
			expect(duration).toBeGreaterThanOrEqual(250);
			expect(operation).toHaveBeenCalledTimes(3);
		});
	});

	describe('withTimeout', () => {
		it('should complete before timeout', async () => {
			const operation = jest.fn().mockResolvedValue('success');
			const result = await withTimeout(operation, 1000);
			expect(result).toBe('success');
		});

		it('should timeout slow operation', async () => {
			const operation = () =>
				new Promise((resolve) => setTimeout(() => resolve('too slow'), 1000));

			await expect(withTimeout(operation, 100, 'Custom timeout')).rejects.toThrow(
				'Custom timeout',
			);
		});

		it('should use default timeout message', async () => {
			const operation = () =>
				new Promise((resolve) => setTimeout(() => resolve('too slow'), 1000));

			await expect(withTimeout(operation, 100)).rejects.toThrow('Operation timed out');
		});
	});

	describe('withRetryAndTimeout', () => {
		it('should succeed with both retry and timeout', async () => {
			const operation = jest
				.fn()
				.mockRejectedValueOnce({ code: 429 })
				.mockResolvedValueOnce('success');

			const result = await withRetryAndTimeout(
				operation,
				{ maxRetries: 1, initialDelayMs: 10 },
				5000,
			);
			expect(result).toBe('success');
			expect(operation).toHaveBeenCalledTimes(2);
		});

		it('should timeout during retry attempts', async () => {
			const operation = jest.fn().mockImplementation(
				() => new Promise((resolve) => setTimeout(() => resolve('slow'), 200)),
			);

			await expect(
				withRetryAndTimeout(
					operation,
					{ maxRetries: 3, initialDelayMs: 10 },
					100, // Very short timeout
				),
			).rejects.toThrow('Operation timed out');
		});

		it('should handle retryable error then timeout', async () => {
			let callCount = 0;
			const operation = jest.fn().mockImplementation(() => {
				callCount++;
				if (callCount === 1) {
					return Promise.reject({ code: 429 });
				}
				return new Promise((resolve) => setTimeout(() => resolve('slow'), 500));
			});

			await expect(
				withRetryAndTimeout(
					operation,
					{ maxRetries: 2, initialDelayMs: 10 },
					100, // Short timeout for second call
				),
			).rejects.toThrow();
		});
	});

	describe('Error handling', () => {
		it('should handle response.status format', async () => {
			const operation = jest
				.fn()
				.mockRejectedValueOnce({ response: { status: 503 } })
				.mockResolvedValueOnce('success');

			const result = await withRetry(operation, { maxRetries: 1, initialDelayMs: 10 });
			expect(result).toBe('success');
			expect(operation).toHaveBeenCalledTimes(2);
		});

		it('should handle non-object errors', async () => {
			const operation = jest.fn().mockRejectedValue('string error');

			await expect(withRetry(operation, { maxRetries: 1 })).rejects.toBe('string error');
			expect(operation).toHaveBeenCalledTimes(1); // No retry for non-retryable
		});

		it('should handle null/undefined errors', async () => {
			const operation = jest.fn().mockRejectedValue(null);

			await expect(withRetry(operation, { maxRetries: 1 })).rejects.toBeNull();
			expect(operation).toHaveBeenCalledTimes(1);
		});
	});

	describe('Configuration', () => {
		it('should use default options', async () => {
			const operation = jest
				.fn()
				.mockRejectedValueOnce({ code: 429 })
				.mockRejectedValueOnce({ code: 429 })
				.mockRejectedValueOnce({ code: 429 })
				.mockResolvedValueOnce('success');

			const result = await withRetry(operation, { initialDelayMs: 10 });
			expect(result).toBe('success');
			expect(operation).toHaveBeenCalledTimes(4); // Default maxRetries is 3
		});

		it('should respect maxDelayMs cap', async () => {
			const operation = jest.fn().mockRejectedValue({ code: 429 });

			const startTime = Date.now();
			await withRetry(operation, {
				maxRetries: 1,
				initialDelayMs: 1000,
				maxDelayMs: 100, // Cap at 100ms
				backoffMultiplier: 10,
			}).catch(() => {
				// Expected to fail
			});
			const duration = Date.now() - startTime;

			// Should not exceed maxDelayMs significantly (100ms maxDelay + 1000ms max jitter + tolerance)
			expect(duration).toBeLessThan(1500);
		});

		it('should support custom retryable error codes', async () => {
			const operation = jest
				.fn()
				.mockRejectedValueOnce({ code: 418 }) // I'm a teapot
				.mockResolvedValueOnce('success');

			const result = await withRetry(operation, {
				maxRetries: 1,
				initialDelayMs: 10,
				retryableErrors: [418], // Custom error code
			});
			expect(result).toBe('success');
			expect(operation).toHaveBeenCalledTimes(2);
		});
	});
});
