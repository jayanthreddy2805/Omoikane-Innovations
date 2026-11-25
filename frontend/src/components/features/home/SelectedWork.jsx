"use client";

import { products } from "@/data/products";
import { useState } from "react";
import Image from "@/components/shared/LoadAwareImage";
import Link from "@/components/shared/IntentLink";
import styles from "./SelectedWork.module.css";

const PROJECTS = products.map(product => ({number: product.number, name: product.title.split(' — ')[0], type: product.title.split(' — ')[1], description: product.description, image: product.images.main, alt: product.images.alt, href: `/work#${product.id}`}));

export default function SelectedWork() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedIndices, setLoadedIndices] = useState([0]);

  const handleRowClick = (index) => {
    setLoadedIndices(previous => previous.includes(index) ? previous : [...previous, index]);
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      className={styles.section}
      id="selected-work"
      aria-labelledby="selected-work-heading"
    >
      {/* Section Introduction */}
      <div className={styles.introContainer}>
        <header className={styles.header}>
          <h2 id="selected-work-heading" className={styles.heading}>
            Selected Work / Projects
          </h2>
          <p className={styles.subtitle}>
            A selection of mission-focused systems engineered for real-world deployment.
          </p>
        </header>
      </div>

      {/* Accordion Rows — stretch 100% edge-to-edge */}
      <div className={styles.accordionList} role="list">
        {PROJECTS.map((project, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={project.number}
              className={`${styles.row} ${isActive ? styles.rowActive : styles.rowCollapsed}`}
              role="listitem"
            >
              {/* Row Header — semantic button */}
              <div className={styles.headerInner}>
                <button
                  type="button"
                  id={`project-header-${project.number}`}
                  className={styles.rowHeader}
                  onClick={() => handleRowClick(index)}
                  aria-expanded={isActive}
                  aria-controls={`project-details-${project.number}`}
                >
                  <div className={styles.headerLeft}>
                    <span className={styles.projectNumber}>{project.number}</span>
                    <div className={styles.titleGroup}>
                      <h3 className={styles.projectTitle}>{project.name}</h3>
                    </div>
                  </div>

                  <div className={styles.headerRight}>
                    <span
                      className={`${styles.toggleIcon} ${isActive ? styles.toggleIconOpen : ""}`}
                      aria-hidden="true"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </div>
                </button>
              </div>

              {/* Expandable Details Container — CSS Grid 0fr / 1fr transition */}
              <div
                id={`project-details-${project.number}`}
                role="region"
                aria-labelledby={`project-header-${project.number}`}
                inert={!isActive}
                className={`${styles.detailsWrapper} ${isActive ? styles.detailsWrapperOpen : ""}`}
              >
                <div className={styles.detailsInner}>
                  {loadedIndices.includes(index) && <div className={`${styles.detailsContent} ${isActive ? styles.detailsContentOpen : ""}`}>
                    {/* Large project image on the left */}
                    <div className={styles.imageCol}>
                      <div className={styles.imageWrapper}>
                        {isActive && <Image
                          src={project.image}
                          alt={project.alt}
                          fill
                          className={`${styles.projectImage} ${isActive ? styles.projectImageActive : ""}`}
                          sizes="(max-width: 860px) calc(100vw - 40px), (max-width: 1280px) 45vw, 560px"
                        />}
                      </div>
                    </div>

                    {/* Project details on the right */}
                    <div className={styles.infoCol}>
                      <div className={styles.infoTop}>
                        {/* Side heading above content showing project type */}
                        <div className={styles.sideHeadingBlock}>
                          <h4 className={styles.sideHeadingTitle}>{project.type}</h4>
                        </div>

                        <p className={styles.projectDesc}>{project.description}</p>
                        <Link
                          href={project.href}
                          aria-label={`Explore ${project.name} ${project.type}`}
                          className={styles.ctaLink}
                        >
                          <span>Explore</span>
                          <span className={styles.ctaArrow} aria-hidden="true">&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  </div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
