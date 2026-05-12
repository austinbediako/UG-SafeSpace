# SafeSpace UG - Remaining Blockers Report

**Generated:** 2026-05-11  
**Status:** 15 Total Items (3 Critical, 8 Medium, 4 Low)

---

## Critical Blockers (Must Resolve Before Production)

### 1. Infrastructure Setup ⚠️
**Priority:** CRITICAL  
**Impact:** Platform cannot run without this

**Tasks:**
- [ ] Verify Docker Compose configuration
- [ ] Start PostgreSQL container
- [ ] Start Redis container
- [ ] Start MinIO container
- [ ] Create MinIO bucket `safespace-evidence`
- [ ] Configure MinIO access policies
- [ ] Apply Prisma migrations
- [ ] Seed database with initial data (if needed)

**Verification Command:**
```bash
docker-compose up -d
cd backend && npx prisma migrate deploy
curl http://localhost:3105/health
```

---

### 2. Email Service Implementation ⚠️
**Priority:** CRITICAL  
**Impact:** Password reset and notifications will fail

**Location:** `backend/src/services/notification.service.ts:186-209`

**Current State:**
```typescript
// TODO: Implement with nodemailer transport
// const transporter = nodemailer.createTransport({ ... });
// await transporter.sendMail({ from: env.SMTP_FROM, ...params });
```

**Required Implementation:**
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === '465',
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendEmail(params: { ... }): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: env.SMTP_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });
    return true;
  } catch (err) {
    logger.error({ err, to: params.to }, "Failed to send email");
    return false;
  }
}
```

**Dependencies:**
- SMTP server credentials (UG email system)
- Environment variables configured

---

### 3. Storage Client Production Implementation ⚠️
**Priority:** CRITICAL  
**Impact:** Evidence upload/download will fail

**Location:** `backend/src/services/evidence.service.ts:40-54`

**Current State:** Stub implementation with placeholder URLs

**Required Implementation:**
- Install `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`
- Implement S3 client for MinIO (S3-compatible)
- Generate proper presigned URLs
- Implement object existence verification

**Code Template:**
```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  endpoint: env.STORAGE_ENDPOINT,
  region: env.STORAGE_REGION || "us-east-1",
  credentials: {
    accessKeyId: env.STORAGE_ACCESS_KEY,
    secretAccessKey: env.STORAGE_SECRET_KEY,
  },
  forcePathStyle: true, // Required for MinIO
});

async function generateUploadUrl(key: string, mimeType: string, expiresIn: number): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: env.STORAGE_BUCKET,
    Key: key,
    ContentType: mimeType,
  });
  return getSignedUrl(s3Client, command, { expiresIn });
}
```

---

## Medium Priority (Should Resolve Before Production)

### 4. Cron Job for Deadline Monitoring
**Priority:** MEDIUM  
**Impact:** Deadline breaches won't trigger notifications

**Location:** `backend/src/services/deadline.service.ts:246-284`

**Implementation Options:**
- Option A: node-cron (in-process)
- Option B: External cron calling API endpoint
- Option C: BullMQ queue with scheduled jobs

**Recommended (Option A):**
```typescript
import cron from 'node-cron';

// Run every hour
cron.schedule('0 * * * *', async () => {
  logger.info("Running deadline check");
  await deadlineService.checkAndUpdateDeadlines();
});
```

---

### 5. Ghana Holiday Table
**Priority:** MEDIUM  
**Impact:** Working day calculations may be inaccurate during holidays

**Location:** `backend/src/services/deadline.service.ts`

**Required Holidays:**
- New Year's Day (January 1)
- Independence Day (March 6)
- Good Friday (variable)
- Easter Monday (variable)
- May Day (May 1)
- Eid al-Fitr (variable)
- Eid al-Adha (variable)
- Founders' Day (August 4)
- Kwame Nkrumah Memorial Day (September 21)
- Farmer's Day (December 1)
- Christmas Day (December 25)
- Boxing Day (December 26)

**Implementation:**
```typescript
const GHANA_HOLIDAYS_2024 = [
  "2024-01-01",
  "2024-03-06",
  "2024-03-29", // Good Friday
  "2024-04-01", // Easter Monday
  // ... etc
];

function isHoliday(date: Date): boolean {
  const dateStr = date.toISOString().split('T')[0];
  return GHANA_HOLIDAYS_2024.includes(dateStr);
}
```

---

### 6. Frontend Permission Enforcement UI
**Priority:** MEDIUM  
**Impact:** Users may see buttons they cannot use

**Implementation:**
- Add `usePermissions()` hook in participation-portal
- Add permission checks before rendering action buttons
- Show disabled state or hide unauthorized actions

**Example:**
```typescript
import { canPerformAction } from "@safespace/security";
import { CaseStage, CaseParticipantRole } from "@safespace/types";

function ActionButtons({ caseStage, userRole }: { caseStage: CaseStage, userRole: CaseParticipantRole }) {
  const canSubmitEvidence = canPerformAction(caseStage, userRole, "UPLOAD_EVIDENCE");
  
  return (
    <>
      {canSubmitEvidence && (
        <button>Submit Evidence</button>
      )}
    </>
  );
}
```

---

### 7. CSRF Protection Review
**Priority:** MEDIUM  
**Impact:** Potential CSRF vulnerability

**Current State:** CSRF tokens not implemented

**Mitigation:** Session-based auth with SameSite cookies provides protection, but explicit CSRF tokens would be safer.

---

### 8. API Response Standardization
**Priority:** MEDIUM  
**Impact:** Inconsistent API responses across endpoints

**Current State:** Some endpoints return `{ data: ... }`, others return direct objects

**Standard Envelope:**
```typescript
interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    hasMore?: boolean;
  };
}
```

---

### 9. Error Handling Consistency
**Priority:** MEDIUM  
**Impact:** Inconsistent error handling across frontend

**Current State:** Each component handles errors differently

**Recommended:** Create shared error handling utilities

---

### 10. Environment Variable Validation
**Priority:** MEDIUM  
**Impact:** Missing env vars cause runtime errors

**Current State:** Basic fallback values provided

**Recommended:** Add startup validation
```typescript
// backend/src/config/env.ts
const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "SESSION_SECRET",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
```

---

### 11. Database Connection Pooling
**Priority:** MEDIUM  
**Impact:** Database performance under load

**Current State:** Default Prisma connection settings

**Recommended:** Configure connection pool
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## Low Priority (Can Resolve Post-Launch)

### 12. WebSocket/SSE Real-time Notifications
**Priority:** LOW  
**Impact:** Notifications require page refresh

**Location:** `backend/src/services/notification.service.ts:32-33`

**Implementation:** Add Socket.io or Server-Sent Events

---

### 13. Frontend Evidence Upload UI
**Priority:** LOW  
**Impact:** Users cannot upload evidence through UI

**Implementation:** Create evidence upload component with:
- File selection
- Progress indicator
- Presigned URL request
- Direct-to-storage upload
- Confirmation call

---

### 14. API Documentation
**Priority:** LOW  
**Impact:** Developer onboarding difficulty

**Options:**
- Swagger/OpenAPI specification
- Postman collection
- API documentation site

---

### 15. Performance Optimization
**Priority:** LOW  
**Impact:** Slow load times under heavy usage

**Areas:**
- Database query optimization (add indexes)
- Frontend code splitting
- Image/asset optimization
- CDN setup for static assets

---

## Dependencies Summary

### NPM Packages Needed
```bash
# Email
npm install nodemailer
npm install --save-dev @types/nodemailer

# Cron (for deadline monitoring)
npm install node-cron
npm install --save-dev @types/node-cron

# S3/MinIO (for storage)
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

# WebSocket (optional)
npm install socket.io
```

### External Services Needed
- SMTP server (UG email system)
- PostgreSQL database
- Redis server
- MinIO/S3 object storage

---

## Resolution Timeline Recommendation

### Week 1 (Critical)
- Infrastructure setup
- Email service
- Storage client

### Week 2 (Medium)
- Cron jobs
- Holiday table
- Permission UI
- CSRF review

### Week 3 (Low/Polish)
- Real-time notifications
- API documentation
- Performance optimization

---

## Verification Checklist

- [ ] All Docker containers running
- [ ] Database migrations applied
- [ ] MinIO bucket created and accessible
- [ ] Email sending verified (test account)
- [ ] Evidence upload/download working
- [ ] All 10 E2E flows passing
- [ ] Security scan completed
- [ ] Performance baseline established

---

**Report End**
