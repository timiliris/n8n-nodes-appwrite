/**
 * Validation utilities for Appwrite operations
 */

const MAX_ID_LENGTH = 36;
const MAX_NAME_LENGTH = 128;
const MAX_JSON_SIZE = 1048576; // 1MB

export interface ValidationResult {
	valid: boolean;
	error?: string;
}

/**
 * Validates an Appwrite ID (database, collection, document, etc.)
 */
export function validateId(id: string, fieldName = 'ID'): ValidationResult {
	if (!id || typeof id !== 'string') {
		return {
			valid: false,
			error: `${fieldName} is required and must be a string`,
		};
	}

	if (id.length > MAX_ID_LENGTH) {
		return {
			valid: false,
			error: `${fieldName} must not exceed ${MAX_ID_LENGTH} characters`,
		};
	}

	// Allow alphanumeric, underscore, hyphen, and special keywords like 'unique()'
	if (!/^[a-zA-Z0-9_\-()]+$/.test(id)) {
		return {
			valid: false,
			error: `${fieldName} contains invalid characters. Only alphanumeric, underscore, and hyphen are allowed`,
		};
	}

	return { valid: true };
}

/**
 * Validates a name field
 */
export function validateName(name: string, fieldName = 'Name'): ValidationResult {
	if (!name || typeof name !== 'string') {
		return {
			valid: false,
			error: `${fieldName} is required and must be a string`,
		};
	}

	if (name.length > MAX_NAME_LENGTH) {
		return {
			valid: false,
			error: `${fieldName} must not exceed ${MAX_NAME_LENGTH} characters`,
		};
	}

	return { valid: true };
}

/**
 * Safely parses JSON with validation
 */
export function safeJsonParse<T = unknown>(
	data: unknown,
	fieldName = 'data',
): { success: true; data: T } | { success: false; error: string } {
	try {
		// If already an object, return it
		if (typeof data === 'object' && data !== null) {
			return { success: true, data: data as T };
		}

		// If string, parse it
		if (typeof data === 'string') {
			// Check size before parsing
			if (data.length > MAX_JSON_SIZE) {
				return {
					success: false,
					error: `${fieldName} exceeds maximum size of ${MAX_JSON_SIZE} bytes`,
				};
			}

			const parsed = JSON.parse(data);
			return { success: true, data: parsed as T };
		}

		return {
			success: false,
			error: `${fieldName} must be a valid JSON string or object`,
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown parsing error';
		return {
			success: false,
			error: `Invalid JSON in ${fieldName}: ${message}`,
		};
	}
}

/**
 * Validates and parses a JSON array (for permissions, etc.)
 */
export function safeJsonArrayParse(
	data: unknown,
	fieldName = 'array',
): { success: true; data: string[] } | { success: false; error: string } {
	const result = safeJsonParse<unknown>(data, fieldName);

	if (!result.success) {
		return result;
	}

	if (!Array.isArray(result.data)) {
		return {
			success: false,
			error: `${fieldName} must be an array`,
		};
	}

	// Validate all items are strings
	if (!result.data.every((item) => typeof item === 'string')) {
		return {
			success: false,
			error: `All items in ${fieldName} must be strings`,
		};
	}

	return { success: true, data: result.data as string[] };
}

/**
 * Validates email format
 */
export function validateEmail(email: string): ValidationResult {
	if (!email || typeof email !== 'string') {
		return {
			valid: false,
			error: 'Email is required and must be a string',
		};
	}

	// Simple email validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return {
			valid: false,
			error: 'Invalid email format',
		};
	}

	return { valid: true };
}

/**
 * Validates numeric range
 */
export function validateNumberRange(
	value: number,
	min?: number,
	max?: number,
	fieldName = 'value',
): ValidationResult {
	if (typeof value !== 'number' || isNaN(value)) {
		return {
			valid: false,
			error: `${fieldName} must be a valid number`,
		};
	}

	if (min !== undefined && value < min) {
		return {
			valid: false,
			error: `${fieldName} must be at least ${min}`,
		};
	}

	if (max !== undefined && value > max) {
		return {
			valid: false,
			error: `${fieldName} must not exceed ${max}`,
		};
	}

	return { valid: true };
}

/**
 * Escapes HTML characters to prevent XSS attacks
 */
export function escapeHtml(text: string): string {
	if (typeof text !== 'string') {
		return '';
	}
	const htmlEscapeMap: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		'/': '&#x2F;',
	};
	return text.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Validates Appwrite permission format
 * Valid formats: read("any"), write("user:123"), create("team:456")
 */
export function validatePermission(permission: string): ValidationResult {
	if (!permission || typeof permission !== 'string') {
		return {
			valid: false,
			error: 'Permission must be a string',
		};
	}

	// Appwrite permission format: action("role:id") or action("role")
	const permissionRegex = /^(read|write|create|update|delete)\("[^"]+"\)$/;

	if (!permissionRegex.test(permission)) {
		return {
			valid: false,
			error: `Invalid permission format: "${permission}". Expected format: action("role") or action("role:id")`,
		};
	}

	return { valid: true };
}

/**
 * Validates an array of permissions
 */
export function validatePermissions(permissions: string[]): ValidationResult {
	if (!Array.isArray(permissions)) {
		return {
			valid: false,
			error: 'Permissions must be an array',
		};
	}

	for (const perm of permissions) {
		const result = validatePermission(perm);
		if (!result.valid) {
			return result;
		}
	}

	return { valid: true };
}

/**
 * Escapes special characters in query values to prevent injection
 */
export function escapeQueryValue(value: string): string {
	if (typeof value !== 'string') {
		return String(value);
	}
	// Escape quotes and backslashes
	return value.replace(/["\\]/g, '\\$&');
}
