import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Messaging } from 'node-appwrite';
import { safeJsonParse } from '../utils/validators';

/**
 * Executes messaging operations for Appwrite
 * @param this - n8n execution context
 * @param messaging - Appwrite Messaging service instance
 * @param operation - Operation to perform
 * @param i - Current item index
 * @returns Execution data with operation results
 * @throws Error if operation is unknown or validation fails
 */
export async function executeMessagingOperation(
	this: IExecuteFunctions,
	messaging: Messaging,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {
	// Message Operations
	if (operation === 'sendEmail') {
		const messageId = this.getNodeParameter('messageId', i) as string;
		const subject = this.getNodeParameter('subject', i) as string;
		const content = this.getNodeParameter('content', i) as string;
		const topicsStr = this.getNodeParameter('topics', i, '') as string;
		const usersStr = this.getNodeParameter('users', i, '') as string;
		const targetsStr = this.getNodeParameter('targets', i, '') as string;
		const draft = this.getNodeParameter('draft', i, false) as boolean;
		const html = this.getNodeParameter('html', i, false) as boolean;
		const cc = this.getNodeParameter('cc', i, '') as string;
		const bcc = this.getNodeParameter('bcc', i, '') as string;

		// Parse arrays
		const topics = topicsStr ? topicsStr.split(',').map((t) => t.trim()) : undefined;
		const users = usersStr ? usersStr.split(',').map((u) => u.trim()) : undefined;
		const targets = targetsStr ? targetsStr.split(',').map((t) => t.trim()) : undefined;
		const ccList = cc ? cc.split(',').map((c) => c.trim()) : undefined;
		const bccList = bcc ? bcc.split(',').map((b) => b.trim()) : undefined;

		const response = await messaging.createEmail(
			messageId,
			subject,
			content,
			topics,
			users,
			targets,
			ccList,
			bccList,
			undefined, // attachments
			draft,
			html,
			undefined, // scheduledAt
		);
		return { json: response };
	} else if (operation === 'sendSMS') {
		const messageId = this.getNodeParameter('messageId', i) as string;
		const content = this.getNodeParameter('content', i) as string;
		const topicsStr = this.getNodeParameter('topics', i, '') as string;
		const usersStr = this.getNodeParameter('users', i, '') as string;
		const targetsStr = this.getNodeParameter('targets', i, '') as string;
		const draft = this.getNodeParameter('draft', i, false) as boolean;

		// Parse arrays
		const topics = topicsStr ? topicsStr.split(',').map((t) => t.trim()) : undefined;
		const users = usersStr ? usersStr.split(',').map((u) => u.trim()) : undefined;
		const targets = targetsStr ? targetsStr.split(',').map((t) => t.trim()) : undefined;

		const response = await messaging.createSms(
			messageId,
			content,
			topics,
			users,
			targets,
			draft,
			undefined, // scheduledAt
		);
		return { json: response };
	} else if (operation === 'sendPush') {
		const messageId = this.getNodeParameter('messageId', i) as string;
		const title = this.getNodeParameter('title', i) as string;
		const body = this.getNodeParameter('body', i) as string;
		const topicsStr = this.getNodeParameter('topics', i, '') as string;
		const usersStr = this.getNodeParameter('users', i, '') as string;
		const targetsStr = this.getNodeParameter('targets', i, '') as string;
		const dataStr = this.getNodeParameter('data', i, '{}') as string;
		const action = this.getNodeParameter('action', i, '') as string;
		const image = this.getNodeParameter('image', i, '') as string;
		const icon = this.getNodeParameter('icon', i, '') as string;
		const sound = this.getNodeParameter('sound', i, '') as string;
		const color = this.getNodeParameter('color', i, '') as string;
		const tag = this.getNodeParameter('tag', i, '') as string;
		const badgeStr = this.getNodeParameter('badge', i, '') as string;
		const draft = this.getNodeParameter('draft', i, false) as boolean;

		// Parse arrays
		const topics = topicsStr ? topicsStr.split(',').map((t) => t.trim()) : undefined;
		const users = usersStr ? usersStr.split(',').map((u) => u.trim()) : undefined;
		const targets = targetsStr ? targetsStr.split(',').map((t) => t.trim()) : undefined;

		// Parse data JSON
		const parseResult = safeJsonParse<Record<string, unknown>>(dataStr, 'data');
		if (!parseResult.success) {
			throw new Error(parseResult.error);
		}
		const data = parseResult.data;

		// Parse badge as number
		const badge = badgeStr ? parseInt(badgeStr, 10) : undefined;

		const response = await messaging.createPush(
			messageId,
			title,
			body,
			topics,
			users,
			targets,
			Object.keys(data).length > 0 ? data : undefined,
			action || undefined,
			image || undefined,
			icon || undefined,
			sound || undefined,
			color || undefined,
			tag || undefined,
			badge,
			draft,
			undefined, // scheduledAt
		);
		return { json: response };
	} else if (operation === 'listMessages') {
		const queriesStr = this.getNodeParameter('queries', i, '') as string;
		const queries = queriesStr ? queriesStr.split(',').map((q) => q.trim()) : undefined;

		const response = await messaging.listMessages(queries);
		return { json: response };
	} else if (operation === 'getMessage') {
		const messageId = this.getNodeParameter('messageId', i) as string;

		const response = await messaging.getMessage(messageId);
		return { json: response };
	}
	// Provider Operations
	else if (operation === 'createProvider') {
		const providerId = this.getNodeParameter('providerId', i) as string;
		const name = this.getNodeParameter('name', i) as string;
		const providerType = this.getNodeParameter('providerType', i) as string;
		const enabled = this.getNodeParameter('enabled', i, true) as boolean;

		// Type-specific parameters
		let response;
		if (providerType === 'sendgrid') {
			const apiKey = this.getNodeParameter('apiKey', i, '') as string;
			const fromEmail = this.getNodeParameter('fromEmail', i, '') as string;
			const fromName = this.getNodeParameter('fromName', i, '') as string;
			response = await messaging.createSendgridProvider(
				providerId,
				name,
				apiKey || undefined,
				fromName || undefined,
				fromEmail || undefined,
				undefined, // replyToName
				undefined, // replyToEmail
				enabled,
			);
		} else if (providerType === 'mailgun') {
			const apiKey = this.getNodeParameter('apiKey', i, '') as string;
			const domain = this.getNodeParameter('domain', i, '') as string;
			const fromEmail = this.getNodeParameter('fromEmail', i, '') as string;
			const fromName = this.getNodeParameter('fromName', i, '') as string;
			response = await messaging.createMailgunProvider(
				providerId,
				name,
				apiKey || undefined,
				domain || undefined,
				undefined, // isEuRegion
				fromName || undefined,
				fromEmail || undefined,
				undefined, // replyToName
				undefined, // replyToEmail
				enabled,
			);
		} else if (providerType === 'twilio') {
			const from = this.getNodeParameter('from', i, '') as string;
			const accountSid = this.getNodeParameter('accountSid', i, '') as string;
			const authToken = this.getNodeParameter('authToken', i, '') as string;
			response = await messaging.createTwilioProvider(
				providerId,
				name,
				from || undefined,
				accountSid || undefined,
				authToken || undefined,
				enabled,
			);
		} else if (providerType === 'fcm') {
			const serverKeyStr = this.getNodeParameter('serverKey', i, '{}') as string;
			const parseResult = safeJsonParse<Record<string, unknown>>(serverKeyStr, 'serverKey');
			if (!parseResult.success) {
				throw new Error(parseResult.error);
			}
			response = await messaging.createFcmProvider(
				providerId,
				name,
				parseResult.data,
				enabled,
			);
		} else if (providerType === 'apns') {
			const authKey = this.getNodeParameter('authKey', i, '') as string;
			const authKeyId = this.getNodeParameter('authKeyId', i, '') as string;
			const teamId = this.getNodeParameter('teamId', i, '') as string;
			const bundleId = this.getNodeParameter('bundleId', i, '') as string;
			const sandbox = this.getNodeParameter('sandbox', i, false) as boolean;
			response = await messaging.createApnsProvider(
				providerId,
				name,
				authKey || undefined,
				authKeyId || undefined,
				teamId || undefined,
				bundleId || undefined,
				sandbox,
				enabled,
			);
		} else {
			throw new Error(`Unknown provider type: ${providerType}`);
		}

		return { json: response };
	} else if (operation === 'listProviders') {
		const queriesStr = this.getNodeParameter('queries', i, '') as string;
		const queries = queriesStr ? queriesStr.split(',').map((q) => q.trim()) : undefined;

		const response = await messaging.listProviders(queries);
		return { json: response };
	} else if (operation === 'getProvider') {
		const providerId = this.getNodeParameter('providerId', i) as string;

		const response = await messaging.getProvider(providerId);
		return { json: response };
	} else if (operation === 'updateProvider') {
		const providerId = this.getNodeParameter('providerId', i) as string;
		const name = this.getNodeParameter('name', i, '') as string;
		const enabled = this.getNodeParameter('enabled', i, true) as boolean;
		const providerType = this.getNodeParameter('providerType', i) as string;

		let response;
		if (providerType === 'sendgrid') {
			const apiKey = this.getNodeParameter('apiKey', i, '') as string;
			const fromEmail = this.getNodeParameter('fromEmail', i, '') as string;
			const fromName = this.getNodeParameter('fromName', i, '') as string;
			response = await messaging.updateSendgridProvider(
				providerId,
				name || undefined,
				enabled,
				apiKey || undefined,
				fromName || undefined,
				fromEmail || undefined,
				undefined, // replyToName
				undefined, // replyToEmail
			);
		} else if (providerType === 'mailgun') {
			const apiKey = this.getNodeParameter('apiKey', i, '') as string;
			const domain = this.getNodeParameter('domain', i, '') as string;
			const fromEmail = this.getNodeParameter('fromEmail', i, '') as string;
			const fromName = this.getNodeParameter('fromName', i, '') as string;
			response = await messaging.updateMailgunProvider(
				providerId,
				name || undefined,
				apiKey || undefined,
				domain || undefined,
				undefined, // isEuRegion
				enabled,
				fromName || undefined,
				fromEmail || undefined,
				undefined, // replyToName
				undefined, // replyToEmail
			);
		} else if (providerType === 'twilio') {
			const from = this.getNodeParameter('from', i, '') as string;
			const accountSid = this.getNodeParameter('accountSid', i, '') as string;
			const authToken = this.getNodeParameter('authToken', i, '') as string;
			response = await messaging.updateTwilioProvider(
				providerId,
				name || undefined,
				enabled,
				accountSid || undefined,
				authToken || undefined,
				from || undefined,
			);
		} else if (providerType === 'fcm') {
			const serverKeyStr = this.getNodeParameter('serverKey', i, '{}') as string;
			const parseResult = safeJsonParse<Record<string, unknown>>(serverKeyStr, 'serverKey');
			if (!parseResult.success) {
				throw new Error(parseResult.error);
			}
			response = await messaging.updateFcmProvider(
				providerId,
				name || undefined,
				enabled,
				parseResult.data as object,
			);
		} else if (providerType === 'apns') {
			const authKey = this.getNodeParameter('authKey', i, '') as string;
			const authKeyId = this.getNodeParameter('authKeyId', i, '') as string;
			const teamId = this.getNodeParameter('teamId', i, '') as string;
			const bundleId = this.getNodeParameter('bundleId', i, '') as string;
			const sandbox = this.getNodeParameter('sandbox', i, false) as boolean;
			response = await messaging.updateApnsProvider(
				providerId,
				name || undefined,
				enabled,
				authKey || undefined,
				authKeyId || undefined,
				teamId || undefined,
				bundleId || undefined,
				sandbox,
			);
		} else {
			throw new Error(`Unknown provider type: ${providerType}`);
		}

		return { json: response };
	} else if (operation === 'deleteProvider') {
		const providerId = this.getNodeParameter('providerId', i) as string;

		await messaging.deleteProvider(providerId);
		return { json: { success: true, providerId } };
	}
	// Topic Operations
	else if (operation === 'createTopic') {
		const topicId = this.getNodeParameter('topicId', i) as string;
		const name = this.getNodeParameter('name', i) as string;
		const subscribeStr = this.getNodeParameter('subscribe', i, '') as string;
		const subscribe = subscribeStr ? subscribeStr.split(',').map((s) => s.trim()) : undefined;

		const response = await messaging.createTopic(
			topicId,
			name,
			subscribe,
		);
		return { json: response };
	} else if (operation === 'listTopics') {
		const queriesStr = this.getNodeParameter('queries', i, '') as string;
		const queries = queriesStr ? queriesStr.split(',').map((q) => q.trim()) : undefined;

		const response = await messaging.listTopics(queries);
		return { json: response };
	} else if (operation === 'getTopic') {
		const topicId = this.getNodeParameter('topicId', i) as string;

		const response = await messaging.getTopic(topicId);
		return { json: response };
	} else if (operation === 'updateTopic') {
		const topicId = this.getNodeParameter('topicId', i) as string;
		const name = this.getNodeParameter('name', i, '') as string;
		const subscribeStr = this.getNodeParameter('subscribe', i, '') as string;
		const subscribe = subscribeStr ? subscribeStr.split(',').map((s) => s.trim()) : undefined;

		const response = await messaging.updateTopic(
			topicId,
			name || undefined,
			subscribe,
		);
		return { json: response };
	} else if (operation === 'deleteTopic') {
		const topicId = this.getNodeParameter('topicId', i) as string;

		await messaging.deleteTopic(topicId);
		return { json: { success: true, topicId } };
	}
	// Subscriber Operations
	else if (operation === 'createSubscriber') {
		const topicId = this.getNodeParameter('topicId', i) as string;
		const subscriberId = this.getNodeParameter('subscriberId', i) as string;
		const targetId = this.getNodeParameter('targetId', i) as string;

		const response = await messaging.createSubscriber(topicId, subscriberId, targetId);
		return { json: response };
	} else if (operation === 'listSubscribers') {
		const topicId = this.getNodeParameter('topicId', i) as string;
		const queriesStr = this.getNodeParameter('queries', i, '') as string;
		const queries = queriesStr ? queriesStr.split(',').map((q) => q.trim()) : undefined;

		const response = await messaging.listSubscribers(topicId, queries);
		return { json: response };
	} else if (operation === 'deleteSubscriber') {
		const topicId = this.getNodeParameter('topicId', i) as string;
		const subscriberId = this.getNodeParameter('subscriberId', i) as string;

		await messaging.deleteSubscriber(topicId, subscriberId);
		return { json: { success: true, subscriberId } };
	}

	throw new Error(`Unknown messaging operation: ${operation}`);
}
