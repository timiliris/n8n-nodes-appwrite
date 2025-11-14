# n8n-nodes-appwrite-full

![n8n-nodes-appwrite-full](https://github.com/timiliris/n8n-nodes-appwrite/blob/main/nodes/Appwrite/Appwrite.svg)

This is an n8n community node that lets you interact with [Appwrite](https://appwrite.io/) - the open-source backend-as-a-service platform. It provides a complete integration with all major Appwrite services.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Appwrite](https://appwrite.io/) is an open-source backend platform for building web, mobile, and flutter applications.

## Features

- **Single node, full coverage** &mdash; manage Appwrite Databases, Collections, Documents, Attributes, Indexes, Sites, Storage, Teams, and Users from one node.
- **Schema tooling built-in** &mdash; create all attribute types (string, integer, boolean, enum, float, datetime, email) individually or in bulk, and keep indexes in sync.
- **Rich storage workflows** &mdash; upload files from n8n binary data, update metadata, generate previews with transformation options, download, or stream file views.
- **Sites deployment** &mdash; deploy static and SSR websites, manage deployments from code uploads or Git repositories, configure environment variables, and control active deployments.
- **Team automation** &mdash; create teams, update preferences, and fully manage memberships (invite, list, update, delete) without leaving the workflow.
- **Icon included** &mdash; ships with a custom Appwrite SVG icon so the node is recognizable inside n8n.
- **AI Tool Support** &mdash; can be used as a tool in AI agents (usableAsTool: true).

> **⚠️ Important Notice**: This project is actively under development and has not been fully tested in all scenarios. While it includes comprehensive functionality, you may encounter bugs or unexpected behavior. If you discover any issues, please [open a GitHub issue](https://github.com/timiliris/n8n-nodes-appwrite/issues/new) with detailed information about the problem. Your feedback helps improve the node for everyone!

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Node Installation

1. Go to **Settings > Community Nodes** in your n8n instance
2. Select **Install**
3. Enter `n8n-nodes-appwrite-full` in the **Package Name** field
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes
5. Select **Install**

After installation, the Appwrite node will be available in your node palette.

### Manual Installation

To install manually, navigate to your n8n installation directory and run:

```bash
npm install n8n-nodes-appwrite-full
```

## Operations

This node supports the following Appwrite services:

| Resource | Operations | Description |
| --- | --- | --- |
| **Database** | Create, List, Get, Update, Delete | Manage Appwrite databases |
| **Collection** | Create, List, Get, Update, Delete, List Attributes, List Indexes | Manage collections with full schema visibility |
| **Document** | Create, List, Get, Update, Delete | Manage documents with JSON payloads and custom permissions |
| **Attribute** | Create String, Create Integer, Create Boolean, Create Enum, Create Float, Create Email, Create DateTime, Delete | Create all attribute types individually or define schemas |
| **Index** | Create, List, Delete | Create key, fulltext, and unique indexes for optimized queries |
| **Sites** | Create, List, Get, Update, Delete, Create Deployment, List Deployments, Get Deployment, Update Active Deployment, Delete Deployment, Create Variable, List Variables, Get Variable, Update Variable, Delete Variable, List Frameworks, List Specifications | Deploy and manage static and SSR websites with Git integration and environment variables |
| **Storage** | Create Bucket, List Buckets, Get Bucket, Update Bucket, Delete Bucket, Upload File, List Files, Get File, Update File, Delete File, Download File, Get File View, Get File Preview | Complete file storage management with binary support and image transformations (width, height, quality, rotation, border, background, compression) |
| **Teams** | Create, List, Get, Update, Delete, Create Membership, List Memberships, Get Membership, Update Membership, Delete Membership, Get Preferences, Update Preferences | Full team and membership lifecycle management with preferences support |
| **Users** | Create, List, Get, Update, Delete | User account management |

## Credentials

To use this node, you need to set up Appwrite API credentials:

### Creating API Credentials

1. **Log in to your Appwrite Console**
   - Visit [cloud.appwrite.io](https://cloud.appwrite.io) or your self-hosted instance

2. **Create or select a project**
   - Navigate to your project or create a new one

3. **Generate an API Key**
   - Go to **Settings** → **API Keys**
   - Click **Create API Key**
   - Give your key a name (e.g., "n8n Integration")
   - Set the appropriate scopes based on operations you need:
     - `databases.*` - For database operations
     - `collections.*` - For collection operations
     - `documents.*` - For document operations
     - `files.*` - For storage operations
     - `buckets.*` - For bucket operations
     - `sites.*` - For sites and deployment operations
     - `teams.*` - For team operations
     - `users.*` - For user management
   - Click **Create**
   - Copy the generated API key (it won't be shown again!)

4. **Get your Project ID**
   - Go to **Settings** → **Settings**
   - Copy your **Project ID**

### Configuring n8n Credentials

In n8n, create new Appwrite API credentials with:

- **Endpoint**: Your Appwrite endpoint URL
  - Cloud: `https://cloud.appwrite.io/v1`
  - Self-hosted: `https://your-domain.com/v1`
- **Project ID**: Your project ID from the Appwrite console
- **API Key**: The API key you generated

## Compatibility

- **Minimum n8n version**: 0.198.0
- **Tested with n8n version**: 1.0.0+
- **Appwrite version**: 1.4.x - 1.8.x+
- **Node.js version**: 18.17.0+
- **Appwrite SDK**: 20.3.0 (node-appwrite)

## Usage

### Example 1: Create a Document

1. Add an **Appwrite** node to your workflow
2. Select your Appwrite credentials
3. Choose **Resource**: `Document`
4. Choose **Operation**: `Create`
5. Fill in:
   - **Database ID**: `main` (or your database ID)
   - **Collection ID**: `users` (or your collection ID)
   - **Document ID**: `unique()` (auto-generate) or specify an ID
   - **Data**:
     ```json
     {
       "name": "John Doe",
       "email": "john@example.com",
       "age": 30
     }
     ```

### Example 2: List Documents

1. Add an **Appwrite** node
2. Select your credentials
3. Choose **Resource**: `Document`
4. Choose **Operation**: `List`
5. Fill in:
   - **Database ID**: `main`
   - **Collection ID**: `users`

### Example 3: Upload a File to Storage

1. Add an **Appwrite** node
2. Select your credentials
3. Choose **Resource**: `Storage`
4. Choose **Operation**: `Upload File`
5. Fill in:
   - **Bucket ID**: `avatars` (or your bucket ID)
   - **File ID**: `unique()` or specify an ID
   - **Binary Property Name**: `data` (or your binary field name)
   - **Permissions**: `["read(\"any\")"]` (JSON array)

### Example 4: Generate Image Preview with Transformations

1. Add an **Appwrite** node
2. Select your credentials
3. Choose **Resource**: `Storage`
4. Choose **Operation**: `Get File Preview`
5. Fill in:
   - **Bucket ID**: `images`
   - **File ID**: your file ID
   - Under **Preview Options**:
     - **Width**: `400`
     - **Height**: `400`
     - **Quality**: `80`
     - **Border Radius**: `10`
     - **Output**: `webp`

### Example 5: Deploy a Static Site

1. Add an **Appwrite** node
2. Select your credentials
3. Choose **Resource**: `Sites`
4. Choose **Operation**: `Create Site`
5. Fill in:
   - **Site ID**: `unique()` or specify an ID
   - **Name**: `My Portfolio`
   - **Framework**: `nextjs` or your framework
   - **Build Runtime**: `node-22`
   - Under **Options**:
     - **Build Command**: `npm run build`
     - **Install Command**: `npm install`
     - **Output Directory**: `out`
     - **Adapter**: `static` or `ssr`

### Example 6: Create Deployment from Git

1. Add an **Appwrite** node
2. Select your credentials
3. Choose **Resource**: `Sites`
4. Choose **Operation**: `Create Deployment`
5. Fill in:
   - **Site ID**: your site ID
   - **Deployment Source**: `Git Repository`
   - **VCS Type**: `branch`
   - **VCS Reference**: `main`
   - **Activate**: `true`

### Example 7: Manage Environment Variables

1. Add an **Appwrite** node
2. Select your credentials
3. Choose **Resource**: `Sites`
4. Choose **Operation**: `Create Variable`
5. Fill in:
   - **Site ID**: your site ID
   - **Key**: `API_KEY`
   - **Value**: `your-secret-key`
   - **Is Secret**: `true`

### Example 8: Create Storage Bucket

1. Add an **Appwrite** node
2. Select your credentials
3. Choose **Resource**: `Storage`
4. Choose **Operation**: `Create Bucket`
5. Fill in:
   - **Bucket ID**: `avatars`
   - **Name**: `User Avatars`
   - **Permissions**: `["read(\"any\")"]`
   - **File Security**: `true`
   - **Enabled**: `true`
   - Under **Options**:
     - **Maximum File Size**: `10485760` (10MB in bytes)
     - **Allowed File Extensions**: `jpg, png, gif, webp`
     - **Compression**: `gzip`

### Example 9: Invite a Team Member

1. Add an **Appwrite** node
2. Select your credentials
3. Choose **Resource**: `Teams`
4. Choose **Operation**: `Create Membership`
5. Fill in:
   - **Team ID**: the team you created earlier
   - **Email** or **User ID** of the invitee
   - **Roles**: `owner,admin`
   - (Optional) **URL** to send the user back to for confirmation

### Example 10: Create a User

1. Add an **Appwrite** node
2. Select your credentials
3. Choose **Resource**: `Users`
4. Choose **Operation**: `Create User`
5. Fill in:
   - **User ID**: `unique()` or specify an ID
   - **Email**: `user@example.com`
   - **Password**: `SecurePassword123!`
   - **Name**: `New User` (optional)

## Development

If you want to contribute or modify this node:

```bash
# Clone the repository
git clone https://github.com/timiliris/n8n-nodes-appwrite-full.git
cd n8n-nodes-appwrite-full

# Install dependencies
npm install

# Build the node
npm run build

# Run linting
npm run lint

# Run tests
npm test

# Run n8n with the node in development mode
npm run dev
```

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Appwrite documentation](https://appwrite.io/docs)
- [Appwrite API reference](https://appwrite.io/docs/apis/rest)
- [Node.js SDK documentation](https://appwrite.io/docs/sdks#server)
- [Appwrite Sites documentation](https://appwrite.io/docs/products/sites)

## Version History

### 0.11.0 (Latest) - Quality & Performance Release
- **SECURITY**: Enhanced security with comprehensive input validation
  - Removed stack trace exposure from error responses
  - Added query injection protection with value escaping
  - Implemented strict permission format validation
  - Safe JSON parsing with size limits
- **PERFORMANCE**: Optimized Storage operations
  - Eliminated 3 redundant API calls in file operations
  - 50-75% faster file download, view, and preview operations
  - Improved service initialization efficiency
- **QUALITY**: Production-ready code quality
  - Zero ESLint errors
  - Comprehensive JSDoc documentation on all operation files
  - Type assertions documented with justifications
  - Enhanced retry logic with exponential backoff
  - Configurable timeouts for all operations
- **TESTING**: Expanded test coverage
  - 88 passing tests across 8 test suites
  - Unit tests for Database and Collection operations
  - Integration test template for end-to-end testing
  - Retry logic and permission validation tests
- **RELIABILITY**: Improved error handling
  - Retry logic for rate limiting (429) and transient failures
  - Better error messages without sensitive information
  - Graceful handling of SDK compatibility issues

### 0.10.0
- **NEW**: Full Sites API support with 17 operations
  - Deploy static and SSR websites
  - Manage deployments from code uploads or Git repositories
  - Configure environment variables for build and runtime
  - Control active deployments and manage site lifecycle
  - List available frameworks and specifications
- Updated node-appwrite SDK from v13.0.0 to v20.3.0
- Added support for latest Appwrite features
- Enhanced TypeScript configuration for better module resolution

### 0.9.1
- Fixed InputFile import path for Storage operations
- Updated TypeScript module resolution to node16
- Resolved package export compatibility issues

### 0.9.0
- **NEW**: Complete Storage API with 13 operations
  - Bucket CRUD operations (Create, List, Get, Update, Delete)
  - File operations with binary support (Upload, List, Get, Update, Delete)
  - File download and streaming (Download File, Get File View)
  - Advanced image preview with 11 transformation options (width, height, gravity, quality, border, opacity, rotation, background, output format)
- **NEW**: Teams resource with 12 operations
  - Team management (Create, List, Get, Update, Delete)
  - Membership management (Create, List, Get, Update, Delete)
  - Team preferences (Get, Update)
- Enhanced binary data handling with InputFile support
- Improved error handling and success responses

### 0.8.1
- Added `usableAsTool` support for AI agents
- Improved node metadata and descriptions

### 0.3.8
- Renamed package to `n8n-nodes-appwrite-full` for easier installation
- Added Appwrite SVG icon bundled with the node
- Introduced Attribute, Collection, Index operations
- Improved documentation and examples

### 0.1.0
- Initial release
- Database operations (CRUD)
- Basic Storage operations (file management)
- Users operations (user management)

## License

[MIT](LICENSE)

## Support

For bugs, questions and discussions please use the [GitHub Issues](https://github.com/timiliris/n8n-nodes-appwrite-full/issues).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Made with ❤️ for the n8n and Appwrite communities**
