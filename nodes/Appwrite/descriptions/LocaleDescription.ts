import { INodeProperties } from 'n8n-workflow';

export const localeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['locale'],
			},
		},
		options: [
			{
				name: 'Get User Locale',
				value: 'get',
				description: 'Get user locale based on IP address',
				action: 'Get user locale',
			},
			{
				name: 'List Locale Codes',
				value: 'listCodes',
				description: 'List all locale codes (ISO 639-1)',
				action: 'List locale codes',
			},
			{
				name: 'List Continents',
				value: 'listContinents',
				description: 'List all continents',
				action: 'List continents',
			},
			{
				name: 'List Countries',
				value: 'listCountries',
				description: 'List all countries',
				action: 'List countries',
			},
			{
				name: 'List EU Countries',
				value: 'listCountriesEU',
				description: 'List EU member countries',
				action: 'List EU countries',
			},
			{
				name: 'List Countries with Phone Codes',
				value: 'listCountriesPhones',
				description: 'List countries with phone codes',
				action: 'List countries with phone codes',
			},
			{
				name: 'List Currencies',
				value: 'listCurrencies',
				description: 'List all currencies',
				action: 'List currencies',
			},
			{
				name: 'List Languages',
				value: 'listLanguages',
				description: 'List all languages (ISO 639-1)',
				action: 'List languages',
			},
		],
		default: 'get',
	},
];

export const localeFields: INodeProperties[] = [
	// No additional fields needed - all operations are parameter-free
];
