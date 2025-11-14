import {
	validatePermission,
	validatePermissions,
	escapeQueryValue,
} from '../nodes/Appwrite/utils/validators';

describe('Permission Validation', () => {
	describe('validatePermission', () => {
		it('should validate read permission for any', () => {
			const result = validatePermission('read("any")');
			expect(result.valid).toBe(true);
		});

		it('should validate write permission for users', () => {
			const result = validatePermission('write("users")');
			expect(result.valid).toBe(true);
		});

		it('should validate create permission with user ID', () => {
			const result = validatePermission('create("user:123456")');
			expect(result.valid).toBe(true);
		});

		it('should validate update permission with team ID', () => {
			const result = validatePermission('update("team:developers")');
			expect(result.valid).toBe(true);
		});

		it('should validate delete permission with member ID', () => {
			const result = validatePermission('delete("member:abc123")');
			expect(result.valid).toBe(true);
		});

		it('should reject invalid permission format - missing quotes', () => {
			const result = validatePermission('read(any)');
			expect(result.valid).toBe(false);
			expect(result.error).toContain('Invalid permission format');
		});

		it('should reject invalid permission format - missing parentheses', () => {
			const result = validatePermission('read"any"');
			expect(result.valid).toBe(false);
			expect(result.error).toContain('Invalid permission format');
		});

		it('should reject invalid action', () => {
			const result = validatePermission('execute("any")');
			expect(result.valid).toBe(false);
			expect(result.error).toContain('Invalid permission format');
		});

		it('should reject empty string', () => {
			const result = validatePermission('');
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Permission must be a string');
		});

		it('should reject non-string input', () => {
			const result = validatePermission(123 as any);
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Permission must be a string');
		});

		it('should reject permission with spaces', () => {
			const result = validatePermission('read ("any")');
			expect(result.valid).toBe(false);
			expect(result.error).toContain('Invalid permission format');
		});
	});

	describe('validatePermissions', () => {
		it('should validate array of valid permissions', () => {
			const permissions = ['read("any")', 'write("users")', 'create("user:123")'];
			const result = validatePermissions(permissions);
			expect(result.valid).toBe(true);
		});

		it('should validate empty array', () => {
			const result = validatePermissions([]);
			expect(result.valid).toBe(true);
		});

		it('should reject array with one invalid permission', () => {
			const permissions = ['read("any")', 'invalid', 'write("users")'];
			const result = validatePermissions(permissions);
			expect(result.valid).toBe(false);
			expect(result.error).toContain('Invalid permission format');
		});

		it('should reject non-array input', () => {
			const result = validatePermissions('read("any")' as any);
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Permissions must be an array');
		});

		it('should validate all Appwrite permission types', () => {
			const permissions = [
				'read("any")',
				'read("users")',
				'read("guests")',
				'read("user:abc")',
				'read("team:xyz")',
				'read("member:123")',
				'read("label:vip")',
				'write("any")',
				'create("user:123")',
				'update("team:dev")',
				'delete("user:456")',
			];
			const result = validatePermissions(permissions);
			expect(result.valid).toBe(true);
		});
	});

	describe('escapeQueryValue', () => {
		it('should escape double quotes', () => {
			const result = escapeQueryValue('test"value');
			expect(result).toBe('test\\"value');
		});

		it('should escape backslashes', () => {
			const result = escapeQueryValue('test\\value');
			expect(result).toBe('test\\\\value');
		});

		it('should escape both quotes and backslashes', () => {
			const result = escapeQueryValue('test\\"value');
			expect(result).toBe('test\\\\\\"value');
		});

		it('should not modify safe strings', () => {
			const result = escapeQueryValue('test_value-123');
			expect(result).toBe('test_value-123');
		});

		it('should handle empty string', () => {
			const result = escapeQueryValue('');
			expect(result).toBe('');
		});

		it('should convert non-string to string', () => {
			const result = escapeQueryValue(123 as any);
			expect(result).toBe('123');
		});

		it('should handle null as string', () => {
			const result = escapeQueryValue(null as any);
			expect(result).toBe('null');
		});

		it('should handle undefined as string', () => {
			const result = escapeQueryValue(undefined as any);
			expect(result).toBe('undefined');
		});

		it('should escape SQL injection attempts', () => {
			const malicious = 'admin"; DROP TABLE users; --';
			const result = escapeQueryValue(malicious);
			expect(result).toBe('admin\\"; DROP TABLE users; --');
		});

		it('should escape XSS attempts in queries', () => {
			const malicious = '<script>alert("xss")</script>';
			const result = escapeQueryValue(malicious);
			// Should preserve the string but escape quotes
			expect(result).toBe('<script>alert(\\"xss\\")</script>');
		});
	});
});
