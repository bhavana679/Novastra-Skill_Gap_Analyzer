# Resume Versioning System

## Overview
The Resume model now supports versioning, allowing multiple versions of resumes to be stored for each profile while maintaining a clear history.

## Schema Changes

### New Fields Added to Resume Model

1. **profileId** (String, optional, indexed)
   - Identifies which user/profile the resume belongs to
   - Used to group multiple resume versions together
   - Indexed for faster queries

2. **version** (Number, default: 1)
   - Tracks the version number of the resume
   - Automatically incremented when a new resume is uploaded for the same profile
   - Starts at 1 for the first resume

3. **isActive** (Boolean, default: true)
   - Indicates whether this is the current active version
   - Only one resume per profile should have isActive: true
   - Previous versions are automatically marked as inactive

## How It Works

### Uploading a Resume

#### Without profileId (Backward Compatible)
```javascript
// POST /api/resume/upload
// Form data: file only
// Result: Creates a resume with version 1, isActive: true, no profileId
```

#### With profileId (Versioning Enabled)
```javascript
// POST /api/resume/upload
// Form data: file + profileId (in body or query)
// Result: 
// - Finds latest version for that profileId
// - Increments version number
// - Marks all previous versions as inactive
// - Creates new resume with new version number
```

### Example Flow

**First Upload (profileId: "user123")**
```json
{
  "resumeId": "abc123",
  "version": 1,
  "isActive": true,
  "profileId": "user123"
}
```

**Second Upload (same profileId: "user123")**
- Previous resume (version 1) is marked as `isActive: false`
- New resume is created:
```json
{
  "resumeId": "def456",
  "version": 2,
  "isActive": true,
  "profileId": "user123"
}
```

**Third Upload (same profileId: "user123")**
- Previous resume (version 2) is marked as `isActive: false`
- New resume is created:
```json
{
  "resumeId": "ghi789",
  "version": 3,
  "isActive": true,
  "profileId": "user123"
}
```

## API Usage

### Upload Resume with Versioning

**Using Form Body:**
```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -F "file=@resume.pdf" \
  -F "profileId=user123"
```

**Using Query Parameter:**
```bash
curl -X POST "http://localhost:5000/api/resume/upload?profileId=user123" \
  -F "file=@resume.pdf"
```

### Response Format
```json
{
  "success": true,
  "resumeId": "65abc123def456",
  "version": 2,
  "isActive": true,
  "text": "Extracted resume text...",
  "extractedData": {
    "skills": ["JavaScript", "Node.js"],
    "education": ["B.S. Computer Science"],
    "experienceLevel": "Mid-level"
  }
}
```

## Helper Functions

Use the `resumeVersion.service.js` helper functions for common queries:

### Get Active Resume for a Profile
```javascript
import { getActiveResumeByProfile } from '../services/resumeVersion.service.js';

const activeResume = await getActiveResumeByProfile('user123');
```

### Get All Versions for a Profile
```javascript
import { getAllResumeVersions } from '../services/resumeVersion.service.js';

const allVersions = await getAllResumeVersions('user123');
// Returns array sorted by version (newest first)
```

### Get Specific Version
```javascript
import { getResumeByVersion } from '../services/resumeVersion.service.js';

const version2 = await getResumeByVersion('user123', 2);
```

### Get Latest Version Number
```javascript
import { getLatestVersion } from '../services/resumeVersion.service.js';

const latestVersionNum = await getLatestVersion('user123');
// Returns 0 if no resumes exist for this profile
```

## Database Queries

### Find Active Resume
```javascript
const activeResume = await Resume.findOne({ 
  profileId: 'user123', 
  isActive: true 
});
```

### Find All Versions
```javascript
const allVersions = await Resume.find({ 
  profileId: 'user123' 
}).sort({ version: -1 });
```

### Find Specific Version
```javascript
const specificVersion = await Resume.findOne({ 
  profileId: 'user123', 
  version: 2 
});
```

## Backward Compatibility

✅ **Existing resumes without profileId continue to work**
- They will have `version: 1` and `isActive: true` by default
- No breaking changes to existing data
- Old upload flow (without profileId) still works perfectly

## Best Practices

1. **Always provide profileId** when you want versioning
2. **Use helper functions** instead of writing raw queries
3. **Query by isActive: true** to get current resume
4. **Keep version history** - don't delete old versions
5. **Index profileId** is already set up for performance

## Migration Notes

- No migration needed for existing data
- All existing resumes will have default values:
  - `version: 1`
  - `isActive: true`
  - `profileId: undefined` (not set)
- These resumes will continue to work as before
