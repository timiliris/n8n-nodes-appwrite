/**
 * Test suite for Query Builder enhancements
 * This file demonstrates the enhanced query builder functionality
 */

import { validateQuery, validateQueryAttribute, formatQueryPreview } from '../nodes/Appwrite/utils/validators';

console.log('=== Query Builder Enhancement Tests ===\n');

// Test 1: Query Attribute Validation
console.log('Test 1: Attribute Validation');
console.log('-'.repeat(50));
const attr1 = validateQueryAttribute('status');
console.log('Valid attribute "status":', attr1);

const attr2 = validateQueryAttribute('user.email');
console.log('Valid nested attribute "user.email":', attr2);

const attr3 = validateQueryAttribute('invalid attr!');
console.log('Invalid attribute with special chars:', attr3);

const attr4 = validateQueryAttribute('');
console.log('Empty attribute:', attr4);
console.log();

// Test 2: Query Validation
console.log('Test 2: Query Validation');
console.log('-'.repeat(50));

const query1 = validateQuery({
	queryType: 'equal',
	attribute: 'status',
	value: 'active',
});
console.log('Valid equal query:', query1);

const query2 = validateQuery({
	queryType: 'equal',
	attribute: 'status',
	// Missing value
});
console.log('Equal query without value:', query2);

const query3 = validateQuery({
	queryType: 'between',
	attribute: '$createdAt',
	startValue: '2024-01-01',
	endValue: '2024-12-31',
});
console.log('Valid between query:', query3);

const query4 = validateQuery({
	queryType: 'between',
	attribute: '$createdAt',
	startValue: '2024-01-01',
	// Missing endValue
});
console.log('Between query missing end value:', query4);

const query5 = validateQuery({
	queryType: 'limit',
	limitValue: 25,
});
console.log('Valid limit query:', query5);

const query6 = validateQuery({
	queryType: 'limit',
	limitValue: 10000, // Exceeds max
});
console.log('Limit query exceeds maximum:', query6);

const query7 = validateQuery({
	queryType: 'offset',
	offsetValue: 0,
});
console.log('Valid offset query:', query7);
console.log();

// Test 3: Query Preview Formatting
console.log('Test 3: Query Preview Formatting');
console.log('-'.repeat(50));

const queries1 = [
	'Query.equal("status", "active")',
	'Query.greaterThan("age", "18")',
	'Query.limit(25)',
];
console.log('Formatted preview:');
console.log(formatQueryPreview(queries1));
console.log();

const queries2: string[] = [];
console.log('Empty query array:');
console.log(formatQueryPreview(queries2));
console.log();

// Test 4: Query Templates
console.log('Test 4: Query Templates (Conceptual)');
console.log('-'.repeat(50));
console.log('Available Templates:');
console.log('1. Active Users: Query.equal("status", "active")');
console.log('2. Recent Documents: Query.orderDesc("$createdAt"), Query.limit(25)');
console.log('3. Search by Name: Query.search("name", "search_term")');
console.log('4. Date Range: Query.between("$createdAt", "start", "end")');
console.log('5. Paginated Results: Query.limit(25), Query.offset(0)');
console.log();

// Test 5: Complex Query Combinations
console.log('Test 5: Complex Query Validation');
console.log('-'.repeat(50));

const complexQuery1 = validateQuery({
	queryType: 'search',
	attribute: 'description',
	value: 'appwrite',
});
console.log('Search query:', complexQuery1);

const complexQuery2 = validateQuery({
	queryType: 'select',
	values: '$id,name,email,status',
});
console.log('Select query:', complexQuery2);

const complexQuery3 = validateQuery({
	queryType: 'startsWith',
	attribute: 'name',
	value: 'John',
});
console.log('Starts with query:', complexQuery3);

const complexQuery4 = validateQuery({
	queryType: 'isNull',
	attribute: 'deletedAt',
});
console.log('Is null query:', complexQuery4);
console.log();

console.log('=== All Tests Completed ===');
