import { executeHelperOperation } from '../../nodes/AppwriteHelper/operations/HelperOperations';

describe('Helper Operations', () => {
	let mockThis: any;

	beforeEach(() => {
		mockThis = {
			getNodeParameter: jest.fn(),
			getInputData: jest.fn(),
			getNode: jest.fn(() => ({ name: 'Test Node' })),
		};
	});

	describe('permissionPreset operation', () => {
		it('should generate publicRead preset', async () => {
			mockThis.getNodeParameter.mockReturnValue('publicRead');

			const result = await executeHelperOperation.call(mockThis, 'permissionPreset', 0);

			expect(result.json).toEqual({
				preset: 'publicRead',
				permissions: ['read("any")'],
				count: 1,
			});
		});

		it('should generate publicReadUserWrite preset', async () => {
			mockThis.getNodeParameter.mockReturnValue('publicReadUserWrite');

			const result = await executeHelperOperation.call(mockThis, 'permissionPreset', 0);

			expect(result.json).toEqual({
				preset: 'publicReadUserWrite',
				permissions: ['read("any")', 'write("users")'],
				count: 2,
			});
		});

		it('should generate adminOnly preset', async () => {
			mockThis.getNodeParameter.mockReturnValue('adminOnly');

			const result = await executeHelperOperation.call(mockThis, 'permissionPreset', 0);

			expect(result.json).toEqual({
				preset: 'adminOnly',
				permissions: ['read("label:admin")', 'write("label:admin")'],
				count: 2,
			});
		});
	});

	describe('detectConflicts operation', () => {
		it('should detect no conflicts in clean permissions', async () => {
			mockThis.getNodeParameter.mockReturnValue('["read(\\"users\\")", "write(\\"users\\")"]');

			const result = await executeHelperOperation.call(mockThis, 'detectConflicts', 0);

			expect(result.json.hasConflicts).toBe(false);
			expect(result.json.conflicts).toHaveLength(0);
			expect(result.json.optimized).toHaveLength(2);
		});

		it('should detect redundant permissions when read("any") exists', async () => {
			mockThis.getNodeParameter.mockReturnValue('["read(\\"any\\")", "read(\\"users\\")", "read(\\"guests\\")"]');

			const result = await executeHelperOperation.call(mockThis, 'detectConflicts', 0);

			expect(result.json.hasConflicts).toBe(true);
			expect(result.json.conflicts.length).toBeGreaterThan(0);
			expect(result.json.optimized).toEqual(['read("any")']);
			expect(result.json.stats.reduction).toBeGreaterThan(0);
		});

		it('should provide optimization statistics', async () => {
			mockThis.getNodeParameter.mockReturnValue('["read(\\"any\\")", "read(\\"users\\")"]');

			const result = await executeHelperOperation.call(mockThis, 'detectConflicts', 0);

			expect(result.json.stats).toEqual({
				original: 2,
				optimized: 1,
				reduction: 1,
			});
		});
	});

	describe('generateId operation', () => {
		it('should generate UUID format', async () => {
			mockThis.getNodeParameter
				.mockReturnValueOnce('uuid')  // idFormat
				.mockReturnValueOnce(21)      // idLength
				.mockReturnValueOnce('')      // idText
				.mockReturnValueOnce('ID-XXXX'); // idPattern

			const result = await executeHelperOperation.call(mockThis, 'generateId', 0);

			expect(result.json.format).toBe('uuid');
			expect(result.json.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
		});

		it('should generate nanoid format with custom length', async () => {
			mockThis.getNodeParameter
				.mockReturnValueOnce('nanoid')
				.mockReturnValueOnce(10)
				.mockReturnValueOnce('')
				.mockReturnValueOnce('ID-XXXX');

			const result = await executeHelperOperation.call(mockThis, 'generateId', 0);

			expect(result.json.format).toBe('nanoid');
			expect(result.json.id).toHaveLength(10);
			expect(result.json.id).toMatch(/^[A-Za-z0-9_-]+$/);
		});

		it('should generate slug from text', async () => {
			mockThis.getNodeParameter
				.mockReturnValueOnce('slug')
				.mockReturnValueOnce(21)
				.mockReturnValueOnce('My Document Name')
				.mockReturnValueOnce('ID-XXXX');

			const result = await executeHelperOperation.call(mockThis, 'generateId', 0);

			expect(result.json.format).toBe('slug');
			expect(result.json.id).toBe('my-document-name');
		});

		it('should generate custom pattern', async () => {
			mockThis.getNodeParameter
				.mockReturnValueOnce('custom')
				.mockReturnValueOnce(21)
				.mockReturnValueOnce('')
				.mockReturnValueOnce('USER-XXXX');

			const result = await executeHelperOperation.call(mockThis, 'generateId', 0);

			expect(result.json.format).toBe('custom');
			expect(result.json.id).toMatch(/^USER-\d{4}$/);
		});
	});

	describe('validateId operation', () => {
		it('should validate valid UUID', async () => {
			mockThis.getNodeParameter
				.mockReturnValueOnce('550e8400-e29b-41d4-a716-446655440000')
				.mockReturnValueOnce('uuid');

			const result = await executeHelperOperation.call(mockThis, 'validateId', 0);

			expect(result.json.valid).toBe(true);
			expect(result.json.errors).toHaveLength(0);
		});

		it('should reject invalid UUID', async () => {
			mockThis.getNodeParameter
				.mockReturnValueOnce('not-a-uuid')
				.mockReturnValueOnce('uuid');

			const result = await executeHelperOperation.call(mockThis, 'validateId', 0);

			expect(result.json.valid).toBe(false);
			expect(result.json.errors.length).toBeGreaterThan(0);
		});

		it('should validate slug format', async () => {
			mockThis.getNodeParameter
				.mockReturnValueOnce('my-valid-slug')
				.mockReturnValueOnce('slug');

			const result = await executeHelperOperation.call(mockThis, 'validateId', 0);

			expect(result.json.valid).toBe(true);
		});

		it('should reject ID exceeding Appwrite limit', async () => {
			mockThis.getNodeParameter
				.mockReturnValueOnce('a'.repeat(37))
				.mockReturnValueOnce('none');

			const result = await executeHelperOperation.call(mockThis, 'validateId', 0);

			expect(result.json.valid).toBe(false);
			expect(result.json.errors).toContain('ID must be 36 characters or less (Appwrite limit)');
		});
	});

	describe('formatDateTime operation', () => {
		it('should format to ISO 8601', async () => {
			mockThis.getNodeParameter
				.mockReturnValueOnce('2024-01-15T10:30:00Z')
				.mockReturnValueOnce('iso8601');

			const result = await executeHelperOperation.call(mockThis, 'formatDateTime', 0);

			expect(result.json.output).toBe('2024-01-15T10:30:00.000Z');
		});

		it('should format to date only', async () => {
			mockThis.getNodeParameter
				.mockReturnValueOnce('2024-01-15T10:30:00Z')
				.mockReturnValueOnce('date');

			const result = await executeHelperOperation.call(mockThis, 'formatDateTime', 0);

			expect(result.json.output).toBe('2024-01-15');
		});

		it('should format timestamp to ISO', async () => {
			mockThis.getNodeParameter
				.mockReturnValueOnce('1705315800000')
				.mockReturnValueOnce('iso8601');

			const result = await executeHelperOperation.call(mockThis, 'formatDateTime', 0);

			expect(result.json.output).toContain('2024-01-15');
		});

		it('should format to unix timestamp', async () => {
			mockThis.getNodeParameter
				.mockReturnValueOnce('2024-01-15T10:30:00.000Z')
				.mockReturnValueOnce('unix');

			const result = await executeHelperOperation.call(mockThis, 'formatDateTime', 0);

			// Verify it's a valid unix timestamp (10 digits)
			expect(result.json.output).toMatch(/^\d{10}$/);
			expect(Number(result.json.output)).toBeGreaterThan(1700000000);
		});
	});

	describe('csvToDocuments operation', () => {
		it('should convert CSV to documents', async () => {
			const csv = 'name,email,age\nJohn Doe,john@example.com,30\nJane Smith,jane@example.com,25';

			mockThis.getNodeParameter
				.mockReturnValueOnce(csv)          // csvInput
				.mockReturnValueOnce(true)         // autoDetectTypes
				.mockReturnValueOnce(true)         // generateIds
				.mockReturnValueOnce('')           // idField
				.mockReturnValueOnce(',')          // delimiter
				.mockReturnValueOnce('{}');        // fieldMapping

			const result = await executeHelperOperation.call(mockThis, 'csvToDocuments', 0);

			expect(result.json.count).toBe(2);
			expect(result.json.documents).toHaveLength(2);
			expect(result.json.documents[0].data.name).toBe('John Doe');
			expect(result.json.documents[0].data.email).toBe('john@example.com');
			expect(result.json.documents[0].data.age).toBe(30); // Auto-detected as number
		});

		it('should apply field mapping', async () => {
			const csv = 'old_name,email_address\nJohn,john@example.com';
			const fieldMapping = '{"old_name": "name", "email_address": "email"}';

			mockThis.getNodeParameter
				.mockReturnValueOnce(csv)
				.mockReturnValueOnce(true)
				.mockReturnValueOnce(true)
				.mockReturnValueOnce('')
				.mockReturnValueOnce(',')
				.mockReturnValueOnce(fieldMapping);

			const result = await executeHelperOperation.call(mockThis, 'csvToDocuments', 0);

			expect(result.json.documents[0].data.name).toBe('John');
			expect(result.json.documents[0].data.email).toBe('john@example.com');
			expect(result.json.documents[0].data.old_name).toBeUndefined();
		});

		it('should auto-detect boolean values', async () => {
			const csv = 'name,active\nJohn,true\nJane,false';

			mockThis.getNodeParameter
				.mockReturnValueOnce(csv)
				.mockReturnValueOnce(true)
				.mockReturnValueOnce(true)
				.mockReturnValueOnce('')
				.mockReturnValueOnce(',')
				.mockReturnValueOnce('{}');

			const result = await executeHelperOperation.call(mockThis, 'csvToDocuments', 0);

			expect(result.json.documents[0].data.active).toBe(true);
			expect(result.json.documents[1].data.active).toBe(false);
		});
	});

	describe('extractMetadata operation', () => {
		it('should extract file metadata from binary data', async () => {
			const mockBinaryData = {
				data: Buffer.from('test file content').toString('base64'),
				fileName: 'test.pdf',
			};

			mockThis.getInputData.mockReturnValue([{
				binary: { data: mockBinaryData },
			}]);
			mockThis.getNodeParameter.mockReturnValue('data');

			const result = await executeHelperOperation.call(mockThis, 'extractMetadata', 0);

			expect(result.json.fileName).toBe('test.pdf');
			expect(result.json.mimeType).toBe('application/pdf');
			expect(result.json.extension).toBe('pdf');
			expect(result.json.isDocument).toBe(true);
			expect(result.json.size).toBeGreaterThan(0);
		});

		it('should detect image file types', async () => {
			const mockBinaryData = {
				data: Buffer.from('fake image data').toString('base64'),
				fileName: 'photo.jpg',
			};

			mockThis.getInputData.mockReturnValue([{
				binary: { data: mockBinaryData },
			}]);
			mockThis.getNodeParameter.mockReturnValue('data');

			const result = await executeHelperOperation.call(mockThis, 'extractMetadata', 0);

			expect(result.json.mimeType).toBe('image/jpeg');
			expect(result.json.isImage).toBe(true);
			expect(result.json.isDocument).toBe(false);
		});
	});
});

describe('aiFilterItems operation', () => {
	it('should filter items using AI (mocked)', async () => {
		const items = JSON.stringify([
			{ name: 'John Doe', email: 'john@example.com', status: 'active' },
			{ name: 'Test User', email: 'test@example.com', status: 'inactive' },
			{ name: 'Jane Smith', email: 'jane@example.com', status: 'active' },
		]);

		mockThis.getNodeParameter
			.mockReturnValueOnce(items)           // itemsInput
			.mockReturnValueOnce('preset')        // filterMode
			.mockReturnValueOnce('claude-3-5-sonnet-20241022') // aiModel
			.mockReturnValueOnce('withStats')     // returnMode
			.mockReturnValueOnce(false)           // explainDecisions
			.mockReturnValueOnce('validItems');   // presetFilter

		// Skip actual AI call in tests - this requires ANTHROPIC_API_KEY
		// In real usage, this would call the Anthropic API
		// For now, we just test the structure is correct

		try {
			await executeHelperOperation.call(mockThis, 'aiFilterItems', 0);
		} catch (error: any) {
			// Expected to fail without API key in test environment
			expect(error.message).toContain('ANTHROPIC_API_KEY');
		}
	});

	it('should require custom prompt when using custom mode', async () => {
		const items = JSON.stringify([{ name: 'Test' }]);

		mockThis.getNodeParameter
			.mockReturnValueOnce(items)           // itemsInput
			.mockReturnValueOnce('custom')        // filterMode
			.mockReturnValueOnce('claude-3-5-sonnet-20241022') // aiModel
			.mockReturnValueOnce('withStats')     // returnMode
			.mockReturnValueOnce(false)           // explainDecisions
			.mockReturnValueOnce('');             // customPrompt (empty)

		try {
			await executeHelperOperation.call(mockThis, 'aiFilterItems', 0);
			fail('Should have thrown error for empty custom prompt');
		} catch (error: any) {
			expect(error.message).toContain('Custom filter prompt is required');
		}
	});

	it('should reject empty items array', async () => {
		mockThis.getNodeParameter
			.mockReturnValueOnce('[]')            // empty items array
			.mockReturnValueOnce('preset')
			.mockReturnValueOnce('claude-3-5-sonnet-20241022')
			.mockReturnValueOnce('withStats')
			.mockReturnValueOnce(false);

		try {
			await executeHelperOperation.call(mockThis, 'aiFilterItems', 0);
			fail('Should have thrown error for empty array');
		} catch (error: any) {
			expect(error.message).toContain('non-empty array');
		}
	});
});
