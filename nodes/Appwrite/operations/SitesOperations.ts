import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Sites, Framework, BuildRuntime, Adapter, VCSDeploymentType } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import { SitesOptions, DeploymentOptions } from '../utils/types';

/**
 * Executes site operations for Appwrite (static site hosting)
 * @param this - n8n execution context
 * @param sites - Appwrite Sites service instance
 * @param operation - Operation to perform (create, get, list, update, delete, createDeployment, getDeployment, listDeployments, updateDeployment, deleteDeployment)
 * @param i - Current item index
 * @returns Execution data with operation results
 * @throws Error if operation is unknown or binary data is invalid
 */
export async function executeSitesOperation(
	this: IExecuteFunctions,
	sites: Sites,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {
	// Site Operations
	if (operation === 'create') {
		const siteId = this.getNodeParameter('siteId', i) as string;
		const name = this.getNodeParameter('name', i) as string;
		const framework = this.getNodeParameter('framework', i) as Framework;
		const buildRuntime = this.getNodeParameter('buildRuntime', i) as BuildRuntime;
		const options = this.getNodeParameter('options', i, {}) as SitesOptions;

		const response = await sites.create({
			siteId,
			name,
			framework,
			buildRuntime,
			enabled: options.enabled,
			logging: options.logging,
			timeout: options.timeout,
			installCommand: options.installCommand,
			buildCommand: options.buildCommand,
			outputDirectory: options.outputDirectory,
			adapter: options.adapter as Adapter,
			installationId: options.installationId,
			fallbackFile: options.fallbackFile,
			providerRepositoryId: options.providerRepositoryId,
			providerBranch: options.providerBranch,
			providerSilentMode: options.providerSilentMode,
			providerRootDirectory: options.providerRootDirectory,
			specification: options.specification,
		});
		return { json: response };
	} else if (operation === 'get') {
		const siteId = this.getNodeParameter('siteId', i) as string;
		const response = await sites.get({ siteId });
		return { json: response };
	} else if (operation === 'list') {
		const response = await sites.list();
		return { json: response };
	} else if (operation === 'update') {
		const siteId = this.getNodeParameter('siteId', i) as string;
		const name = this.getNodeParameter('name', i) as string;
		const framework = this.getNodeParameter('framework', i) as Framework;
		const options = this.getNodeParameter('options', i, {}) as SitesOptions;

		const response = await sites.update({
			siteId,
			name,
			framework,
			enabled: options.enabled,
			logging: options.logging,
			timeout: options.timeout,
			installCommand: options.installCommand,
			buildCommand: options.buildCommand,
			outputDirectory: options.outputDirectory,
			buildRuntime: options.buildRuntime as BuildRuntime,
			adapter: options.adapter as Adapter,
			fallbackFile: options.fallbackFile,
			installationId: options.installationId,
			providerRepositoryId: options.providerRepositoryId,
			providerBranch: options.providerBranch,
			providerSilentMode: options.providerSilentMode,
			providerRootDirectory: options.providerRootDirectory,
			specification: options.specification,
		});
		return { json: response };
	} else if (operation === 'delete') {
		const siteId = this.getNodeParameter('siteId', i) as string;
		await sites.delete({ siteId });
		return { json: { success: true, siteId } };
	}

	// Deployment Operations
	else if (operation === 'createDeployment') {
		const siteId = this.getNodeParameter('siteId', i) as string;
		const deploymentSource = this.getNodeParameter('deploymentSource', i) as string;
		const activate = this.getNodeParameter('activate', i, false) as boolean;

		if (deploymentSource === 'upload') {
			const codeArchiveField = this.getNodeParameter('codeArchiveField', i) as string;
			const options = this.getNodeParameter('deploymentOptions', i, {}) as DeploymentOptions;

			const items = this.getInputData();
			const binaryData = items[i].binary?.[codeArchiveField];

			if (!binaryData) {
				throw new Error(`No binary data found in field "${codeArchiveField}"`);
			}

			const binaryDataBuffer = await this.helpers.getBinaryDataBuffer(i, codeArchiveField);
			const file = InputFile.fromBuffer(
				binaryDataBuffer,
				binaryData.fileName || 'code.tar.gz',
			);

			const response = await sites.createDeployment({
				siteId,
				// Type assertion required: Appwrite SDK expects InputFile but TypeScript can't infer
			// the correct type from InputFile.fromBuffer. This is safe as we validate binary data exists.
			code: file as any,
				activate,
				installCommand: options.installCommand,
				buildCommand: options.buildCommand,
				outputDirectory: options.outputDirectory,
			});
			return { json: response };
		} else {
			// VCS deployment
			const vcsType = this.getNodeParameter('vcsType', i) as VCSDeploymentType;
			const vcsReference = this.getNodeParameter('vcsReference', i) as string;

			const response = await sites.createVcsDeployment({
				siteId,
				type: vcsType,
				reference: vcsReference,
				activate,
			});
			return { json: response };
		}
	} else if (operation === 'getDeployment') {
		const siteId = this.getNodeParameter('siteId', i) as string;
		const deploymentId = this.getNodeParameter('deploymentId', i) as string;
		const response = await sites.getDeployment({ siteId, deploymentId });
		return { json: response };
	} else if (operation === 'listDeployments') {
		const siteId = this.getNodeParameter('siteId', i) as string;
		const response = await sites.listDeployments({ siteId });
		return { json: response };
	} else if (operation === 'updateActiveDeployment') {
		const siteId = this.getNodeParameter('siteId', i) as string;
		const deploymentId = this.getNodeParameter('deploymentId', i) as string;
		const response = await sites.updateSiteDeployment({ siteId, deploymentId });
		return { json: response };
	} else if (operation === 'deleteDeployment') {
		const siteId = this.getNodeParameter('siteId', i) as string;
		const deploymentId = this.getNodeParameter('deploymentId', i) as string;
		await sites.deleteDeployment({ siteId, deploymentId });
		return { json: { success: true, deploymentId } };
	}

	// Variable Operations
	else if (operation === 'createVariable') {
		const siteId = this.getNodeParameter('siteId', i) as string;
		const key = this.getNodeParameter('key', i) as string;
		const value = this.getNodeParameter('value', i) as string;
		const secret = this.getNodeParameter('isSecret', i, false) as boolean;

		const response = await sites.createVariable({
			siteId,
			key,
			value,
			secret,
		});
		return { json: response };
	} else if (operation === 'getVariable') {
		const siteId = this.getNodeParameter('siteId', i) as string;
		const variableId = this.getNodeParameter('variableId', i) as string;
		const response = await sites.getVariable({ siteId, variableId });
		return { json: response };
	} else if (operation === 'listVariables') {
		const siteId = this.getNodeParameter('siteId', i) as string;
		const response = await sites.listVariables({ siteId });
		return { json: response };
	} else if (operation === 'updateVariable') {
		const siteId = this.getNodeParameter('siteId', i) as string;
		const variableId = this.getNodeParameter('variableId', i) as string;
		const key = this.getNodeParameter('key', i) as string;
		const options = this.getNodeParameter('options', i, {}) as { value?: string; isSecret?: boolean };

		const response = await sites.updateVariable({
			siteId,
			variableId,
			key,
			value: options.value,
			secret: options.isSecret,
		});
		return { json: response };
	} else if (operation === 'deleteVariable') {
		const siteId = this.getNodeParameter('siteId', i) as string;
		const variableId = this.getNodeParameter('variableId', i) as string;
		await sites.deleteVariable({ siteId, variableId });
		return { json: { success: true, variableId } };
	}

	// Discovery Operations
	else if (operation === 'listFrameworks') {
		const response = await sites.listFrameworks();
		return { json: response };
	} else if (operation === 'listSpecifications') {
		const response = await sites.listSpecifications();
		return { json: response };
	}

	throw new Error(`Unknown sites operation: ${operation}`);
}
