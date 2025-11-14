import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { safeJsonParse, escapeQueryValue, validateQuery, formatQueryPreview } from '../../Appwrite/utils/validators';
import type {
	PermissionsList,
	QueriesList,
	QueryItem,
	SchemaAttribute,
	SchemaAttributesList,
} from '../types/HelperTypes';

/**
 * Returns a pre-built query template
 * @param templateName - Name of the template
 * @returns Array of query items
 */
function getQueryTemplate(templateName: string): QueryItem[] {
	switch (templateName) {
		case 'activeUsers':
			return [
				{
					queryType: 'equal',
					attribute: 'status',
					value: 'active',
				},
			];
		case 'recentDocuments':
			return [
				{
					queryType: 'orderDesc',
					attribute: '$createdAt',
				},
				{
					queryType: 'limit',
					limitValue: 25,
				},
			];
		case 'searchName':
			return [
				{
					queryType: 'search',
					attribute: 'name',
					value: '',
				},
			];
		case 'dateRange':
			return [
				{
					queryType: 'between',
					attribute: '$createdAt',
					startValue: '',
					endValue: '',
				},
			];
		case 'paginatedResults':
			return [
				{
					queryType: 'limit',
					limitValue: 25,
				},
				{
					queryType: 'offset',
					offsetValue: 0,
				},
			];
		default:
			return [];
	}
}

/**
 * Builds permission presets
 * @param presetName - Name of the preset
 * @returns Array of permission strings
 */
function buildPermissionPreset(presetName: string): string[] {
	switch (presetName) {
		case 'publicRead':
			return ['read("any")'];
		case 'publicReadUserWrite':
			return ['read("any")', 'write("users")'];
		case 'private':
			return ['read("users")', 'write("users")'];
		case 'userOwned':
			return ['read("users")', 'create("users")', 'update("users")', 'delete("users")'];
		case 'teamCollaborative':
			return ['read("users")', 'create("users")', 'update("users")', 'delete("users")'];
		case 'adminOnly':
			return ['read("label:admin")', 'write("label:admin")'];
		case 'publicReadAdminWrite':
			return ['read("any")', 'write("label:admin")'];
		case 'guestsRead':
			return ['read("guests")'];
		default:
			return [];
	}
}

/**
 * Detects permission conflicts
 * @param permissions - Array of permission strings
 * @returns Conflict detection result
 */
function detectPermissionConflicts(permissions: string[]): {
	conflicts: Array<{ permission: string; reason: string }>;
	optimized: string[];
	stats: { original: number; optimized: number; reduction: number };
} {
	const conflicts: Array<{ permission: string; reason: string }> = [];
	const optimized = new Set<string>();

	// Parse permissions
	const parsed = permissions.map((perm) => {
		const match = perm.match(/^(\w+)\("(.+)"\)$/);
		if (!match) return null;
		return { full: perm, action: match[1], role: match[2] };
	}).filter((p) => p !== null);

	// Check for conflicts
	const hasAnyRead = parsed.some((p) => p!.action === 'read' && p!.role === 'any');
	const hasAnyWrite = parsed.some((p) => p!.action === 'write' && p!.role === 'any');

	for (const perm of parsed) {
		if (!perm) continue;

		let isRedundant = false;

		// Check if read("guests") is redundant when read("any") exists
		if (perm.action === 'read' && perm.role === 'guests' && hasAnyRead) {
			conflicts.push({
				permission: perm.full,
				reason: 'Redundant: read("any") already grants access to guests',
			});
			isRedundant = true;
		}

		// Check if read("users") is redundant when read("any") exists
		if (perm.action === 'read' && perm.role === 'users' && hasAnyRead) {
			conflicts.push({
				permission: perm.full,
				reason: 'Redundant: read("any") already grants access to authenticated users',
			});
			isRedundant = true;
		}

		// Check if write("guests") is redundant when write("any") exists
		if (perm.action === 'write' && perm.role === 'guests' && hasAnyWrite) {
			conflicts.push({
				permission: perm.full,
				reason: 'Redundant: write("any") already grants write access to guests',
			});
			isRedundant = true;
		}

		// Check if write("users") is redundant when write("any") exists
		if (perm.action === 'write' && perm.role === 'users' && hasAnyWrite) {
			conflicts.push({
				permission: perm.full,
				reason: 'Redundant: write("any") already grants write access to authenticated users',
			});
			isRedundant = true;
		}

		// Add to optimized set if not redundant
		if (!isRedundant) {
			optimized.add(perm.full);
		}
	}

	const optimizedArray = Array.from(optimized);
	const reduction = permissions.length - optimizedArray.length;

	return {
		conflicts,
		optimized: optimizedArray,
		stats: {
			original: permissions.length,
			optimized: optimizedArray.length,
			reduction,
		},
	};
}

/**
 * Generates ID based on format
 * @param format - ID format type
 * @param options - Format-specific options
 * @returns Generated ID
 */
function generateId(format: string, options: { length?: number; text?: string; pattern?: string }): string {
	switch (format) {
		case 'uuid': {
			// Generate UUID v4
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
				const r = (Math.random() * 16) | 0;
				const v = c === 'x' ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			});
		}
		case 'nanoid': {
			// Generate nanoid-style ID (URL-friendly)
			const length = options.length || 21;
			const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
			let id = '';
			for (let i = 0; i < length; i++) {
				id += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return id;
		}
		case 'timestamp': {
			// Generate timestamp-based ID
			return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		}
		case 'slug': {
			// Generate slug from text
			const text = options.text || '';
			return text
				.toLowerCase()
				.trim()
				.replace(/[^\w\s-]/g, '')
				.replace(/[\s_-]+/g, '-')
				.replace(/^-+|-+$/g, '');
		}
		case 'custom': {
			// Generate from custom pattern
			const pattern = options.pattern || 'ID-XXXX';
			return pattern.replace(/X/g, () => Math.floor(Math.random() * 10).toString());
		}
		case 'shortid': {
			// Generate short alphanumeric ID
			const length = options.length || 8;
			const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
			let id = '';
			for (let i = 0; i < length; i++) {
				id += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return id;
		}
		default:
			return 'unique()';
	}
}

/**
 * Validates ID against pattern
 * @param id - ID to validate
 * @param pattern - Validation pattern
 * @returns Validation result
 */
function validateId(id: string, pattern: string): { valid: boolean; errors: string[] } {
	const errors: string[] = [];

	if (!id) {
		errors.push('ID is required');
		return { valid: false, errors };
	}

	switch (pattern) {
		case 'uuid':
			if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
				errors.push('Invalid UUID v4 format');
			}
			break;
		case 'nanoid':
			if (!/^[A-Za-z0-9_-]+$/.test(id)) {
				errors.push('Invalid Nanoid format (must contain only A-Z, a-z, 0-9, _, -)');
			}
			break;
		case 'slug':
			if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
				errors.push('Invalid slug format (must be lowercase alphanumeric with hyphens)');
			}
			break;
		case 'alphanumeric':
			if (!/^[A-Za-z0-9]+$/.test(id)) {
				errors.push('ID must contain only alphanumeric characters');
			}
			break;
		case 'numeric':
			if (!/^\d+$/.test(id)) {
				errors.push('ID must contain only numeric characters');
			}
			break;
		default:
			// No specific validation
			break;
	}

	// Check Appwrite ID constraints
	if (id.length > 36) {
		errors.push('ID must be 36 characters or less (Appwrite limit)');
	}

	if (!/^[a-zA-Z0-9._-]+$/.test(id)) {
		errors.push('ID can only contain letters, numbers, dots, hyphens, and underscores');
	}

	return { valid: errors.length === 0, errors };
}

/**
 * Formats date/time to various formats
 * @param date - Input date (Date object, timestamp, or ISO string)
 * @param format - Output format
 * @returns Formatted date string
 */
function formatDateTime(
	date: Date | number | string,
	format: string,
): string {
	let dateObj: Date;

	// Parse input
	if (date instanceof Date) {
		dateObj = date;
	} else if (typeof date === 'number') {
		dateObj = new Date(date);
	} else if (typeof date === 'string') {
		dateObj = new Date(date);
	} else {
		throw new Error('Invalid date input');
	}

	if (isNaN(dateObj.getTime())) {
		throw new Error('Invalid date value');
	}

	switch (format) {
		case 'iso8601':
			return dateObj.toISOString();
		case 'timestamp':
			return dateObj.getTime().toString();
		case 'date':
			return dateObj.toISOString().split('T')[0];
		case 'time':
			return dateObj.toISOString().split('T')[1].split('.')[0];
		case 'datetime':
			return dateObj.toISOString().replace('T', ' ').split('.')[0];
		case 'relative': {
			const now = new Date();
			const diffMs = now.getTime() - dateObj.getTime();
			const diffSec = Math.floor(diffMs / 1000);
			const diffMin = Math.floor(diffSec / 60);
			const diffHour = Math.floor(diffMin / 60);
			const diffDay = Math.floor(diffHour / 24);

			if (diffSec < 60) return `${diffSec} seconds ago`;
			if (diffMin < 60) return `${diffMin} minutes ago`;
			if (diffHour < 24) return `${diffHour} hours ago`;
			if (diffDay < 30) return `${diffDay} days ago`;
			return dateObj.toISOString().split('T')[0];
		}
		case 'unix':
			return Math.floor(dateObj.getTime() / 1000).toString();
		default:
			return dateObj.toISOString();
	}
}

/**
 * Converts CSV to documents
 * @param csv - CSV string
 * @param options - Conversion options
 * @returns Array of documents
 */
function csvToDocuments(
	csv: string,
	options: {
		autoDetectTypes?: boolean;
		fieldMapping?: Record<string, string>;
		generateIds?: boolean;
		idField?: string;
		delimiter?: string;
	},
): Array<{ documentId: string; data: Record<string, any> }> {
	const lines = csv.trim().split('\n');
	if (lines.length < 2) {
		throw new Error('CSV must have at least a header row and one data row');
	}

	const delimiter = options.delimiter || ',';
	const headers = lines[0].split(delimiter).map((h) => h.trim());
	const documents: Array<{ documentId: string; data: Record<string, any> }> = [];

	// Apply field mapping if provided
	const mappedHeaders = headers.map((h) => options.fieldMapping?.[h] || h);

	for (let i = 1; i < lines.length; i++) {
		const values = lines[i].split(delimiter).map((v) => v.trim());
		const data: Record<string, any> = {};

		for (let j = 0; j < headers.length; j++) {
			const key = mappedHeaders[j];
			let value: any = values[j];

			// Auto-detect types
			if (options.autoDetectTypes) {
				// Try boolean
				if (value === 'true') value = true;
				else if (value === 'false') value = false;
				// Try number
				else if (value !== '' && !isNaN(Number(value))) value = Number(value);
				// Try date (ISO format)
				else if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
					const date = new Date(value);
					if (!isNaN(date.getTime())) value = date.toISOString();
				}
			}

			data[key] = value;
		}

		// Generate or extract document ID
		let documentId: string;
		if (options.generateIds) {
			documentId = generateId('nanoid', { length: 20 });
		} else if (options.idField && data[options.idField]) {
			documentId = String(data[options.idField]);
			delete data[options.idField]; // Remove ID field from data
		} else {
			documentId = generateId('nanoid', { length: 20 });
		}

		documents.push({ documentId, data });
	}

	return documents;
}

/**
 * Extracts file metadata
 * @param file - File object or binary data
 * @param fileName - File name
 * @returns File metadata
 */
function extractFileMetadata(
	file: Buffer | any,
	fileName: string,
): {
	mimeType: string;
	size: number;
	sizeFormatted: string;
	extension: string;
	isImage: boolean;
	isVideo: boolean;
	isAudio: boolean;
	isDocument: boolean;
} {
	// Get file extension
	const extension = fileName.split('.').pop()?.toLowerCase() || '';

	// Detect MIME type based on extension
	const mimeTypes: Record<string, string> = {
		// Images
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		png: 'image/png',
		gif: 'image/gif',
		webp: 'image/webp',
		svg: 'image/svg+xml',
		bmp: 'image/bmp',
		// Videos
		mp4: 'video/mp4',
		webm: 'video/webm',
		ogg: 'video/ogg',
		mov: 'video/quicktime',
		avi: 'video/x-msvideo',
		// Audio
		mp3: 'audio/mpeg',
		wav: 'audio/wav',
		m4a: 'audio/mp4',
		flac: 'audio/flac',
		// Documents
		pdf: 'application/pdf',
		doc: 'application/msword',
		docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		xls: 'application/vnd.ms-excel',
		xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		ppt: 'application/vnd.ms-powerpoint',
		pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
		txt: 'text/plain',
		csv: 'text/csv',
		json: 'application/json',
		xml: 'application/xml',
		// Archives
		zip: 'application/zip',
		tar: 'application/x-tar',
		gz: 'application/gzip',
		rar: 'application/x-rar-compressed',
	};

	const mimeType = mimeTypes[extension] || 'application/octet-stream';

	// Get file size
	const size = Buffer.isBuffer(file) ? file.length : 0;
	const sizeFormatted = formatFileSize(size);

	// Determine file category
	const isImage = mimeType.startsWith('image/');
	const isVideo = mimeType.startsWith('video/');
	const isAudio = mimeType.startsWith('audio/');
	const isDocument = [
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'text/plain',
		'text/csv',
	].includes(mimeType);

	return {
		mimeType,
		size,
		sizeFormatted,
		extension,
		isImage,
		isVideo,
		isAudio,
		isDocument,
	};
}

/**
 * Formats file size to human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted size string
 */
function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

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
		const queryTemplate = this.getNodeParameter('queryTemplate', i, 'custom') as string;
		let queries: QueryItem[] = [];

		// Handle pre-built templates
		if (queryTemplate !== 'custom') {
			const baseQueries = getQueryTemplate(queryTemplate);

			// Customize templates with user input
			queries = baseQueries.map((query) => {
				const customQuery = { ...query };

				// Customize based on template type
				if (queryTemplate === 'searchName' && query.queryType === 'search') {
					const searchTerm = this.getNodeParameter('templateSearchTerm', i, '') as string;
					customQuery.value = searchTerm;
				} else if (queryTemplate === 'dateRange' && query.queryType === 'between') {
					const startDate = this.getNodeParameter('templateStartDate', i, '') as string;
					const endDate = this.getNodeParameter('templateEndDate', i, '') as string;
					customQuery.startValue = startDate;
					customQuery.endValue = endDate;
				} else if ((queryTemplate === 'paginatedResults' || queryTemplate === 'recentDocuments') && query.queryType === 'limit') {
					const pageSize = this.getNodeParameter('templatePageSize', i, 25) as number;
					customQuery.limitValue = pageSize;
				} else if (queryTemplate === 'paginatedResults' && query.queryType === 'offset') {
					const pageNumber = this.getNodeParameter('templatePageNumber', i, 1) as number;
					const pageSize = this.getNodeParameter('templatePageSize', i, 25) as number;
					customQuery.offsetValue = (pageNumber - 1) * pageSize;
				}

				return customQuery;
			});
		} else {
			const queriesList = this.getNodeParameter('queriesList', i, {}) as QueriesList;
			queries = queriesList.queries || [];
		}

		const result: string[] = [];
		const validationErrors: string[] = [];

		for (let idx = 0; idx < queries.length; idx++) {
			const query = queries[idx];
			const { queryType, attribute = '', value = '', values = '', startValue = '', endValue = '', limitValue = 25, offsetValue = 0 } = query;

			// Validate query before building
			const validation = validateQuery({
				queryType,
				attribute,
				value,
				values,
				startValue,
				endValue,
				limitValue,
				offsetValue,
			});

			if (!validation.valid) {
				validationErrors.push(`Query ${idx + 1} (${queryType}): ${validation.error}`);
				continue;
			}

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
					throw new NodeOperationError(this.getNode(), `Unknown query type: ${queryType}`);
			}

			result.push(queryString);
		}

		// If there are validation errors, include them in the output
		if (validationErrors.length > 0) {
			throw new NodeOperationError(
				this.getNode(),
				`Query validation failed:\n${validationErrors.join('\n')}`,
			);
		}

		return {
			json: {
				queries: result,
				count: result.length,
				formatted: formatQueryPreview(result),
				preview: formatQueryPreview(result),
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
	} else if (operation === 'permissionPreset') {
		const presetName = this.getNodeParameter('presetName', i) as string;
		const permissions = buildPermissionPreset(presetName);

		return {
			json: {
				preset: presetName,
				permissions,
				count: permissions.length,
			},
		};
	} else if (operation === 'detectConflicts') {
		const permissionsInput = this.getNodeParameter('permissionsInput', i) as string;
		const permissions = safeJsonParse<string[]>(permissionsInput, 'permissionsInput');

		if (!permissions.success) {
			throw new Error(permissions.error);
		}

		const result = detectPermissionConflicts(permissions.data);

		return {
			json: {
				...result,
				hasConflicts: result.conflicts.length > 0,
			},
		};
	} else if (operation === 'generateId') {
		const format = this.getNodeParameter('idFormat', i) as string;
		const length = this.getNodeParameter('idLength', i, 21) as number;
		const text = this.getNodeParameter('idText', i, '') as string;
		const pattern = this.getNodeParameter('idPattern', i, 'ID-XXXX') as string;

		const id = generateId(format, { length, text, pattern });

		return {
			json: {
				id,
				format,
			},
		};
	} else if (operation === 'validateId') {
		const id = this.getNodeParameter('idToValidate', i) as string;
		const pattern = this.getNodeParameter('validationPattern', i, 'none') as string;

		const result = validateId(id, pattern);

		return {
			json: {
				id,
				...result,
			},
		};
	} else if (operation === 'formatDateTime') {
		const dateInput = this.getNodeParameter('dateInput', i) as string;
		const format = this.getNodeParameter('dateFormat', i) as string;

		// Parse date input
		let dateValue: Date | number | string = dateInput;
		if (!isNaN(Number(dateInput))) {
			dateValue = Number(dateInput);
		}

		const formatted = formatDateTime(dateValue, format);

		return {
			json: {
				input: dateInput,
				format,
				output: formatted,
			},
		};
	} else if (operation === 'csvToDocuments') {
		const csvInput = this.getNodeParameter('csvInput', i) as string;
		const autoDetectTypes = this.getNodeParameter('autoDetectTypes', i, true) as boolean;
		const generateIds = this.getNodeParameter('generateIds', i, true) as boolean;
		const idField = this.getNodeParameter('idField', i, '') as string;
		const delimiter = this.getNodeParameter('delimiter', i, ',') as string;
		const fieldMappingJson = this.getNodeParameter('fieldMapping', i, '{}') as string;

		// Parse field mapping
		const fieldMappingResult = safeJsonParse<Record<string, string>>(fieldMappingJson, 'fieldMapping');
		if (!fieldMappingResult.success) {
			throw new Error(fieldMappingResult.error);
		}

		const documents = csvToDocuments(csvInput, {
			autoDetectTypes,
			generateIds,
			idField,
			delimiter,
			fieldMapping: fieldMappingResult.data,
		});

		return {
			json: {
				documents,
				count: documents.length,
				summary: {
					totalRows: documents.length,
					fields: Object.keys(documents[0]?.data || {}),
				},
			},
		};
	} else if (operation === 'extractMetadata') {
		const items = this.getInputData();
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;

		const binaryData = items[i].binary?.[binaryPropertyName];
		if (!binaryData) {
			throw new NodeOperationError(
				this.getNode(),
				`No binary data found for property '${binaryPropertyName}'`,
			);
		}

		const fileName = binaryData.fileName || 'unknown';
		const fileBuffer = Buffer.from(binaryData.data, 'base64');

		const metadata = extractFileMetadata(fileBuffer, fileName);

		return {
			json: {
				fileName,
				...metadata,
			},
		};
	}

	throw new Error(`Unknown helper operation: ${operation}`);
}
