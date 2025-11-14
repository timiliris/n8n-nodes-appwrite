/**
 * Type definitions for AppwriteFormTrigger
 */

export interface FormAttribute {
	key: string;
	type: string;
	required?: boolean;
	array?: boolean;
	size?: number;
	min?: number;
	max?: number;
	default?: unknown;
	elements?: string[];
	format?: string;
	[key: string]: unknown;
}
