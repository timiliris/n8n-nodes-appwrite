import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Functions } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import { getRequiredParameter, getOptionalParameter } from '../utils/helpers';
import { safeJsonArrayParse, safeJsonParse, validateName } from '../utils/validators';
import { ValidationError } from '../utils/errors';
import { FunctionOptions, DeploymentOptions, ExecutionOptions } from '../utils/types';

/**
 * Executes Functions operations for Appwrite
 * @param this - n8n execution context
 * @param functions - Appwrite Functions service instance
 * @param operation - Operation to perform
 * @param i - Current item index
 * @returns Execution data with operation results
 * @throws ValidationError if validation fails
 * @throws Error if operation is unknown or parameters are invalid
 */
export async function executeFunctionsOperation(
	this: IExecuteFunctions,
	functions: Functions,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {
	// Function CRUD Operations
	if (operation === 'create') {
		const functionId = getRequiredParameter(this, 'functionId', i, false);
		const name = this.getNodeParameter('name', i) as string;
		const runtime = getRequiredParameter(this, 'runtime', i, false);

		// Validate name
		const nameValidation = validateName(name, 'Function name');
		if (!nameValidation.valid) {
			throw new ValidationError(nameValidation.error!);
		}

		const options = getOptionalParameter<FunctionOptions>(this, 'options', i, {});

		// Parse execute permissions
		let execute: string[] | undefined;
		if (options.execute) {
			const executeResult = safeJsonArrayParse(options.execute, 'execute permissions');
			if (!executeResult.success) {
				throw new ValidationError(executeResult.error);
			}
			execute = executeResult.data;
		}

		// Parse events
		let events: string[] | undefined;
		if (options.events) {
			const eventsResult = safeJsonArrayParse(options.events, 'events');
			if (!eventsResult.success) {
				throw new ValidationError(eventsResult.error);
			}
			events = eventsResult.data;
		}

		// Type assertion required: Appwrite SDK expects Runtime enum.
		// This is safe as the value comes from validated n8n dropdown options.
		const response = await functions.create(
			functionId,
			name,
			runtime as any,
			execute,
			events,
			options.schedule,
			options.timeout,
			options.enabled,
			options.logging,
			options.entrypoint,
			options.commands,
			undefined, // scopes - not exposed in n8n UI for simplicity
			options.installationId,
			options.providerRepositoryId,
			options.providerBranch,
			options.providerSilentMode,
			options.providerRootDirectory,
			undefined, // specification - can be added later if needed
		);
		return { json: response };
	} else if (operation === 'list') {
		const options = getOptionalParameter<{ queries?: string; search?: string }>(this, 'options', i, {});

		// Parse queries if provided
		let queries: string[] | undefined;
		if (options.queries) {
			const queriesResult = safeJsonArrayParse(options.queries, 'queries');
			if (!queriesResult.success) {
				throw new ValidationError(queriesResult.error);
			}
			queries = queriesResult.data;
		}

		const response = await functions.list(queries, options.search);
		return { json: response };
	} else if (operation === 'get') {
		const functionId = getRequiredParameter(this, 'functionId', i);
		const response = await functions.get(functionId);
		return { json: response };
	} else if (operation === 'update') {
		const functionId = getRequiredParameter(this, 'functionId', i);
		const name = this.getNodeParameter('name', i) as string;

		// Validate name
		const nameValidation = validateName(name, 'Function name');
		if (!nameValidation.valid) {
			throw new ValidationError(nameValidation.error!);
		}

		const runtime = getOptionalParameter(this, 'runtime', i, '');
		const options = getOptionalParameter<FunctionOptions>(this, 'options', i, {});

		// Parse execute permissions
		let execute: string[] | undefined;
		if (options.execute) {
			const executeResult = safeJsonArrayParse(options.execute, 'execute permissions');
			if (!executeResult.success) {
				throw new ValidationError(executeResult.error);
			}
			execute = executeResult.data;
		}

		// Parse events
		let events: string[] | undefined;
		if (options.events) {
			const eventsResult = safeJsonArrayParse(options.events, 'events');
			if (!eventsResult.success) {
				throw new ValidationError(eventsResult.error);
			}
			events = eventsResult.data;
		}

		// Type assertion required: Appwrite SDK expects Runtime enum.
		// This is safe as the value comes from validated n8n dropdown options.
		const response = await functions.update(
			functionId,
			name,
			runtime ? (runtime as any) : undefined,
			execute,
			events,
			options.schedule,
			options.timeout,
			options.enabled,
			options.logging,
			options.entrypoint,
			options.commands,
			undefined, // scopes - not exposed in n8n UI for simplicity
			options.installationId,
			options.providerRepositoryId,
			options.providerBranch,
			options.providerSilentMode,
			options.providerRootDirectory,
			undefined, // specification - can be added later if needed
		);
		return { json: response };
	} else if (operation === 'delete') {
		const functionId = getRequiredParameter(this, 'functionId', i);
		await functions.delete(functionId);
		return { json: { success: true, functionId } };
	}

	// Deployment Operations
	const functionId = getRequiredParameter(this, 'functionId', i);

	if (operation === 'createDeployment') {
		const entrypoint = getOptionalParameter(this, 'entrypoint', i, '');
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

		const options = getOptionalParameter<DeploymentOptions>(this, 'options', i, {});

		const items = this.getInputData();
		const binaryData = items[i].binary?.[binaryPropertyName];

		if (!binaryData) {
			throw new Error(`No binary data found in field "${binaryPropertyName}"`);
		}

		// Get the binary data buffer
		const binaryDataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

		// Create InputFile from buffer
		const code = InputFile.fromBuffer(
			binaryDataBuffer,
			binaryData.fileName || 'code.tar.gz',
		);

		const response = await functions.createDeployment(
			functionId,
			code as any,
			options.activate !== undefined ? options.activate : true,
			entrypoint || undefined,
			options.commands,
		);
		return { json: response };
	} else if (operation === 'listDeployments') {
		const options = getOptionalParameter<{ queries?: string }>(this, 'options', i, {});

		// Parse queries if provided
		let queries: string[] | undefined;
		if (options.queries) {
			const queriesResult = safeJsonArrayParse(options.queries, 'queries');
			if (!queriesResult.success) {
				throw new ValidationError(queriesResult.error);
			}
			queries = queriesResult.data;
		}

		const response = await functions.listDeployments(functionId, queries);
		return { json: response };
	} else if (operation === 'getDeployment') {
		const deploymentId = getRequiredParameter(this, 'deploymentId', i);
		const response = await functions.getDeployment(functionId, deploymentId);
		return { json: response };
	} else if (operation === 'updateDeployment') {
		const deploymentId = getRequiredParameter(this, 'deploymentId', i);
		const response = await functions.updateDeploymentStatus(functionId, deploymentId);
		return { json: response };
	} else if (operation === 'deleteDeployment') {
		const deploymentId = getRequiredParameter(this, 'deploymentId', i);
		await functions.deleteDeployment(functionId, deploymentId);
		return { json: { success: true, functionId, deploymentId } };
	}

	// Execution Operations
	if (operation === 'createExecution') {
		const options = getOptionalParameter<ExecutionOptions>(this, 'options', i, {});

		// Parse body if provided
		let body: string | undefined;
		if (options.body) {
			body = options.body;
		}

		// Parse headers if provided
		let headers: object | undefined;
		if (options.headers) {
			const headersResult = safeJsonParse(options.headers, 'headers');
			if (!headersResult.success) {
				throw new ValidationError(headersResult.error);
			}
			headers = headersResult.data as object;
		}

		const response = await functions.createExecution(
			functionId,
			body,
			options.async,
			options.path,
			// Type assertion required: Appwrite SDK expects ExecutionMethod enum.
			// This is safe as the value comes from validated n8n dropdown options.
			options.method as any,
			headers,
		);
		return { json: response };
	} else if (operation === 'listExecutions') {
		const options = getOptionalParameter<{ queries?: string }>(this, 'options', i, {});

		// Parse queries if provided
		let queries: string[] | undefined;
		if (options.queries) {
			const queriesResult = safeJsonArrayParse(options.queries, 'queries');
			if (!queriesResult.success) {
				throw new ValidationError(queriesResult.error);
			}
			queries = queriesResult.data;
		}

		const response = await functions.listExecutions(functionId, queries);
		return { json: response };
	} else if (operation === 'getExecution') {
		const executionId = getRequiredParameter(this, 'executionId', i);
		const response = await functions.getExecution(functionId, executionId);
		return { json: response };
	}

	// Variable Operations
	if (operation === 'createVariable') {
		const key = getRequiredParameter(this, 'key', i, false);
		const value = getRequiredParameter(this, 'value', i, false);

		const response = await functions.createVariable(functionId, key, value);
		return { json: response };
	} else if (operation === 'listVariables') {
		const response = await functions.listVariables(functionId);
		return { json: response };
	} else if (operation === 'getVariable') {
		const variableId = getRequiredParameter(this, 'variableId', i);
		const response = await functions.getVariable(functionId, variableId);
		return { json: response };
	} else if (operation === 'updateVariable') {
		const variableId = getRequiredParameter(this, 'variableId', i);
		const key = getRequiredParameter(this, 'key', i, false);
		const value = getOptionalParameter(this, 'value', i, '');

		const response = await functions.updateVariable(
			functionId,
			variableId,
			key,
			value || undefined,
		);
		return { json: response };
	} else if (operation === 'deleteVariable') {
		const variableId = getRequiredParameter(this, 'variableId', i);
		await functions.deleteVariable(functionId, variableId);
		return { json: { success: true, functionId, variableId } };
	}

	throw new Error(`Unknown functions operation: ${operation}`);
}
