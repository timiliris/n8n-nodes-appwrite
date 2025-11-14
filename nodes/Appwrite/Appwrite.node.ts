import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
} from 'n8n-workflow';
import { Client, Databases, Sites, Storage, Teams, Users } from 'node-appwrite';

// Import all property descriptions
import { properties } from './descriptions';

// Import all operation handlers
import { executeDatabaseOperation } from './operations/DatabaseOperations';
import { executeAttributeOperation } from './operations/AttributeOperations';
import { executeIndexOperation } from './operations/IndexOperations';
import { executeCollectionOperation } from './operations/CollectionOperations';
import { executeDocumentOperation } from './operations/DocumentOperations';
import { executeSitesOperation } from './operations/SitesOperations';
import { executeStorageOperation } from './operations/StorageOperations';
import { executeTeamsOperation } from './operations/TeamsOperations';
import { executeUsersOperation } from './operations/UsersOperations';

// Import retry and timeout utilities
import { withRetryAndTimeout } from './utils/retry';

export class Appwrite implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Appwrite',
		name: 'appwrite',
		icon: 'file:AppwriteLogo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Appwrite API',
		defaults: {
			name: 'Appwrite',
		},
		inputs: ['main'],
		outputs: ['main'],
		usableAsTool: true,
		credentials: [
			{
				name: 'appwriteApi',
				required: true,
			},
		],
		properties,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('appwriteApi');
		const endpoint = credentials.endpoint as string;
		const projectId = credentials.projectId as string;
		const apiKey = credentials.apiKey as string;

		// Initialize Appwrite client
		const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);

		const resource = this.getNodeParameter('resource', 0) as string;

		// Initialize service instances once before loop for better performance
		const databases = ['database', 'attribute', 'index', 'collection', 'document'].includes(resource)
			? new Databases(client)
			: null;
		const sites = resource === 'sites' ? new Sites(client) : null;
		const storage = resource === 'storage' ? new Storage(client) : null;
		const teams = resource === 'teams' ? new Teams(client) : null;
		const users = resource === 'users' ? new Users(client) : null;

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;


				// Route to appropriate operation handler using pre-initialized instances
				// Wrap each operation with retry and timeout logic
				const result = await withRetryAndTimeout(async () => {
					if (resource === 'database' && databases) {
						return await executeDatabaseOperation.call(this, databases, operation, i);
					} else if (resource === 'attribute' && databases) {
						return await executeAttributeOperation.call(this, databases, operation, i);
					} else if (resource === 'index' && databases) {
						return await executeIndexOperation.call(this, databases, operation, i);
					} else if (resource === 'collection' && databases) {
						return await executeCollectionOperation.call(this, databases, operation, i);
					} else if (resource === 'document' && databases) {
						return await executeDocumentOperation.call(this, databases, operation, i);
					} else if (resource === 'sites' && sites) {
						return await executeSitesOperation.call(this, sites, operation, i);
					} else if (resource === 'storage' && storage) {
						return await executeStorageOperation.call(this, storage, operation, i);
					} else if (resource === 'teams' && teams) {
						return await executeTeamsOperation.call(this, teams, operation, i);
					} else if (resource === 'users' && users) {
						return await executeUsersOperation.call(this, users, operation, i);
					} else {
						throw new Error(`Unknown resource: ${resource}`);
					}
				});

				returnData.push(result);
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					returnData.push({
						json: {
							error: errorMessage,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}

				const errorData =
					error instanceof Error
						? { message: error.message, name: error.name }
						: { message: String(error) };

				// Type assertion required: n8n NodeApiError accepts JsonObject but our errorData
				// is a more specific type. This is safe as errorData always contains valid JSON.
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				throw new NodeApiError(this.getNode(), errorData as any);
			}
		}

		return [returnData];
	}
}
