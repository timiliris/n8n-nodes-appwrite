import { executeDatabaseOperation } from '../../nodes/Appwrite/operations/DatabaseOperations';
import { Databases } from 'node-appwrite';

describe('DatabaseOperations', () => {
	let mockThis: any;
	let mockDatabases: jest.Mocked<Databases>;

	beforeEach(() => {
		// Mock n8n execution context
		mockThis = {
			getNodeParameter: jest.fn(),
		};

		// Mock Appwrite Databases service
		mockDatabases = {
			create: jest.fn(),
			get: jest.fn(),
			list: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		} as any;
	});

	describe('create operation', () => {
		it('should create a database successfully', async () => {
			// getNodeParameter is called for: databaseId, name, enabled (with default true)
			mockThis.getNodeParameter
				.mockReturnValueOnce('test-db')      // databaseId
				.mockReturnValueOnce('Test Database') // name
				.mockReturnValueOnce(true);           // enabled (default)

			mockDatabases.create.mockResolvedValue({
				$id: 'test-db',
				name: 'Test Database',
			} as any);

			const result = await executeDatabaseOperation.call(mockThis, mockDatabases, 'create', 0);

			expect(result.json).toEqual({
				$id: 'test-db',
				name: 'Test Database',
			});
			expect(mockDatabases.create).toHaveBeenCalledWith('test-db', 'Test Database', true);
		});
	});

	describe('get operation', () => {
		it('should retrieve a database by ID', async () => {
			mockThis.getNodeParameter.mockReturnValue('test-db');

			mockDatabases.get.mockResolvedValue({
				$id: 'test-db',
				name: 'Test Database',
			} as any);

			const result = await executeDatabaseOperation.call(mockThis, mockDatabases, 'get', 0);

			expect(result.json).toEqual({
				$id: 'test-db',
				name: 'Test Database',
			});
			expect(mockDatabases.get).toHaveBeenCalledWith('test-db');
		});
	});

	describe('list operation', () => {
		it('should list all databases', async () => {
			mockDatabases.list.mockResolvedValue({
				total: 2,
				databases: [
					{ $id: 'db1', name: 'Database 1' },
					{ $id: 'db2', name: 'Database 2' },
				],
			} as any);

			const result = await executeDatabaseOperation.call(mockThis, mockDatabases, 'list', 0);

			expect(result.json).toEqual({
				total: 2,
				databases: [
					{ $id: 'db1', name: 'Database 1' },
					{ $id: 'db2', name: 'Database 2' },
				],
			});
			expect(mockDatabases.list).toHaveBeenCalled();
		});
	});

	describe('update operation', () => {
		it('should update a database', async () => {
			// getNodeParameter is called for: databaseId, name, enabled (with default true)
			mockThis.getNodeParameter
				.mockReturnValueOnce('test-db')           // databaseId
				.mockReturnValueOnce('Updated Database')  // name
				.mockReturnValueOnce(true);               // enabled (default)

			mockDatabases.update.mockResolvedValue({
				$id: 'test-db',
				name: 'Updated Database',
			} as any);

			const result = await executeDatabaseOperation.call(mockThis, mockDatabases, 'update', 0);

			expect(result.json).toEqual({
				$id: 'test-db',
				name: 'Updated Database',
			});
			expect(mockDatabases.update).toHaveBeenCalledWith('test-db', 'Updated Database', true);
		});
	});

	describe('delete operation', () => {
		it('should delete a database', async () => {
			mockThis.getNodeParameter.mockReturnValue('test-db');

			mockDatabases.delete.mockResolvedValue({} as any);

			const result = await executeDatabaseOperation.call(mockThis, mockDatabases, 'delete', 0);

			expect(result.json).toEqual({
				success: true,
				databaseId: 'test-db',
			});
			expect(mockDatabases.delete).toHaveBeenCalledWith('test-db');
		});
	});

	describe('error handling', () => {
		it('should throw error for unknown operation', async () => {
			await expect(
				executeDatabaseOperation.call(mockThis, mockDatabases, 'invalid', 0),
			).rejects.toThrow('Unknown database operation: invalid');
		});
	});
});
