"use client";

import React from "react";
import styles from "./TechMarquee.module.css";

const technologies = [
  "C++",
  "Rust",
  "Python",
  "Embedded C",
  "ROS 2",
  "CUDA",
  "TensorFlow",
  "PyTorch",
  "OpenCV",
  "NVIDIA Jetson",
  "PX4 Autopilot",
  "ArduPilot",
  "FreeRTOS",
  "VxWorks",
  "CAN bus",
  "WebRTC",
  "Kubernetes",
  "Go",
  "VHDL",
  "Verilog"
];

export function TechMarquee() {
  // We duplicate the array to create a seamless infinite scroll loop
  const displayTechs = [...technologies, ...technologies];

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeTrack}>
        {displayTechs.map((tech, idx) => (
          <React.Fragment key={idx}>
            <span className={styles.techItem}>{tech}</span>
            <span className={styles.dot} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
