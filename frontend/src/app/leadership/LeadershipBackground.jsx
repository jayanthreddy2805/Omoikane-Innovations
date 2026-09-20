'use client';

import { Canvas } from '@react-three/fiber';
import { useGLTF, useAnimations, Environment } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Preload to avoid popping
useGLTF.preload('/models/CEREBRIUM_part1_11_optimization.glb');

function Scene() {
  const group = useRef();
  // Using the exact GLB extracted from cerebrium.ai
  const { scene, animations } = useGLTF('/models/CEREBRIUM_part1_11_optimization.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Play all animations to replicate their movement exactly
    if (actions) {
      Object.values(actions).forEach(action => {
        if (action) {
          action.play();
        }
      });
    }
  }, [actions]);

  useEffect(() => {
    // Meshes to hide based on visual position
    const hiddenMeshes = [
      'Cube.14', 'Cube.17', // Far left (removed the biggest diagonals)
      'Cube.23', // Center-left strips (keeping some)
      'Cube.10', // Exact center (removed the dominant center block)
      'Cube.3', // Far right (removed the brightest diagonal)
      'Cube.8' // Lower center right (removed the specific triangle)
    ];

    scene.traverse((child) => {
      if (child.isMesh) {
        if (hiddenMeshes.includes(child.name)) {
          child.visible = false;
        } else if (child.material) {
          // Blended Dark Steel Navy and Slate Grey
          child.material.envMapIntensity = 0.8;
          child.material.color = new THREE.Color('#151c25'); // A dark, desaturated navy-grey mix
          child.material.emissive = new THREE.Color('#030508'); // Barely there, just enough to not be pitch black
          child.material.roughness = 0.5; // Slightly more matte to match the reference image
          child.material.metalness = 0.8;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  // Use original coordinates
  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

export default function LeadershipBackground() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none', background: '#02060D' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        {/* Atmospheric depth via fog */}
        <fog attach="fog" args={['#02060D', 5, 25]} />
        
        <ambientLight intensity={0.2} color="#051024" />
        
        {/* Subtle blue reflections */}
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#00C2FF" />
        <directionalLight position={[-10, -5, -5]} intensity={0.8} color="#0044FF" />
        <pointLight position={[0, 0, 5]} intensity={0.5} color="#1E3447" distance={20} />
        
        <Environment preset="city" />
        <Scene />
      </Canvas>
      
      {/* Soft Vignette and darker center overlay */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'radial-gradient(circle at center, rgba(2, 6, 13, 0.4) 0%, rgba(2, 6, 13, 0.8) 70%, rgba(2, 6, 13, 1) 100%)' 
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(2, 6, 13, 0) 50%, #050B12 100%)' }} />
    </div>
  );
}
