import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, FileText, Cpu, CheckCircle } from 'lucide-react';
import styles from './ProductCard.module.css';

export const PRODUCT_CATALOG = {
  'ofc-x': {
    id: 'ofc-x',
    name: 'OFC-X Autonomous Flight Controller',
    badge: 'Flagship Avionics',
    category: 'Flight Control & Autonomous Navigation',
    image: '/images/projects/flight-controller.webp',
    specs: [
      'STM32 / AT32 redundant MCU platforms',
      'Triple IMU redundancy for high-reliability telemetry',
      'Fixed-wing, multi-rotor & hybrid VTOL support',
      'Isolated CAN, UAVCAN, UART & PWM interfaces'
    ],
    detailUrl: '/projects',
    ctaQuote: 'Request OFC-X Datasheet / OEM Quote'
  },
  'oesc': {
    id: 'oesc',
    name: 'OESC-60 / OESC-100 Speed Controller',
    badge: 'Heavy-Lift Propulsion',
    category: '4-in-1 Electronic Speed Controller',
    image: '/images/projects/oesc-propulsion.jpg',
    specs: [
      '60A and 100A continuous current variants',
      '6S to 12S LiPo battery architecture',
      'Active thermal dissipation & current protection',
      'High-speed PWM & DShot digital protocol support'
    ],
    detailUrl: '/projects',
    ctaQuote: 'Request OESC Specifications / OEM Quote'
  },
  'ogn-x': {
    id: 'ogn-x',
    name: 'OGN-X Precision GNSS / GPS Module',
    badge: 'Centimeter Precision',
    category: 'Satellite Positioning & Navigation',
    image: '/images/projects/ogn-x-gnss.jpg',
    specs: [
      'Multi-constellation: GPS, GLONASS, Galileo, BeiDou/NavIC',
      'RTK-ready (Real-Time Kinematic) architecture',
      'Centimeter-level precision for mapping & surveying',
      'Rugged, EMI-shielded enclosure'
    ],
    detailUrl: '/projects',
    ctaQuote: 'Request OGN-X Integration Guide'
  },
  'ocom-x': {
    id: 'ocom-x',
    name: 'OCOM-X Autonomous Communication System',
    badge: 'Encrypted Telemetry',
    category: 'Datalink & RF Telemetry System',
    image: '/images/projects/tactical-datalink.webp',
    specs: [
      'Long-range RF and cellular LTE integration',
      'AES-encrypted real-time telemetry and video payload link',
      'Ultra low-latency command & control link',
      'Compact airborne & ground-station form factor'
    ],
    detailUrl: '/projects',
    ctaQuote: 'Request OCOM-X Telemetry Specs'
  }
};

export function detectProductInText(text) {
  if (!text) return null;
  const t = text.toLowerCase();
  if (t.includes('ofc-x') || t.includes('ofc x') || t.includes('flight controller')) {
    return PRODUCT_CATALOG['ofc-x'];
  }
  if (t.includes('oesc') || t.includes('speed controller')) {
    return PRODUCT_CATALOG['oesc'];
  }
  if (t.includes('ogn-x') || t.includes('ogn x') || t.includes('gnss') || (t.includes('gps') && t.includes('module'))) {
    return PRODUCT_CATALOG['ogn-x'];
  }
  if (t.includes('ocom-x') || t.includes('ocom x') || t.includes('communication system') || t.includes('datalink')) {
    return PRODUCT_CATALOG['ocom-x'];
  }
  return null;
}

export default function ProductCard({ product, onSelectAction }) {
  if (!product) return null;

  return (
    <div className={styles.productCardContainer}>
      <div className={styles.cardHeader}>
        <div className={styles.badgeWrapper}>
          <Cpu size={12} className={styles.badgeIcon} />
          <span className={styles.badgeText}>{product.badge}</span>
        </div>
        <span className={styles.categoryLabel}>{product.category}</span>
      </div>

      <div className={styles.cardBody}>
        {product.image && (
          <div className={styles.imageWrapper}>
            <Image
              src={product.image}
              alt={product.name}
              width={110}
              height={80}
              className={styles.productImage}
            />
          </div>
        )}
        <div className={styles.infoWrapper}>
          <h4 className={styles.productTitle}>{product.name}</h4>
          <ul className={styles.specsList}>
            {product.specs.map((spec, idx) => (
              <li key={idx} className={styles.specItem}>
                <CheckCircle size={11} className={styles.checkIcon} />
                <span>{spec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <Link
          href={`/contact?subject=${encodeURIComponent(product.ctaQuote)}`}
          className={styles.primaryCta}
          target="_blank"
        >
          <FileText size={13} />
          <span>{product.ctaQuote}</span>
        </Link>
        <Link
          href={product.detailUrl}
          className={styles.secondaryCta}
          target="_blank"
          title="View in Projects Showcase"
        >
          <ExternalLink size={13} />
        </Link>
      </div>
    </div>
  );
}
