import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import FloatingCubes from './FloatingCubes.jsx';

export const PremiumBackground = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // Parallax coordinates using Framer Motion springs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 40, stiffness: 200, mass: 0.5 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  const transformedX = useTransform(parallaxX, (v) => v * 0.4);
  const transformedY = useTransform(parallaxY, (v) => v * 0.4);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate normalized mouse position relative to center (-0.5 to 0.5)
      const x = (clientX / innerWidth) - 0.5;
      const y = (clientY / innerHeight) - 0.5;
      
      mouseX.set(x * 50); // 50px max translation
      mouseY.set(y * 50);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 2 + 0.8;
        this.alpha = Math.random() * 0.4 + 0.15;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${this.alpha})`; // Purple particles
        ctx.fill();
      }
    }

    const particlesCount = Math.min(50, Math.floor((width * height) / 32000));
    const particles = Array.from({ length: particlesCount }, () => new Particle());

    // Connection distance threshold
    const connectionDist = 110;

    const resizeHandler = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeHandler);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`; // Soft purple connection lines
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden select-none pointer-events-none"
      style={{ background: '#09090B' }}
    >
      {/* ── Gradient Glow Effects (Blobs) ── */}
      <motion.div
        className="absolute top-[-15%] left-[-15%] w-[60vw] h-[60vw] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.16) 0%, transparent 70%)',
          filter: 'blur(100px)',
          x: useSpring(useTransform(parallaxX, v => v * -0.5), springConfig),
          y: useSpring(useTransform(parallaxY, v => v * -0.5), springConfig),
        }}
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[-15%] w-[65vw] h-[65vw] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
          filter: 'blur(120px)',
          x: useSpring(useTransform(parallaxX, v => v * -0.3), springConfig),
          y: useSpring(useTransform(parallaxY, v => v * -0.3), springConfig),
        }}
        animate={{
          scale: [1.1, 0.95, 1.1],
          opacity: [0.7, 0.9, 0.7],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* ── Animated Light Beams ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.035]">
        <div
          className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] rotate-[30deg]"
          style={{
            backgroundImage: 'linear-gradient(90deg, transparent 40%, rgba(168, 85, 247, 0.5) 50%, transparent 60%)',
            backgroundSize: '200% 100%',
            animation: 'beamShift 18s linear infinite',
          }}
        />
      </div>
      
      <style>{`
        @keyframes beamShift {
          0% { background-position: -100% 0; }
          100% { background-position: 100% 0; }
        }
      `}</style>

      {/* ── Interactive Particle Canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* ── 3D Floating Cubes Layer ── */}
      <motion.div 
        className="absolute inset-0 z-[2]"
        style={{
          x: transformedX,
          y: transformedY,
        }}
      >
        <FloatingCubes className="opacity-[0.55]" />
      </motion.div>

      {/* ── Ambient Overlay & Depth ── */}
      <div 
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.85)',
          background: 'radial-gradient(circle at center, transparent 40%, rgba(9,9,11,0.6) 100%)'
        }}
      />
    </div>
  );
};

export default PremiumBackground;
