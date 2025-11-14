import { formatAppwriteError, ValidationError, ParseError } from '../nodes/Appwrite/utils/errors';
import { AppwriteError } from '../nodes/Appwrite/utils/types';

describe('Error Handling', () => {
	describe('formatAppwriteError', () => {
		it('should format complete Appwrite error', () => {
			const error: AppwriteError = {
				code: 404,
				type: 'document_not_found',
				message: 'Document not found',
			};

			const formatted = formatAppwriteError(error);
			expect(formatted).toContain('[document_not_found]');
			expect(formatted).toContain('(Code: 404)');
			expect(formatted).toContain('Document not found');
		});

		it('should format error with response message', () => {
			const error: AppwriteError = {
				code: 400,
				type: 'validation_error',
				message: 'Invalid data',
				response: {
					message: 'Email field is required',
				},
			};

			const formatted = formatAppwriteError(error);
			expect(formatted).toContain('Invalid data');
			expect(formatted).toContain('Email field is required');
		});

		it('should handle minimal error info', () => {
			const error: AppwriteError = {
				code: 500,
				type: 'server_error',
				message: 'Internal error',
			};

			const formatted = formatAppwriteError(error);
			expect(formatted).toBeTruthy();
			expect(formatted).toContain('Internal error');
		});
	});

	describe('ValidationError', () => {
		it('should create validation error with correct properties', () => {
			const error = new ValidationError('Invalid ID format');
			expect(error.name).toBe('ValidationError');
			expect(error.message).toBe('Invalid ID format');
			expect(error instanceof Error).toBe(true);
		});
	});

	describe('ParseError', () => {
		it('should create parse error with correct properties', () => {
			const originalError = new Error('Unexpected token');
			const error = new ParseError('Failed to parse JSON', originalError);

			expect(error.name).toBe('ParseError');
			expect(error.message).toBe('Failed to parse JSON');
			expect(error.originalError).toBe(originalError);
			expect(error instanceof Error).toBe(true);
		});
	});
});
