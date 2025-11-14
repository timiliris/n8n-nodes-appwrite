import { executeCollectionOperation } from '../../nodes/Appwrite/operations/CollectionOperations';
import { Databases } from 'node-appwrite';

describe('CollectionOperations', () => {
	let mockThis: any;
	let mockDatabases: jest.Mocked<Databases>;

	beforeEach(() => {
		mockThis = {
			getNodeParameter: jest.fn(),
		};

		mockDatabases = {
			createCollection: jest.fn(),
			getCollection: jest.fn(),
			listCollections: jest.fn(),
			updateCollection: jest.fn(),
			deleteCollection: jest.fn(),
			listAttributes: jest.fn(),
			listIndexes: jest.fn(),
		} as any;
	});

	describe('create operation', () => {
		it('should create a collection with valid permissions', async () => {
			mockThis.getNodeParameter.mockImplementation((param: string) => {
				const params: Record<string, any> = {
					databaseId: 'test-db',
					collectionId: 'test-collection',
					name: 'Test Collection',
					permissions: '["read(\\"any\\")","write(\\"users\\")"]',
					documentSecurity: true,
					enabled: true,
				};
				return params[param];
			});

			mockDatabases.createCollection.mockResolvedValue({
				$id: 'test-collection',
				name: 'Test Collection',
			} as any);

			const result = await executeCollectionOperation.call(
				mockThis,
				mockDatabases,
				'create',
				0,
			);

			expect(result.json).toEqual({
				$id: 'test-collection',
				name: 'Test Collection',
			});
			expect(mockDatabases.createCollection).toHaveBeenCalledWith(
				'test-db',
				'test-collection',
				'Test Collection',
				['read("any")', 'write("users")'],
				true,
				true,
			);
		});

		it('should throw error for invalid permission format', async () => {
			mockThis.getNodeParameter.mockImplementation((param: string) => {
				const params: Record<string, any> = {
					databaseId: 'test-db',
					collectionId: 'test-collection',
					name: 'Test Collection',
					permissions: '["invalid-permission"]',
					documentSecurity: false,
					enabled: true,
				};
				return params[param];
			});

			await expect(
				executeCollectionOperation.call(mockThis, mockDatabases, 'create', 0),
			).rejects.toThrow();
		});
	});

	describe('get operation', () => {
		it('should retrieve a collection', async () => {
			mockThis.getNodeParameter.mockImplementation((param: string) => {
				const params: Record<string, any> = {
					databaseId: 'test-db',
					collectionId: 'test-collection',
				};
				return params[param];
			});

			mockDatabases.getCollection.mockResolvedValue({
				$id: 'test-collection',
				name: 'Test Collection',
			} as any);

			const result = await executeCollectionOperation.call(
				mockThis,
				mockDatabases,
				'get',
				0,
			);

			expect(result.json).toEqual({
				$id: 'test-collection',
				name: 'Test Collection',
			});
		});
	});

	describe('list operation', () => {
		it('should list all collections in database', async () => {
			mockThis.getNodeParameter.mockReturnValue('test-db');

			mockDatabases.listCollections.mockResolvedValue({
				total: 2,
				collections: [
					{ $id: 'col1', name: 'Collection 1' },
					{ $id: 'col2', name: 'Collection 2' },
				],
			} as any);

			const result = await executeCollectionOperation.call(
				mockThis,
				mockDatabases,
				'list',
				0,
			);

			expect(result.json).toHaveProperty('total', 2);
			expect(result.json).toHaveProperty('collections');
		});
	});

	describe('listAttributes operation', () => {
		it('should list collection attributes', async () => {
			mockThis.getNodeParameter.mockImplementation((param: string) => {
				const params: Record<string, any> = {
					databaseId: 'test-db',
					collectionId: 'test-collection',
				};
				return params[param];
			});

			mockDatabases.listAttributes.mockResolvedValue({
				total: 1,
				attributes: [{ key: 'name', type: 'string' }],
			} as any);

			const result = await executeCollectionOperation.call(
				mockThis,
				mockDatabases,
				'listAttributes',
				0,
			);

			expect(result.json).toHaveProperty('total', 1);
		});
	});

	describe('listIndexes operation', () => {
		it('should list collection indexes', async () => {
			mockThis.getNodeParameter.mockImplementation((param: string) => {
				const params: Record<string, any> = {
					databaseId: 'test-db',
					collectionId: 'test-collection',
				};
				return params[param];
			});

			mockDatabases.listIndexes.mockResolvedValue({
				total: 1,
				indexes: [{ key: 'idx_name', type: 'key' }],
			} as any);

			const result = await executeCollectionOperation.call(
				mockThis,
				mockDatabases,
				'listIndexes',
				0,
			);

			expect(result.json).toHaveProperty('total', 1);
		});
	});

	describe('error handling', () => {
		it('should throw error for unknown operation', async () => {
			mockThis.getNodeParameter.mockReturnValue('test-db');

			await expect(
				executeCollectionOperation.call(mockThis, mockDatabases, 'invalid', 0),
			).rejects.toThrow('Unknown collection operation: invalid');
		});
	});
});
