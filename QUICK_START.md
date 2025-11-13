# Quick Start Guide - n8n-nodes-appwrite-full

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build the Project
```bash
npm run build
```

### Step 3: Test Locally
```bash
# Run all tests
npm test

# Check linting
npm run lint
```

### Step 4: Test in n8n
```bash
npm run dev
```

This will start n8n with your node loaded. Open http://localhost:5678

### Step 5: Create Appwrite Credentials

1. **In Appwrite Console**:
   - Go to your project
   - Navigate to Settings > API Keys
   - Create new API key with scopes:
     - `databases.*`
     - `collections.*`
     - `documents.*`
     - `files.*`
     - `users.*`
   - Copy API Key and Project ID

2. **In n8n**:
   - Go to Credentials > New
   - Search for "Appwrite"
   - Fill in:
     - Endpoint: `https://cloud.appwrite.io/v1`
     - Project ID: `[your-project-id]`
     - API Key: `[your-api-key]`
   - Click "Save"

### Step 6: Create Your First Workflow

1. **Add Manual Trigger**:
   - Drag "Manual Trigger" to canvas

2. **Add Appwrite Node**:
   - Search "Appwrite" in node panel
   - Drag to canvas
   - Connect to trigger

3. **Configure Appwrite Node**:
   - Select your credentials
   - Resource: `Database`
   - Operation: `List Documents`
   - Database ID: `[your-database-id]`
   - Collection ID: `[your-collection-id]`

4. **Test**:
   - Click "Execute Node"
   - See results

## 📝 Example: Create a Document

```json
{
  "resource": "database",
  "operation": "createDocument",
  "databaseId": "main",
  "collectionId": "users",
  "documentId": "unique()",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }
}
```

## 📝 Example: List Users

```json
{
  "resource": "users",
  "operation": "listUsers"
}
```

## 🔧 Development Tips

### Hot Reload
```bash
npm run build:watch
```

### Format Code
```bash
npm run format
```

### Fix Linting Issues
```bash
npm run lint:fix
```

## 🐛 Common Issues

### Issue: Node doesn't appear in n8n
**Solution**: Restart n8n and clear browser cache

### Issue: Credentials test fails
**Solution**:
- Check endpoint URL (must end with /v1)
- Verify API key has correct scopes
- Ensure Project ID is correct

### Issue: Build fails
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: TypeScript errors
**Solution**: Make sure you're using Node.js 18.17.0+
```bash
node --version
```

## 📚 Resources

- [Full README](./README.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Project Summary](./PROJECT_SUMMARY.md)
- [n8n Documentation](https://docs.n8n.io/)
- [Appwrite Documentation](https://appwrite.io/docs)

## 🎯 Next Steps

1. ✅ Test all operations with your Appwrite instance
2. ✅ Read CONTRIBUTING.md if you want to contribute
3. ✅ Star the repo on GitHub
4. ✅ Share feedback via GitHub Issues
5. ✅ Join n8n and Appwrite communities

---

**Happy Automating! 🎉**
