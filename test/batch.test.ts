/**
 * Tests for batch operations utilities
 */

import {
	processBatch,
	validateBatchCreateItems,
	validateBatchUpdateItems,
	validateBatchDeleteItems,
	validateBatchOptions,
	formatBatchResult,
	BatchOptions,
	BatchCreateItem,
	BatchUpdateItem,
	BatchDeleteItem,
} from '../nodes/Appwrite/utils/batch';

describe('Batch Operations', () => {
	describe('validateBatchOptions', () => {
		it('should accept valid batch options', () => {
			expect(() =>
				validateBatchOptions({
					continueOnError: true,
					batchSize: 10,
					parallel: false,
					maxConcurrency: 5,
				}),
			).not.toThrow();
		});

		it('should reject invalid batchSize', () => {
			expect(() => validateBatchOptions({ batchSize: 0 })).toThrow(
				'batchSize must be a positive number',
			);
			expect(() => validateBatchOptions({ batchSize: 101 })).toThrow(
				'batchSize cannot exceed 100',
			);
		});

		it('should reject invalid maxConcurrency', () => {
			expect(() => validateBatchOptions({ maxConcurrency: 0 })).toThrow(
				'maxConcurrency must be a positive number',
			);
			expect(() => validateBatchOptions({ maxConcurrency: 21 })).toThrow(
				'maxConcurrency cannot exceed 20',
			);
		});
	});

	describe('validateBatchCreateItems', () => {
		it('should validate valid create items', () => {
			const items = [
				{ data: { name: 'Item 1' }, documentId: 'doc1' },
				{ data: { name: 'Item 2' } },
			];

			const validated = validateBatchCreateItems(items);
			expect(validated).toHaveLength(2);
			expect(validated[0].documentId).toBe('doc1');
			expect(validated[1].documentId).toBe('unique()');
		});

		it('should reject non-array input', () => {
			expect(() => validateBatchCreateItems('not an array')).toThrow('Batch items must be an array');
		});

		it('should reject empty array', () => {
			expect(() => validateBatchCreateItems([])).toThrow('Batch items array cannot be empty');
		});

		it('should reject items without data', () => {
			expect(() => validateBatchCreateItems([{ documentId: 'doc1' }])).toThrow(
				"Item at index 0 must have a 'data' property that is an object",
			);
		});

		it('should reject too many items', () => {
			const items = Array(1001).fill({ data: { name: 'test' } });
			expect(() => validateBatchCreateItems(items)).toThrow(
				'Cannot process more than 1000 items in a single batch',
			);
		});
	});

	describe('validateBatchUpdateItems', () => {
		it('should validate valid update items', () => {
			const items = [
				{ documentId: 'doc1', data: { name: 'Updated 1' } },
				{ documentId: 'doc2', data: { name: 'Updated 2' }, permissions: ['read("any")'] },
			];

			const validated = validateBatchUpdateItems(items);
			expect(validated).toHaveLength(2);
			expect(validated[0].documentId).toBe('doc1');
			expect(validated[1].permissions).toEqual(['read("any")']);
		});

		it('should reject items without documentId', () => {
			expect(() => validateBatchUpdateItems([{ data: { name: 'test' } }])).toThrow(
				"Item at index 0 must have a 'documentId' property that is a string",
			);
		});

		it('should reject items without data', () => {
			expect(() => validateBatchUpdateItems([{ documentId: 'doc1' }])).toThrow(
				"Item at index 0 must have a 'data' property that is an object",
			);
		});
	});

	describe('validateBatchDeleteItems', () => {
		it('should validate valid delete items', () => {
			const items = [{ documentId: 'doc1' }, { documentId: 'doc2' }];

			const validated = validateBatchDeleteItems(items);
			expect(validated).toHaveLength(2);
			expect(validated[0].documentId).toBe('doc1');
		});

		it('should reject items without documentId', () => {
			expect(() => validateBatchDeleteItems([{ data: { name: 'test' } }])).toThrow(
				"Item at index 0 must have a 'documentId' property that is a string",
			);
		});
	});

	describe('processBatch', () => {
		it('should process all items successfully', async () => {
			const items = [1, 2, 3, 4, 5];
			const operation = async (num: number) => num * 2;

			const result = await processBatch(items, operation, { batchSize: 2 });

			expect(result.total).toBe(5);
			expect(result.successful).toBe(5);
			expect(result.failed).toBe(0);
			expect(result.results.map((r) => r.data)).toEqual([2, 4, 6, 8, 10]);
		});

		it('should handle partial failures with continueOnError', async () => {
			const items = [1, 2, 3, 4, 5];
			const operation = async (num: number) => {
				if (num === 3) throw new Error('Error on 3');
				return num * 2;
			};

			const result = await processBatch(items, operation, {
				batchSize: 10,
				continueOnError: true,
			});

			expect(result.total).toBe(5);
			expect(result.successful).toBe(4);
			expect(result.failed).toBe(1);
			expect(result.errors).toHaveLength(1);
			// Index 2 corresponds to the 3rd item (value 3) in the array
			expect(result.errors[0].index).toBe(2);
			expect(result.errors[0].message).toBe('Error on 3');
		});

		it('should stop on first error when continueOnError is false', async () => {
			const items = [1, 2, 3, 4, 5];
			const operation = async (num: number) => {
				if (num === 3) throw new Error('Error on 3');
				return num * 2;
			};

			const result = await processBatch(items, operation, {
				batchSize: 10,
				continueOnError: false,
			});

			expect(result.failed).toBeGreaterThan(0);
			expect(result.successful).toBeLessThan(5);
		});

		it('should process items in parallel', async () => {
			const items = [1, 2, 3, 4, 5];
			const startTime = Date.now();
			const operation = async (num: number) => {
				await new Promise((resolve) => setTimeout(resolve, 100));
				return num * 2;
			};

			const result = await processBatch(items, operation, {
				batchSize: 5,
				parallel: true,
				maxConcurrency: 3,
			});

			const duration = Date.now() - startTime;

			expect(result.successful).toBe(5);
			// With concurrency of 3, should take ~200ms (2 batches) instead of 500ms (sequential)
			expect(duration).toBeLessThan(400);
		});

		it('should handle empty items array', async () => {
			const items: number[] = [];
			const operation = async (num: number) => num * 2;

			const result = await processBatch(items, operation);

			expect(result.total).toBe(0);
			expect(result.successful).toBe(0);
			expect(result.failed).toBe(0);
		});

		it('should include metadata in result', async () => {
			const items = [1, 2, 3];
			const operation = async (num: number) => num * 2;

			const result = await processBatch(items, operation, {
				batchSize: 10,
				continueOnError: true,
			});

			expect(result.metadata).toBeDefined();
			expect(result.metadata?.batchSize).toBe(10);
			expect(result.metadata?.continueOnError).toBe(true);
			expect(result.metadata?.startTime).toBeInstanceOf(Date);
			expect(result.metadata?.endTime).toBeInstanceOf(Date);
		});
	});

	describe('formatBatchResult', () => {
		it('should format successful result', () => {
			const batchResult = {
				total: 100,
				successful: 100,
				failed: 0,
				results: [],
				errors: [],
				duration: 1500,
			};

			const formatted = formatBatchResult(batchResult);

			expect(formatted.summary).toContain('100/100 successful');
			expect(formatted.summary).toContain('100.00%');
			expect(formatted.summary).toContain('1500ms');
			expect(formatted.details.total).toBe(100);
			expect(formatted.details.successful).toBe(100);
			expect(formatted.details.errors).toBeUndefined();
		});

		it('should format partial failure result', () => {
			const batchResult = {
				total: 100,
				successful: 98,
				failed: 2,
				results: [],
				errors: [
					{ index: 5, message: 'Error 1' },
					{ index: 10, message: 'Error 2' },
				],
				duration: 2000,
			};

			const formatted = formatBatchResult(batchResult);

			expect(formatted.summary).toContain('98/100 successful');
			expect(formatted.summary).toContain('98.00%');
			expect(formatted.summary).toContain('2 failed');
			expect(formatted.details.errors).toHaveLength(2);
		});

		it('should calculate average time per item', () => {
			const batchResult = {
				total: 50,
				successful: 50,
				failed: 0,
				results: [],
				errors: [],
				duration: 5000,
			};

			const formatted = formatBatchResult(batchResult);

			expect(formatted.details.averageTimePerItem).toBe('100.00ms');
		});
	});
});
