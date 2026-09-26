"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./NetworkVisual.module.css";

interface NetworkVisualProps {
  formation?: number;
  density?: number;
  className?: string;
  fillContainer?: boolean;
}

// Omoikane Innovations brand color palette:
// Electric Cyan (--accent), Bright Aqua (--accent-hover), Sky Blue, Avionics Blue, Slate Accent
const OMOIKANE_PALETTE = [
  new THREE.Color(0xffd700), // Radiant Gold
  new THREE.Color(0xff8c00), // Deep Amber
  new THREE.Color(0xcc5500), // Burnt Orange
  new THREE.Color(0x8b0000), // Deep Mahogany
  new THREE.Color(0xcd7f32), // Metallic Bronze
];

const noiseFunctions = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m*=m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p,float time){
    float value=0.0;float amplitude=0.5;float frequency=1.0;int octaves=3;
    for(int i=0;i<octaves;i++){
        value+=amplitude*snoise(p*frequency+time*0.2*frequency);
        amplitude*=0.5;frequency*=2.0;
    }
    return value;
}
`;

const nodeShader = {
  vertexShader: `${noiseFunctions}
    attribute float nodeSize;
    attribute float nodeType;
    attribute vec3 nodeColor;
    attribute float distanceFromRoot;
    uniform float uTime;
    uniform vec3 uPulsePositions[3];
    uniform float uPulseTimes[3];
    uniform float uPulseSpeed;
    uniform float uBaseNodeSize;
    varying vec3 vColor;
    varying float vNodeType;
    varying vec3 vPosition;
    varying float vPulseIntensity;
    varying float vDistanceFromRoot;

    float getPulseIntensity(vec3 worldPos, vec3 pulsePos, float pulseTime) {
        if (pulseTime < 0.0) return 0.0;
        float timeSinceClick = uTime - pulseTime;
        if (timeSinceClick < 0.0 || timeSinceClick > 3.0) return 0.0;

        float pulseRadius = timeSinceClick * uPulseSpeed;
        float distToPulse = distance(worldPos, pulsePos);
        float pulseThickness = 2.5;
        float waveProximity = abs(distToPulse - pulseRadius);

        return smoothstep(pulseThickness, 0.0, waveProximity) * smoothstep(3.0, 0.0, timeSinceClick);
    }

    void main() {
        vNodeType = nodeType;
        vColor = nodeColor;
        vDistanceFromRoot = distanceFromRoot;

        vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        vPosition = worldPos;

        float totalPulseIntensity = 0.0;
        for (int i = 0; i < 3; i++) {
            totalPulseIntensity += getPulseIntensity(worldPos, uPulsePositions[i], uPulseTimes[i]);
        }
        vPulseIntensity = min(totalPulseIntensity, 1.0);

        // Gentle breathing animation
        float timeScale = 0.5 + 0.5 * sin(uTime * 0.9 + distanceFromRoot * 0.2);
        float baseSize = nodeSize * (0.85 + 0.15 * timeScale);
        float pulseSize = baseSize * (1.0 + vPulseIntensity * 1.5);

        vec3 modifiedPosition = position;
        if (nodeType > 0.5) {
            float noise = fbm(position * 0.1, uTime * 0.12);
            modifiedPosition += normal * noise * 0.15;
        }

        vec4 mvPosition = modelViewMatrix * vec4(modifiedPosition, 1.0);
        gl_PointSize = pulseSize * uBaseNodeSize * (920.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }`,

  fragmentShader: `
    uniform float uTime;
    uniform vec3 uPulseColors[3];
    varying vec3 vColor;
    varying float vNodeType;
    varying vec3 vPosition;
    varying float vPulseIntensity;
    varying float vDistanceFromRoot;

    void main() {
        vec2 center = 2.0 * gl_PointCoord - 1.0;
        float dist = length(center);
        if (dist > 1.0) discard;

        // Controlled radial glow
        float core = smoothstep(0.24, 0.0, dist);
        float innerGlow = smoothstep(0.65, 0.06, dist);
        float outerHalo = pow(1.0 - dist, 1.5);

        // Aerospace blue/cyan base
        vec3 baseColor = vColor * (0.95 + 0.25 * sin(uTime * 0.8 + vDistanceFromRoot * 0.3));
        vec3 finalColor = baseColor;

        // Subtle white highlight strictly on central hub nodes (vNodeType < 0.5)
        if (vNodeType < 0.5) {
            finalColor = mix(baseColor * 1.35, vec3(1.0, 0.9, 0.6), core * 0.75);
            finalColor *= 1.25;
        } else {
            // Peripheral nodes become rich warm amber/crimson
            finalColor = mix(baseColor, vec3(0.8, 0.2, 0.05), innerGlow * 0.45);
        }

        if (vPulseIntensity > 0.0) {
            vec3 pulseColor = mix(vec3(1.0), uPulseColors[0], 0.3);
            finalColor = mix(finalColor, pulseColor * 1.8, vPulseIntensity);
        }

        float alpha = core * 0.95 + innerGlow * 0.75 + outerHalo * 0.38;
        float camDistance = length(vPosition - cameraPosition);
        float distanceFade = smoothstep(90.0, 10.0, camDistance);
        float radialFade = smoothstep(13.5, 8.5, length(vPosition.xy));

        gl_FragColor = vec4(finalColor, alpha * distanceFade * radialFade);
    }`,
};

const connectionShader = {
  vertexShader: `${noiseFunctions}
    attribute vec3 startPoint;
    attribute vec3 endPoint;
    attribute float connectionStrength;
    attribute float pathIndex;
    attribute vec3 connectionColor;
    uniform float uTime;
    uniform vec3 uPulsePositions[3];
    uniform float uPulseTimes[3];
    uniform float uPulseSpeed;
    varying vec3 vColor;
    varying float vConnectionStrength;
    varying float vPulseIntensity;
    varying float vPathPosition;
    varying vec3 vWorldPos;

    float getPulseIntensity(vec3 worldPos, vec3 pulsePos, float pulseTime) {
        if (pulseTime < 0.0) return 0.0;
        float timeSinceClick = uTime - pulseTime;
        if (timeSinceClick < 0.0 || timeSinceClick > 3.0) return 0.0;
        float pulseRadius = timeSinceClick * uPulseSpeed;
        float distToPulse = distance(worldPos, pulsePos);
        float pulseThickness = 2.4;
        float waveProximity = abs(distToPulse - pulseRadius);
        return smoothstep(pulseThickness, 0.0, waveProximity) * smoothstep(3.0, 0.0, timeSinceClick);
    }

    void main() {
        float t = position.x;
        vPathPosition = t;

        vec3 midPoint = mix(startPoint, endPoint, 0.5);
        float pathOffset = sin(t * 3.14159) * 0.12;
        vec3 perpendicular = normalize(cross(normalize(endPoint - startPoint), vec3(0.0, 1.0, 0.0)));
        if (length(perpendicular) < 0.1) perpendicular = vec3(1.0, 0.0, 0.0);
        midPoint += perpendicular * pathOffset;

        vec3 p0 = mix(startPoint, midPoint, t);
        vec3 p1 = mix(midPoint, endPoint, t);
        vec3 finalPos = mix(p0, p1, t);

        float noiseTime = uTime * 0.2;
        float noise = fbm(vec3(pathIndex * 0.12, t * 0.5, noiseTime), noiseTime);
        finalPos += perpendicular * noise * 0.08;

        vec3 worldPos = (modelMatrix * vec4(finalPos, 1.0)).xyz;
        vWorldPos = worldPos;

        float totalPulseIntensity = 0.0;
        for (int i = 0; i < 3; i++) {
            totalPulseIntensity += getPulseIntensity(worldPos, uPulsePositions[i], uPulseTimes[i]);
        }
        vPulseIntensity = min(totalPulseIntensity, 1.0);

        vColor = connectionColor;
        vConnectionStrength = connectionStrength;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
    }`,

  fragmentShader: `
    uniform float uTime;
    uniform vec3 uPulseColors[3];
    varying vec3 vColor;
    varying float vConnectionStrength;
    varying float vPulseIntensity;
    varying float vPathPosition;
    varying vec3 vWorldPos;

    void main() {
        // Clean, elegant amber/crimson wire line
        vec3 baseColor = vColor * (0.95 + 0.25 * sin(uTime * 0.6 + vPathPosition * 6.0));

        // Subtle traveling data packet along wire
        float flowPattern = sin(vPathPosition * 18.0 - uTime * 3.0) * 0.5 + 0.5;
        float packet = pow(flowPattern, 3.8);

        // Controlled gold/amber pulse glow along wire
        vec3 packetGlow = vec3(0.95, 0.4, 0.1) * (packet * 0.85);
        vec3 finalColor = baseColor + packetGlow;

        if (vPulseIntensity > 0.0) {
            vec3 pulseColor = mix(vec3(0.95, 0.4, 0.1), uPulseColors[0], 0.3);
            finalColor = mix(finalColor, pulseColor * 1.7, vPulseIntensity);
        }

        finalColor *= (0.8 + vConnectionStrength * 0.35);

        // Crisp, visible opacity with smooth radial edge fade
        float alpha = clamp(0.60 + 0.35 * flowPattern + vConnectionStrength * 0.2, 0.0, 0.95);
        if (vPulseIntensity > 0.0) {
            alpha = min(1.0, alpha + vPulseIntensity * 0.3);
        }
        float radialFade = smoothstep(13.5, 8.5, length(vWorldPos.xy));

        gl_FragColor = vec4(finalColor, alpha * radialFade);
    }`,
};

class Node {
  position: THREE.Vector3;
  connections: { node: Node; strength: number }[];
  level: number;
  type: number;
  size: number;
  distanceFromRoot: number;

  constructor(position: THREE.Vector3, level = 0, type = 0) {
    this.position = position;
    this.connections = [];
    this.level = level;
    this.type = type;
    this.size = type === 0 ? THREE.MathUtils.randFloat(0.8, 1.25) : THREE.MathUtils.randFloat(0.5, 0.85);
    this.distanceFromRoot = 0;
  }

  addConnection(node: Node, strength = 1.0) {
    if (!this.isConnectedTo(node)) {
      this.connections.push({ node, strength });
      node.connections.push({ node: this, strength });
    }
  }

  isConnectedTo(node: Node) {
    return this.connections.some((conn) => conn.node === node);
  }
}

/**
 * Generate a balanced, aerospace-grade neural network graph
 * Medium-high node density (~130-150 nodes, ~320-360 wires)
 */
function generateNeuralNetwork(densityFactor = 1.0) {
  const nodes: Node[] = [];
  const rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0);
  rootNode.size = 1.8;
  nodes.push(rootNode);

  // 6 primary structural axes
  const primaryAxes = 6;
  const nodesPerAxis = 8;
  const axisLength = 12.0;
  const axisEndpoints: Node[] = [];

  for (let a = 0; a < primaryAxes; a++) {
    const phi = Math.acos(-1 + (2 * a) / primaryAxes);
    const theta = Math.PI * (1 + Math.sqrt(5)) * a;
    const dirVec = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      Math.cos(phi)
    );

    let prevNode = rootNode;
    for (let i = 1; i <= nodesPerAxis; i++) {
      const t = i / nodesPerAxis;
      const distance = axisLength * Math.pow(t, 0.85);
      // Give slight organic elliptical spread to fill rectangular space
      const pos = new THREE.Vector3(
        dirVec.x * distance * 1.15,
        dirVec.y * distance * 0.95,
        dirVec.z * distance * 1.0
      );
      const nodeType = i === nodesPerAxis ? 1 : (i % 3 === 0 ? 1 : 0);
      const newNode = new Node(pos, i, nodeType);
      newNode.distanceFromRoot = distance;
      nodes.push(newNode);
      prevNode.addConnection(newNode, 0.95 - t * 0.25);
      prevNode = newNode;
      if (i === nodesPerAxis) axisEndpoints.push(newNode);
    }
  }

  // 4 concentric structural spherical tiers
  const ringDistances = [3.0, 5.8, 8.6, 11.2];
  const ringNodes: Node[][] = [];

  for (const ringDist of ringDistances) {
    const nodesInRing = Math.max(6, Math.floor(ringDist * 3.2 * densityFactor));
    const ringLayer: Node[] = [];

    for (let i = 0; i < nodesInRing; i++) {
      const t = i / nodesInRing;
      const ringPhi = Math.acos(2 * Math.random() - 1);
      const ringTheta = 2 * Math.PI * t;
      const pos = new THREE.Vector3(
        ringDist * Math.sin(ringPhi) * Math.cos(ringTheta) * 1.15,
        ringDist * Math.sin(ringPhi) * Math.sin(ringTheta) * 0.95,
        ringDist * Math.cos(ringPhi)
      );
      const level = Math.ceil(ringDist / 3);
      const nodeType = Math.random() < 0.35 ? 1 : 0;
      const newNode = new Node(pos, level, nodeType);
      newNode.distanceFromRoot = ringDist;
      nodes.push(newNode);
      ringLayer.push(newNode);
    }
    ringNodes.push(ringLayer);

    // Intra-ring connections (circumferential loop + skip chords)
    for (let i = 0; i < ringLayer.length; i++) {
      const node = ringLayer[i];
      const nextNode = ringLayer[(i + 1) % ringLayer.length];
      node.addConnection(nextNode, 0.75);

      if (ringLayer.length > 5 && i % 2 === 0) {
        const skipNode = ringLayer[(i + 2) % ringLayer.length];
        node.addConnection(skipNode, 0.5);
      }
    }
  }

  // Connect ring nodes to closest axis nodes (clean structural ribs)
  for (const ring of ringNodes) {
    for (const node of ring) {
      let closestAxisNode: Node | null = null;
      let minDist = Infinity;
      for (const n of nodes) {
        if (n === rootNode || n === node || n.level === 0 || n.type !== 0) continue;
        const dist = node.position.distanceTo(n.position);
        if (dist < minDist) {
          minDist = dist;
          closestAxisNode = n;
        }
      }
      if (closestAxisNode && minDist < 6.5) {
        const strength = 0.55 + (1 - minDist / 6.5) * 0.35;
        node.addConnection(closestAxisNode, strength);
      }
    }
  }

  // Inter-ring radial bridges between shells (clean, orderly data routes)
  for (let r = 0; r < ringNodes.length - 1; r++) {
    const innerRing = ringNodes[r];
    const outerRing = ringNodes[r + 1];
    const connectionsCount = Math.floor(innerRing.length * 0.45);

    for (let i = 0; i < connectionsCount; i++) {
      const innerNode = innerRing[Math.floor(Math.random() * innerRing.length)];
      let closestOuter = outerRing[0];
      let minDist = Infinity;
      for (const outN of outerRing) {
        const d = innerNode.position.distanceTo(outN.position);
        if (d < minDist) {
          minDist = d;
          closestOuter = outN;
        }
      }
      if (!innerNode.isConnectedTo(closestOuter)) {
        innerNode.addConnection(closestOuter, 0.65);
      }
    }
  }

  // Interconnect axis endpoints into an outer geodesic lattice
  for (let i = 0; i < axisEndpoints.length; i++) {
    const startNode = axisEndpoints[i];
    const endNode = axisEndpoints[(i + 2) % axisEndpoints.length];
    if (!startNode.isConnectedTo(endNode)) {
      startNode.addConnection(endNode, 0.5);
    }
  }

  return { nodes, rootNode };
}

function createStarfield() {
  const count = 2200;
  const pos: number[] = [];
  const colors: number[] = [];

  const starColors = [
    new THREE.Color(0xffd700), // Radiant Gold
    new THREE.Color(0x8b0000), // Deep Mahogany
    new THREE.Color(0xff4500), // Orange Red
  ];

  for (let i = 0; i < count; i++) {
    const r = THREE.MathUtils.randFloat(30, 110);
    const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
    const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
    pos.push(
      r * Math.sin(phi) * Math.cos(theta) * 1.2,
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );

    const c = starColors[Math.floor(Math.random() * starColors.length)];
    colors.push(c.r, c.g, c.b);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.24,
    vertexColors: true,
    sizeAttenuation: true,
    depthWrite: false,
    opacity: 0.55,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geo, mat);
}

function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function ensureShaderPrecisionSafe() {
  if (typeof window === "undefined") return;

  const patch = (proto: any) => {
    if (!proto || !proto.getShaderPrecisionFormat || proto.__precisionPatched) return;
    const orig = proto.getShaderPrecisionFormat;
    proto.getShaderPrecisionFormat = function (...args: any[]) {
      const format = orig.apply(this, args);
      if (!format) {
        return { rangeMin: 1, rangeMax: 1, precision: 1 };
      }
      return format;
    };
    proto.__precisionPatched = true;
  };

  if (typeof WebGLRenderingContext !== "undefined") {
    patch(WebGLRenderingContext.prototype);
  }
  if (typeof WebGL2RenderingContext !== "undefined") {
    patch(WebGL2RenderingContext.prototype);
  }
}

export default function NetworkVisual({
  density = 1.0,
  className = "",
  fillContainer = false,
}: NetworkVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!isWebGLAvailable()) return;

    ensureShaderPrecisionSafe();

    let animId: number | null = null;
    let pulseIntervalId: number | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    let nodesMesh: THREE.Points | null = null;
    let connectionsMesh: THREE.LineSegments | null = null;
    let starField: THREE.Points | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let isVisible = false;

    try {
      canvas = document.createElement("canvas");
      canvas.className = styles.canvas;
      container.appendChild(canvas);

      const initialWidth = container.clientWidth || 340;
      const initialHeight = container.clientHeight || 400;

      // 1. Scene & Camera sized precisely to container (100% transparent background, no fog)
      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(58, initialWidth / Math.max(initialHeight, 1), 0.1, 1000);
      camera.position.set(0, 0, 23.5);

      // 2. WebGL Renderer with capped pixel ratio at 1.5 and 100% transparent alpha
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(initialWidth, initialHeight, false);
      renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5));
      renderer.setClearColor(0x000000, 0); // Transparent clear color (alpha 0)
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      // 3. Ambient Starfield
      starField = createStarfield();
      scene.add(starField);

      // 4. Shader Uniforms
      const pulseUniforms = {
        uTime: { value: 0.0 },
        uPulsePositions: {
          value: [
            new THREE.Vector3(1e3, 1e3, 1e3),
            new THREE.Vector3(1e3, 1e3, 1e3),
            new THREE.Vector3(1e3, 1e3, 1e3),
          ],
        },
        uPulseTimes: { value: [-1e3, -1e3, -1e3] },
        uPulseColors: {
          value: [
            new THREE.Color(0xffd700),
            new THREE.Color(0xff4500),
            new THREE.Color(0xcc5500),
          ],
        },
        uPulseSpeed: { value: 16.0 },
        uBaseNodeSize: { value: 0.54 },
      };

      // 5. Generate Balanced Aerospace Network Graph
      const network = generateNeuralNetwork(density);
      const nodesGeometry = new THREE.BufferGeometry();
      const nodePositions: number[] = [];
      const nodeTypes: number[] = [];
      const nodeSizes: number[] = [];
      const nodeColors: number[] = [];
      const distancesFromRoot: number[] = [];

      network.nodes.forEach((node) => {
        nodePositions.push(node.position.x, node.position.y, node.position.z);
        nodeTypes.push(node.type);
        nodeSizes.push(node.size);
        distancesFromRoot.push(node.distanceFromRoot);

        const colorIndex = Math.min(node.level, OMOIKANE_PALETTE.length - 1);
        const baseColor = OMOIKANE_PALETTE[colorIndex % OMOIKANE_PALETTE.length].clone();
        baseColor.offsetHSL(
          THREE.MathUtils.randFloatSpread(0.02),
          THREE.MathUtils.randFloatSpread(0.04),
          THREE.MathUtils.randFloatSpread(0.04)
        );
        nodeColors.push(baseColor.r, baseColor.g, baseColor.b);
      });

      nodesGeometry.setAttribute("position", new THREE.Float32BufferAttribute(nodePositions, 3));
      nodesGeometry.setAttribute("nodeType", new THREE.Float32BufferAttribute(nodeTypes, 1));
      nodesGeometry.setAttribute("nodeSize", new THREE.Float32BufferAttribute(nodeSizes, 1));
      nodesGeometry.setAttribute("nodeColor", new THREE.Float32BufferAttribute(nodeColors, 3));
      nodesGeometry.setAttribute("distanceFromRoot", new THREE.Float32BufferAttribute(distancesFromRoot, 1));

      const nodesMaterial = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.clone(pulseUniforms),
        vertexShader: nodeShader.vertexShader,
        fragmentShader: nodeShader.fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      nodesMesh = new THREE.Points(nodesGeometry, nodesMaterial);
      scene.add(nodesMesh);

      // 6. Generate Connections with Pairwise Continuous Segments
      const connectionsGeometry = new THREE.BufferGeometry();
      const connectionColors: number[] = [];
      const connectionStrengths: number[] = [];
      const connectionPositions: number[] = [];
      const startPoints: number[] = [];
      const endPoints: number[] = [];
      const pathIndices: number[] = [];
      const processedConnections = new Set<string>();
      let pathIndex = 0;

      network.nodes.forEach((node, nodeIndex) => {
        node.connections.forEach((connection) => {
          const connectedNode = connection.node;
          const connectedIndex = network.nodes.indexOf(connectedNode);
          if (connectedIndex === -1) return;

          const key = [Math.min(nodeIndex, connectedIndex), Math.max(nodeIndex, connectedIndex)].join("-");
          if (!processedConnections.has(key)) {
            processedConnections.add(key);
            const startPoint = node.position;
            const endPoint = connectedNode.position;

            const numSteps = 12;
            const avgLevel = Math.min(Math.floor((node.level + connectedNode.level) / 2), OMOIKANE_PALETTE.length - 1);
            const baseColor = OMOIKANE_PALETTE[avgLevel % OMOIKANE_PALETTE.length].clone();
            baseColor.offsetHSL(
              THREE.MathUtils.randFloatSpread(0.02),
              THREE.MathUtils.randFloatSpread(0.04),
              THREE.MathUtils.randFloatSpread(0.04)
            );

            for (let i = 0; i < numSteps; i++) {
              const t0 = i / numSteps;
              const t1 = (i + 1) / numSteps;

              // Pairwise vertex 1
              connectionPositions.push(t0, 0, 0);
              startPoints.push(startPoint.x, startPoint.y, startPoint.z);
              endPoints.push(endPoint.x, endPoint.y, endPoint.z);
              pathIndices.push(pathIndex);
              connectionStrengths.push(connection.strength);
              connectionColors.push(baseColor.r, baseColor.g, baseColor.b);

              // Pairwise vertex 2
              connectionPositions.push(t1, 0, 0);
              startPoints.push(startPoint.x, startPoint.y, startPoint.z);
              endPoints.push(endPoint.x, endPoint.y, endPoint.z);
              pathIndices.push(pathIndex);
              connectionStrengths.push(connection.strength);
              connectionColors.push(baseColor.r, baseColor.g, baseColor.b);
            }
            pathIndex++;
          }
        });
      });

      connectionsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(connectionPositions, 3));
      connectionsGeometry.setAttribute("startPoint", new THREE.Float32BufferAttribute(startPoints, 3));
      connectionsGeometry.setAttribute("endPoint", new THREE.Float32BufferAttribute(endPoints, 3));
      connectionsGeometry.setAttribute("connectionStrength", new THREE.Float32BufferAttribute(connectionStrengths, 1));
      connectionsGeometry.setAttribute("connectionColor", new THREE.Float32BufferAttribute(connectionColors, 3));
      connectionsGeometry.setAttribute("pathIndex", new THREE.Float32BufferAttribute(pathIndices, 1));

      const connectionsMaterial = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.clone(pulseUniforms),
        vertexShader: connectionShader.vertexShader,
        fragmentShader: connectionShader.fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      connectionsMesh = new THREE.LineSegments(connectionsGeometry, connectionsMaterial);
      scene.add(connectionsMesh);

      // 7. Controlled Ambient Energy Pulses (No interactive clicks/touches)
      let lastPulseIndex = 0;
      const clock = new THREE.Clock();

      const triggerAmbientPulse = () => {
        if (!nodesMesh || !connectionsMesh) return;
        const time = clock.getElapsedTime();
        lastPulseIndex = (lastPulseIndex + 1) % 3;

        const originIndex = Math.floor(Math.random() * Math.min(8, network.nodes.length));
        const originNode = network.nodes[originIndex] || network.rootNode;
        const pulsePos = originNode.position.clone();

        const pulseColor = Math.random() > 0.5 ? new THREE.Color(0xffd700) : new THREE.Color(0xff4500);

        nodesMesh.material.uniforms.uPulsePositions.value[lastPulseIndex].copy(pulsePos);
        nodesMesh.material.uniforms.uPulseTimes.value[lastPulseIndex] = time;
        nodesMesh.material.uniforms.uPulseColors.value[lastPulseIndex].copy(pulseColor);

        connectionsMesh.material.uniforms.uPulsePositions.value[lastPulseIndex].copy(pulsePos);
        connectionsMesh.material.uniforms.uPulseTimes.value[lastPulseIndex] = time;
        connectionsMesh.material.uniforms.uPulseColors.value[lastPulseIndex].copy(pulseColor);
      };

      // Periodic gentle pulse every 2.6s
      pulseIntervalId = window.setInterval(() => {
        if (isVisible) {
          triggerAmbientPulse();
        }
      }, 2600);

      // 8. Simple slow constant rotation: mesh.rotation.y += 0.001
      const animate = () => {
        if (!isVisible) {
          animId = null;
          return;
        }
        animId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        if (nodesMesh) {
          (nodesMesh.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
          nodesMesh.rotation.y += 0.001;
        }
        if (connectionsMesh) {
          (connectionsMesh.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
          connectionsMesh.rotation.y += 0.001;
        }
        if (starField) {
          starField.rotation.y += 0.0003;
        }

        if (renderer) {
          renderer.render(scene, camera);
        }
      };

      // 9. IntersectionObserver to pause rendering when outside viewport
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const wasVisible = isVisible;
            isVisible = entry.isIntersecting;
            if (isVisible && !wasVisible && animId === null) {
              triggerAmbientPulse();
              animate();
            }
          }
        },
        { threshold: 0.01 }
      );
      intersectionObserver.observe(container);

      // 10. ResizeObserver on the container (no window.innerWidth / innerHeight)
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = Math.floor(entry.contentRect.width || container.clientWidth);
          const height = Math.floor(entry.contentRect.height || container.clientHeight);
          if (width <= 0 || height <= 0) continue;

          camera.aspect = width / height;
          camera.updateProjectionMatrix();

          if (renderer) {
            renderer.setSize(width, height, false);
          }
        }
      });
      resizeObserver.observe(container);

    } catch (err) {
      console.warn("NetworkVisual WebGL initialization failed:", err);
      if (canvas && container.contains(canvas)) {
        container.removeChild(canvas);
      }
      return;
    }

    // 11. Component unmount: dispose renderer, geometries, materials
    return () => {
      if (animId !== null) {
        cancelAnimationFrame(animId);
      }
      if (pulseIntervalId !== null) {
        clearInterval(pulseIntervalId);
      }
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      if (nodesMesh) {
        nodesMesh.geometry.dispose();
        (nodesMesh.material as THREE.Material).dispose();
      }

      if (connectionsMesh) {
        connectionsMesh.geometry.dispose();
        (connectionsMesh.material as THREE.Material).dispose();
      }

      if (starField) {
        starField.geometry.dispose();
        (starField.material as THREE.Material).dispose();
      }

      if (renderer) {
        renderer.dispose();
      }

      if (canvas && container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, [density]);

  return (
    <div
      ref={containerRef}
      className={`${fillContainer ? styles.containerFill : styles.container} ${className}`}
      aria-hidden="true"
    />
  );
}
