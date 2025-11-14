import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { safeJsonParse, escapeQueryValue } from '../../Appwrite/utils/validators';
import type {
	PermissionsList,
	QueriesList,
	SchemaAttribute,
	SchemaAttributesList,
} from '../types/HelperTypes';

/**
 * Executes helper operations for building Appwrite queries, permissions, and schemas
 * @param this - n8n execution context
 * @param operation - Operation to perform (buildPermissions, buildQuery, buildSchema)
 * @param i - Current item index
 * @returns Execution data with formatted permissions/queries/schema
 * @throws Error if operation is unknown or JSON parsing fails
 */
export async function executeHelperOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {
	if (operation === 'buildPermissions') {
		const permissionsList = this.getNodeParameter('permissionsList', i, {}) as PermissionsList;
		const permissions = permissionsList.permissions || [];

		const result: string[] = [];

		for (const perm of permissions) {
			const { type, role, id } = perm;

			let permString: string;
			if (role === 'any' || role === 'guests' || role === 'users') {
				permString = `${type}("${role}")`;
			} else if (role === 'user') {
				permString = `${type}("user:${id}")`;
			} else if (role === 'team') {
				permString = `${type}("team:${id}")`;
			} else if (role === 'member') {
				permString = `${type}("member:${id}")`;
			} else if (role === 'label') {
				permString = `${type}("label:${id}")`;
			} else {
				permString = `${type}("${role}")`;
			}

			result.push(permString);
		}

		return {
			json: {
				permissions: result,
				count: result.length,
			},
		};
	} else if (operation === 'buildQuery') {
		const queriesList = this.getNodeParameter('queriesList', i, {}) as QueriesList;
		const queries = queriesList.queries || [];

		const result: string[] = [];

		for (const query of queries) {
			const { queryType, attribute = '', value = '', values = '', startValue = '', endValue = '', limitValue = 25, offsetValue = 0 } = query;

			let queryString: string;

			switch (queryType) {
				case 'equal':
					queryString = `Query.equal("${escapeQueryValue(attribute)}", "${escapeQueryValue(value)}")`;
					break;
				case 'notEqual':
					queryString = `Query.notEqual("${escapeQueryValue(attribute)}", "${escapeQueryValue(value)}")`;
					break;
				case 'lessThan':
					queryString = `Query.lessThan("${escapeQueryValue(attribute)}", "${escapeQueryValue(value)}")`;
					break;
				case 'lessThanEqual':
					queryString = `Query.lessThanEqual("${escapeQueryValue(attribute)}", "${escapeQueryValue(value)}")`;
					break;
				case 'greaterThan':
					queryString = `Query.greaterThan("${escapeQueryValue(attribute)}", "${escapeQueryValue(value)}")`;
					break;
				case 'greaterThanEqual':
					queryString = `Query.greaterThanEqual("${escapeQueryValue(attribute)}", "${escapeQueryValue(value)}")`;
					break;
				case 'search':
					queryString = `Query.search("${escapeQueryValue(attribute)}", "${escapeQueryValue(value)}")`;
					break;
				case 'isNull':
					queryString = `Query.isNull("${escapeQueryValue(attribute)}")`;
					break;
				case 'isNotNull':
					queryString = `Query.isNotNull("${escapeQueryValue(attribute)}")`;
					break;
				case 'between':
					queryString = `Query.between("${escapeQueryValue(attribute)}", "${escapeQueryValue(startValue)}", "${escapeQueryValue(endValue)}")`;
					break;
				case 'startsWith':
					queryString = `Query.startsWith("${escapeQueryValue(attribute)}", "${escapeQueryValue(value)}")`;
					break;
				case 'endsWith':
					queryString = `Query.endsWith("${escapeQueryValue(attribute)}", "${escapeQueryValue(value)}")`;
					break;
				case 'select': {
					const selectAttrs = values.split(',').map((v: string) => `"${escapeQueryValue(v.trim())}"`).join(', ');
					queryString = `Query.select([${selectAttrs}])`;
					break;
				}
				case 'orderDesc':
					queryString = `Query.orderDesc("${escapeQueryValue(attribute)}")`;
					break;
				case 'orderAsc':
					queryString = `Query.orderAsc("${escapeQueryValue(attribute)}")`;
					break;
				case 'limit':
					queryString = `Query.limit(${limitValue})`;
					break;
				case 'offset':
					queryString = `Query.offset(${offsetValue})`;
					break;
				default:
					throw new Error(`Unknown query type: ${queryType}`);
			}

			result.push(queryString);
		}

		return {
			json: {
				queries: result,
				count: result.length,
				formatted: `[\n  ${result.join(',\n  ')}\n]`,
			},
		};
	} else if (operation === 'buildSchema') {
		const inputMode = this.getNodeParameter('schemaInputMode', i, 'form') as string;
		let attributes: SchemaAttribute[];

		if (inputMode === 'form') {
			const schemaAttributesList = this.getNodeParameter('schemaAttributesList', i, {}) as SchemaAttributesList;
			attributes = schemaAttributesList.attributes || [];
		} else {
			const schemaInputJson = this.getNodeParameter('schemaInputJson', i) as string;
			const parseResult = safeJsonParse<SchemaAttribute[]>(schemaInputJson, 'schemaInputJson');
			if (!parseResult.success) {
				throw new Error(parseResult.error);
			}
			attributes = parseResult.data;
		}

		const schema = {
			attributes: attributes,
			summary: {
				totalAttributes: attributes.length,
				types: {} as Record<string, number>,
				required: 0,
				optional: 0,
			},
		};

		// Generate summary
		for (const attr of attributes) {
			const type = attr.type || 'unknown';
			schema.summary.types[type] = (schema.summary.types[type] || 0) + 1;
			if (attr.required) {
				schema.summary.required++;
			} else {
				schema.summary.optional++;
			}
		}

		return {
			json: schema,
		};
	}

	throw new Error(`Unknown helper operation: ${operation}`);
}
