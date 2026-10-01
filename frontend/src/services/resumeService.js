/**
 * ============================================================================
 * RESUME SERVICE - Omoikane Innovations
 * ============================================================================
 * 
 * Handles simulated resume upload, file validation, progress updates,
 * and candidate skill profile extraction.
 * 
 * FUTURE FASTAPI BACKEND INTEGRATION:
 * In production, connect this service to:
 *   POST /api/resume/upload
 *   POST /api/resume/analyze
 * 
 * Security & Privacy:
 * Production credentials, API keys, and LLM secrets must remain securely
 * on the backend server. No confidential keys are kept in the client bundle.
 * ============================================================================
 */

import { DEMO_RESUME_PROFILE } from '../data/demoResume.js';

export const resumeService = {
  /**
   * Validates file size and MIME type
   */
  validateFile(file) {
    if (!file) {
      return { valid: false, error: "Please select a file to upload." };
    }

    const MAX_SIZE_MB = 5;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return { valid: false, error: `File exceeds maximum allowed size of ${MAX_SIZE_MB}MB.` };
    }

    const allowedExtensions = ['pdf', 'docx', 'doc'];
    const extension = file.name.split('.').pop().toLowerCase();
    
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedMimeTypes.includes(file.type) && !allowedExtensions.includes(extension)) {
      return { valid: false, error: "Unsupported format. Please upload a PDF or Word (.docx) document." };
    }

    return { valid: true };
  },

  /**
   * Simulates file upload, OCR extraction, and LLM entity extraction
   */
  async uploadAndAnalyze(file, onProgress) {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Step 1: Uploading
    if (onProgress) onProgress({ phase: "uploading", progress: 25, label: "Uploading resume securely..." });
    await new Promise(r => setTimeout(r, 400));

    // Step 2: Parsing & Extracting text
    if (onProgress) onProgress({ phase: "extracting", progress: 60, label: "Extracting structured text and sections..." });
    await new Promise(r => setTimeout(r, 500));

    // Step 3: LLM entity matching
    if (onProgress) onProgress({ phase: "analyzing", progress: 90, label: "Identifying technical skills, experience and projects..." });
    await new Promise(r => setTimeout(r, 450));

    // Step 4: Complete
    if (onProgress) onProgress({ phase: "complete", progress: 100, label: "Resume analyzed successfully." });

    // Return structured profile customized with uploaded file info
    return {
      ...DEMO_RESUME_PROFILE,
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      fileType: file.type || "application/pdf",
      uploadTimestamp: new Date().toISOString()
    };
  },

  /**
   * Returns current mock demo profile
   */
  getDemoProfile() {
    return DEMO_RESUME_PROFILE;
  }
};
