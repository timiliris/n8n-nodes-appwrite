# n8n-Appwrite: Implementation Examples for Missing Features

This document provides code examples for implementing the most critical missing features.

---

## 1. Enhanced Users Service - Missing Operations

### Example 1: Update Password Operation

```typescript
// nodes/Appwrite/operations/UsersOperations.ts - ADD THIS

} else if (operation === 'updatePassword') {
	const userId = this.getNodeParameter('userId', i) as string;
	const newPassword = this.getNodeParameter('newPassword', i) as string;
	
	const response = await users.updatePassword(userId, newPassword);
	return { json: response };
} else if (operation === 'resetPassword') {
	const userId = this.getNodeParameter('userId', i) as string;
	const email = this.getNodeParameter('email', i) as string;
	const resetUrl = this.getNodeParameter('resetUrl', i) as string;
	
	const response = await users.createRecovery(userId, email, resetUrl);
	return { json: response };
} else if (operation === 'updateEmail') {
	const userId = this.getNodeParameter('userId', i) as string;
	const newEmail = this.getNodeParameter('newEmail', i) as string;
	
	const response = await users.updateEmail(userId, newEmail);
	return { json: response };
} else if (operation === 'updatePhone') {
	const userId = this.getNodeParameter('userId', i) as string;
	const newPhone = this.getNodeParameter('newPhone', i) as string;
	
	const response = await users.updatePhone(userId, newPhone);
	return { json: response };
} else if (operation === 'updatePreferences') {
	const userId = this.getNodeParameter('userId', i) as string;
	const preferencesStr = this.getNodeParameter('preferences', i) as string;
	
	const parseResult = safeJsonParse<Record<string, unknown>>(preferencesStr, 'preferences');
	if (!parseResult.success) {
		throw new Error(parseResult.error);
	}
	
	const response = await users.updatePrefs(userId, parseResult.data as object);
	return { json: response };
} else if (operation === 'getPreferences') {
	const userId = this.getNodeParameter('userId', i) as string;
	const response = await users.getPrefs(userId);
	return { json: response };
} else if (operation === 'getMfaStatus') {
	const userId = this.getNodeParameter('userId', i) as string;
	const response = await users.getMfa(userId);
	return { json: response };
} else if (operation === 'listSessions') {
	const userId = this.getNodeParameter('userId', i) as string;
	const response = await users.listSessions(userId);
	return { json: response };
} else if (operation === 'deleteSessions') {
	const userId = this.getNodeParameter('userId', i) as string;
	await users.deleteSessions(userId);
	return { json: { success: true, userId } };
}
```

### Example 2: Update Users Description

```typescript
// nodes/Appwrite/descriptions/UsersDescription.ts - ADD THIS

{
	displayName: 'Update Password',
	name: 'updatePassword',
	description: 'Update a user password',
	type: 'action',
	routing: { send: { preSend: ['prepareUpdatePassword'] } },
},
{
	displayName: 'Reset Password',
	name: 'resetPassword',
	description: 'Create a password recovery code',
	type: 'action',
},
{
	displayName: 'Update Email',
	name: 'updateEmail',
	description: 'Update a user email address',
	type: 'action',
},
{
	displayName: 'Update Phone',
	name: 'updatePhone',
	description: 'Update a user phone number',
	type: 'action',
},
{
	displayName: 'Update Preferences',
	name: 'updatePreferences',
	description: 'Update user preferences',
	type: 'action',
},
{
	displayName: 'Get Preferences',
	name: 'getPreferences',
	description: 'Get user preferences',
	type: 'action',
},
{
	displayName: 'Get MFA Status',
	name: 'getMfaStatus',
	description: 'Get MFA status for user',
	type: 'action',
},
{
	displayName: 'List Sessions',
	name: 'listSessions',
	description: 'List user sessions',
	type: 'action',
},
{
	displayName: 'Delete Sessions',
	name: 'deleteSessions',
	description: 'Delete all user sessions',
	type: 'action',
},
```

---

## 2. Batch Operations Framework

### Example: Batch Document Create

```typescript
// nodes/Appwrite/operations/BatchOperations.ts - NEW FILE

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Databases } from 'node-appwrite';

export interface BatchCreateDocumentsOptions {
	transactional?: boolean;
	continueOnError?: boolean;
	parallelLimit?: number;
}

/**
 * Create multiple documents in batch
 */
export async function batchCreateDocuments(
	this: IExecuteFunctions,
	databases: Databases,
	databaseId: string,
	collectionId: string,
	documents: Array<{ id: string; data: Record<string, unknown>; permissions?: string[] }>,
	options: BatchCreateDocumentsOptions = {},
): Promise<INodeExecutionData> {
	const { transactional = false, continueOnError = true, parallelLimit = 10 } = options;
	
	const results = {
		successful: 0,
		failed: 0,
		errors: [] as Array<{ documentId: string; error: string }>,
		documents: [] as unknown[],
	};
	
	if (transactional) {
		// For transactional, fail all if any fails
		try {
			for (const doc of documents) {
				const response = await databases.createDocument(
					databaseId,
					collectionId,
					doc.id,
					doc.data,
					doc.permissions,
				);
				results.successful++;
				results.documents.push(response);
			}
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : String(error);
			throw new Error(`Batch operation failed: ${errorMsg}`);
		}
	} else {
		// Process in parallel with limit
		const chunks = [];
		for (let i = 0; i < documents.length; i += parallelLimit) {
			chunks.push(documents.slice(i, i + parallelLimit));
		}
		
		for (const chunk of chunks) {
			const promises = chunk.map(doc =>
				databases.createDocument(
					databaseId,
					collectionId,
					doc.id,
					doc.data,
					doc.permissions,
				).then(response => {
					results.successful++;
					results.documents.push(response);
					return { success: true, documentId: doc.id };
				}).catch(error => {
					results.failed++;
					const errorMsg = error instanceof Error ? error.message : String(error);
					results.errors.push({ documentId: doc.id, error: errorMsg });
					
					if (!continueOnError) {
						throw error;
					}
					return { success: false, documentId: doc.id, error: errorMsg };
				})
			);
			
			await Promise.all(promises);
		}
	}
	
	return {
		json: results,
	};
}
```

### Example: Batch File Upload

```typescript
// Batch file upload operation

export async function batchUploadFiles(
	this: IExecuteFunctions,
	storage: Storage,
	bucketId: string,
	files: Array<{ fileId: string; binaryPropertyName: string }>,
	options: { parallelLimit?: number } = {},
): Promise<INodeExecutionData> {
	const { parallelLimit = 5 } = options;
	
	const results = {
		successful: 0,
		failed: 0,
		files: [] as unknown[],
	};
	
	const items = this.getInputData();
	
	// Process in parallel batches
	for (let i = 0; i < files.length; i += parallelLimit) {
		const batch = files.slice(i, i + parallelLimit);
		
		const promises = batch.map(async (file) => {
			try {
				const binaryData = items[0].binary?.[file.binaryPropertyName];
				if (!binaryData) {
					throw new Error(`No binary data found for ${file.binaryPropertyName}`);
				}
				
				const buffer = await this.helpers.getBinaryDataBuffer(0, file.binaryPropertyName);
				const uploadFile = InputFile.fromBuffer(buffer, binaryData.fileName || file.fileId);
				
				const response = await storage.createFile(bucketId, file.fileId, uploadFile);
				results.successful++;
				results.files.push(response);
				
				return { success: true, fileId: file.fileId };
			} catch (error) {
				results.failed++;
				throw error;
			}
		});
		
		await Promise.allSettled(promises);
	}
	
	return { json: results };
}
```

---

## 3. Query Builder / Pagination Helper

### Example: Query Builder Operation

```typescript
// nodes/AppwriteHelper/operations/QueryBuilderOperation.ts

export interface QueryCondition {
	field: string;
	operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'between';
	value?: string | number | boolean;
	values?: (string | number | boolean)[];
	logic?: 'AND' | 'OR'; // For next condition
}

export function buildComplexQuery(
	conditions: QueryCondition[],
	pagination?: { limit?: number; offset?: number }
): string[] {
	const queries: string[] = [];
	
	for (const condition of conditions) {
		const { field, operator, value, values } = condition;
		
		let query: string;
		switch (operator) {
			case 'equals':
				query = `Query.equal("${field}", "${value}")`;
				break;
			case 'notEquals':
				query = `Query.notEqual("${field}", "${value}")`;
				break;
			case 'greaterThan':
				query = `Query.greaterThan("${field}", "${value}")`;
				break;
			case 'lessThan':
				query = `Query.lessThan("${field}", "${value}")`;
				break;
			case 'contains':
				query = `Query.search("${field}", "${value}")`;
				break;
			case 'startsWith':
				query = `Query.startsWith("${field}", "${value}")`;
				break;
			case 'endsWith':
				query = `Query.endsWith("${field}", "${value}")`;
				break;
			case 'in':
				query = `Query.select(["${values?.join('", "')}"])`;
				break;
			case 'between':
				query = `Query.between("${field}", "${values?.[0]}", "${values?.[1]}")`;
				break;
			default:
				throw new Error(`Unknown operator: ${operator}`);
		}
		
		queries.push(query);
	}
	
	if (pagination?.limit) {
		queries.push(`Query.limit(${pagination.limit})`);
	}
	if (pagination?.offset) {
		queries.push(`Query.offset(${pagination.offset})`);
	}
	
	return queries;
}
```

---

## 4. Messaging Service - Email Operation Example

```typescript
// nodes/Appwrite/operations/MessagingOperations.ts - NEW FILE

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Messaging } from 'node-appwrite';

/**
 * Send email via Appwrite Messaging
 */
export async function executeMessagingOperation(
	this: IExecuteFunctions,
	messaging: Messaging,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {
	if (operation === 'sendEmail') {
		const messageId = this.getNodeParameter('messageId', i) as string;
		const subject = this.getNodeParameter('subject', i) as string;
		const content = this.getNodeParameter('content', i) as string;
		const emailsStr = this.getNodeParameter('emails', i) as string;
		const emails = emailsStr.split(',').map(e => e.trim());
		
		const response = await messaging.createEmail(
			messageId,
			subject,
			content,
			emails,
		);
		return { json: response };
	} else if (operation === 'sendSms') {
		const messageId = this.getNodeParameter('messageId', i) as string;
		const content = this.getNodeParameter('content', i) as string;
		const phonesStr = this.getNodeParameter('phones', i) as string;
		const phones = phonesStr.split(',').map(p => p.trim());
		
		const response = await messaging.createSms(
			messageId,
			content,
			phones,
		);
		return { json: response };
	} else if (operation === 'sendPush') {
		const messageId = this.getNodeParameter('messageId', i) as string;
		const title = this.getNodeParameter('title', i) as string;
		const body = this.getNodeParameter('body', i) as string;
		const topicId = this.getNodeParameter('topicId', i) as string;
		
		const response = await messaging.createPush(
			messageId,
			title,
			body,
			[topicId],
		);
		return { json: response };
	}
	
	throw new Error(`Unknown messaging operation: ${operation}`);
}
```

---

## 5. Functions Service - Execution Example

```typescript
// nodes/Appwrite/operations/FunctionsOperations.ts - NEW FILE

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Functions } from 'node-appwrite';

/**
 * Execute Appwrite serverless functions
 */
export async function executeFunctionOperation(
	this: IExecuteFunctions,
	functions: Functions,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {
	if (operation === 'create') {
		const functionId = this.getNodeParameter('functionId', i) as string;
		const name = this.getNodeParameter('name', i) as string;
		const runtime = this.getNodeParameter('runtime', i) as string;
		const entrypoint = this.getNodeParameter('entrypoint', i, '') as string;
		
		const response = await functions.create(
			functionId,
			name,
			runtime,
			undefined,
			undefined,
			entrypoint || undefined,
		);
		return { json: response };
	} else if (operation === 'createExecution') {
		const functionId = this.getNodeParameter('functionId', i) as string;
		const payloadStr = this.getNodeParameter('payload', i, '{}') as string;
		const async = this.getNodeParameter('async', i, false) as boolean;
		
		const payload = JSON.parse(payloadStr);
		
		const response = await functions.createExecution(
			functionId,
			JSON.stringify(payload),
			async,
		);
		return { json: response };
	} else if (operation === 'getExecution') {
		const functionId = this.getNodeParameter('functionId', i) as string;
		const executionId = this.getNodeParameter('executionId', i) as string;
		
		const response = await functions.getExecution(functionId, executionId);
		return { json: response };
	} else if (operation === 'listExecutions') {
		const functionId = this.getNodeParameter('functionId', i) as string;
		const response = await functions.listExecutions(functionId);
		return { json: response };
	}
	
	throw new Error(`Unknown functions operation: ${operation}`);
}
```

---

## 6. Workflow Template - User Onboarding

```json
{
  "name": "User Onboarding Workflow",
  "nodes": [
    {
      "parameters": {
        "resource": "users",
        "operation": "create"
      },
      "name": "Create User",
      "type": "n8n-nodes-base.appwrite",
      "typeVersion": 1
    },
    {
      "parameters": {
        "operation": "sendEmail",
        "subject": "Welcome to {{ $node[\"Create User\"].json.name }}",
        "content": "Welcome email content"
      },
      "name": "Send Welcome Email",
      "type": "n8n-nodes-base.appwrite",
      "typeVersion": 1
    },
    {
      "parameters": {
        "resource": "teams",
        "operation": "createMembership"
      },
      "name": "Add to Team",
      "type": "n8n-nodes-base.appwrite",
      "typeVersion": 1
    }
  ],
  "connections": {
    "Create User": {
      "main": [
        [
          {
            "node": "Send Welcome Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send Welcome Email": {
      "main": [
        [
          {
            "node": "Add to Team",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

---

## 7. Enhanced Error Handling Utility

```typescript
// nodes/Appwrite/utils/advancedErrorHandling.ts - NEW FILE

export enum ErrorSeverity {
	CRITICAL = 'critical', // System down
	HIGH = 'high', // Operation failed
	MEDIUM = 'medium', // Retryable error
	LOW = 'low', // Warning only
}

export interface ErrorContext {
	operation: string;
	service: string;
	timestamp: Date;
	retryCount: number;
	originalError: unknown;
}

export function classifyError(error: unknown): {
	severity: ErrorSeverity;
	retryable: boolean;
	shouldLog: boolean;
	message: string;
} {
	if (!error) {
		return {
			severity: ErrorSeverity.MEDIUM,
			retryable: false,
			shouldLog: true,
			message: 'Unknown error',
		};
	}
	
	const errorStr = String(error);
	const errorCode = (error as any)?.code;
	
	// Network errors - retryable
	if (errorCode === 429 || errorStr.includes('rate limit')) {
		return {
			severity: ErrorSeverity.MEDIUM,
			retryable: true,
			shouldLog: true,
			message: 'Rate limited, retrying...',
		};
	}
	
	if (errorCode === 503 || errorCode === 504 || errorStr.includes('service unavailable')) {
		return {
			severity: ErrorSeverity.MEDIUM,
			retryable: true,
			shouldLog: true,
			message: 'Service temporarily unavailable, retrying...',
		};
	}
	
	// Client errors - not retryable
	if (errorCode === 400) {
		return {
			severity: ErrorSeverity.HIGH,
			retryable: false,
			shouldLog: true,
			message: 'Bad request, check parameters',
		};
	}
	
	if (errorCode === 401 || errorCode === 403) {
		return {
			severity: ErrorSeverity.CRITICAL,
			retryable: false,
			shouldLog: true,
			message: 'Authentication/authorization failed',
		};
	}
	
	if (errorCode === 404) {
		return {
			severity: ErrorSeverity.HIGH,
			retryable: false,
			shouldLog: true,
			message: 'Resource not found',
		};
	}
	
	return {
		severity: ErrorSeverity.MEDIUM,
		retryable: true,
		shouldLog: true,
		message: errorStr,
	};
}

export async function executeWithCircuitBreaker(
	operation: () => Promise<any>,
	context: ErrorContext,
	options: {
		maxRetries?: number;
		backoffMultiplier?: number;
		maxBackoff?: number;
	} = {},
): Promise<any> {
	const { maxRetries = 3, backoffMultiplier = 2, maxBackoff = 30000 } = options;
	
	let lastError: unknown;
	let backoff = 1000;
	
	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			return await operation();
		} catch (error) {
			lastError = error;
			const classification = classifyError(error);
			
			if (!classification.retryable || attempt === maxRetries) {
				throw error;
			}
			
			// Exponential backoff
			await new Promise(resolve => setTimeout(resolve, backoff));
			backoff = Math.min(backoff * backoffMultiplier, maxBackoff);
		}
	}
	
	throw lastError;
}
```

---

## 8. Helper Utilities - Data Transformation

```typescript
// nodes/AppwriteHelper/operations/DataTransformationHelpers.ts

export function transformDocument(
	document: Record<string, any>,
	mode: 'flatten' | 'unflatten',
	separator = '.',
): Record<string, any> {
	if (mode === 'flatten') {
		const flattened: Record<string, any> = {};
		
		const flatten = (obj: any, prefix = '') => {
			for (const key in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, key)) {
					const value = obj[key];
					const newKey = prefix ? `${prefix}${separator}${key}` : key;
					
					if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
						flatten(value, newKey);
					} else {
						flattened[newKey] = value;
					}
				}
			}
		};
		
		flatten(document);
		return flattened;
	} else {
		// Unflatten
		const unflattened: Record<string, any> = {};
		
		for (const [key, value] of Object.entries(document)) {
			const parts = key.split(separator);
			let current = unflattened;
			
			for (let i = 0; i < parts.length - 1; i++) {
				const part = parts[i];
				if (!current[part]) {
					current[part] = {};
				}
				current = current[part];
			}
			
			current[parts[parts.length - 1]] = value;
		}
		
		return unflattened;
	}
}

export function validateDocumentAgainstSchema(
	document: Record<string, any>,
	schema: Record<string, any>,
): { valid: boolean; errors: string[] } {
	const errors: string[] = [];
	
	for (const [fieldName, fieldDef] of Object.entries(schema.attributes || {})) {
		const field = fieldDef as any;
		const value = document[fieldName];
		
		// Check required
		if (field.required && (value === undefined || value === null)) {
			errors.push(`Field "${fieldName}" is required`);
			continue;
		}
		
		if (value === undefined || value === null) {
			continue;
		}
		
		// Check type
		const expectedType = field.type;
		const actualType = Array.isArray(value) ? 'array' : typeof value;
		
		if (actualType !== expectedType && expectedType !== 'array') {
			errors.push(`Field "${fieldName}" must be ${expectedType}, got ${actualType}`);
		}
		
		// Check constraints
		if (field.type === 'string' && field.size && value.length > field.size) {
			errors.push(`Field "${fieldName}" exceeds max size of ${field.size}`);
		}
		
		if (field.type === 'integer' || field.type === 'float') {
			if (field.min !== undefined && value < field.min) {
				errors.push(`Field "${fieldName}" must be >= ${field.min}`);
			}
			if (field.max !== undefined && value > field.max) {
				errors.push(`Field "${fieldName}" must be <= ${field.max}`);
			}
		}
		
		if (field.type === 'enum' && !field.elements.includes(value)) {
			errors.push(`Field "${fieldName}" must be one of: ${field.elements.join(', ')}`);
		}
	}
	
	return { valid: errors.length === 0, errors };
}
```

---

## Quick Implementation Checklist

### Phase 1: Enhanced Users (15 hours)
- [ ] Add password update operation
- [ ] Add email management operations
- [ ] Add phone management
- [ ] Add preferences management
- [ ] Add session management
- [ ] Add MFA status checking
- [ ] Update operation descriptions
- [ ] Add tests for new operations

### Phase 2: Batch Operations (20 hours)
- [ ] Create batch operations module
- [ ] Implement batch document operations
- [ ] Implement batch file operations
- [ ] Add transaction support option
- [ ] Add parallel processing with limits
- [ ] Error aggregation and reporting
- [ ] Add tests with sample data

### Phase 3: Query Builder UI (18 hours)
- [ ] Create query builder node
- [ ] Add condition builder interface
- [ ] Implement pagination parameters
- [ ] Add query validation
- [ ] Add example queries
- [ ] Add tests

### Phase 4: Messaging Service (35 hours)
- [ ] Implement email sending
- [ ] Implement SMS sending
- [ ] Implement push notifications
- [ ] Add provider configuration
- [ ] Add subscription management
- [ ] Comprehensive tests
- [ ] Documentation

---

**For full implementation details, refer to the main analysis document.**
