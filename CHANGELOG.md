# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.12.0] - 2025-01-14

### Added

#### New Services (5)
- **Messaging Service** with 18 operations
  - Send transactional emails via Sendgrid and Mailgun
  - Send SMS messages via Twilio
  - Send push notifications via FCM (Firebase) and APNS (Apple)
  - Manage messaging providers, topics, and subscribers
  - List and track sent messages
- **Functions Service** with 18 operations
  - Create and manage serverless functions
  - Deploy function code with 40+ runtime support (Node.js, Python, PHP, Ruby, Dart, .NET, Java, Swift, Kotlin, C++, Bun, Deno)
  - Execute functions synchronously or asynchronously
  - Manage function deployments and executions
  - Configure environment variables
- **Account Service** with 37 operations
  - Complete client-side authentication
  - OAuth2 login with 26 providers (Google, GitHub, Facebook, etc.)
  - Multi-Factor Authentication (MFA) with TOTP
  - Email and phone verification
  - Session management (create, list, delete)
  - Password recovery
  - JWT token generation
  - Magic URL passwordless login
  - User preferences management
- **Locale Service** with 8 operations
  - Get user locale based on IP geolocation
  - List countries, continents, currencies, and languages
  - ISO codes for internationalization
  - Country phone codes for validation
  - EU country list for compliance
- **Avatars Service** with 7 operations
  - Generate QR codes from text
  - Generate user initials avatars
  - Get browser icons
  - Get credit card type icons
  - Get country flags
  - Get website favicons
  - Fetch and crop remote images

#### Enhanced Services
- **Users Service**: Expanded from 5 to 19 operations (+280%)
  - updateEmail, updatePhone, updatePassword
  - updateEmailVerification, updatePhoneVerification
  - getPrefs, updatePrefs
  - listSessions, deleteSessions, deleteSession
  - listLogs, updateLabels, listMemberships
  - updateMfa, createMfaAuthenticator, updateMfaAuthenticator

- **Document Service**: Added batch operations
  - batchCreate, batchUpdate, batchDelete

#### Batch Operations Framework
- High-performance bulk processing for up to 1000 items
- Parallel and sequential processing modes
- Partial success support with detailed error reporting

#### Query Builder Enhancements
- 5 pre-built query templates
- Comprehensive query validation
- Query preview with formatted output

### Statistics
- **Total Services**: 8 → 13 (+62%)
- **Total Operations**: 76 → 164 (+116%)
- **Test Coverage**: 88 → 110 tests (+25%)
- **Code Added**: ~8,000 lines

