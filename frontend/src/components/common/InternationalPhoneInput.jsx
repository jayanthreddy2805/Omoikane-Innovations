"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getCountries, getCountryCallingCode, AsYouType, parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js/min';
import * as Flags from 'country-flag-icons/react/3x2';
import { ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './InternationalPhoneInput.module.css';

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

export default function InternationalPhoneInput({ 
  value, 
  onChange, 
  onBlur,
  id, 
  required, 
  disabled,
  variant = 'default', // 'default' | 'career'
  className = '' 
}) {
  const [country, setCountry] = useState('IN');
  const [localValue, setLocalValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isValid, setIsValid] = useState(true);
  
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize all countries on mount
  const allCountries = useMemo(() => {
    return getCountries().map(code => {
      let name = code;
      try {
        name = regionNames.of(code);
      } catch (e) {
        // fallback
      }
      return {
        code,
        name,
        dialCode: `+${getCountryCallingCode(code)}`
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allCountries;
    
    return allCountries.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.code.toLowerCase().includes(q) ||
      c.dialCode.includes(q)
    );
  }, [searchQuery, allCountries]);

  // Handle external value changes (e.g. pasted full E.164 number)
  useEffect(() => {
    if (value && typeof value === 'string') {
      const phoneNumber = parsePhoneNumberFromString(value);
      if (phoneNumber) {
        if (phoneNumber.country && phoneNumber.country !== country) {
          setCountry(phoneNumber.country);
        }
        // Extract just the national part for the input field to prevent double country code
        const national = phoneNumber.formatNational();
        if (localValue !== national) {
          setLocalValue(national);
        }
      }
    }
  }, [value]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [isDropdownOpen]);

  const handleCountrySelect = (c) => {
    setCountry(c.code);
    setIsDropdownOpen(false);
    
    // Re-format existing local value for the new country
    if (localValue) {
      const formatter = new AsYouType(c.code);
      const stripped = localValue.replace(/\D/g, '');
      const formatted = formatter.input(stripped);
      setLocalValue(formatted);
      
      const parsed = parsePhoneNumberFromString(stripped, c.code);
      if (parsed && onChange) {
        onChange(parsed.format('E.164'));
        setIsValid(parsed.isValid());
      }
    }
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    let input = e.target.value;
    
    // If the user pastes a full international number (e.g. +1 415...)
    if (input.startsWith('+')) {
      const parsed = parsePhoneNumberFromString(input);
      if (parsed && parsed.country) {
        setCountry(parsed.country);
        input = parsed.formatNational();
      }
    }

    const formatter = new AsYouType(country);
    const formatted = formatter.input(input);
    setLocalValue(formatted);

    // Provide E.164 string to parent
    const parsed = parsePhoneNumberFromString(formatted, country);
    if (onChange) {
      if (parsed && parsed.isValid()) {
        onChange(parsed.format('E.164'));
        setIsValid(true);
      } else {
        onChange(formatted); // emit the unvalidated/incomplete string
      }
    }
  };

  const handleBlur = (e) => {
    if (localValue) {
      const parsed = parsePhoneNumberFromString(localValue, country);
      setIsValid(parsed ? parsed.isValid() : false);
    } else {
      setIsValid(true); // empty is valid until form submission if not required
    }
    
    if (onBlur) {
      onBlur(e);
    }
  };

  const isCareer = variant === 'career';
  const SelectedFlag = Flags[country];

  return (
    <div className={`${styles.container} ${className}`} ref={containerRef}>
      <div className={`
        ${isCareer ? styles.inputGroupCareer : styles.inputGroup} 
        ${!isValid && !isCareer ? styles.invalid : ''}
        ${!isValid && isCareer ? styles.invalidCareer : ''}
      `}>
        
        <button 
          type="button"
          className={isCareer ? styles.countrySelectBtnCareer : styles.countrySelectBtn}
          onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
          aria-label="Select country"
          disabled={disabled}
        >
          {SelectedFlag ? <SelectedFlag className={styles.flagIcon} /> : <div className={styles.flagIcon} />}
          <span className={isCareer ? styles.dialCodeCareer : styles.dialCode}>+{getCountryCallingCode(country)}</span>
          <ChevronDown size={14} className={isCareer ? styles.chevronCareer : styles.chevron} />
        </button>

        <input
          ref={inputRef}
          id={id}
          type="tel"
          className={isCareer ? styles.phoneInputCareer : styles.phoneInput}
          value={localValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="Phone number"
          required={required}
          disabled={disabled}
          autoComplete="tel-national"
        />
      </div>

      {!isValid && localValue && (
        <span className={styles.errorText}>Please enter a valid phone number.</span>
      )}

      {isDropdownOpen && (
        <>
          <div className={styles.dropdownOverlay} onClick={() => setIsDropdownOpen(false)} />
          <AnimatePresence>
            <motion.div
              className={isCareer ? styles.dropdownCareer : styles.dropdown}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className={isCareer ? styles.searchHeaderCareer : styles.searchHeader}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Search size={14} color="#888888" style={{ position: 'absolute', left: '10px' }} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    className={isCareer ? styles.searchInputCareer : styles.searchInput}
                    placeholder="Search countries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              
              <ul className={isCareer ? styles.dropdownListCareer : styles.dropdownList}>
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((c) => {
                    const Flag = Flags[c.code];
                    return (
                      <li key={c.code}>
                        <button
                          type="button"
                          className={isCareer ? styles.countryOptionCareer : styles.countryOption}
                          onClick={() => handleCountrySelect(c)}
                          aria-selected={country === c.code}
                        >
                          {Flag ? <Flag className={styles.flagIcon} /> : <div className={styles.flagIcon} />}
                          <span className={isCareer ? styles.countryNameCareer : styles.countryName}>{c.name}</span>
                          <span className={isCareer ? styles.countryDialCodeCareer : styles.countryDialCode}>{c.dialCode}</span>
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <li className={isCareer ? styles.noResultsCareer : styles.noResults}>No countries found.</li>
                )}
              </ul>
            </motion.div>
          </AnimatePresence>

        </>
      )}
    </div>
  );
}
