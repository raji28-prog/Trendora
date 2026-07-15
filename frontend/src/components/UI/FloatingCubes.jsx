import React, { useRef } from 'react';
import { motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────
   FloatingCubes
   Physics-like cube drop from top, then gentle float/rotate.
   Uses CSS 3D transforms + Framer Motion spring physics.
   Fully GPU-accelerated (transform + opacity only).
   ──────────────────────────────────────────────────────────────  */

const CUBE_CONFIGS = [
  { size: 70,  x: '12%',  finalY: '8%',  delay: 0,    rotation: [0, 45, 20],  floatAmp: 10, floatDuration: 4.5 },
  { size: 50,  x: '72%',  finalY: '5%',  delay: 0.18, rotation: [20, 30, 15], floatAmp: 8,  floatDuration: 5.2 },
  { size: 90,  x: '85%',  finalY: '18%', delay: 0.32, rotation: [10, 60, 30], floatAmp: 12, floatDuration: 4.0 },
  { size: 40,  x: '28%',  finalY: '62%', delay: 0.46, rotation: [30, 20, 45], floatAmp: 6,  floatDuration: 5.8 },
  { size: 60,  x: '58%',  finalY: '58%', delay: 0.56, rotation: [15, 50, 10], floatAmp: 9,  floatDuration: 4.8 },
  { size: 35,  x: '3%',   finalY: '45%', delay: 0.65, rotation: [40, 25, 35], floatAmp: 7,  floatDuration: 6.2 },
  { size: 55,  x: '92%',  finalY: '70%', delay: 0.72, rotation: [25, 40, 20], floatAmp: 10, floatDuration: 5.0 },
];

/* Renders one face of a CSS 3D cube */
const CubeFace = ({ transform, size }) => (
  <div
    className="absolute cube-face"
    style={{
      width: size,
      height: size,
      transform,
    }}
  />
);

const Cube3D = ({ size, rotation, floatAmp, floatDuration, entryDelay }) => {
  const [rx, ry, rz] = rotation;
  const halfSize = size / 2;

  /* Physics-like entry: spring from -300px top with bounce */
  const entryVariants = {
    hidden: {
      y: -350,
      opacity: 0,
      rotateX: rx - 60,
      rotateY: ry - 40,
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: rx,
      rotateY: ry,
      transition: {
        type: 'spring',
        stiffness: 55,
        damping: 12,
        mass: 1.2,
        delay: entryDelay,
        opacity: { duration: 0.3, delay: entryDelay },
      },
    },
  };

  /* After landing: gentle slow float loop */
  const floatVariants = {
    rest: { y: 0, rotateX: rx, rotateY: ry, rotateZ: rz },
    float: {
      y: [-floatAmp / 2, floatAmp / 2, -floatAmp / 2],
      rotateX: [rx, rx + 8, rx - 4, rx],
      rotateY: [ry, ry + 12, ry - 6, ry],
      transition: {
        duration: floatDuration,
        ease: 'easeInOut',
        repeat: Infinity,
        delay: entryDelay + 0.8,
      },
    },
  };

  const faces = [
    { transform: `translateZ(${halfSize}px)` },                    // front
    { transform: `translateZ(-${halfSize}px) rotateY(180deg)` },   // back
    { transform: `rotateY(90deg) translateZ(${halfSize}px)` },     // right
    { transform: `rotateY(-90deg) translateZ(${halfSize}px)` },    // left
    { transform: `rotateX(90deg) translateZ(${halfSize}px)` },     // top
    { transform: `rotateX(-90deg) translateZ(${halfSize}px)` },    // bottom
  ];

  return (
    <motion.div
      variants={entryVariants}
      initial="hidden"
      animate="visible"
      style={{
        width: size,
        height: size,
        transformStyle: 'preserve-3d',
        position: 'relative',
      }}
    >
      <motion.div
        variants={floatVariants}
        animate="float"
        style={{
          width: size,
          height: size,
          transformStyle: 'preserve-3d',
          position: 'relative',
        }}
      >
        {faces.map((face, i) => (
          <CubeFace key={i} transform={face.transform} size={size} />
        ))}
      </motion.div>
    </motion.div>
  );
};

export const FloatingCubes = ({ className = '' }) => {
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) return null;

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ perspective: '900px', perspectiveOrigin: '50% 50%' }}
      aria-hidden="true"
    >
      {CUBE_CONFIGS.map((cfg, idx) => (
        <div
          key={idx}
          className="absolute"
          style={{
            left: cfg.x,
            top: cfg.finalY,
          }}
        >
          <Cube3D
            size={cfg.size}
            rotation={cfg.rotation}
            floatAmp={cfg.floatAmp}
            floatDuration={cfg.floatDuration}
            entryDelay={cfg.delay}
          />
        </div>
      ))}
    </div>
  );
};

export default FloatingCubes;
