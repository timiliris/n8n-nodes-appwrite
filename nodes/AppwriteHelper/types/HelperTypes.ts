/**
 * Type definitions for AppwriteHelper operations
 */

export interface PermissionItem {
	type: 'read' | 'write' | 'create' | 'update' | 'delete';
	role: 'any' | 'guests' | 'users' | 'user' | 'team' | 'member' | 'label' | string;
	id?: string;
}

export interface PermissionsList {
	permissions: PermissionItem[];
}

export interface QueryItem {
	queryType: 'equal' | 'notEqual' | 'lessThan' | 'lessThanEqual' | 'greaterThan' | 'greaterThanEqual' |
		'search' | 'isNull' | 'isNotNull' | 'between' | 'startsWith' | 'endsWith' | 'select' |
		'orderDesc' | 'orderAsc' | 'limit' | 'offset';
	attribute?: string;
	value?: string;
	values?: string;
	startValue?: string;
	endValue?: string;
	limitValue?: number;
	offsetValue?: number;
}

export interface QueriesList {
	queries: QueryItem[];
}

export interface SchemaAttribute {
	type: string;
	key?: string;
	required?: boolean;
	array?: boolean;
	size?: number;
	default?: unknown;
	[key: string]: unknown;
}

export interface SchemaAttributesList {
	attributes: SchemaAttribute[];
}
