/**
 * Resume Versioning Test Examples
 * 
 * These examples demonstrate how to test the resume versioning system
 * using Postman or curl commands.
 */

// ============================================
// Example 1: Upload First Resume (Version 1)
// ============================================

// Using Postman:
// - Method: POST
// - URL: http://localhost:5000/api/resume/upload
// - Body: form-data
//   - file: [select your resume.pdf]
//   - profileId: user123

// Using curl:
/*
curl -X POST http://localhost:5000/api/resume/upload \
  -F "file=@resume.pdf" \
  -F "profileId=user123"
*/

// Expected Response:
/*
{
  "success": true,
  "resumeId": "65abc123...",
  "version": 1,
  "isActive": true,
  "text": "Extracted text...",
  "extractedData": {
    "skills": [...],
    "education": [...],
    "experienceLevel": "..."
  }
}
*/

// ============================================
// Example 2: Upload Second Resume (Version 2)
// ============================================

// Same profileId - this will create version 2 and mark version 1 as inactive

// Using curl:
/*
curl -X POST http://localhost:5000/api/resume/upload \
  -F "file=@updated_resume.pdf" \
  -F "profileId=user123"
*/

// Expected Response:
/*
{
  "success": true,
  "resumeId": "65def456...",
  "version": 2,  // ← Incremented!
  "isActive": true,
  "text": "Extracted text...",
  "extractedData": { ... }
}
*/

// At this point in the database:
// - Resume 1: version=1, isActive=false (marked inactive)
// - Resume 2: version=2, isActive=true (current active)

// ============================================
// Example 3: Upload Resume Without profileId
// ============================================

// Backward compatible - works like before

// Using curl:
/*
curl -X POST http://localhost:5000/api/resume/upload \
  -F "file=@resume.pdf"
*/

// Expected Response:
/*
{
  "success": true,
  "resumeId": "65ghi789...",
  "version": 1,  // Default version
  "isActive": true,  // Default active
  "text": "Extracted text...",
  "extractedData": { ... }
}
*/

// ============================================
// Example 4: Query Active Resume
// ============================================

// In your code, use the helper function:
/*
import { getActiveResumeByProfile } from '../services/resumeVersion.service.js';

const activeResume = await getActiveResumeByProfile('user123');
console.log(`Active version: ${activeResume.version}`);
*/

// Or direct MongoDB query:
/*
const activeResume = await Resume.findOne({ 
  profileId: 'user123', 
  isActive: true 
});
*/

// ============================================
// Example 5: Get All Versions
// ============================================

/*
import { getAllResumeVersions } from '../services/resumeVersion.service.js';

const allVersions = await getAllResumeVersions('user123');
allVersions.forEach(resume => {
  console.log(`Version ${resume.version}: ${resume.isActive ? 'ACTIVE' : 'inactive'}`);
});
*/

// Expected output:
// Version 3: ACTIVE
// Version 2: inactive
// Version 1: inactive

// ============================================
// Example 6: Get Specific Version
// ============================================

/*
import { getResumeByVersion } from '../services/resumeVersion.service.js';

const version2 = await getResumeByVersion('user123', 2);
console.log(`Version 2 skills: ${version2.skills.join(', ')}`);
*/

// ============================================
// Testing Workflow
// ============================================

/*
1. Start your backend server:
   npm run dev

2. Upload first resume with profileId:
   curl -X POST http://localhost:5000/api/resume/upload \
     -F "file=@resume_v1.pdf" \
     -F "profileId=testuser"
   
   → Should return version: 1, isActive: true

3. Upload second resume with same profileId:
   curl -X POST http://localhost:5000/api/resume/upload \
     -F "file=@resume_v2.pdf" \
     -F "profileId=testuser"
   
   → Should return version: 2, isActive: true

4. Check MongoDB to verify:
   - First resume has isActive: false
   - Second resume has isActive: true

5. Upload resume without profileId:
   curl -X POST http://localhost:5000/api/resume/upload \
     -F "file=@resume.pdf"
   
   → Should work normally (backward compatible)
*/

export default {
    message: 'This file contains testing examples. Import helper functions as needed.'
};
