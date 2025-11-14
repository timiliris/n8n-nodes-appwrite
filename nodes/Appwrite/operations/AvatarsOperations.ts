import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Avatars } from 'node-appwrite';
import { getOptionalParameter } from '../utils/helpers';

/**
 * Executes avatar operations for Appwrite
 * @param this - n8n execution context
 * @param avatars - Appwrite Avatars service instance
 * @param operation - Operation to perform (getBrowser, getCreditCard, getFavicon, getFlag, getImage, getInitials, getQR)
 * @param i - Current item index
 * @returns Execution data with operation results (binary data for images)
 * @throws Error if operation is unknown or required parameters are missing
 */
export async function executeAvatarsOperation(
	this: IExecuteFunctions,
	avatars: Avatars,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {
	if (operation === 'getBrowser') {
		const code = this.getNodeParameter('code', i) as string;
		const width = getOptionalParameter<number>(this, 'width', i, 100);
		const height = getOptionalParameter<number>(this, 'height', i, 100);
		const quality = getOptionalParameter<number>(this, 'quality', i, 100);

		const imageBuffer = await avatars.getBrowser(
			code as any,
			width,
			height,
			quality,
		);

		const binaryData = await this.helpers.prepareBinaryData(
			Buffer.from(imageBuffer as ArrayBuffer),
			`browser-${code}.png`,
			'image/png',
		);

		return {
			json: { success: true, code, width, height, quality },
			binary: {
				data: binaryData,
			},
		};
	} else if (operation === 'getCreditCard') {
		const code = this.getNodeParameter('code', i) as string;
		const width = getOptionalParameter<number>(this, 'width', i, 100);
		const height = getOptionalParameter<number>(this, 'height', i, 100);
		const quality = getOptionalParameter<number>(this, 'quality', i, 100);

		const imageBuffer = await avatars.getCreditCard(
			code as any,
			width,
			height,
			quality,
		);

		const binaryData = await this.helpers.prepareBinaryData(
			Buffer.from(imageBuffer as ArrayBuffer),
			`card-${code}.png`,
			'image/png',
		);

		return {
			json: { success: true, code, width, height, quality },
			binary: {
				data: binaryData,
			},
		};
	} else if (operation === 'getFavicon') {
		const url = this.getNodeParameter('url', i) as string;

		if (!url) {
			throw new Error('URL is required for getFavicon operation');
		}

		const imageBuffer = await avatars.getFavicon(url);

		// Extract domain name for filename
		const domain = new URL(url).hostname.replace(/^www\./, '');
		const binaryData = await this.helpers.prepareBinaryData(
			Buffer.from(imageBuffer as ArrayBuffer),
			`favicon-${domain}.ico`,
			'image/x-icon',
		);

		return {
			json: { success: true, url },
			binary: {
				data: binaryData,
			},
		};
	} else if (operation === 'getFlag') {
		const code = this.getNodeParameter('code', i) as string;
		const width = getOptionalParameter<number>(this, 'width', i, 100);
		const height = getOptionalParameter<number>(this, 'height', i, 100);
		const quality = getOptionalParameter<number>(this, 'quality', i, 100);

		const imageBuffer = await avatars.getFlag(
			code as any,
			width,
			height,
			quality,
		);

		const binaryData = await this.helpers.prepareBinaryData(
			Buffer.from(imageBuffer as ArrayBuffer),
			`flag-${code}.png`,
			'image/png',
		);

		return {
			json: { success: true, code, width, height, quality },
			binary: {
				data: binaryData,
			},
		};
	} else if (operation === 'getImage') {
		const url = this.getNodeParameter('url', i) as string;
		const width = getOptionalParameter<number>(this, 'width', i, 400);
		const height = getOptionalParameter<number>(this, 'height', i, 400);

		if (!url) {
			throw new Error('URL is required for getImage operation');
		}

		const imageBuffer = await avatars.getImage(url, width, height);

		// Extract filename from URL or use generic name
		let filename = 'image.png';
		try {
			const urlPath = new URL(url).pathname;
			const urlFilename = urlPath.split('/').pop();
			if (urlFilename) {
				filename = urlFilename;
			}
		} catch {
			// Use default filename if URL parsing fails
		}

		const binaryData = await this.helpers.prepareBinaryData(
			Buffer.from(imageBuffer as ArrayBuffer),
			filename,
			'image/png',
		);

		return {
			json: { success: true, url, width, height },
			binary: {
				data: binaryData,
			},
		};
	} else if (operation === 'getInitials') {
		const name = getOptionalParameter<string>(this, 'name', i, '');
		const width = getOptionalParameter<number>(this, 'width', i, 100);
		const height = getOptionalParameter<number>(this, 'height', i, 100);
		const background = getOptionalParameter<string>(this, 'background', i, '');

		const imageBuffer = await avatars.getInitials(
			name || undefined,
			width,
			height,
			background || undefined,
		);

		// Generate filename based on name or use generic
		const safeFilename = name
			? `initials-${name.replace(/[^a-zA-Z0-9]/g, '-')}.png`
			: 'initials.png';

		const binaryData = await this.helpers.prepareBinaryData(
			Buffer.from(imageBuffer as ArrayBuffer),
			safeFilename,
			'image/png',
		);

		return {
			json: { success: true, name, width, height, background },
			binary: {
				data: binaryData,
			},
		};
	} else if (operation === 'getQR') {
		const text = this.getNodeParameter('text', i) as string;
		const size = getOptionalParameter<number>(this, 'size', i, 400);
		const margin = getOptionalParameter<number>(this, 'margin', i, 1);
		const download = getOptionalParameter<boolean>(this, 'download', i, false);

		if (!text) {
			throw new Error('Text is required for getQR operation');
		}

		const imageBuffer = await avatars.getQR(text, size, margin, download);

		// Generate safe filename from text
		const safeText = text.substring(0, 50).replace(/[^a-zA-Z0-9]/g, '-');
		const filename = `qr-${safeText}.png`;

		const binaryData = await this.helpers.prepareBinaryData(
			Buffer.from(imageBuffer as ArrayBuffer),
			filename,
			'image/png',
		);

		return {
			json: { success: true, text, size, margin, download },
			binary: {
				data: binaryData,
			},
		};
	}

	throw new Error(`Unknown avatars operation: ${operation}`);
}
