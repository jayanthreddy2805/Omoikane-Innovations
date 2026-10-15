import React from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';
import SourceLink from './SourceLink';
import styles from './ChatbotWidget.module.css';

/**
 * Safely parses simple markdown bold and URL/email/tel links without dangerouslySetInnerHTML
 */
function renderFormattedContent(text) {
  if (!text) return null;

  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    if (!line.trim()) {
      return <div key={lineIdx} className={styles.paragraphSpacer} />;
    }

    const markdownLinkRegex = /\[(.*?)\]\((.*?)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = markdownLinkRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }
      parts.push({
        type: 'link',
        label: match[1],
        url: match[2]
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    return (
      <p key={lineIdx} className={line.startsWith('•') ? styles.bulletLine : styles.textLine}>
        {parts.map((part, pIdx) => {
          if (typeof part === 'string') {
            const boldParts = part.split(/\*\*(.*?)\*\*/g);
            return (
              <span key={pIdx}>
                {boldParts.map((bChunk, bIdx) =>
                  bIdx % 2 === 1 ? (
                    <strong key={bIdx} className={styles.boldText}>
                      {bChunk}
                    </strong>
                  ) : (
                    bChunk
                  )
                )}
              </span>
            );
          } else if (part.type === 'link') {
            return (
              <a
                key={pIdx}
                href={part.url}
                target={part.url.startsWith('http') ? '_blank' : undefined}
                rel={part.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={styles.inlineLink}
              >
                {part.label}
              </a>
            );
          }
          return null;
        })}
      </p>
    );
  });
}

export default function ChatMessage({ message, onSelectSuggestion }) {
  const isBot = message.sender === 'bot';

  return (
    <div className={`${styles.messageRow} ${isBot ? styles.botRow : styles.userRow}`}>
      {/* Bot Avatar with Company Logo */}
      {isBot && (
        <div className={styles.botAvatarContainer}>
          <Image
            src="/images/shared/omoikane-logo.png"
            alt="Omoikane Logo"
            width={24}
            height={24}
            className={styles.botAvatarLogo}
            priority
          />
        </div>
      )}

      {/* Message Bubble & Addons */}
      <div className={styles.bubbleCol}>
        <div className={`${styles.messageBubble} ${isBot ? styles.botBubble : styles.userBubble}`}>
          <div className={styles.bubbleContent}>
            {renderFormattedContent(message.text)}
          </div>

          {/* Source Link */}
          {isBot && message.source && (
            <SourceLink source={message.source} />
          )}

          {/* Timestamp */}
          {message.timestamp && (
            <span className={styles.messageTimestamp}>{message.timestamp}</span>
          )}
        </div>

        {/* Follow-up Suggestion Chips */}
        {isBot && message.suggestions && message.suggestions.length > 0 && onSelectSuggestion && (
          <div className={styles.suggestionsRow}>
            {message.suggestions.slice(0, 3).map((sugg, sIdx) => (
              <button
                key={sIdx}
                type="button"
                className={styles.followupChip}
                onClick={() => onSelectSuggestion(sugg)}
              >
                {sugg}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
