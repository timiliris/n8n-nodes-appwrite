import {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import { Client, Databases } from 'node-appwrite';

export class AppwriteFormTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Appwrite Form Trigger',
		name: 'appwriteFormTrigger',
		icon: 'file:AppwriteLogo.svg',
		group: ['trigger'],
		version: 1,
		subtitle: 'Create document via web form',
		description: 'Generates a web form based on collection schema for document creation',
		defaults: {
			name: 'Appwrite Form Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'appwriteApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'GET,POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'ℹ️ How to Get Your Form URL',
				name: 'notice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {},
				},
			},
			{
				displayName: 'Instructions',
				name: 'instructions',
				type: 'notice',
				default: '1️⃣ Configure the Database ID and Collection ID below\n2️⃣ Save the workflow\n3️⃣ Activate the workflow (toggle in top right)\n4️⃣ Click on this node to see the "Production URL"\n5️⃣ Copy and share that URL - it\'s your web form!\n\n⚠️ The form URL only works when the workflow is ACTIVE.',
			},
			{
				displayName: 'Database ID',
				name: 'databaseId',
				type: 'string',
				required: true,
				default: '',
				description: 'The ID of the database',
			},
			{
				displayName: 'Collection ID',
				name: 'collectionId',
				type: 'string',
				required: true,
				default: '',
				description: 'The ID of the collection',
			},
			{
				displayName: 'Form Title',
				name: 'formTitle',
				type: 'string',
				default: 'Submit Data',
				description: 'Title displayed at the top of the form',
			},
			{
				displayName: 'Form Description',
				name: 'formDescription',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: 'Fill out the form below to submit your data.',
				description: 'Description text shown below the title',
			},
			{
				displayName: 'Submit Button Text',
				name: 'submitButtonText',
				type: 'string',
				default: 'Submit',
				description: 'Text displayed on the submit button',
			},
			{
				displayName: 'Success Message',
				name: 'successMessage',
				type: 'string',
				default: 'Thank you! Your submission has been received.',
				description: 'Message shown after successful submission',
			},
			{
				displayName: 'Form Theme',
				name: 'formTheme',
				type: 'options',
				options: [
					{ name: 'Light', value: 'light' },
					{ name: 'Dark', value: 'dark' },
					{ name: 'Minimal', value: 'minimal' },
				],
				default: 'light',
				description: 'Visual theme for the form',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const res = this.getResponseObject();
		const method = req.method;

		const credentials = await this.getCredentials('appwriteApi');
		const endpoint = credentials.endpoint as string;
		const projectId = credentials.projectId as string;
		const apiKey = credentials.apiKey as string;

		const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
		const databases = new Databases(client);

		const databaseId = this.getNodeParameter('databaseId') as string;
		const collectionId = this.getNodeParameter('collectionId') as string;
		const formTitle = this.getNodeParameter('formTitle') as string;
		const formDescription = this.getNodeParameter('formDescription') as string;
		const submitButtonText = this.getNodeParameter('submitButtonText') as string;
		const successMessage = this.getNodeParameter('successMessage') as string;
		const formTheme = this.getNodeParameter('formTheme') as string;

		// GET request: Show the form
		if (method === 'GET') {
			try {
				// Fetch collection attributes
				const attributesResponse = await databases.listAttributes(databaseId, collectionId);
				const attributes = attributesResponse.attributes || [];

				// Generate HTML form
				const webhookUrl = this.getNodeWebhookUrl('default') || '';
				const html = generateFormHTML(
					attributes,
					formTitle,
					formDescription,
					submitButtonText,
					formTheme,
					webhookUrl,
				);

				res.writeHead(200, { 'Content-Type': 'text/html' });
				res.end(html);

				return {
					noWebhookResponse: true,
				};
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Failed to load form';
				res.writeHead(500, { 'Content-Type': 'text/html' });
				res.end(`<html><body><h1>Error</h1><p>${errorMessage}</p></body></html>`);

				return {
					noWebhookResponse: true,
				};
			}
		}

		// POST request: Process form submission
		if (method === 'POST') {
			try {
				// Get the request body - n8n automatically parses form data
				const rawBody = this.getBodyData() as IDataObject;

				// Fetch collection attributes to convert types properly
				const attributesResponse = await databases.listAttributes(databaseId, collectionId);
				const attributes = attributesResponse.attributes || [];

				// Convert form data to proper types based on collection schema
				const body: IDataObject = {};
				for (const attr of attributes) {
					const attrObj = attr as any;
					const key = attrObj.key;
					const value = rawBody[key];

					// Skip system attributes
					if (key === '$id' || key.startsWith('$')) {
						continue;
					}

					// Skip if value is undefined or empty string for optional fields
					if (value === undefined || value === '') {
						if (!attrObj.required) {
							continue;
						}
					}

					// Convert based on attribute type
					switch (attrObj.type) {
						case 'boolean':
							// HTML checkbox sends 'on' or 'true' when checked, undefined when unchecked
							body[key] = value === 'on' || value === 'true' || value === true;
							break;
						case 'integer':
							body[key] = value ? parseInt(String(value), 10) : (attrObj.required ? 0 : undefined);
							break;
						case 'float':
							body[key] = value ? parseFloat(String(value)) : (attrObj.required ? 0 : undefined);
							break;
						case 'datetime':
							// HTML datetime-local returns format: "2024-01-15T10:30"
							// Convert to ISO 8601 format that Appwrite expects
							if (value) {
								const date = new Date(String(value));
								body[key] = date.toISOString();
							}
							break;
						default:
							// string, email, enum - use as is
							body[key] = value;
					}
				}

				// Create document in Appwrite
				const documentId = 'unique()';
				const response = await databases.createDocument(
					databaseId,
					collectionId,
					documentId,
					body,
				);

				// Generate success HTML and send response
				const html = generateSuccessHTML(successMessage, formTheme);
				res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
				res.end(html);

				// Return workflow data
				return {
					noWebhookResponse: true,
					workflowData: [
						[
							{
								json: {
									document: response,
									submittedData: body,
									rawFormData: rawBody,
									success: true,
								},
							},
						],
					],
				};
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Failed to create document';
				const html = generateErrorHTML(errorMessage, formTheme);
				res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
				res.end(html);

				// Return workflow data
				return {
					noWebhookResponse: true,
					workflowData: [
						[
							{
								json: {
									error: errorMessage,
									success: false,
								},
							},
						],
					],
				};
			}
		}

		// Unsupported method
		res.writeHead(405, { 'Content-Type': 'text/plain' });
		res.end('Method Not Allowed');

		return {
			noWebhookResponse: true,
		};
	}

}

function generateFormHTML(
	attributes: any[],
	title: string,
	description: string,
	submitText: string,
	theme: string,
	webhookUrl: string,
): string {
	const themeStyles = getThemeStyles(theme);

	let formFields = '';
	for (const attr of attributes) {
		if (attr.key === '$id' || attr.key.startsWith('$')) {
			continue; // Skip system attributes
		}

		const required = attr.required ? 'required' : '';
		const label = attr.key.charAt(0).toUpperCase() + attr.key.slice(1).replace(/([A-Z])/g, ' $1');

		switch (attr.type) {
			case 'string':
			case 'email':
				const inputType = attr.type === 'email' ? 'email' : 'text';
				const maxLength = attr.size ? `maxlength="${attr.size}"` : '';
				formFields += `
					<div class="form-group">
						<label for="${attr.key}">${label}${attr.required ? ' *' : ''}</label>
						<input type="${inputType}" id="${attr.key}" name="${attr.key}" ${required} ${maxLength} class="form-control" />
					</div>
				`;
				break;

			case 'integer':
			case 'float':
				const step = attr.type === 'float' ? '0.01' : '1';
				const min = attr.min !== null && attr.min !== undefined ? `min="${attr.min}"` : '';
				const max = attr.max !== null && attr.max !== undefined ? `max="${attr.max}"` : '';
				formFields += `
					<div class="form-group">
						<label for="${attr.key}">${label}${attr.required ? ' *' : ''}</label>
						<input type="number" id="${attr.key}" name="${attr.key}" step="${step}" ${min} ${max} ${required} class="form-control" />
					</div>
				`;
				break;

			case 'boolean':
				formFields += `
					<div class="form-group checkbox-group">
						<label>
							<input type="checkbox" id="${attr.key}" name="${attr.key}" value="true" />
							${label}
						</label>
					</div>
				`;
				break;

			case 'enum':
				const elements = attr.elements || [];
				let options = '<option value="">Select an option</option>';
				for (const element of elements) {
					options += `<option value="${element}">${element}</option>`;
				}
				formFields += `
					<div class="form-group">
						<label for="${attr.key}">${label}${attr.required ? ' *' : ''}</label>
						<select id="${attr.key}" name="${attr.key}" ${required} class="form-control">
							${options}
						</select>
					</div>
				`;
				break;

			case 'datetime':
				formFields += `
					<div class="form-group">
						<label for="${attr.key}">${label}${attr.required ? ' *' : ''}</label>
						<input type="datetime-local" id="${attr.key}" name="${attr.key}" ${required} class="form-control" />
					</div>
				`;
				break;

			default:
				formFields += `
					<div class="form-group">
						<label for="${attr.key}">${label}${attr.required ? ' *' : ''}</label>
						<input type="text" id="${attr.key}" name="${attr.key}" ${required} class="form-control" />
					</div>
				`;
		}
	}

	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${title}</title>
	<style>
		${themeStyles}
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
			background: var(--bg-color);
			color: var(--text-color);
			padding: 20px;
			min-height: 100vh;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.container {
			width: 100%;
			max-width: 600px;
			background: var(--container-bg);
			padding: 40px;
			border-radius: 12px;
			box-shadow: var(--shadow);
		}
		h1 {
			margin-bottom: 10px;
			color: var(--heading-color);
		}
		.description {
			margin-bottom: 30px;
			color: var(--description-color);
			font-size: 14px;
		}
		.form-group {
			margin-bottom: 20px;
		}
		label {
			display: block;
			margin-bottom: 6px;
			font-weight: 500;
			font-size: 14px;
		}
		.form-control {
			width: 100%;
			padding: 10px 12px;
			border: 1px solid var(--border-color);
			border-radius: 6px;
			font-size: 14px;
			background: var(--input-bg);
			color: var(--text-color);
			transition: border-color 0.2s;
		}
		.form-control:focus {
			outline: none;
			border-color: var(--primary-color);
		}
		select.form-control {
			cursor: pointer;
		}
		.checkbox-group label {
			display: flex;
			align-items: center;
			cursor: pointer;
		}
		.checkbox-group input[type="checkbox"] {
			margin-right: 8px;
			width: 18px;
			height: 18px;
			cursor: pointer;
		}
		.submit-btn {
			width: 100%;
			padding: 12px;
			background: var(--primary-color);
			color: white;
			border: none;
			border-radius: 6px;
			font-size: 16px;
			font-weight: 600;
			cursor: pointer;
			transition: background 0.2s;
		}
		.submit-btn:hover {
			background: var(--primary-hover);
		}
		.submit-btn:active {
			transform: scale(0.98);
		}
		.required-note {
			margin-top: 20px;
			font-size: 12px;
			color: var(--description-color);
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>${title}</h1>
		<p class="description">${description}</p>
		<form method="POST" action="${webhookUrl}">
			${formFields}
			<button type="submit" class="submit-btn">${submitText}</button>
		</form>
		<p class="required-note">* Required fields</p>
	</div>
</body>
</html>`;
}

function generateSuccessHTML(message: string, theme: string): string {
	const themeStyles = getThemeStyles(theme);

	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Success</title>
	<style>
		${themeStyles}
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
			background: var(--bg-color);
			color: var(--text-color);
			padding: 20px;
			min-height: 100vh;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.container {
			text-align: center;
			max-width: 500px;
			background: var(--container-bg);
			padding: 60px 40px;
			border-radius: 12px;
			box-shadow: var(--shadow);
		}
		.success-icon {
			width: 80px;
			height: 80px;
			margin: 0 auto 20px;
			background: #22c55e;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;
			font-size: 40px;
		}
		h1 {
			margin-bottom: 10px;
			color: var(--heading-color);
		}
		p {
			color: var(--description-color);
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="success-icon">✓</div>
		<h1>Success!</h1>
		<p>${message}</p>
	</div>
</body>
</html>`;
}

function generateErrorHTML(message: string, theme: string): string {
	const themeStyles = getThemeStyles(theme);

	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Error</title>
	<style>
		${themeStyles}
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
			background: var(--bg-color);
			color: var(--text-color);
			padding: 20px;
			min-height: 100vh;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.container {
			text-align: center;
			max-width: 500px;
			background: var(--container-bg);
			padding: 60px 40px;
			border-radius: 12px;
			box-shadow: var(--shadow);
		}
		.error-icon {
			width: 80px;
			height: 80px;
			margin: 0 auto 20px;
			background: #ef4444;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;
			font-size: 40px;
		}
		h1 {
			margin-bottom: 10px;
			color: var(--heading-color);
		}
		p {
			color: var(--description-color);
		}
		.back-btn {
			margin-top: 20px;
			padding: 10px 20px;
			background: var(--primary-color);
			color: white;
			border: none;
			border-radius: 6px;
			cursor: pointer;
			text-decoration: none;
			display: inline-block;
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="error-icon">✕</div>
		<h1>Error</h1>
		<p>${message}</p>
		<a href="javascript:history.back()" class="back-btn">Go Back</a>
	</div>
</body>
</html>`;
}

function getThemeStyles(theme: string): string {
	switch (theme) {
		case 'dark':
			return `
				:root {
					--bg-color: #0f172a;
					--container-bg: #1e293b;
					--text-color: #f1f5f9;
					--heading-color: #ffffff;
					--description-color: #cbd5e1;
					--border-color: #334155;
					--input-bg: #0f172a;
					--primary-color: #3b82f6;
					--primary-hover: #2563eb;
					--shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
				}
			`;
		case 'minimal':
			return `
				:root {
					--bg-color: #ffffff;
					--container-bg: #ffffff;
					--text-color: #000000;
					--heading-color: #000000;
					--description-color: #666666;
					--border-color: #e5e5e5;
					--input-bg: #ffffff;
					--primary-color: #000000;
					--primary-hover: #333333;
					--shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
				}
			`;
		default: // light
			return `
				:root {
					--bg-color: #f8fafc;
					--container-bg: #ffffff;
					--text-color: #1e293b;
					--heading-color: #0f172a;
					--description-color: #64748b;
					--border-color: #e2e8f0;
					--input-bg: #ffffff;
					--primary-color: #3b82f6;
					--primary-hover: #2563eb;
					--shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
				}
			`;
	}
}
