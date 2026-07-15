import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────
   GlobalBackground
   Renders: blurred neon orbs, tiny moving particles,
   diagonal light streaks, and a mouse-tracking glow.
   All animations are GPU-accelerated (transform + opacity only).
   Respects prefers-reduced-motion.
   ──────────────────────────────────────────────────────────────  */

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 10,
  duration: 8 + Math.random() * 12,
  size: Math.random() > 0.7 ? 3 : 2,
  opacity: 0.3 + Math.random() * 0.5,
}));

const STREAKS = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  x: 10 + i * 20 + Math.random() * 10,
  y: Math.random() * 50,
  delay: i * 1.8 + Math.random() * 2,
  duration: 6 + Math.random() * 4,
  length: 80 + Math.random() * 60,
}));

export const GlobalBackground = () => {
  const mouseGlowRef = useRef(null);
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onMouseMove = useCallback((e) => {
    if (!mouseGlowRef.current || reducedMotion) return;
    mouseGlowRef.current.style.left = `${e.clientX}px`;
    mouseGlowRef.current.style.top  = `${e.clientY}px`;
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove, reducedMotion]);

  return (
    <>
      {/* ── Deep background blobs ─────────────────────────── */}
      <div className="blob-container" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        {/* Extra ambient radial glow rings */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 40% at 20% 10%, rgba(124,58,237,0.05) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 50% 50% at 80% 90%, rgba(79,70,229,0.06) 0%, transparent 60%)',
          }}
        />

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(124,58,237,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* ── Particles ──────────────────────────────────── */}
        {!reducedMotion && PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              bottom: -10,
              width: p.size,
              height: p.size,
              background: '#7C3AED',
              boxShadow: `0 0 ${p.size * 3}px rgba(124,58,237,0.8)`,
            }}
            animate={{
              y: [0, -(window?.innerHeight ?? 800) - 100],
              x: [0, (Math.random() - 0.5) * 80],
              opacity: [0, p.opacity, p.opacity, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}

        {/* ── Light streaks ──────────────────────────────── */}
        {!reducedMotion && STREAKS.map((s) => (
          <motion.div
            key={s.id}
            className="absolute pointer-events-none"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: 1,
              height: s.length,
              background:
                'linear-gradient(180deg, transparent 0%, rgba(124,58,237,0.5) 50%, transparent 100%)',
              rotate: '-45deg',
              transformOrigin: 'top left',
            }}
            animate={{
              x: ['-200px', '150vw'],
              y: [0, '120vh'],
              opacity: [0, 0.4, 0.2, 0],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* ── Mouse-following glow ───────────────────────────── */}
      {!reducedMotion && (
        <div
          ref={mouseGlowRef}
          className="mouse-glow"
          aria-hidden="true"
          style={{ left: '-1000px', top: '-1000px' }}
        />
      )}
    </>
  );
};

export default GlobalBackground;
