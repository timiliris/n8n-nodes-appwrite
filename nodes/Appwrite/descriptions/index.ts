import { INodeProperties } from 'n8n-workflow';

import { attributeOperations, attributeFields } from './AttributeDescription';
import { collectionOperations, collectionFields } from './CollectionDescription';
import { databaseOperations, databaseFields } from './DatabaseDescription';
import { documentOperations, documentFields } from './DocumentDescription';
import { indexOperations, indexFields } from './IndexDescription';
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
				name: 'Attribute',
				value: 'attribute',
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
				name: 'Index',
				value: 'index',
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

	// Database
	...databaseOperations,
	...databaseFields,

	// Attribute
	...attributeOperations,
	...attributeFields,

	// Index
	...indexOperations,
	...indexFields,

	// Collection
	...collectionOperations,
	...collectionFields,

	// Document
	...documentOperations,
	...documentFields,

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
