import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export async function executeHelperOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {
	if (operation === 'buildPermissions') {
		const permissionsList = this.getNodeParameter('permissionsList', i, {}) as any;
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
		const queriesList = this.getNodeParameter('queriesList', i, {}) as any;
		const queries = queriesList.queries || [];

		const result: string[] = [];

		for (const query of queries) {
			const { queryType, attribute, value, values, startValue, endValue, limitValue, offsetValue } = query;

			let queryString: string;

			switch (queryType) {
				case 'equal':
					queryString = `Query.equal("${attribute}", "${value}")`;
					break;
				case 'notEqual':
					queryString = `Query.notEqual("${attribute}", "${value}")`;
					break;
				case 'lessThan':
					queryString = `Query.lessThan("${attribute}", "${value}")`;
					break;
				case 'lessThanEqual':
					queryString = `Query.lessThanEqual("${attribute}", "${value}")`;
					break;
				case 'greaterThan':
					queryString = `Query.greaterThan("${attribute}", "${value}")`;
					break;
				case 'greaterThanEqual':
					queryString = `Query.greaterThanEqual("${attribute}", "${value}")`;
					break;
				case 'search':
					queryString = `Query.search("${attribute}", "${value}")`;
					break;
				case 'isNull':
					queryString = `Query.isNull("${attribute}")`;
					break;
				case 'isNotNull':
					queryString = `Query.isNotNull("${attribute}")`;
					break;
				case 'between':
					queryString = `Query.between("${attribute}", "${startValue}", "${endValue}")`;
					break;
				case 'startsWith':
					queryString = `Query.startsWith("${attribute}", "${value}")`;
					break;
				case 'endsWith':
					queryString = `Query.endsWith("${attribute}", "${value}")`;
					break;
				case 'select':
					const selectAttrs = values.split(',').map((v: string) => `"${v.trim()}"`).join(', ');
					queryString = `Query.select([${selectAttrs}])`;
					break;
				case 'orderDesc':
					queryString = `Query.orderDesc("${attribute}")`;
					break;
				case 'orderAsc':
					queryString = `Query.orderAsc("${attribute}")`;
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
		let attributes: any[];

		if (inputMode === 'form') {
			const schemaAttributesList = this.getNodeParameter('schemaAttributesList', i, {}) as any;
			attributes = schemaAttributesList.attributes || [];
		} else {
			const schemaInputJson = this.getNodeParameter('schemaInputJson', i) as string;
			attributes = typeof schemaInputJson === 'string' ? JSON.parse(schemaInputJson) : schemaInputJson;
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
