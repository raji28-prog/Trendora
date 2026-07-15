import React, { useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   AnimatedBackground — Production-grade live animation system
   ───────────────────────────────────────────────────────────────
   Layer 0 (z=0):  Canvas — particles, twinkling stars, streaks
   Layer 1 (z=1):  CSS Orbs — breathing blur blobs (keyframes)
   Layer 2 (z=2):  Framer Motion — Gradient mesh shifts
   Layer 3 (z=3):  Mouse glow
   ═══════════════════════════════════════════════════════════════ */

/* ── Canvas Particle System ──────────────────────────────────── */
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const stateRef  = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    /* Resize handler */
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* Particle factory */
    const makeParticle = () => ({
      x:     Math.random() * canvas.width,
      y:     canvas.height + 10,
      vx:    (Math.random() - 0.5) * 0.5,
      vy:    -(0.4 + Math.random() * 0.8),
      size:  Math.random() > 0.7 ? 2.5 : 1.5,
      alpha: 0.3 + Math.random() * 0.5,
      life:  0,
      maxLife: 220 + Math.random() * 180,
      hue:   260 + Math.random() * 30,
    });

    /* Star factory */
    const makeStar = () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      r:       0.5 + Math.random() * 1,
      phase:   Math.random() * Math.PI * 2,
      speed:   0.01 + Math.random() * 0.02,
      alpha:   0.2 + Math.random() * 0.5,
    });

    /* Streak factory */
    const makeStreak = () => ({
      x:        -100 + Math.random() * canvas.width,
      y:        -100,
      vx:       3 + Math.random() * 4,
      vy:       2 + Math.random() * 3,
      len:      60 + Math.random() * 80,
      alpha:    0,
      phase:    0,          // 0=fade-in 1=live 2=fade-out
      maxAlpha: 0.35 + Math.random() * 0.2,
      delay:    Math.random() * 300,
    });

    /* Init collections */
    const particles = Array.from({ length: 60 }, makeParticle);
    particles.forEach((p, i) => { p.y = Math.random() * canvas.height; p.life = Math.random() * p.maxLife; });
    const stars = Array.from({ length: 80 }, makeStar);
    const streaks = Array.from({ length: 8 }, makeStreak);

    let frame = 0;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* ── Stars ─────────────────────────────────────────── */
      stars.forEach(s => {
        s.phase += s.speed;
        const a = s.alpha * (0.5 + 0.5 * Math.sin(s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,180,255,${a})`;
        ctx.fill();
      });

      /* ── Particles ─────────────────────────────────────── */
      particles.forEach((p, i) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        const lifeRatio = p.life / p.maxLife;
        const fadeAlpha = lifeRatio < 0.1
          ? lifeRatio * 10 * p.alpha
          : lifeRatio > 0.8
          ? (1 - lifeRatio) * 5 * p.alpha
          : p.alpha;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},80%,65%,${fadeAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${p.hue},80%,65%,0.6)`;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (p.life >= p.maxLife || p.y < -20) {
          particles[i] = makeParticle();
        }
      });

      /* ── Streaks ───────────────────────────────────────── */
      streaks.forEach((s, i) => {
        if (s.delay > 0) { s.delay--; return; }

        if (s.phase === 0) {
          s.alpha += 0.015;
          if (s.alpha >= s.maxAlpha) s.phase = 1;
        } else if (s.phase === 1) {
          // active for a while
          if (frame % 60 === i * 7) s.phase = 2;
        } else {
          s.alpha -= 0.012;
          if (s.alpha <= 0) {
            streaks[i] = makeStreak();
            return;
          }
        }

        s.x += s.vx;
        s.y += s.vy;

        const endX = s.x - s.len * 0.7;
        const endY = s.y - s.len * 0.5;
        const grad = ctx.createLinearGradient(endX, endY, s.x, s.y);
        grad.addColorStop(0, `rgba(124,58,237,0)`);
        grad.addColorStop(0.5, `rgba(168,85,247,${s.alpha})`);
        grad.addColorStop(1, `rgba(124,58,237,0)`);

        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (s.x > canvas.width + 200 || s.y > canvas.height + 200) {
          streaks[i] = makeStreak();
        }
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
      aria-hidden="true"
    />
  );
};

/* ── Breathing Orbs (CSS keyframes via inline style) ────────── */
const GlowOrbs = () => (
  <div
    style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 1,
      pointerEvents: 'none',
      overflow: 'hidden',
    }}
    aria-hidden="true"
  >
    {/* Orb 1 — top-left purple */}
    <div style={{
      position: 'absolute',
      top: '-15%', left: '-5%',
      width: 700, height: 700,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)',
      filter: 'blur(80px)',
      animation: 'orbFloat1 18s ease-in-out infinite alternate',
    }} />
    {/* Orb 2 — bottom-right indigo */}
    <div style={{
      position: 'absolute',
      bottom: '-15%', right: '-5%',
      width: 800, height: 800,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(79,70,229,0.18) 0%, transparent 70%)',
      filter: 'blur(100px)',
      animation: 'orbFloat2 22s ease-in-out infinite alternate',
      animationDelay: '-8s',
    }} />
    {/* Orb 3 — center violet accent */}
    <div style={{
      position: 'absolute',
      top: '35%', left: '40%',
      width: 500, height: 500,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
      filter: 'blur(90px)',
      animation: 'orbFloat3 14s ease-in-out infinite alternate',
      animationDelay: '-4s',
    }} />
    {/* Orb 4 — top-right small neon */}
    <div style={{
      position: 'absolute',
      top: '8%', right: '15%',
      width: 300, height: 300,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)',
      filter: 'blur(60px)',
      animation: 'orbFloat1 11s ease-in-out infinite alternate',
      animationDelay: '-2s',
    }} />
  </div>
);

/* ── Dot-Grid Mesh ───────────────────────────────────────────── */
const GradientMesh = () => (
  <div
    style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 1,
      pointerEvents: 'none',
      backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.6) 1px, transparent 1px)',
      backgroundSize: '36px 36px',
      opacity: 0.035,
    }}
    aria-hidden="true"
  />
);

/* ── Mouse Parallax Glow ─────────────────────────────────────── */
const MouseGlow = () => {
  const glowRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (!glowRef.current) return;
      glowRef.current.style.left = `${e.clientX}px`;
      glowRef.current.style.top  = `${e.clientY}px`;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={glowRef}
      style={{
        position: 'fixed',
        zIndex: 2,
        pointerEvents: 'none',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.055) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
        transition: 'left 0.12s ease-out, top 0.12s ease-out',
        left: '-1000px',
        top:  '-1000px',
        willChange: 'left, top',
      }}
      aria-hidden="true"
    />
  );
};

/* ── CSS Keyframe injection ──────────────────────────────────── */
const AnimationKeyframes = () => (
  <style>{`
    @keyframes orbFloat1 {
      0%   { transform: translate(0,   0)   scale(1);    }
      33%  { transform: translate(60px, -50px) scale(1.1); }
      66%  { transform: translate(-40px, 40px) scale(0.95); }
      100% { transform: translate(20px, -20px) scale(1.05); }
    }
    @keyframes orbFloat2 {
      0%   { transform: translate(0, 0)    scale(1);    }
      40%  { transform: translate(-70px, 50px) scale(1.12); }
      70%  { transform: translate(50px, -35px) scale(0.93); }
      100% { transform: translate(-30px, 20px) scale(1.07); }
    }
    @keyframes orbFloat3 {
      0%   { transform: translate(0, 0)   scale(1);    }
      50%  { transform: translate(-80px, -60px) scale(1.15); }
      100% { transform: translate(60px, 40px)   scale(0.9);  }
    }
    @keyframes shimmer {
      0%   { transform: translateX(-100%); }
      100% { transform: translateX(200%);  }
    }
    .animate-shimmer {
      animation: shimmer 2.4s ease-in-out infinite;
    }
  `}</style>
);

/* ── Root AnimatedBackground ─────────────────────────────────── */
const AnimatedBackground = () => {
  /* Respect prefers-reduced-motion */
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <>
      <AnimationKeyframes />
      {/* Solid base layer */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          background: '#06060A',
        }}
        aria-hidden="true"
      />
      <GradientMesh />
      <GlowOrbs />
      {!prefersReduced && <ParticleCanvas />}
      {!prefersReduced && <MouseGlow />}
    </>
  );
};

export default AnimatedBackground;
