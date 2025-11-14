import { Appwrite } from '../nodes/Appwrite/Appwrite.node';

describe('Appwrite Node', () => {
	let appwriteNode: Appwrite;

	beforeEach(() => {
		appwriteNode = new Appwrite();
	});

	describe('Node Structure', () => {
		it('should have correct properties', () => {
			expect(appwriteNode.description.displayName).toBe('Appwrite');
			expect(appwriteNode.description.name).toBe('appwrite');
			expect(appwriteNode.description.group).toContain('transform');
		});

		it('should have required credentials', () => {
			expect(appwriteNode.description.credentials).toHaveLength(1);
			expect(appwriteNode.description.credentials?.[0].name).toBe('appwriteApi');
			expect(appwriteNode.description.credentials?.[0].required).toBe(true);
		});

		it('should have correct resources', () => {
			const resourceProperty = appwriteNode.description.properties.find(
				(prop) => prop.name === 'resource',
			);
			expect(resourceProperty).toBeDefined();
			expect(resourceProperty?.type).toBe('options');

			const options = (resourceProperty as any).options;
			expect(options).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ value: 'database' }),
					expect.objectContaining({ value: 'storage' }),
					expect.objectContaining({ value: 'users' }),
				]),
			);
		});
	});

	describe('Database Operations', () => {
		it('should have database operations defined', () => {
			const databaseOperations = appwriteNode.description.properties.find(
				(prop) =>
					prop.name === 'operation' &&
					prop.displayOptions?.show?.resource?.includes('database'),
			);

			expect(databaseOperations).toBeDefined();
			const options = (databaseOperations as any).options;
			expect(options).toHaveLength(5);
			expect(options.map((opt: any) => opt.value)).toEqual([
				'create',
				'delete',
				'get',
				'list',
				'update',
			]);
		});
	});

	describe('Storage Operations', () => {
		it('should have storage operations defined', () => {
			const storageOperations = appwriteNode.description.properties.find(
				(prop) =>
					prop.name === 'operation' &&
					prop.displayOptions?.show?.resource?.includes('storage'),
			);

			expect(storageOperations).toBeDefined();
			const options = (storageOperations as any).options;
			expect(options.length).toBeGreaterThan(0);
			// Check that key operations exist
			const operationValues = options.map((opt: any) => opt.value);
			expect(operationValues).toContain('createBucket');
			expect(operationValues).toContain('uploadFile');
			expect(operationValues).toContain('listFiles');
		});
	});

	describe('Users Operations', () => {
		it('should have users operations defined', () => {
			const usersOperations = appwriteNode.description.properties.find(
				(prop) =>
					prop.name === 'operation' &&
					prop.displayOptions?.show?.resource?.includes('users'),
			);

			expect(usersOperations).toBeDefined();
			const options = (usersOperations as any).options;
			expect(options).toHaveLength(5);
			expect(options.map((opt: any) => opt.value)).toEqual([
				'createUser',
				'deleteUser',
				'getUser',
				'listUsers',
				'updateUser',
			]);
		});
	});

	// Note: Integration tests would require actual Appwrite instance
	// These should be implemented separately with proper test environment setup
	describe('Integration Tests', () => {
		it.skip('should create a document (requires Appwrite instance)', async () => {
			// This test would require a real or mocked Appwrite instance
			// Skip for now, implement when test environment is ready
		});

		it.skip('should list documents (requires Appwrite instance)', async () => {
			// This test would require a real or mocked Appwrite instance
			// Skip for now, implement when test environment is ready
		});
	});
});
