/**
 * Integration tests for Appwrite operations
 *
 * IMPORTANT: These tests require a running Appwrite instance
 * To run integration tests:
 * 1. Set APPWRITE_ENDPOINT environment variable
 * 2. Set APPWRITE_PROJECT_ID environment variable
 * 3. Set APPWRITE_API_KEY environment variable
 * 4. Run: npm test -- --testPathPattern=integration
 *
 * Example:
 * export APPWRITE_ENDPOINT="http://localhost/v1"
 * export APPWRITE_PROJECT_ID="my-project-id"
 * export APPWRITE_API_KEY="my-api-key"
 * npm test -- --testPathPattern=integration
 */

import { Client, Databases } from 'node-appwrite';

const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;

const hasIntegrationConfig =
	APPWRITE_ENDPOINT && APPWRITE_PROJECT_ID && APPWRITE_API_KEY;

// Skip all tests if integration config is not provided
const describeIntegration = hasIntegrationConfig ? describe : describe.skip;

describeIntegration('Appwrite Integration Tests', () => {
	let client: Client;
	let databases: Databases;
	const testDatabaseId = `test-db-${Date.now()}`;
	const testCollectionId = `test-col-${Date.now()}`;

	beforeAll(() => {
		if (!hasIntegrationConfig) return;

		client = new Client();
		client
			.setEndpoint(APPWRITE_ENDPOINT!)
			.setProject(APPWRITE_PROJECT_ID!)
			.setKey(APPWRITE_API_KEY!);

		databases = new Databases(client);
	});

	afterAll(async () => {
		if (!hasIntegrationConfig) return;

		// Cleanup: Delete test database
		try {
			await databases.delete(testDatabaseId);
		} catch (error) {
			// Ignore cleanup errors
		}
	});

	describe('Database Operations', () => {
		it('should create a database', async () => {
			const result = await databases.create(testDatabaseId, 'Test Database');

			expect(result.$id).toBe(testDatabaseId);
			expect(result.name).toBe('Test Database');
		});

		it('should get the created database', async () => {
			const result = await databases.get(testDatabaseId);

			expect(result.$id).toBe(testDatabaseId);
			expect(result.name).toBe('Test Database');
		});

		it('should list databases', async () => {
			const result = await databases.list();

			expect(result.total).toBeGreaterThan(0);
			expect(result.databases).toBeInstanceOf(Array);
		});

		it('should update database name', async () => {
			const result = await databases.update(testDatabaseId, 'Updated Test Database');

			expect(result.$id).toBe(testDatabaseId);
			expect(result.name).toBe('Updated Test Database');
		});
	});

	describe('Collection Operations', () => {
		it('should create a collection', async () => {
			const result = await databases.createCollection(
				testDatabaseId,
				testCollectionId,
				'Test Collection',
				['read("any")'],
			);

			expect(result.$id).toBe(testCollectionId);
			expect(result.name).toBe('Test Collection');
		});

		it('should get the created collection', async () => {
			const result = await databases.getCollection(testDatabaseId, testCollectionId);

			expect(result.$id).toBe(testCollectionId);
			expect(result.name).toBe('Test Collection');
		});

		it('should list collections', async () => {
			const result = await databases.listCollections(testDatabaseId);

			expect(result.total).toBeGreaterThan(0);
			expect(result.collections).toBeInstanceOf(Array);
		});
	});

	describe('Attribute Operations', () => {
		it('should create a string attribute', async () => {
			const result = await databases.createStringAttribute(
				testDatabaseId,
				testCollectionId,
				'name',
				255,
				true,
			);

			expect(result.key).toBe('name');
			expect(result.type).toBe('string');
		});

		// Wait for attribute to be available
		it('should wait for attribute to be ready', async () => {
			await new Promise((resolve) => setTimeout(resolve, 2000));
		});

		it('should list attributes', async () => {
			const result = await databases.listAttributes(testDatabaseId, testCollectionId);

			expect(result.total).toBeGreaterThan(0);
			expect(result.attributes[0].key).toBe('name');
		});
	});

	describe('Document Operations', () => {
		const testDocumentId = 'unique()';

		it('should create a document', async () => {
			const result = await databases.createDocument(
				testDatabaseId,
				testCollectionId,
				testDocumentId,
				{ name: 'Test Document' },
			);

			expect(result.name).toBe('Test Document');
		});

		it('should list documents', async () => {
			const result = await databases.listDocuments(testDatabaseId, testCollectionId);

			expect(result.total).toBeGreaterThan(0);
			expect(result.documents).toBeInstanceOf(Array);
		});
	});
});

describe('Integration Test Configuration', () => {
	it('should have integration test instructions', () => {
		expect(true).toBe(true);
		if (!hasIntegrationConfig) {
			console.log('\n⚠️  Integration tests skipped: Missing Appwrite configuration');
			console.log('To run integration tests, set these environment variables:');
			console.log('  - APPWRITE_ENDPOINT');
			console.log('  - APPWRITE_PROJECT_ID');
			console.log('  - APPWRITE_API_KEY\n');
		}
	});
});
