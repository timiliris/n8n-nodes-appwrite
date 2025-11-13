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

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				let result: INodeExecutionData;

				// Route to appropriate operation handler
				if (resource === 'database') {
					const databases = new Databases(client);
					result = await executeDatabaseOperation.call(this, databases, operation, i);
				} else if (resource === 'attribute') {
					const databases = new Databases(client);
					result = await executeAttributeOperation.call(this, databases, operation, i);
				} else if (resource === 'index') {
					const databases = new Databases(client);
					result = await executeIndexOperation.call(this, databases, operation, i);
				} else if (resource === 'collection') {
					const databases = new Databases(client);
					result = await executeCollectionOperation.call(this, databases, operation, i);
				} else if (resource === 'document') {
					const databases = new Databases(client);
					result = await executeDocumentOperation.call(this, databases, operation, i);
				} else if (resource === 'sites') {
					const sites = new Sites(client);
					result = await executeSitesOperation.call(this, sites, operation, i);
				} else if (resource === 'storage') {
					const storage = new Storage(client);
					result = await executeStorageOperation.call(this, storage, operation, i);
				} else if (resource === 'teams') {
					const teams = new Teams(client);
					result = await executeTeamsOperation.call(this, teams, operation, i);
				} else if (resource === 'users') {
					const users = new Users(client);
					result = await executeUsersOperation.call(this, users, operation, i);
				} else {
					throw new Error(`Unknown resource: ${resource}`);
				}

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
						? { message: error.message, name: error.name, stack: error.stack }
						: { message: String(error) };

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				throw new NodeApiError(this.getNode(), errorData as any);
			}
		}

		return [returnData];
	}
}
