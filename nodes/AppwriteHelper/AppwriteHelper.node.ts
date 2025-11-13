import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
} from 'n8n-workflow';

import { properties } from './descriptions';
import { executeHelperOperation } from './operations/HelperOperations';

export class AppwriteHelper implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Appwrite Helper',
		name: 'appwriteHelper',
		icon: 'file:AppwriteLogo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Utility node for building Appwrite queries, permissions, and schemas',
		defaults: {
			name: 'Appwrite Helper',
		},
		inputs: ['main'],
		outputs: ['main'],
		usableAsTool: true,
		properties,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const result = await executeHelperOperation.call(this, operation, i);
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

				throw new NodeApiError(this.getNode(), errorData as any);
			}
		}

		return [returnData];
	}
}
