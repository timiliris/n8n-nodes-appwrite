# Security Policy

## Overview

This document outlines security best practices and policies for using the n8n-nodes-appwrite-full package.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.10.x  | :white_check_mark: |
| < 0.10  | :x:                |

## Reporting Security Vulnerabilities

If you discover a security vulnerability in this project, please report it by:

1. **DO NOT** open a public GitHub issue
2. Email the maintainer at: timiliris@example.com
3. Include a detailed description of the vulnerability
4. Provide steps to reproduce (if applicable)
5. Suggest a fix (if you have one)

We aim to respond to security reports within 48 hours.

## Security Best Practices

### API Key Management

#### ✅ DO

- Store API keys securely in n8n credentials manager
- Use API keys with minimum required scopes
- Rotate API keys regularly (recommended: every 90 days)
- Create separate API keys for different environments (dev, staging, production)
- Revoke API keys immediately when:
  - Team members leave
  - Keys are suspected to be compromised
  - Projects are decommissioned

#### ❌ DON'T

- Hard-code API keys in workflows
- Share API keys via email, chat, or version control
- Use production API keys in development environments
- Grant more permissions than necessary
- Reuse API keys across multiple projects

### Appwrite API Key Scopes

Configure API keys with minimum required scopes:

| Operation Type | Required Scopes |
|---------------|-----------------|
| Databases | `databases.read`, `databases.write` |
| Collections | `collections.read`, `collections.write` |
| Documents | `documents.read`, `documents.write` |
| Storage | `files.read`, `files.write`, `buckets.read`, `buckets.write` |
| Sites | `sites.read`, `sites.write` |
| Teams | `teams.read`, `teams.write` |
| Users | `users.read`, `users.write` |

**Important**: Only grant the scopes your workflows actually need.

### Data Validation

This package includes built-in validation for:

- **ID validation**: Alphanumeric, underscore, hyphen only (max 36 chars)
- **JSON parsing**: Safe parsing with size limits (max 1MB)
- **Email validation**: RFC-compliant email format
- **Name validation**: Maximum 128 characters

#### Custom Validation

For sensitive data, add additional validation in your workflows:

```javascript
// Example: Validate user input before creating document
if (!email.includes('@')) {
  throw new Error('Invalid email format');
}

if (password.length < 12) {
  throw new Error('Password must be at least 12 characters');
}
```

### Permissions Configuration

When creating documents or files, always specify explicit permissions:

```json
{
  "permissions": [
    "read(\"user:USER_ID\")",
    "write(\"user:USER_ID\")"
  ]
}
```

#### ❌ Avoid Overly Permissive Settings

```json
// DON'T: Allows anyone to read/write
{
  "permissions": [
    "read(\"any\")",
    "write(\"any\")"
  ]
}
```

#### ✅ Use Role-Based Permissions

```json
// DO: Restrict to specific roles
{
  "permissions": [
    "read(\"role:members\")",
    "write(\"role:admins\")"
  ]
}
```

### File Upload Security

When working with file uploads:

1. **Validate file types**: Use bucket `allowedFileExtensions`
2. **Limit file size**: Set `maximumFileSize` on buckets
3. **Enable antivirus**: Set `antivirus: true` on buckets (Appwrite Cloud)
4. **Enable encryption**: Set `encryption: true` for sensitive files

Example secure bucket configuration:

```javascript
{
  "bucketId": "secure-files",
  "name": "Secure Files",
  "permissions": ["read(\"role:members\")"],
  "fileSecurity": true,
  "enabled": true,
  "options": {
    "maximumFileSize": 5242880, // 5MB
    "allowedFileExtensions": ["pdf", "jpg", "png"],
    "encryption": true,
    "antivirus": true
  }
}
```

### Password Handling

When creating users:

1. **Never log passwords**: Ensure workflows don't log sensitive data
2. **Use strong passwords**: Enforce minimum 12 characters with complexity
3. **Don't send passwords in plain text**: Use secure password reset flows
4. **Hash on server**: Appwrite handles hashing - never pre-hash passwords

### Environment-Specific Configuration

Use different Appwrite projects for different environments:

| Environment | Configuration |
|------------|---------------|
| Development | Test project with limited data |
| Staging | Separate project mirroring production |
| Production | Production project with strict security |

Configure credentials separately for each environment in n8n.

### Rate Limiting

Be aware of Appwrite rate limits:

- **Appwrite Cloud**: Varies by plan
- **Self-hosted**: Configurable

Implement retry logic with exponential backoff:

```javascript
// Example: Retry with backoff
let retries = 3;
while (retries > 0) {
  try {
    await createDocument(...);
    break;
  } catch (error) {
    if (error.code === 429) { // Rate limit
      await sleep(Math.pow(2, 3 - retries) * 1000);
      retries--;
    } else {
      throw error;
    }
  }
}
```

### Audit Logging

Enable audit logging in Appwrite to track:

- Document creations/modifications/deletions
- User management actions
- Permission changes
- File uploads/downloads

Review logs regularly for suspicious activity.

### Network Security

#### For Self-Hosted Appwrite

- Use HTTPS only (enforce TLS 1.2+)
- Configure firewall rules
- Use VPN for administrative access
- Implement IP whitelisting for API access
- Enable CORS appropriately

#### For Appwrite Cloud

- Verify endpoint is `https://cloud.appwrite.io/v1`
- Never connect over HTTP
- Use webhook signatures for webhooks

### Input Sanitization

This package validates inputs, but always sanitize data in workflows:

```javascript
// Example: Sanitize HTML content
const sanitized = htmlContent
  .replace(/<script[^>]*>.*?<\/script>/gi, '')
  .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');
```

### Error Handling

The package provides structured error handling. In workflows:

1. **Don't expose sensitive errors to users**: Log detailed errors internally
2. **Use generic messages**: "An error occurred" instead of exposing stack traces
3. **Enable `continueOnFail`**: For non-critical operations

### Dependency Security

This package is scanned for vulnerabilities. To check:

```bash
npm audit
```

Update dependencies regularly:

```bash
npm update n8n-nodes-appwrite-full
```

### Common Vulnerabilities to Avoid

| Vulnerability | Mitigation |
|--------------|------------|
| **Injection** | Use validated, parameterized inputs |
| **Broken Auth** | Use Appwrite's built-in auth, validate sessions |
| **Sensitive Data Exposure** | Encrypt at rest, use HTTPS, limit permissions |
| **XXE** | Avoid parsing untrusted XML |
| **Broken Access Control** | Use role-based permissions, validate IDs |
| **Security Misconfiguration** | Follow this guide, review settings |
| **XSS** | Sanitize outputs, use Content Security Policy |
| **Insecure Deserialization** | Validate JSON before parsing (done automatically) |
| **Insufficient Logging** | Enable audit logs, monitor errors |
| **SSRF** | Validate URLs, use allowlists |

## Data Size Limits

The package enforces the following limits:

- **JSON payload**: 1 MB maximum
- **ID length**: 36 characters maximum
- **Name length**: 128 characters maximum

These limits prevent:
- Memory exhaustion attacks
- Buffer overflow attempts
- Denial of service via large payloads

## Compliance

When using this package for applications subject to:

- **GDPR**: Ensure proper consent, implement data deletion, use encryption
- **HIPAA**: Use encryption, audit logs, access controls, BAA with Appwrite
- **PCI-DSS**: Never store credit card data in Appwrite, use compliant payment processor
- **SOC 2**: Enable logging, implement access controls, regular security reviews

## Security Checklist

Before deploying workflows to production:

- [ ] API keys use minimum required scopes
- [ ] Credentials stored securely in n8n
- [ ] Permissions configured with least privilege
- [ ] File upload validation enabled
- [ ] Error handling doesn't expose sensitive info
- [ ] Audit logging enabled in Appwrite
- [ ] HTTPS enforced for all connections
- [ ] Rate limiting considered
- [ ] Input validation implemented
- [ ] Dependencies up to date
- [ ] Security policies documented for team

## Additional Resources

- [Appwrite Security Documentation](https://appwrite.io/docs/security)
- [n8n Security Best Practices](https://docs.n8n.io/hosting/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Appwrite Permissions Guide](https://appwrite.io/docs/permissions)

## Updates

This security policy is reviewed quarterly and updated as needed.

**Last Updated**: 2024-11-14
**Version**: 1.0.0
