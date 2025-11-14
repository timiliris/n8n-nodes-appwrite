import { INodeProperties } from 'n8n-workflow';

import { accountOperations, accountFields } from './AccountDescription';
import { attributeOperations, attributeFields } from './AttributeDescription';
import { avatarsOperations, avatarsFields } from './AvatarsDescription';
import { collectionOperations, collectionFields } from './CollectionDescription';
import { databaseOperations, databaseFields } from './DatabaseDescription';
import { documentOperations, documentFields } from './DocumentDescription';
import { functionsOperations, functionsFields } from './FunctionsDescription';
import { indexOperations, indexFields } from './IndexDescription';
import { localeOperations, localeFields } from './LocaleDescription';
import { messagingOperations, messagingFields } from './MessagingDescription';
import { sitesOperations, sitesFields } from './SitesDescription';
import { storageOperations, storageFields } from './StorageDescription';
import { teamsOperations, teamsFields } from './TeamsDescription';
import { usersOperations, usersFields } from './UsersDescription';

export const resourceOperations: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Account',
				value: 'account',
			},
			{
				name: 'Attribute',
				value: 'attribute',
			},
			{
				name: 'Avatars',
				value: 'avatars',
			},
			{
				name: 'Collection',
				value: 'collection',
			},
			{
				name: 'Database',
				value: 'database',
			},
			{
				name: 'Document',
				value: 'document',
			},
			{
				name: 'Functions',
				value: 'functions',
			},
			{
				name: 'Index',
				value: 'index',
			},
			{
				name: 'Locale',
				value: 'locale',
			},
			{
				name: 'Messaging',
				value: 'messaging',
			},
			{
				name: 'Sites',
				value: 'sites',
			},
			{
				name: 'Storage',
				value: 'storage',
			},
			{
				name: 'Teams',
				value: 'teams',
			},
			{
				name: 'Users',
				value: 'users',
			},
		],
		default: 'document',
	},
];

export const properties: INodeProperties[] = [
	...resourceOperations,

	// Account
	...accountOperations,
	...accountFields,

	// Database
	...databaseOperations,
	...databaseFields,

	// Attribute
	...attributeOperations,
	...attributeFields,

	// Avatars
	...avatarsOperations,
	...avatarsFields,

	// Index
	...indexOperations,
	...indexFields,

	// Collection
	...collectionOperations,
	...collectionFields,

	// Document
	...documentOperations,
	...documentFields,

	// Functions
	...functionsOperations,
	...functionsFields,

	// Locale
	...localeOperations,
	...localeFields,

	// Messaging
	...messagingOperations,
	...messagingFields,

	// Sites
	...sitesOperations,
	...sitesFields,

	// Storage
	...storageOperations,
	...storageFields,

	// Teams
	...teamsOperations,
	...teamsFields,

	// Users
	...usersOperations,
	...usersFields,
];
