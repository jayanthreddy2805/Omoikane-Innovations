"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import styles from './CustomSelect.module.css';

export default function CustomSelect({ options, value, onChange, placeholder = "Select an option" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (value) {
        const idx = options.findIndex(opt => opt.id === value);
        setFocusedIndex(idx !== -1 ? idx : 0);
      } else {
        setFocusedIndex(0);
      }
    }
  }, [isOpen, value, options]);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev < options.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          onChange(options[focusedIndex].id);
          setIsOpen(false);
        }
        break;
    }
  };

  return (
    <div 
      className={styles.selectContainer} 
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <div 
        className={`${styles.selectTrigger} ${isOpen ? styles.open : ''} ${selectedOption ? styles.hasValue : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={styles.selectValue}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className={styles.chevron}>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} strokeWidth={2} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.optionsDropdown}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            role="listbox"
          >
            <div className={styles.optionsScroll}>
              {options.map((option, index) => (
                <div
                  key={option.id}
                  role="option"
                  aria-selected={value === option.id}
                  className={`${styles.optionItem} ${value === option.id ? styles.selected : ''} ${focusedIndex === index ? styles.focused : ''}`}
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  <span className={styles.optionLabel}>{option.label}</span>
                  {value === option.id && (
                    <Check size={14} strokeWidth={2.5} className={styles.checkIcon} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
