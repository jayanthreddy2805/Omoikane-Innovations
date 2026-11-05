import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, MicOff, ArrowUp, FileText, X, AlertCircle } from 'lucide-react';
import styles from './ChatbotWidget.module.css';

export default function ChatInput({ onSendMessage, isTyping }) {
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState('');

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollH = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollH, 110)}px`;
    }
  }, [inputText]);

  // Clear notice after 4 seconds
  useEffect(() => {
    if (voiceNotice) {
      const timer = setTimeout(() => setVoiceNotice(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [voiceNotice]);

  // ─── 1. RESUME ATTACHMENT HANDLER ──────────────────────────────────────────
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setVoiceNotice('File size exceeds the 10MB limit.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate extension
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const allowed = ['.pdf', '.docx', '.doc', '.txt'];
    if (!allowed.includes(ext)) {
      setVoiceNotice('Please attach a PDF, DOCX, or TXT resume.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Read file as Base64 for server-side parsing (PDF, DOCX, TXT)
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64Data = typeof dataUrl === 'string' ? dataUrl.split(',')[1] : '';
      let textPreview = '';
      if (ext === '.txt' && typeof dataUrl === 'string') {
        try {
          textPreview = atob(base64Data);
        } catch {
          textPreview = '';
        }
      }

      setAttachedFile({
        name: file.name,
        size: file.size,
        base64: base64Data,
        text: textPreview
      });
    };

    reader.onerror = () => {
      setAttachedFile({
        name: file.name,
        size: file.size,
        base64: '',
        text: file.name
      });
    };

    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
  };

  // ─── 2. SPEECH-TO-TEXT VOICE INPUT ────────────────────────────────────────
  const toggleVoiceInput = () => {
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setVoiceNotice('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice('Listening... Speak into your microphone');
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText((prev) => {
          // Append or set transcript cleanly
          return prev ? `${prev.trim()} ${transcript}` : transcript;
        });
      };

      recognition.onerror = (event) => {
        console.warn('[Speech Recognition Error]:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceNotice('Microphone permission was denied. Please allow microphone access in your browser.');
        } else if (event.error === 'no-speech') {
          setVoiceNotice('No speech detected. Please try again.');
        } else {
          setVoiceNotice('Voice recognition error. Please type your message.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Error starting SpeechRecognition:', err);
      setIsListening(false);
      setVoiceNotice('Unable to access microphone.');
    }
  };

  // ─── 3. SUBMIT DISPATCHER ──────────────────────────────────────────────────
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isTyping) return;

    if (!inputText.trim() && !attachedFile) return;

    onSendMessage(inputText.trim(), attachedFile);

    setInputText('');
    setAttachedFile(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.composerWrapper}>
      {/* Voice or File Notification Toast */}
      {voiceNotice && (
        <div className={styles.noticeToast}>
          <AlertCircle size={13} className={styles.noticeIcon} />
          <span>{voiceNotice}</span>
        </div>
      )}

      {/* Selected File Chip */}
      {attachedFile && (
        <div className={styles.attachedFilePill}>
          <FileText size={14} className={styles.fileIcon} />
          <span className={styles.fileNameText} title={attachedFile.name}>
            {attachedFile.name}
          </span>
          <button
            type="button"
            className={styles.removeFileBtn}
            onClick={handleRemoveFile}
            title="Remove attached resume"
            aria-label="Remove attached file"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Main Composer Box */}
      <form className={styles.composerForm} onSubmit={handleSubmit}>
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx,.doc,.txt"
          style={{ display: 'none' }}
        />

        {/* Paperclip Button */}
        <button
          type="button"
          className={styles.actionIconButton}
          onClick={handleAttachmentClick}
          title="Attach Resume (PDF, DOCX)"
          aria-label="Attach Resume"
        >
          <Paperclip size={18} />
        </button>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening... Speak now" : "Type a message..."}
          rows={1}
          className={`${styles.composerTextarea} ${isListening ? styles.listeningActive : ''}`}
          aria-label="Message input"
          disabled={isTyping}
        />

        {/* Microphone Button */}
        <button
          type="button"
          className={`${styles.actionIconButton} ${isListening ? styles.micActiveBtn : ''}`}
          onClick={toggleVoiceInput}
          title={isListening ? "Stop listening" : "Voice input (Click to speak)"}
          aria-label="Voice input"
        >
          {isListening ? (
            <MicOff size={18} className={styles.micPulseIcon} />
          ) : (
            <Mic size={18} />
          )}
        </button>

        {/* Send Button */}
        <button
          type="submit"
          className={styles.composerSendBtn}
          disabled={(!inputText.trim() && !attachedFile) || isTyping}
          aria-label="Send message"
          title="Send"
        >
          <ArrowUp size={16} />
        </button>
      </form>
    </div>
  );
}
