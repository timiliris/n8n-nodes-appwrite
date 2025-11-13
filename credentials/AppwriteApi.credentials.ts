import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AppwriteApi implements ICredentialType {
	name = 'appwriteApi';
	displayName = 'Appwrite API';
	documentationUrl = 'https://appwrite.io/docs/apis/rest';
	properties: INodeProperties[] = [
		{
			displayName: 'Endpoint',
			name: 'endpoint',
			type: 'string',
			default: 'https://cloud.appwrite.io/v1',
			required: true,
			description: 'The Appwrite API endpoint URL (e.g., https://cloud.appwrite.io/v1 or your self-hosted URL)',
			placeholder: 'https://cloud.appwrite.io/v1',
		},
		{
			displayName: 'Project ID',
			name: 'projectId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Appwrite project ID. You can find this in your Appwrite console under Settings > Project ID.',
			placeholder: '5f9a9b9a9b9a9',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Appwrite API key with appropriate scopes. Generate one in your Appwrite console under API Keys.',
			placeholder: 'd1efb...your-api-key',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Appwrite-Project': '={{$credentials.projectId}}',
				'X-Appwrite-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.endpoint}}',
			url: '/health',
			method: 'GET',
		},
	};
}
