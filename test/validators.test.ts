import {
	validateId,
	validateName,
	validateEmail,
	validateNumberRange,
	safeJsonParse,
	safeJsonArrayParse,
} from '../nodes/Appwrite/utils/validators';

describe('Validators', () => {
	describe('validateId', () => {
		it('should validate correct IDs', () => {
			expect(validateId('validId123')).toEqual({ valid: true });
			expect(validateId('valid_id-123')).toEqual({ valid: true });
			expect(validateId('unique()')).toEqual({ valid: true });
		});

		it('should reject empty IDs', () => {
			const result = validateId('');
			expect(result.valid).toBe(false);
			expect(result.error).toContain('required');
		});

		it('should reject IDs that are too long', () => {
			const longId = 'a'.repeat(37);
			const result = validateId(longId);
			expect(result.valid).toBe(false);
			expect(result.error).toContain('36 characters');
		});

		it('should reject IDs with invalid characters', () => {
			const result = validateId('invalid@id');
			expect(result.valid).toBe(false);
			expect(result.error).toContain('invalid characters');
		});
	});

	describe('validateName', () => {
		it('should validate correct names', () => {
			expect(validateName('Valid Name')).toEqual({ valid: true });
			expect(validateName('Name 123')).toEqual({ valid: true });
		});

		it('should reject empty names', () => {
			const result = validateName('');
			expect(result.valid).toBe(false);
			expect(result.error).toContain('required');
		});

		it('should reject names that are too long', () => {
			const longName = 'a'.repeat(129);
			const result = validateName(longName);
			expect(result.valid).toBe(false);
			expect(result.error).toContain('128 characters');
		});
	});

	describe('validateEmail', () => {
		it('should validate correct emails', () => {
			expect(validateEmail('test@example.com')).toEqual({ valid: true });
			expect(validateEmail('user+tag@domain.co.uk')).toEqual({ valid: true });
		});

		it('should reject invalid emails', () => {
			expect(validateEmail('invalid')).toEqual({
				valid: false,
				error: 'Invalid email format',
			});
			expect(validateEmail('invalid@')).toEqual({
				valid: false,
				error: 'Invalid email format',
			});
			expect(validateEmail('@example.com')).toEqual({
				valid: false,
				error: 'Invalid email format',
			});
		});
	});

	describe('validateNumberRange', () => {
		it('should validate numbers within range', () => {
			expect(validateNumberRange(5, 1, 10)).toEqual({ valid: true });
			expect(validateNumberRange(1, 1, 10)).toEqual({ valid: true });
			expect(validateNumberRange(10, 1, 10)).toEqual({ valid: true });
		});

		it('should reject numbers outside range', () => {
			const result = validateNumberRange(0, 1, 10);
			expect(result.valid).toBe(false);
			expect(result.error).toContain('at least 1');

			const result2 = validateNumberRange(11, 1, 10);
			expect(result2.valid).toBe(false);
			expect(result2.error).toContain('not exceed 10');
		});

		it('should reject non-numbers', () => {
			const result = validateNumberRange(NaN);
			expect(result.valid).toBe(false);
			expect(result.error).toContain('valid number');
		});
	});

	describe('safeJsonParse', () => {
		it('should parse valid JSON strings', () => {
			const result = safeJsonParse('{"name":"John","age":30}');
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual({ name: 'John', age: 30 });
			}
		});

		it('should return objects as-is', () => {
			const obj = { name: 'John' };
			const result = safeJsonParse(obj);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(obj);
			}
		});

		it('should reject invalid JSON', () => {
			const result = safeJsonParse('invalid json');
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toContain('Invalid JSON');
			}
		});

		it('should reject JSON that exceeds max size', () => {
			const largeJson = '{"data":"' + 'a'.repeat(1048577) + '"}';
			const result = safeJsonParse(largeJson);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toContain('exceeds maximum size');
			}
		});
	});

	describe('safeJsonArrayParse', () => {
		it('should parse valid JSON arrays', () => {
			const result = safeJsonArrayParse('["item1","item2"]');
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(['item1', 'item2']);
			}
		});

		it('should reject non-arrays', () => {
			const result = safeJsonArrayParse('{"not":"array"}');
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toContain('must be an array');
			}
		});

		it('should reject arrays with non-string items', () => {
			const result = safeJsonArrayParse('[1,2,3]');
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toContain('must be strings');
			}
		});
	});
});
