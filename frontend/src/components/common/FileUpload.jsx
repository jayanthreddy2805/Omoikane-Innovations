"use client";

import { useState, useRef } from "react";
import { Upload, Check, X, AlertCircle, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Field, FieldLabel } from "@/components/ui/v-field-21-utils/field";
import styles from "./FileUpload.module.css";

export default function FileUpload({ id = "cv", required = false }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const validateFile = (selectedFile) => {
    setError("");
    if (!selectedFile) return false;

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File exceeds maximum size of 5 MB.");
      return false;
    }

    const validTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    // Also accept by extension if MIME type is missing or generic
    const extension = selectedFile.name.split('.').pop().toLowerCase();
    const validExtensions = ['pdf', 'doc', 'docx'];
    
    if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(extension)) {
      setError("Please upload a valid PDF or Word document.");
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      } else {
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
      }
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setFile(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(droppedFile);
        if (inputRef.current) inputRef.current.files = dataTransfer.files;
      }
    }
  };

  return (
    <Field>
      <FieldLabel htmlFor={id}>
        <span className={styles.labelContainer}>
          <Upload size={14} strokeWidth={2.5} className={styles.labelIcon} />
          <span className={styles.labelText}>UPLOAD RESUME</span>
        </span>
      </FieldLabel>

      {/* Visually hidden but fully accessible native input */}
      <input
        ref={inputRef}
        type="file"
        id={id}
        required={required && !file}
        accept=".pdf,.doc,.docx"
        className={styles.hiddenInput}
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {/* Custom interactive container */}
      <div
        className={`${styles.container} ${isDragging ? styles.isDragging : ""} ${error ? styles.hasError : ""}`}
        onClick={() => {
          if (!file) {
            setError("");
            inputRef.current?.click();
          }
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        tabIndex={0}
        role="button"
        aria-label="Upload resume file"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!file) inputRef.current?.click();
          }
        }}
      >
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className={styles.emptyState}
            >
              <div className={styles.emptyContent}>
                <span className={styles.chooseAction}>
                  <Plus size={16} strokeWidth={2} className={styles.plusIcon} />
                  Choose file
                </span>
                <span className={styles.emptyText}>PDF or Word document &middot; Max 5 MB</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="selected"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={styles.selectedState}
            >
              <div className={styles.fileInfo}>
                <Check size={16} strokeWidth={2.5} className={styles.checkIcon} />
                <span className={styles.fileName} title={file.name}>
                  {file.name}
                </span>
              </div>
              <div className={styles.fileMeta}>
                <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={handleClear}
                  aria-label="Remove file"
                  title="Remove file"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.bottomArea}>
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 4 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className={styles.errorText}
            >
              <AlertCircle size={14} strokeWidth={2.5} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Field>
  );
}
