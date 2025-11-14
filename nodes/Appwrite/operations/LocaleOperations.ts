import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Locale } from 'node-appwrite';

/**
 * Executes locale operations for Appwrite (internationalization data)
 * @param this - n8n execution context
 * @param locale - Appwrite Locale service instance
 * @param operation - Operation to perform (get, listCodes, listContinents, listCountries, listCountriesEU, listCountriesPhones, listCurrencies, listLanguages)
 * @returns Execution data with operation results
 * @throws Error if operation is unknown
 */
export async function executeLocaleOperation(
	this: IExecuteFunctions,
	locale: Locale,
	operation: string,
): Promise<INodeExecutionData> {
	if (operation === 'get') {
		/**
		 * Get user locale based on IP address
		 * Returns user location data including country, continent, and suggested currency
		 * IP Geolocation provided by DB-IP
		 */
		const response = await locale.get();
		return { json: response };
	} else if (operation === 'listCodes') {
		/**
		 * List all locale codes in ISO 639-1 format
		 * Returns standardized language codes for internationalization
		 */
		const response = await locale.listCodes();
		return { json: response };
	} else if (operation === 'listContinents') {
		/**
		 * List all continents
		 * Returns continent names and codes for location filtering
		 */
		const response = await locale.listContinents();
		return { json: response };
	} else if (operation === 'listCountries') {
		/**
		 * List all countries
		 * Returns comprehensive country data for country selection dropdowns
		 */
		const response = await locale.listCountries();
		return { json: response };
	} else if (operation === 'listCountriesEU') {
		/**
		 * List all EU member countries
		 * Returns countries currently in the European Union
		 * Useful for EU-specific features and compliance
		 */
		const response = await locale.listCountriesEU();
		return { json: response };
	} else if (operation === 'listCountriesPhones') {
		/**
		 * List all countries with their phone codes
		 * Returns country calling codes for phone number validation
		 * Useful for international phone number input fields
		 */
		const response = await locale.listCountriesPhones();
		return { json: response };
	} else if (operation === 'listCurrencies') {
		/**
		 * List all currencies
		 * Returns currency data including symbols, names, plural forms, and decimal digits
		 * Useful for e-commerce and financial applications
		 */
		const response = await locale.listCurrencies();
		return { json: response };
	} else if (operation === 'listLanguages') {
		/**
		 * List all languages classified by ISO 639-1
		 * Returns 2-letter codes, English names, and native language names
		 * Useful for language selection dropdowns and i18n
		 */
		const response = await locale.listLanguages();
		return { json: response };
	}

	throw new Error(`Unknown locale operation: ${operation}`);
}
