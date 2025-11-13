import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Databases } from 'node-appwrite';

export async function executeAttributeOperation(
	this: IExecuteFunctions,
	databases: Databases,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {
	const databaseId = this.getNodeParameter('databaseId', i) as string;
	const collectionId = this.getNodeParameter('collectionId', i) as string;

	if (operation === 'createMultiple') {
		const inputMode = this.getNodeParameter('inputMode', i, 'form') as string;
		let attributes: any[];

		if (inputMode === 'form') {
			const attributesList = this.getNodeParameter('attributesList', i, {}) as any;
			attributes = attributesList.attributes || [];
		} else {
			const attributesJson = this.getNodeParameter('attributesJson', i) as string;
			attributes = typeof attributesJson === 'string' ? JSON.parse(attributesJson) : attributesJson;
		}

		const results = [];

		for (const attr of attributes) {
			const { type, key, size, required = false, defaultValue, array = false, elements, min, max } = attr;

			let response;
			if (type === 'string') {
				response = await databases.createStringAttribute(
					databaseId,
					collectionId,
					key,
					size || 255,
					required,
					defaultValue || undefined,
					array,
				);
			} else if (type === 'integer') {
				response = await databases.createIntegerAttribute(
					databaseId,
					collectionId,
					key,
					required,
					min,
					max,
					defaultValue !== undefined ? defaultValue : undefined,
					array,
				);
			} else if (type === 'boolean') {
				response = await databases.createBooleanAttribute(
					databaseId,
					collectionId,
					key,
					required,
					defaultValue !== undefined ? defaultValue : undefined,
					array,
				);
			} else if (type === 'email') {
				response = await databases.createEmailAttribute(
					databaseId,
					collectionId,
					key,
					required,
					defaultValue || undefined,
					array,
				);
			} else if (type === 'enum') {
				const elementsArray = typeof elements === 'string' ? elements.split(',').map((e: string) => e.trim()) : elements;
				response = await databases.createEnumAttribute(
					databaseId,
					collectionId,
					key,
					elementsArray,
					required,
					defaultValue || undefined,
					array,
				);
			} else if (type === 'float') {
				response = await databases.createFloatAttribute(
					databaseId,
					collectionId,
					key,
					required,
					min,
					max,
					defaultValue !== undefined ? defaultValue : undefined,
					array,
				);
			} else if (type === 'datetime') {
				response = await databases.createDatetimeAttribute(
					databaseId,
					collectionId,
					key,
					required,
					defaultValue || undefined,
					array,
				);
			}

			results.push(response);
		}

		return { json: { success: true, created: results.length, attributes: results } };
	}

	const key = this.getNodeParameter('key', i) as string;

	if (operation === 'createString') {
		const size = this.getNodeParameter('size', i, 255) as number;
		const required = this.getNodeParameter('required', i, false) as boolean;
		const defaultValue = this.getNodeParameter('defaultValue', i, null) as string | null;
		const array = this.getNodeParameter('array', i, false) as boolean;

		const response = await databases.createStringAttribute(
			databaseId,
			collectionId,
			key,
			size,
			required,
			defaultValue || undefined,
			array,
		);
		return { json: response };
	} else if (operation === 'createInteger') {
		const required = this.getNodeParameter('required', i, false) as boolean;
		const min = this.getNodeParameter('min', i, undefined) as number | undefined;
		const max = this.getNodeParameter('max', i, undefined) as number | undefined;
		const defaultValue = this.getNodeParameter('defaultValue', i, null) as number | null;
		const array = this.getNodeParameter('array', i, false) as boolean;

		const response = await databases.createIntegerAttribute(
			databaseId,
			collectionId,
			key,
			required,
			min,
			max,
			defaultValue !== null ? defaultValue : undefined,
			array,
		);
		return { json: response };
	} else if (operation === 'createBoolean') {
		const required = this.getNodeParameter('required', i, false) as boolean;
		const defaultValue = this.getNodeParameter('defaultValue', i, null) as boolean | null;
		const array = this.getNodeParameter('array', i, false) as boolean;

		const response = await databases.createBooleanAttribute(
			databaseId,
			collectionId,
			key,
			required,
			defaultValue !== null ? defaultValue : undefined,
			array,
		);
		return { json: response };
	} else if (operation === 'createEmail') {
		const required = this.getNodeParameter('required', i, false) as boolean;
		const defaultValue = this.getNodeParameter('defaultValue', i, null) as string | null;
		const array = this.getNodeParameter('array', i, false) as boolean;

		const response = await databases.createEmailAttribute(
			databaseId,
			collectionId,
			key,
			required,
			defaultValue || undefined,
			array,
		);
		return { json: response };
	} else if (operation === 'createEnum') {
		const elements = this.getNodeParameter('elements', i) as string;
		const elementsArray = elements.split(',').map((e) => e.trim());
		const required = this.getNodeParameter('required', i, false) as boolean;
		const defaultValue = this.getNodeParameter('defaultValue', i, null) as string | null;
		const array = this.getNodeParameter('array', i, false) as boolean;

		const response = await databases.createEnumAttribute(
			databaseId,
			collectionId,
			key,
			elementsArray,
			required,
			defaultValue || undefined,
			array,
		);
		return { json: response };
	} else if (operation === 'createFloat') {
		const required = this.getNodeParameter('required', i, false) as boolean;
		const min = this.getNodeParameter('min', i, undefined) as number | undefined;
		const max = this.getNodeParameter('max', i, undefined) as number | undefined;
		const defaultValue = this.getNodeParameter('defaultValue', i, null) as number | null;
		const array = this.getNodeParameter('array', i, false) as boolean;

		const response = await databases.createFloatAttribute(
			databaseId,
			collectionId,
			key,
			required,
			min,
			max,
			defaultValue !== null ? defaultValue : undefined,
			array,
		);
		return { json: response };
	} else if (operation === 'createDateTime') {
		const required = this.getNodeParameter('required', i, false) as boolean;
		const defaultValue = this.getNodeParameter('defaultValue', i, null) as string | null;
		const array = this.getNodeParameter('array', i, false) as boolean;

		const response = await databases.createDatetimeAttribute(
			databaseId,
			collectionId,
			key,
			required,
			defaultValue || undefined,
			array,
		);
		return { json: response };
	} else if (operation === 'delete') {
		await databases.deleteAttribute(databaseId, collectionId, key);
		return { json: { success: true, key } };
	}

	throw new Error(`Unknown attribute operation: ${operation}`);
}
