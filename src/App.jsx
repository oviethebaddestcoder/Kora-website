import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight, Zap, Shield, Lock, Hexagon,
  Smartphone, Terminal, Layers, Github, BookOpen,
  Key, Clock, Package, Info, AlertTriangle, X, Cloud, Server,
  Radio, Target, Grid3X3, ChevronLeft, ChevronRight, Menu,
  Network, Bluetooth, Inbox, Cpu, GitMerge, RefreshCw, Waypoints, Database, Braces,
} from 'lucide-react';

// ── Design Tokens ──
const tokens = {
  surface: '#fcf9f3',
  surfaceDim: '#dcdad4',
  surfaceContainerLow: '#f6f3ed',
  surfaceContainer: '#f0eee8',
  surfaceContainerHigh: '#ebe8e2',
  onSurface: '#1c1c18',
  onSurfaceVariant: '#56423e',
  inverseSurface: '#31312d',
  outline: '#89726d',
  outlineVariant: '#ddc0ba',
  primary: '#9f402d',
  onPrimary: '#ffffff',
  primaryContainer: '#e2725b',
  onPrimaryContainer: '#5a0d02',
  inversePrimary: '#ffb4a5',
  secondary: '#904d00',
  onSecondary: '#ffffff',
  secondaryContainer: '#ffa049',
  onSecondaryContainer: '#6e3a00',
  tertiary: '#4a6457',
  onTertiary: '#ffffff',
  tertiaryContainer: '#7e998a',
  onTertiaryContainer: '#183025',
  error: '#ba1a1a',
  onError: '#ffffff',
  background: '#fcf9f3',
  digitalNeon: '#00e676',
  solarGold: '#ffa049',
};

// ── Mesh Network Canvas Animation ──
function MeshAnimation() {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const packetsRef = useRef([]);
  const frameRef = useRef(0);
  const [dims, setDims] = useState({ w: 700, h: 400 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const parent = canvas.parentElement;
      const w = Math.min(parent ? parent.clientWidth : 700, 700);
      const h = 400;
      setDims({ w, h });
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize nodes
    const nodePositions = [
      { x: 0.15, y: 0.3 }, { x: 0.5, y: 0.2 }, { x: 0.85, y: 0.35 },
      { x: 0.3, y: 0.7 }, { x: 0.7, y: 0.75 }, { x: 0.5, y: 0.55 }
    ];
    nodesRef.current = nodePositions.map((pos, i) => ({
      x: pos.x, y: pos.y,
      id: i,
      active: i < 4,
      pulsePhase: Math.random() * Math.PI * 2,
      label: ['Lagos', 'Kano', 'Abuja', 'Ibadan', 'Offline', 'Offline'][i],
    }));

    const animate = () => {
      const w = dims.w;
      const h = dims.h;
      ctx.clearRect(0, 0, w, h);
      const time = Date.now() / 1000;

      // Draw connections
      nodesRef.current.forEach((node, i) => {
        nodesRef.current.forEach((other, j) => {
          if (i >= j) return;
          const nx = node.x * w, ny = node.y * h;
          const ox = other.x * w, oy = other.y * h;
          const dist = Math.hypot(nx - ox, ny - oy);
          if (dist > 280) return;

          const bothActive = node.active && other.active;
          const alpha = bothActive ? 0.35 * (1 - dist / 280) : 0.06;

          ctx.beginPath();
          ctx.moveTo(nx, ny);
          ctx.lineTo(ox, oy);
          ctx.strokeStyle = bothActive 
            ? `rgba(0, 230, 118, ${alpha})` 
            : `rgba(137, 114, 109, ${alpha})`;
          ctx.lineWidth = bothActive ? 2 : 1;
          ctx.stroke();
        });
      });

      // Spawn packets
      if (Math.random() < 0.025) {
        const activeNodes = nodesRef.current.filter(n => n.active);
        if (activeNodes.length >= 2) {
          const from = activeNodes[Math.floor(Math.random() * activeNodes.length)];
          let to = activeNodes[Math.floor(Math.random() * activeNodes.length)];
          while (to === from) {
            to = activeNodes[Math.floor(Math.random() * activeNodes.length)];
          }
          packetsRef.current.push({
            from, to, progress: 0, speed: 0.012 + Math.random() * 0.008
          });
        }
      }

      // Draw packets
      packetsRef.current = packetsRef.current.filter(p => {
        p.progress += p.speed;
        if (p.progress >= 1) return false;

        const fx = p.from.x * w, fy = p.from.y * h;
        const tx = p.to.x * w, ty = p.to.y * h;
        const x = fx + (tx - fx) * p.progress;
        const y = fy + (ty - fy) * p.progress;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = tokens.digitalNeon;
        ctx.shadowColor = tokens.digitalNeon;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        return true;
      });

      // Draw nodes
      nodesRef.current.forEach(node => {
        const nx = node.x * w, ny = node.y * h;
        const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.3 + 0.7;

        if (node.active) {
          ctx.beginPath();
          ctx.arc(nx, ny, 28 + pulse * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(159, 64, 45, ${0.08 * pulse})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(nx, ny, 20, 0, Math.PI * 2);
        ctx.fillStyle = node.active ? tokens.primary : tokens.surfaceDim;
        ctx.fill();
        ctx.strokeStyle = node.active ? tokens.primaryContainer : tokens.outline;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(nx, ny, 6, 0, Math.PI * 2);
        ctx.fillStyle = node.active ? tokens.onPrimary : tokens.outline;
        ctx.fill();

        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillStyle = node.active ? tokens.onSurface : tokens.outline;
        ctx.textAlign = 'center';
        ctx.fillText(node.label, nx, ny + 36);
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [dims.w, dims.h]);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 700, height: 400, margin: '0 auto' }}>
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', borderRadius: 16 }}
      />
      <div style={{
        position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 16, alignItems: 'center',
        background: 'rgba(252,249,243,0.9)', backdropFilter: 'blur(8px)',
        padding: '8px 16px', borderRadius: 100, border: '1px solid ' + tokens.outlineVariant,
        fontSize: 12, fontFamily: '"JetBrains Mono", monospace', fontWeight: 600,
        color: tokens.onSurfaceVariant
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ 
            width: 8, height: 8, borderRadius: '50%', 
            background: tokens.digitalNeon,
            animation: 'pulse 2s ease-in-out infinite',
            display: 'inline-block'
          }} />
          4 nodes active
        </span>
        <span style={{ color: tokens.outlineVariant }}>|</span>
        <span>BLE mesh</span>
        <span style={{ color: tokens.outlineVariant }}>|</span>
        <span>0 external deps</span>
      </div>
    </div>
  );
}

// ── Minimal helpers (placeholder hooks) ──
function useIntersectionObserver() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    setVisible(true);
  }, []);
  return [ref, visible];
}

function useCountUp(target) {
  const ref = useRef(null);
  const [value, setValue] = useState(target);
  useEffect(() => { setValue(target); }, [target]);
  return [ref, value];
}

// ── Navigation ──
function Navigation({ onNavigate, currentPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'How it works', id: 'how-it-works' },
    { label: 'Packages', id: 'packages' },
    { label: 'Performance', id: 'performance' },
  ];

  const scrollToSection = (id) => {
    onNavigate('landing');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <nav className="site-nav" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300,
      height: 64,
      background: scrolled ? 'rgba(252,249,243,0.95)' : 'rgba(252,249,243,0.85)',
      backdropFilter: 'blur(20px) saturate(1.8)',
      WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
      borderBottom: '1px solid ' + tokens.outlineVariant,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px',
      transition: 'all 0.3s ease',
      boxShadow: scrolled ? '0 1px 3px rgba(0,0,0,0.04)' : 'none'
    }}>
      <button
        onClick={() => onNavigate('landing')}
        className="nav-brand"
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: 20, fontWeight: 800,
          color: tokens.primary, letterSpacing: '-0.03em',
          textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer'
        }}
      >
        <img src="/koralogo.png" alt="Kora logo" style={{ width: 32, height: 32, borderRadius: 12, objectFit: 'contain' }} />
        Kora
      </button>

      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        {navLinks.map(link => (
          <button
            key={link.id}
            onClick={() => scrollToSection(link.id)}
            style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: 14, fontWeight: 600,
              color: tokens.onSurfaceVariant,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px 0', position: 'relative',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = tokens.onSurface}
            onMouseLeave={e => e.currentTarget.style.color = tokens.onSurfaceVariant}
          >
            {link.label}
          </button>
        ))}

        <button
          onClick={() => onNavigate('docs')}
          style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: 13, fontWeight: 700,
            padding: '8px 18px', borderRadius: 8,
            background: tokens.primary, color: tokens.onPrimary,
            border: 'none', cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: 6
          }}
        >
          <BookOpen size={14} />
          Docs
        </button>
      </div>

      <button className="nav-toggle" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
            style={{ position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, zIndex: 150 }}
          />
          <div className="nav-mobile-menu" style={{ position: 'absolute', top: 64, right: 12, zIndex: 160, background: 'rgba(252,249,243,0.98)', border: '1px solid ' + tokens.outlineVariant, borderRadius: 12, padding: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
            {navLinks.map(link => (
              <button key={link.id} onClick={() => { setMenuOpen(false); scrollToSection(link.id); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', color: tokens.onSurfaceVariant, fontWeight: 700 }}>{link.label}</button>
            ))}
            <button onClick={() => { setMenuOpen(false); onNavigate('docs'); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', background: tokens.primary, color: tokens.onPrimary, border: 'none', borderRadius: 8, marginTop: 8 }}>Docs</button>
          </div>
        </>
      )}
    </nav>
  );
}

// Hero section extracted into its own component
function HeroSection({ onNavigate }) {
  const [ref1, visible1] = useIntersectionObserver();
  const [ref2, visible2] = useIntersectionObserver();
  const [ref3, visible3] = useIntersectionObserver();
  const [ref4, visible4] = useIntersectionObserver();

  return (
    <section className="hero" style={{ padding: '96px 32px', position: 'relative', textAlign: 'center' }}>
      <div style={{
        position: 'absolute', width: 500, height: 500,
        borderRadius: '50%', background: tokens.primary,
        filter: 'blur(80px)', opacity: 0.12,
        top: '-10%', right: '-5%',
        animation: 'float 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%', background: tokens.tertiary,
        filter: 'blur(80px)', opacity: 0.1,
        bottom: '-10%', left: '-5%',
        animation: 'float 10s ease-in-out infinite 1s'
      }} />

      <div 
        ref={ref1}
        style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 100,
          margin: '0 auto 24px',
          background: 'rgba(159,64,45,0.08)', border: '1px solid rgba(159,64,45,0.15)',
          fontFamily: '"JetBrains Mono", monospace', fontSize: 12, fontWeight: 600,
          color: tokens.primary, letterSpacing: '0.04em',
          
          opacity: visible1 ? 1 : 0,
          transform: visible1 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: tokens.digitalNeon,
          animation: 'pulse 2s ease-in-out infinite',
          display: 'inline-block'
        }} />
        v0.1.0 — Weave Protocol v1
      </div>

      <h1 
        ref={ref2}
        style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: 'clamp(40px, 6vw, 72px)',
          fontWeight: 900, lineHeight: 1.05,
          letterSpacing: '-0.03em',
          color: tokens.onSurface,
          maxWidth: 900,
          margin: '0 auto 16px',
          textAlign: 'center',
          opacity: visible2 ? 1 : 0,
          transform: visible2 ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s'
        }}
      >
        Offline-First Mesh for{' '}
        <span style={{
          background: 'linear-gradient(135deg, ' + tokens.primary + ' 0%, ' + tokens.secondary + ' 50%, ' + tokens.tertiary + ' 100%)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'gradientShift 4s ease infinite'
        }}>
          Africa's Last Mile
        </span>
      </h1>

      <p 
        ref={ref3}
        style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          lineHeight: 1.7,
          color: tokens.onSurfaceVariant,
          maxWidth: 640,
          margin: '0 auto 40px',
          opacity: visible3 ? 1 : 0,
          transform: visible3 ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
        }}
      >
        Build applications that work at full speed with no internet, sync automatically 
        when any connectivity appears, and route data through BLE mesh networks across 
        Africa's last mile.
      </p>

      <div 
        ref={ref4}
        style={{
          display: 'flex', gap: 12, flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: 64,
          opacity: visible4 ? 1 : 0,
          transform: visible4 ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
        }}
      >
        <button
          onClick={() => onNavigate('docs')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 28px', borderRadius: 8,
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: 14, fontWeight: 700,
            background: tokens.primary, color: tokens.onPrimary,
            border: 'none', cursor: 'pointer',
            boxShadow: '0 2px 0 ' + tokens.onPrimaryContainer + ', 0 4px 16px rgba(159,64,45,0.2)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 3px 0 ' + tokens.onPrimaryContainer + ', 0 8px 24px rgba(159,64,45,0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 0 ' + tokens.onPrimaryContainer + ', 0 4px 16px rgba(159,64,45,0.2)';
          }}
        >
          Read the docs
          <ArrowRight size={16} />
        </button>
        <a
          href="https://github.com/koraprotocol/kora"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 28px', borderRadius: 8,
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: 14, fontWeight: 700,
            background: 'transparent', color: tokens.primary,
            border: '2px solid ' + tokens.primary,
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(159,64,45,0.06)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Github size={16} />
          GitHub
        </a>
      </div>

      <MeshAnimation />
    </section>
  );
}

// ── Stats Section ──
function StatsSection() {
  const [ref1, count1] = useCountUp(92);
  const [ref2, count2] = useCountUp(0);
  const [ref3, count3] = useCountUp(153);
  const [ref4, count4] = useCountUp(355);
  const [ref5, count5] = useCountUp(10);
  const [sectionRef, visible] = useIntersectionObserver();

  const stats = [
    { ref: ref1, value: count1, suffix: '', label: 'Tests passing', delay: 0 },
    { ref: ref2, value: count2, suffix: '', label: 'External deps', delay: 0.1 },
    { ref: ref3, value: count3, suffix: 'B', label: 'Min parcel size', delay: 0.2 },
    { ref: ref4, value: count4, suffix: 'K', label: 'AES ops/sec', delay: 0.3 },
    { ref: ref5, value: count5, suffix: 'M', label: 'HLC ticks/sec', delay: 0.4 },
  ];

  return (
    <section className="stats" 
      ref={sectionRef}
      style={{ padding: '64px 32px', background: tokens.surfaceContainerLow, borderTop: '1px solid ' + tokens.outlineVariant }}
    >
      <div style={{
        display: 'flex', gap: 16, flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: 900, margin: '0 auto'
      }}>
        {stats.map((stat, i) => (
          <div
            key={i}
            ref={stat.ref}
            className="stat-card"
            style={{
              background: tokens.surface,
              border: '1px solid ' + tokens.outlineVariant,
              borderRadius: 16,
              padding: '24px 32px',
              flex: 1, minWidth: 140,
              textAlign: 'center',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative',
              overflow: 'hidden',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: stat.delay + 's'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.06)';
              e.currentTarget.style.borderColor = tokens.outline;
              const line = e.currentTarget.querySelector('.stat-line');
              if (line) line.style.transform = 'scaleX(1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = tokens.outlineVariant;
              const line = e.currentTarget.querySelector('.stat-line');
              if (line) line.style.transform = 'scaleX(0)';
            }}
          >
            <div className="stat-line" style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: 3,
              background: 'linear-gradient(90deg, ' + tokens.primary + ', ' + tokens.secondary + ')',
              transform: 'scaleX(0)', transformOrigin: 'left',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
            <div style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: 32, fontWeight: 800,
              letterSpacing: '-0.02em', color: tokens.primary,
              lineHeight: 1
            }}>
              {stat.value}{stat.suffix}
            </div>
            <div style={{
              fontSize: 12, color: tokens.onSurfaceVariant,
              marginTop: 6, fontWeight: 600,
              letterSpacing: '0.02em'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Mini inline visuals for the marquee feature cards ──
function WalPulseStrip({ color }) {
  const bars = [12, 20, 15, 24, 17, 22, 13];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 28 }}>
      {bars.map((h, i) => (
        <div key={i} style={{
          width: 5, borderRadius: 2, height: h,
          background: color,
          opacity: 0.3 + (i % 3) * 0.2,
          animation: `pulse ${1.5 + (i % 4) * 0.25}s ease-in-out infinite`,
          animationDelay: (i * 0.1) + 's'
        }} />
      ))}
    </div>
  );
}

function MiniMeshHops({ color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: 28 }}>
      {[0, 1, 2].map(i => (
        <React.Fragment key={i}>
          <div style={{
            width: 9, height: 9, borderRadius: '50%',
            background: color, boxShadow: '0 0 0 3px ' + color + '26',
            flexShrink: 0
          }} />
          {i < 2 && (
            <div style={{ width: 20, height: 2, background: color, opacity: 0.22, position: 'relative', flexShrink: 0 }}>
              <div style={{
                position: 'absolute', top: -2, left: 0,
                width: 6, height: 6, borderRadius: '50%', background: color,
                animation: 'meshPulse 1.6s ease-in-out infinite',
                animationDelay: (i * 0.45) + 's'
              }} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Features Section ──
function FeaturesSection() {
  const [sectionRef, visible] = useIntersectionObserver();
  const accents = {
    primary: { bg: 'rgba(159,64,45,0.08)', ring: 'rgba(159,64,45,0.14)', color: tokens.primary },
    secondary: { bg: 'rgba(144,77,0,0.08)', ring: 'rgba(144,77,0,0.14)', color: tokens.secondary },
    tertiary: { bg: 'rgba(74,100,87,0.08)', ring: 'rgba(74,100,87,0.14)', color: tokens.tertiary },
  };
  const features = [
    { icon: <Zap size={22} />, title: 'Offline-first writes', desc: 'Every write lands in a durable, WAL-backed store first — the UI never waits on a network that might not be there.', accent: 'primary', marquee: true, visual: (c) => <WalPulseStrip color={c} /> },
    { icon: <Radio size={22} />, title: 'BLE mesh routing', desc: 'Multi-hop gossip routing carries data device to device, finding a path even when no single hop reaches the destination.', accent: 'secondary', marquee: true, visual: (c) => <MiniMeshHops color={c} /> },
    { icon: <Shield size={18} />, title: 'Crypto-first identity', desc: 'Ed25519 identity, signed parcels, AES encryption.', accent: 'primary' },
    { icon: <Layers size={18} />, title: 'Composable packages', desc: 'Small packages that compose into production systems.', accent: 'tertiary' },
    { icon: <Smartphone size={18} />, title: 'Mobile bindings', desc: 'gomobile-compatible API for Android and iOS.', accent: 'secondary' },
    { icon: <Clock size={18} />, title: 'Causal ordering', desc: 'Hybrid Logical Clocks preserve causality across devices.', accent: 'tertiary' },
  ];

  return (
    <section id="features" ref={sectionRef} className="features" style={{ padding: '80px 32px', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 12, fontWeight: 600,
          color: tokens.primary, letterSpacing: '0.1em', textTransform: 'uppercase',
          marginBottom: 12
        }}>
          Features
        </div>
        <h2 style={{ fontFamily: '"Inter", system-ui, sans-serif', fontSize: 'clamp(22px,3.6vw,36px)', fontWeight: 800 }}>Built for the last mile</h2>
        <p style={{ color: tokens.onSurfaceVariant, maxWidth: 560, margin: '10px auto 0', fontSize: 15, lineHeight: 1.6 }}>Compact, focused building blocks for reliable offline-first apps.</p>
      </div>

      <div className="features-grid" style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {features.map((f, i) => {
          const a = accents[f.accent];
          if (f.marquee) {
            return (
              <div key={i} className="feature feature-marquee" style={{
                gridColumn: 'span 2',
                background: tokens.surfaceContainerLow,
                border: '1px solid ' + tokens.outlineVariant,
                borderRadius: 16, padding: 26,
                display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 13,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: a.bg, color: a.color,
                    boxShadow: '0 0 0 6px ' + a.ring,
                    flexShrink: 0
                  }}>
                    {f.icon}
                  </div>
                  {f.visual(a.color)}
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: tokens.onSurfaceVariant, lineHeight: 1.6, maxWidth: 380 }}>{f.desc}</div>
              </div>
            );
          }
          return (
            <div key={i} className="feature" style={{
              gridColumn: 'span 1',
              background: tokens.surfaceContainerLow,
              border: '1px solid ' + tokens.outlineVariant,
              borderRadius: 14, padding: 22
            }}>
              <div style={{ position: 'relative', width: 40, height: 40, marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 11,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: a.bg, color: a.color
                }}>
                  {f.icon}
                </div>
                <span style={{
                  position: 'absolute', top: -2, right: -2,
                  width: 9, height: 9, borderRadius: '50%',
                  background: tokens.digitalNeon,
                  border: '2px solid ' + tokens.surfaceContainerLow,
                  animation: 'pulse 2s ease-in-out infinite'
                }} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13.5, color: tokens.onSurfaceVariant, lineHeight: 1.55 }}>{f.desc}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── How It Works Section ──
function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'Write fully offline',
      desc: 'Health workers record patient data with zero connectivity. Every write is immediately durable in the WAL-backed store. The app never stalls.',
      visual: 'code'
    },
    {
      num: '02',
      title: 'Sync on proximity',
      desc: 'When two devices come within Bluetooth range, the CRDT sync engine fires automatically. Records merge mathematically — no conflicts, no data loss.',
      visual: 'mesh'
    },
    {
      num: '03',
      title: 'Route through the mesh',
      desc: 'Data hops device-to-device via multi-hop gossip routing. No direct path needed. A record from Lagos reaches Abuja through Kano automatically.',
      visual: 'route'
    },
    {
      num: '04',
      title: 'Upload when online',
      desc: 'Gateway nodes at clinics batch records and POST to the cloud when internet is available. Exponential backoff on failure. Full audit trail.',
      visual: 'cloud'
    },
  ];

  return (
    <section 
      id="how-it-works" className="howit"
      style={{ 
        padding: '96px 32px',
        background: tokens.surfaceContainerLow,
        borderTop: '1px solid ' + tokens.outlineVariant,
        borderBottom: '1px solid ' + tokens.outlineVariant
      }}
    >
      <div style={{
        textAlign: 'center', maxWidth: 700, margin: '0 auto 64px'
      }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 12, fontWeight: 600,
          color: tokens.primary, letterSpacing: '0.1em', textTransform: 'uppercase',
          marginBottom: 12
        }}>
          How It Works
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {steps.map((step, i) => {
          const StepRow = () => {
            const [ref, visible] = useIntersectionObserver();
            const isReversed = i % 2 === 1;

            return (
              <div
                ref={ref}
                className="howit-row"
                style={{
                  display: 'flex',
                  gap: 48,
                  alignItems: 'center',
                  marginBottom: 64,
                  flexDirection: isReversed ? 'row-reverse' : 'row',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: tokens.primary, color: tokens.onPrimary,
                    fontFamily: '"Inter", system-ui, sans-serif',
                    fontSize: 16, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20
                  }}>
                    {step.num}
                  </div>
                  <h3 style={{
                    fontFamily: '"Inter", system-ui, sans-serif',
                    fontSize: 24, fontWeight: 700,
                    color: tokens.onSurface,
                    marginBottom: 12,
                    letterSpacing: '-0.01em'
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontSize: 16, lineHeight: 1.7,
                    color: tokens.onSurfaceVariant,
                    maxWidth: 480
                  }}>
                    {step.desc}
                  </p>
                </div>

                <div className="step-visual" style={{
                  flex: 1, minWidth: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  minHeight: 280
                }}>
                  <StepVisual type={step.visual} index={i} />
                </div>
              </div>
            );
          };
          return <StepRow key={i} />;
        })}
      </div>
    </section>
  );
}

// ── Step Visual Components ──
function StepVisual({ type, index }) {
  if (type === 'code') {
    return (
      <div style={{
        background: tokens.inverseSurface,
        color: '#e8e6e0',
        borderRadius: 16,
        padding: 24,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 13,
        lineHeight: 1.7,
        width: '100%',
        maxWidth: 420,
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
          <span style={{ marginLeft: 'auto', fontSize: 11, color: tokens.onSurfaceVariant }}>main.go</span>
        </div>
        <div><span style={{ color: '#ffb4a5' }}>store</span>.<span style={{ color: '#ffa049' }}>Set</span>(<span style={{ color: '#b1cdbd' }}>"HealthRecord"</span>, <span style={{ color: '#b1cdbd' }}>"NG-0042"</span>,</div>
        <div style={{ paddingLeft: 20 }}>map[<span style={{ color: '#ddc0ba' }}>string</span>]<span style={{ color: '#ddc0ba' }}>any</span>{'{'}</div>
        <div style={{ paddingLeft: 40 }}><span style={{ color: '#b1cdbd' }}>"patientId"</span>: <span style={{ color: '#b1cdbd' }}>"NG-0042"</span>,</div>
        <div style={{ paddingLeft: 40 }}><span style={{ color: '#b1cdbd' }}>"weight"</span>: <span style={{ color: '#ffcf99' }}>72.5</span>,</div>
        <div style={{ paddingLeft: 40 }}><span style={{ color: '#b1cdbd' }}>"bp"</span>: <span style={{ color: '#b1cdbd' }}>"120/80"</span>,</div>
        <div style={{ paddingLeft: 20 }}>{'}'})</div>
        <div style={{ marginTop: 8, color: '#89726d', fontStyle: 'italic' }}>{'// Works fully offline. WAL fsynced.'}</div>
      </div>
    );
  }

  if (type === 'mesh') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 24, width: '100%'
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: tokens.primary, color: tokens.onPrimary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700,
          boxShadow: '0 0 30px rgba(159,64,45,0.3)',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          Lagos
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
        }}>
          <div style={{
            width: 60, height: 2,
            background: 'linear-gradient(90deg, ' + tokens.digitalNeon + ', ' + tokens.solarGold + ')',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute', top: -3, left: '50%',
              width: 8, height: 8, borderRadius: '50%',
              background: tokens.digitalNeon,
              transform: 'translateX(-50%)',
              animation: 'meshPulse 1.5s ease-in-out infinite'
            }} />
          </div>
          <span style={{ fontSize: 10, color: tokens.outline, fontFamily: '"JetBrains Mono", monospace' }}>BLE 30m</span>
        </div>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: tokens.tertiary, color: tokens.onTertiary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700
        }}>
          Kano
        </div>
      </div>
    );
  }

  if (type === 'route') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 16, width: '100%'
      }}>
        {['Lagos', 'Kano', 'Abuja'].map((city, i) => (
          <React.Fragment key={city}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: i === 0 ? tokens.primary : i === 2 ? tokens.secondary : tokens.tertiary,
              color: tokens.onPrimary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700,
              boxShadow: i === 0 ? '0 0 20px rgba(159,64,45,0.3)' : 'none'
            }}>
              {city}
            </div>
            {i < 2 && (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}>
                <ArrowRight size={16} color={tokens.digitalNeon} />
                <span style={{ fontSize: 9, color: tokens.outline }}>20m</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (type === 'cloud') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 16, width: '100%'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <div style={{
            padding: '12px 20px', borderRadius: 12,
            background: tokens.surfaceContainer,
            border: '1px solid ' + tokens.outlineVariant,
            fontSize: 12, fontWeight: 600,
            color: tokens.onSurfaceVariant
          }}>
            <Server size={14} style={{ marginRight: 6, display: 'inline', verticalAlign: 'middle' }} />
            Gateway Pi
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}>
            <ArrowRight size={16} color={tokens.digitalNeon} />
            <span style={{ fontSize: 9, color: tokens.outline }}>HTTPS</span>
          </div>
          <div style={{
            padding: '12px 20px', borderRadius: 12,
            background: 'linear-gradient(135deg, ' + tokens.primary + ', ' + tokens.secondary + ')',
            color: tokens.onPrimary,
            fontSize: 12, fontWeight: 600
          }}>
            <Cloud size={14} style={{ marginRight: 6, display: 'inline', verticalAlign: 'middle' }} />
            Cloud API
          </div>
        </div>
        <div style={{
          fontSize: 11, color: tokens.onSurfaceVariant,
          fontFamily: '"JetBrains Mono", monospace'
        }}>
          Batch: 50 records · Retry with backoff
        </div>
      </div>
    );
  }

  return null;
}

// ── Packages Section ──
function PackagesSection({ onNavigate }) {
  const [sectionRef, visible] = useIntersectionObserver();

  const pkgInfo = {
    parcel: { icon: <Hexagon size={16} />, desc: 'WVP binary packet encode / decode' },
    identity: { icon: <Key size={16} />, desc: 'Ed25519 + X25519 keypair management' },
    crypto: { icon: <Lock size={16} />, desc: 'AES-256-GCM encrypt / decrypt' },
    hlc: { icon: <Clock size={16} />, desc: 'Hybrid Logical Clock for causal order' },
    transport: { icon: <Network size={16} />, desc: 'TCP framed transport + WVP handshake' },
    'transport/ble': { icon: <Bluetooth size={16} />, desc: 'BLE mesh simulator — real BLE, same API' },
    queue: { icon: <Inbox size={16} />, desc: 'Store-and-forward queue with backoff' },
    node: { icon: <Cpu size={16} />, desc: 'Mesh node orchestrator' },
    crdt: { icon: <GitMerge size={16} />, desc: 'CRDT store with vector clock sync' },
    sync: { icon: <RefreshCw size={16} />, desc: 'SYNC_REQ / DATA / ACK over WVP' },
    relay: { icon: <Waypoints size={16} />, desc: 'Multi-hop gossip routing' },
    store: { icon: <Database size={16} />, desc: 'WAL-backed persistent CRDT store' },
    gateway: { icon: <Server size={16} />, desc: 'Cloud gateway bridge' },
    schema: { icon: <Braces size={16} />, desc: 'Entity schema + Go code compiler' },
    mobile: { icon: <Smartphone size={16} />, desc: 'gomobile Android / iOS interface' },
  };

  // Same five layers, same colors, as the Architecture page in the docs —
  // the landing page and the docs describe the same stack.
  const layers = [
    { name: 'Transport', tagline: 'gets bytes moving, over whatever link is available', accent: 'secondary', packages: ['transport', 'transport/ble'] },
    { name: 'Security', tagline: 'every parcel signed, encrypted, and clock-stamped', accent: 'primary', packages: ['parcel', 'identity', 'crypto', 'hlc'] },
    { name: 'Mesh routing', tagline: 'finds a path even with no direct link', accent: 'primary', packages: ['relay', 'node', 'queue'] },
    { name: 'Sync + CRDT', tagline: 'merges offline writes without conflict', accent: 'tertiary', packages: ['crdt', 'sync', 'store'] },
    { name: 'Application', tagline: 'the layer your own code actually touches', accent: 'tertiary', packages: ['gateway', 'schema', 'mobile'] },
  ];

  const accentColors = {
    primary: tokens.primary,
    secondary: tokens.secondary,
    tertiary: tokens.tertiary,
  };

  return (
    <section id="packages" ref={sectionRef} style={{ padding: '80px 32px', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <div style={{ textAlign: 'center', marginBottom: 44 }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, fontWeight: 600, color: tokens.primary, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>15 Packages</div>
        <h2 style={{ fontFamily: '"Inter", system-ui, sans-serif', fontSize: 'clamp(22px,3.6vw,36px)', fontWeight: 800 }}>One protocol, five layers, fifteen packages</h2>
        <p style={{ color: tokens.onSurfaceVariant, maxWidth: 560, margin: '10px auto 0', fontSize: 15, lineHeight: 1.6 }}>Every package maps to exactly one layer of the stack — pull in only what you need.</p>
      </div>

      <div style={{ maxWidth: 1040, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
        {layers.map(layer => {
          const color = accentColors[layer.accent];
          return (
            <div key={layer.name}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color }}>{layer.name}</span>
              </div>
              <div style={{ fontSize: 13, color: tokens.onSurfaceVariant, margin: '2px 0 14px 15px' }}>{layer.tagline}</div>

              <div className="pkg-layer-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {layer.packages.map(key => {
                  const info = pkgInfo[key];
                  return (
                    <div key={key} className="pkg-card" style={{
                      flex: '1 1 220px', minWidth: 0,
                      background: tokens.surfaceContainerLow,
                      border: '1px solid ' + tokens.outlineVariant,
                      borderTop: '3px solid ' + color,
                      borderRadius: '4px 12px 12px 12px',
                      padding: '16px 16px 18px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 26, height: 26, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: color + '18', color, flexShrink: 0 }}>
                          {info.icon}
                        </div>
                        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12.5, fontWeight: 700, color: tokens.onSurface, overflowWrap: 'break-word' }}>pkg/{key}</div>
                      </div>
                      <div style={{ fontSize: 12.5, color: tokens.onSurfaceVariant, lineHeight: 1.5 }}>{info.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <button
          onClick={() => onNavigate('docs')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 8,
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: 14, fontWeight: 700,
            background: 'transparent', color: tokens.primary,
            border: '2px solid ' + tokens.primary,
            cursor: 'pointer', transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(159,64,45,0.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          Browse the full API reference
          <ArrowRight size={15} />
        </button>
      </div>
    </section>
  );
}

// ── Performance Section ──
function PerformanceSection() {
  const [sectionRef, visible] = useIntersectionObserver();

  const benchmarks = [
    { name: 'AES-256-GCM', ops: '355,548', unit: 'ops/sec', mb: '86.8 MB/sec', icon: <Lock size={18} /> },
    { name: 'Ed25519 sign+verify', ops: '9,585', unit: 'ops/sec', mb: null, icon: <Key size={18} /> },
    { name: 'HLC generation', ops: '10,206,202', unit: 'ops/sec', mb: '97ns per op', icon: <Clock size={18} /> },
  ];

  return (
    <section 
      id="performance"
      ref={sectionRef}
      style={{ 
        padding: '96px 32px',
        background: tokens.surfaceContainerLow,
        borderTop: '1px solid ' + tokens.outlineVariant
      }}
    >
      <div style={{
        textAlign: 'center', maxWidth: 700, margin: '0 auto 48px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 12, fontWeight: 600,
          color: tokens.primary, letterSpacing: '0.1em', textTransform: 'uppercase',
          marginBottom: 12
        }}>
          Performance
        </div>
        <h2 style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: tokens.onSurface,
          marginBottom: 16
        }}>
          Cryptographic throughput
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24,
        maxWidth: 900, margin: '0 auto'
      }}>
        {benchmarks.map((bench, i) => (
          <div
            key={bench.name}
            style={{
              background: tokens.surface,
              border: '1px solid ' + tokens.outlineVariant,
              borderRadius: 20,
              padding: 32,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: (0.1 + i * 0.1) + 's'
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'rgba(159,64,45,0.08)',
                color: tokens.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1.5px solid ' + tokens.primary
              }}>
                {bench.icon}
              </div>
              <span style={{
                fontSize: 14, fontWeight: 600,
                color: tokens.onSurfaceVariant
              }}>
                {bench.name}
              </span>
            </div>
            <div style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: 36, fontWeight: 800,
              color: tokens.primary,
              letterSpacing: '-0.02em',
              lineHeight: 1
            }}>
              {bench.ops}
            </div>
            <div style={{
              fontSize: 13, color: tokens.onSurfaceVariant,
              marginTop: 4, fontWeight: 600
            }}>
              {bench.unit}
            </div>
            {bench.mb && (
              <div style={{
                marginTop: 12,
                padding: '8px 12px',
                borderRadius: 8,
                background: 'rgba(0,230,118,0.08)',
                border: '1px solid rgba(0,230,118,0.2)',
                fontSize: 12, fontWeight: 700,
                color: '#1a5e32',
                fontFamily: '"JetBrains Mono", monospace'
              }}>
                {bench.mb}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── CTA Section ──
function CTASection({ onNavigate }) {
  const [ref, visible] = useIntersectionObserver();

  return (
    <section
      ref={ref}
      style={{
        background: 'linear-gradient(135deg, ' + tokens.primary + ' 0%, ' + tokens.onPrimaryContainer + ' 100%)',
        position: 'relative', overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        textAlign: 'center',
        padding: '96px 32px',
        maxWidth: 700, margin: '0 auto',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 100,
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)',
          fontFamily: '"JetBrains Mono", monospace', fontSize: 12, fontWeight: 600,
          color: 'rgba(255,255,255,0.9)', letterSpacing: '0.04em',
          marginBottom: 20
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: tokens.digitalNeon,
            animation: 'pulse 2s ease-in-out infinite',
            display: 'inline-block'
          }} />
          MIT licensed — open source
        </div>
        <h2 style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: 800, lineHeight: 1.1,
          color: tokens.onPrimary,
          marginBottom: 16
        }}>
          Ready to build offline-first?
        </h2>
        <p style={{
          fontSize: 18, lineHeight: 1.7,
          color: 'rgba(255,255,255,0.75)',
          marginBottom: 32
        }}>
          From go get to a working mesh node in under five minutes. 
          No servers required. No internet required.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => onNavigate('docs')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 32px', borderRadius: 10,
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: 15, fontWeight: 700,
              background: tokens.onPrimary, color: tokens.primary,
              border: 'none', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Get Started
            <ArrowRight size={18} />
          </button>
          <a
            href="https://github.com/koraprotocol/kora"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 32px', borderRadius: 10,
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: 15, fontWeight: 700,
              background: 'transparent', color: tokens.onPrimary,
              border: '2px solid rgba(255,255,255,0.45)',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Github size={18} />
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Footer ──
function Footer({ onNavigate }) {
  const scrollToSection = (id) => {
    onNavigate('landing');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="site-footer" style={{
      borderTop: '1px solid ' + tokens.outlineVariant,
      padding: '64px 32px',
      background: tokens.surfaceContainerLow
    }}>
      <div className="footer-grid" style={{
        display: 'grid',
        gap: 32,
        maxWidth: 1100, margin: '0 auto'
      }}>
        <div>
          <div style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: 20, fontWeight: 800,
            color: tokens.primary,
            marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <img
              src="/koralogo.png"
              alt="Kora logo"
              style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'contain' }}
            />
            Kora
          </div>
          <p style={{
            fontSize: 14, color: tokens.onSurfaceVariant,
            lineHeight: 1.6, maxWidth: 280
          }}>
            Offline-first mesh framework for Africa's last mile. 
            Built with Go. Zero dependencies.
          </p>
        </div>

        <div>
          <div style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: 12, fontWeight: 700,
            color: tokens.onSurface,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: 16
          }}>
            Product
          </div>
          {['Features', 'How it works', 'Packages', 'Performance'].map(item => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase().replace(/ /g, '-'))}
              style={{
                display: 'block',
                fontSize: 14, color: tokens.onSurfaceVariant,
                background: 'none', border: 'none', cursor: 'pointer',
                marginBottom: 10, padding: 0, textAlign: 'left',
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = tokens.primary}
              onMouseLeave={e => e.currentTarget.style.color = tokens.onSurfaceVariant}
            >
              {item}
            </button>
          ))}
        </div>

        <div>
          <div style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: 12, fontWeight: 700,
            color: tokens.onSurface,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: 16
          }}>
            Resources
          </div>
          {[
            { label: 'Documentation', action: () => onNavigate('docs') },
            { label: 'GitHub', action: () => window.open('https://github.com/koraprotocol/kora', '_blank') },
            { label: 'CLI Reference', action: () => onNavigate('docs') },
            { label: 'WVP Spec', action: () => onNavigate('docs') },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                display: 'block',
                fontSize: 14, color: tokens.onSurfaceVariant,
                background: 'none', border: 'none', cursor: 'pointer',
                marginBottom: 10, padding: 0, textAlign: 'left',
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = tokens.primary}
              onMouseLeave={e => e.currentTarget.style.color = tokens.onSurfaceVariant}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div>
          <div style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: 12, fontWeight: 700,
            color: tokens.onSurface,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: 16
          }}>
            Community
          </div>
          {[
            { label: 'Twitter / X', action: () => window.open('#', '_blank') },
            { label: 'Discord', action: () => window.open('#', '_blank') },
            { label: 'Blog', action: () => onNavigate('landing') },
            { label: 'Status', action: () => onNavigate('landing') },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                display: 'block',
                fontSize: 14, color: tokens.onSurfaceVariant,
                background: 'none', border: 'none', cursor: 'pointer',
                marginBottom: 10, padding: 0, textAlign: 'left',
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = tokens.primary}
              onMouseLeave={e => e.currentTarget.style.color = tokens.onSurfaceVariant}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        maxWidth: 1100, margin: '32px auto 0',
        paddingTop: 24,
        borderTop: '1px solid ' + tokens.outlineVariant,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 12
      }}>
        <span style={{ fontSize: 13, color: tokens.outline }}>
           Kora Protocol. MIT License.
        </span>
        <span style={{
          fontSize: 12, color: tokens.outline,
          fontFamily: '"JetBrains Mono", monospace'
        }}>
          Built with Go · Zero dependencies
        </span>
      </div>
    </footer>
  );
}

// ── Docs Sidebar ──
function DocsSidebar({ activeSection, onSectionChange, collapsed, onToggle }) {
  const sections = [
    { section: 'Overview', items: [
      { id: 'intro', label: 'Introduction', icon: <Target size={14} /> },
      { id: 'quickstart', label: 'Quick start', icon: <Zap size={14} /> },
      { id: 'concepts', label: 'Core concepts', icon: <Hexagon size={14} /> },
    ]},
    { section: 'Reference', items: [
      { id: 'api', label: 'API reference', icon: <Package size={14} />, badge: '12 pkg' },
      { id: 'cli', label: 'CLI reference', icon: <Terminal size={14} /> },
      { id: 'schema', label: 'Schema system', icon: <Grid3X3 size={14} /> },
      { id: 'mobile', label: 'Mobile binding', icon: <Smartphone size={14} /> },
    ]},
    { section: 'Protocol', items: [
      { id: 'protocol', label: 'WVP spec', icon: <Shield size={14} /> },
      { id: 'security', label: 'Security model', icon: <Lock size={14} /> },
    ]},
    { section: 'Deployment', items: [
      { id: 'deploy', label: 'Gateway & Pi', icon: <Server size={14} /> },
      { id: 'arch', label: 'Architecture', icon: <Layers size={14} /> },
    ]},
  ];

  return (
    <aside className={"docs-sidebar" + (collapsed ? ' collapsed' : '')} style={{
      width: 280, flexShrink: 0,
      position: 'fixed', top: 64, left: 0, bottom: 0,
      background: tokens.surfaceContainerLow,
      borderRight: '1px solid ' + tokens.outlineVariant,
      overflowY: 'auto',
      padding: '24px 0 32px'
    }}>
      <div style={{
        padding: '0 24px 16px',
        borderBottom: '1px solid ' + tokens.outlineVariant,
        marginBottom: 8
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onToggle} aria-label="Toggle sidebar" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'inline-flex', alignItems: 'center' }}>
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        <div style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: 18, fontWeight: 800,
          color: tokens.primary, letterSpacing: '-0.02em',
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <img
            src="/koralogo.png"
            alt="Kora logo"
            style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'contain' }}
          />
          Kora
        </div>
        <div style={{
          fontSize: 10, color: tokens.onSurfaceVariant,
          marginTop: 3, fontWeight: 600, letterSpacing: '0.05em',
          fontFamily: '"JetBrains Mono", monospace'
        }}>
          WEAVE PROTOCOL (WVP) · v0.1.0
        </div>
      </div>

      {sections.map(group => (
        <div key={group.section}>
          <div style={{
            padding: '8px 24px 4px',
            fontSize: 10, fontWeight: 700,
            color: tokens.outline, letterSpacing: '0.12em',
            textTransform: 'uppercase', marginTop: 8,
            fontFamily: '"Inter", system-ui, sans-serif'
          }}>
            {group.section}
          </div>
          {group.items.map(item => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 24px',
                fontSize: 14, fontWeight: 600,
                color: activeSection === item.id ? tokens.primary : tokens.onSurfaceVariant,
                background: activeSection === item.id ? tokens.surfaceContainerHigh : 'transparent',
                border: 'none',
                borderLeft: activeSection === item.id ? '3px solid ' + tokens.primary : '3px solid transparent',
                cursor: 'pointer',
                width: '100%', textAlign: 'left',
                transition: 'all 0.15s'
              }}
            >
              {item.icon}
              {item.label}
              {item.badge && (
                <span style={{
                  marginLeft: 'auto',
                  fontSize: 10, fontWeight: 700,
                  padding: '2px 6px', borderRadius: 4,
                  background: tokens.surfaceContainerHigh,
                  color: tokens.onSurfaceVariant
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}

// ── Docs Content Components ──
function DocsCodeBlock({ label, children }) {
  return (
    <div style={{ margin: '16px 0 24px' }}>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
        color: tokens.onSurfaceVariant, textTransform: 'uppercase',
        marginBottom: 4
      }}>
        {label}
      </div>
      <pre style={{
        background: tokens.inverseSurface,
        color: '#e8e6e0',
        borderRadius: 16,
        padding: 24,
        overflowX: 'auto',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 13, lineHeight: 1.7,
        border: '1px solid rgba(255,255,255,0.06)',
        margin: 0
      }}>
        {children}
      </pre>
    </div>
  );
}

function DocsAlert({ type, children }) {
  const isInfo = type === 'info';
  return (
    <div style={{
      borderRadius: 16,
      padding: '16px 24px',
      margin: '16px 0',
      display: 'flex', gap: 16,
      alignItems: 'flex-start',
      background: isInfo ? 'rgba(74,100,87,0.08)' : 'rgba(144,77,0,0.08)',
      border: '1px solid ' + (isInfo ? 'rgba(74,100,87,0.2)' : 'rgba(144,77,0,0.2)')
    }}>
      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>
        {isInfo ? <Info size={18} color={tokens.tertiary} /> : <AlertTriangle size={18} color={tokens.secondary} />}
      </span>
      <span style={{ fontSize: 14, lineHeight: 1.6, color: tokens.onSurface }}>
        {children}
      </span>
    </div>
  );
}

function DocsCard({ title, icon, children }) {
  return (
    <div style={{
      background: tokens.surfaceContainerLow,
      border: '1px solid ' + tokens.outlineVariant,
      borderRadius: 16,
      padding: 24,
      marginBottom: 16
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, flexShrink: 0,
          border: '1.5px solid ' + tokens.primary,
          background: 'rgba(159,64,45,0.08)',
          color: tokens.primary
        }}>
          {icon}
        </div>
        <span style={{
          fontSize: 14, fontWeight: 700,
          color: tokens.tertiary, letterSpacing: '0.01em'
        }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function DocsTable({ headers, rows }) {
  return (
    <div style={{ overflowX: 'auto', margin: '16px 0 24px' }}>
      <table style={{
        width: '100%', minWidth: 480, borderCollapse: 'collapse',
        fontSize: 14
      }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{
                textAlign: 'left', padding: '10px 16px',
                background: tokens.surfaceContainer,
                color: tokens.tertiary, fontSize: 11,
                fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderBottom: '2px solid ' + tokens.outlineVariant,
                whiteSpace: 'nowrap'
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{
              borderBottom: i < rows.length - 1 ? '1px solid ' + tokens.outlineVariant : 'none'
            }}>
              {row.map((cell, j) => (
                <td key={j} style={{
                  padding: '10px 16px',
                  verticalAlign: 'top', lineHeight: 1.5,
                  color: tokens.onSurfaceVariant
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocsChip({ children, color = 'primary' }) {
  const colorMap = {
    primary: { bg: 'rgba(159,64,45,0.1)', color: tokens.primary },
    secondary: { bg: 'rgba(144,77,0,0.1)', color: tokens.secondary },
    tertiary: { bg: 'rgba(74,100,87,0.1)', color: tokens.tertiary },
    neon: { bg: 'rgba(0,230,118,0.12)', color: '#1a5e32' },
    warn: { bg: 'rgba(144,77,0,0.12)', color: tokens.secondary },
  };
  const c = colorMap[color];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: 100,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
      background: c.bg, color: c.color
    }}>
      {children}
    </span>
  );
}

function DocsStep({ num, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: tokens.primary, color: tokens.onPrimary,
        fontSize: 12, fontWeight: 800,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: 2
      }}>
        {num}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 14, color: tokens.onSurfaceVariant, lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}

function DocsFnSig({ children }) {
  return (
    <div style={{
      fontFamily: '"JetBrains Mono", monospace', fontSize: 12.5,
      background: tokens.surfaceContainer,
      borderLeft: '3px solid ' + tokens.primary,
      padding: '8px 16px',
      borderRadius: '0 4px 4px 0',
      margin: '8px 0 4px',
      overflowX: 'auto',
      color: tokens.onSurface
    }}>
      {children}
    </div>
  );
}

// ── Docs Sections ──
function IntroSection() {
  return (
    <div>
      <div className="docs-header" style={{ borderBottom: '1px solid ' + tokens.outlineVariant, paddingBottom: 32, marginBottom: 32 }}>
        <h1 style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: 32, fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-0.02em', color: tokens.onSurface,
          marginBottom: 8
        }}>
          Kora — Offline-First Mesh Framework
        </h1>
        <p style={{
          fontSize: 18, lineHeight: 1.6,
          color: tokens.onSurfaceVariant, marginBottom: 24,
          maxWidth: 640
        }}>
          Build applications that work at full speed with no internet, sync automatically when any connectivity appears, and route data through BLE mesh networks across Africa's last mile.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 8,
            fontSize: 14, fontWeight: 700,
            background: tokens.solarGold, color: tokens.onTertiaryContainer,
            border: 'none', cursor: 'pointer',
            boxShadow: '2px 2px 0px ' + tokens.primary
          }}>
            Get started →
          </button>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 8,
            fontSize: 14, fontWeight: 700,
            background: 'transparent', color: tokens.primary,
            border: '2px solid ' + tokens.primary,
            cursor: 'pointer'
          }}>
            WVP protocol spec
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex', gap: 16, flexWrap: 'wrap',
        margin: '32px 0'
      }}>
        {[
          { val: '92', label: 'Tests passing' },
          { val: '0', label: 'External deps' },
          { val: '153B', label: 'Min parcel size' },
          { val: '355K', label: 'AES ops/sec' },
          { val: '10M', label: 'HLC ticks/sec' },
        ].map((s, i) => (
          <div key={i} style={{
            background: tokens.surfaceContainerLow,
            border: '1px solid ' + tokens.outlineVariant,
            borderRadius: 16,
            padding: '16px 24px',
            flex: 1, minWidth: 120
          }}>
            <div style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: 28, fontWeight: 800,
              letterSpacing: '-0.02em', color: tokens.primary,
              lineHeight: 1
            }}>{s.val}</div>
            <div style={{
              fontSize: 12, color: tokens.onSurfaceVariant,
              marginTop: 4, fontWeight: 600
            }}>{s.label}</div>
          </div>
        ))}
      </div>

      <h2 style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 22, fontWeight: 700, lineHeight: 1.2,
        color: tokens.tertiary, margin: '48px 0 16px'
      }}>What is Kora?</h2>
      <p style={{ marginBottom: 16, lineHeight: 1.7, maxWidth: 680, fontSize: 15 }}>
        Kora is a Go framework for building offline-first applications that communicate over a device mesh using the Weave Protocol (WVP) — a custom binary protocol designed from the ground up for intermittent connectivity, low-bandwidth links, and the physical constraints of the African market.
      </p>
      <p style={{ marginBottom: 16, lineHeight: 1.7, maxWidth: 680, fontSize: 15 }}>
        Every Kora application works fully offline. Data syncs automatically when two devices come within Bluetooth range. Records merge without conflicts using CRDTs. Every byte on the wire is signed with Ed25519 and encrypted with AES-256-GCM. No server needs to be online for any of this to work.
      </p>

      <div className="docs-card-grid" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
        margin: '32px 0'
      }}>
        <DocsCard title="Weave Protocol" icon={<Hexagon size={18} />}>
          <p style={{ fontSize: 14, color: tokens.onSurfaceVariant, margin: 0, lineHeight: 1.6 }}>
            A custom binary protocol — not HTTP. Self-contained 153-byte parcels carry their own address, signature, timestamp, and routing. Works over BLE, WiFi Direct, SMS, or TCP.
          </p>
        </DocsCard>
        <DocsCard title="CRDT Sync Engine" icon={<Layers size={18} />}>
          <p style={{ fontSize: 14, color: tokens.onSurfaceVariant, margin: 0, lineHeight: 1.6 }}>
            Three merge strategies: LastWriteWins, AppendOnly, MergeFields. Two nodes modify the same record offline — merge is mathematical, automatic, and loss-free.
          </p>
        </DocsCard>
        <DocsCard title="Ed25519 Identity" icon={<Shield size={18} />}>
          <p style={{ fontSize: 14, color: tokens.onSurfaceVariant, margin: 0, lineHeight: 1.6 }}>
            The NodeID is the Ed25519 public key. No certificate authority, no DNS, no central registration. Every device is sovereign from first boot.
          </p>
        </DocsCard>
        <DocsCard title="BLE Mesh Routing" icon={<Radio size={18} />}>
          <p style={{ fontSize: 14, color: tokens.onSurfaceVariant, margin: 0, lineHeight: 1.6 }}>
            Multi-hop gossip routing with deduplication. Lagos → Kano → Abuja: data traverses a 40m gap with zero direct connectivity between endpoints.
          </p>
        </DocsCard>
      </div>

      <h2 style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 22, fontWeight: 700, lineHeight: 1.2,
        color: tokens.tertiary, margin: '48px 0 16px'
      }}>Package overview</h2>
      <DocsTable
        headers={['Package', 'What it does', 'Key type']}
        rows={[
          [<code key="1">pkg/parcel</code>, 'WVP binary packet encode/decode', <code key="2">Parcel, NodeID</code>],
          [<code key="3">pkg/identity</code>, 'Ed25519 + X25519 keypair management', <code key="4">Identity</code>],
          [<code key="5">pkg/crypto</code>, 'AES-256-GCM encrypt/decrypt', 'functions only'],
          [<code key="6">pkg/hlc</code>, 'Hybrid Logical Clock for causal ordering', <code key="7">Clock</code>],
          [<code key="8">pkg/transport</code>, 'TCP framed transport + WVP handshake', <code key="9">Conn, Listener</code>],
          [<code key="10">pkg/transport/ble</code>, 'BLE mesh simulator (real BLE same API)', <code key="11">Hub, Device</code>],
          [<code key="12">pkg/queue</code>, 'Store-and-forward queue with backoff', <code key="13">Queue</code>],
          [<code key="14">pkg/node</code>, 'Mesh node orchestrator', <code key="15">Node</code>],
          [<code key="16">pkg/crdt</code>, 'CRDT store with vector clock sync', <code key="17">Store, Record</code>],
          [<code key="18">pkg/sync</code>, 'SYNC_REQ/DATA/ACK protocol over WVP', <code key="19">Syncer</code>],
          [<code key="20">pkg/relay</code>, 'Multi-hop gossip routing', <code key="21">Router</code>],
          [<code key="22">pkg/store</code>, 'WAL-backed persistent CRDT store', <code key="23">Store</code>],
          [<code key="24">pkg/gateway</code>, 'Cloud gateway bridge', <code key="25">Gateway</code>],
          [<code key="26">pkg/schema</code>, 'Entity schema + Go code compiler', <code key="27">Registry, Entity</code>],
          [<code key="28">pkg/mobile</code>, 'gomobile Android/iOS interface', <code key="29">KoraClient</code>],
        ]}
      />
    </div>
  );
}

function QuickstartSection() {
  return (
    <div>
      <div className="docs-header" style={{ borderBottom: '1px solid ' + tokens.outlineVariant, paddingBottom: 32, marginBottom: 32 }}>
        <h1 style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: 32, fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-0.02em', color: tokens.onSurface,
          marginBottom: 8
        }}>Quick start</h1>
        <p style={{
          fontSize: 18, lineHeight: 1.6,
          color: tokens.onSurfaceVariant
        }}>
          From <code>go get</code> to a working signed-and-encrypted offline-first node in under five minutes.
        </p>
      </div>

      <h2 style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 22, fontWeight: 700, lineHeight: 1.2,
        color: tokens.tertiary, margin: '48px 0 16px'
      }}>Installation</h2>
      <DocsCodeBlock label="Terminal">
        <span style={{ color: '#89726d' }}># Clone and build</span>{"\n"}
        git clone https://github.com/koraprotocol/kora{"\n"}
        cd kora{"\n"}
        go build ./...{"\n"}
        go test ./...   <span style={{ color: '#89726d' }}># 92 tests, 0 failures</span>{"\n"}
        {"\n"}
        <span style={{ color: '#89726d' }}># Run the full mesh demo</span>{"\n"}
        go run ./cmd/kora simulate{"\n"}
        {"\n"}
        <span style={{ color: '#89726d' }}># Or install the CLI globally</span>{"\n"}
        go install ./cmd/kora
      </DocsCodeBlock>

      <h2 style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 22, fontWeight: 700, lineHeight: 1.2,
        color: tokens.tertiary, margin: '48px 0 16px'
      }}>Your first node in 10 lines</h2>
      <p style={{ marginBottom: 16, lineHeight: 1.7, maxWidth: 680, fontSize: 15 }}>
        This is all you write. Transport selection, handshake, encryption, signing, and queue management all happen automatically.
      </p>
      <DocsCodeBlock label="Go">
        <span style={{ color: '#ffb4a5' }}>package</span> main{"\n"}
        {"\n"}
        <span style={{ color: '#ffb4a5' }}>import</span> ({"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#b1cdbd' }}>"github.com/koraprotocol/kora/pkg/identity"</span>{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#b1cdbd' }}>"github.com/koraprotocol/kora/pkg/node"</span>{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#b1cdbd' }}>"github.com/koraprotocol/kora/pkg/parcel"</span>{"\n"}
        ){"\n"}
        {"\n"}
        <span style={{ color: '#ffb4a5' }}>func</span> <span style={{ color: '#ffa049' }}>main</span>() {"{"}{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;id, _  := identity.<span style={{ color: '#ffa049' }}>Generate</span>()&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style={{ color: '#89726d' }}>{'// Ed25519 + X25519 keypair'}</span>{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;nd     := node.<span style={{ color: '#ffa049' }}>New</span>(id, <span style={{ color: '#b1cdbd' }}>"my-node"</span>){"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;nd.<span style={{ color: '#ffa049' }}>Listen</span>(<span style={{ color: '#b1cdbd' }}>":9001"</span>)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#89726d' }}>{'// WVP handshake on every connect'}</span>{"\n"}
        {"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;nd.<span style={{ color: '#ffa049' }}>OnMessage</span>(<span style={{ color: '#ffb4a5' }}>func</span>(from parcel.NodeID, t <span style={{ color: '#ddc0ba' }}>uint8</span>, payload []<span style={{ color: '#ddc0ba' }}>byte</span>) {"{"}{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fmt.<span style={{ color: '#ffa049' }}>Printf</span>(<span style={{ color: '#b1cdbd' }}>"[%s] %s\\n"</span>, from.<span style={{ color: '#ffa049' }}>Short</span>(), payload){"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;{"}"}){"\n"}
        {"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;nd.<span style={{ color: '#ffa049' }}>Connect</span>(<span style={{ color: '#b1cdbd' }}>":9002"</span>)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style={{ color: '#89726d' }}>{'// handshake fires, queue flushes'}</span>{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;nd.<span style={{ color: '#ffa049' }}>Send</span>(peerID, parcel.TypeMessage, []<span style={{ color: '#ddc0ba' }}>byte</span>(<span style={{ color: '#b1cdbd' }}>"Hello from Lagos"</span>)){"\n"}
        {"}"}
      </DocsCodeBlock>

      <h2 style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 22, fontWeight: 700, lineHeight: 1.2,
        color: tokens.tertiary, margin: '48px 0 16px'
      }}>Add CRDT sync in 5 more lines</h2>
      <DocsCodeBlock label="Go">
        <span style={{ color: '#ffb4a5' }}>import</span> ({"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#b1cdbd' }}>"github.com/koraprotocol/kora/pkg/crdt"</span>{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;korasync <span style={{ color: '#b1cdbd' }}>"github.com/koraprotocol/kora/pkg/sync"</span>{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#b1cdbd' }}>"github.com/koraprotocol/kora/pkg/schema"</span>{"\n"}
        ){"\n"}
        {"\n"}
        <span style={{ color: '#89726d' }}>{'// Create a CRDT store'}</span>{"\n"}
        store := crdt.<span style={{ color: '#ffa049' }}>New</span>(id.NodeID, nd.Clock){"\n"}
        store.<span style={{ color: '#ffa049' }}>RegisterEntity</span>(<span style={{ color: '#b1cdbd' }}>"HealthRecord"</span>, crdt.MergeFields){"\n"}
        {"\n"}
        <span style={{ color: '#89726d' }}>{'// Wire the sync protocol to the node'}</span>{"\n"}
        syncer := korasync.<span style={{ color: '#ffa049' }}>New</span>(nd, store, schema.<span style={{ color: '#ffa049' }}>New</span>()){"\n"}
        syncer.<span style={{ color: '#ffa049' }}>Start</span>()  <span style={{ color: '#89726d' }}>{'// intercepts SYNC_REQ/DATA/ACK, background ticker'}</span>{"\n"}
        {"\n"}
        <span style={{ color: '#89726d' }}>{'// Write — works fully offline'}</span>{"\n"}
        store.<span style={{ color: '#ffa049' }}>Set</span>(<span style={{ color: '#b1cdbd' }}>"HealthRecord"</span>, <span style={{ color: '#b1cdbd' }}>"NG-0042"</span>, map[<span style={{ color: '#ddc0ba' }}>string</span>]<span style={{ color: '#ddc0ba' }}>any</span>{"{"}{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#b1cdbd' }}>"patientId"</span>: <span style={{ color: '#b1cdbd' }}>"NG-0042"</span>,{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#b1cdbd' }}>"weight"</span>:&nbsp;&nbsp;&nbsp; <span style={{ color: '#ffcf99' }}>72.5</span>,{"\n"}
        {"}"}){"\n"}
        <span style={{ color: '#89726d' }}>{'// Syncs automatically when any peer connects'}</span>
      </DocsCodeBlock>

      <h2 style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 22, fontWeight: 700, lineHeight: 1.2,
        color: tokens.tertiary, margin: '48px 0 16px'
      }}>Run the simulation</h2>
      <DocsCodeBlock label="Terminal">
        kora simulate --nodes 3{"\n"}
        {"\n"}
        <span style={{ color: '#89726d' }}>━━ SCHEMA ━━  Defining entities</span>{"\n"}
        <span style={{ color: '#89726d' }}>━━ CRDT WRITES ━━  Lagos and Abuja write offline</span>{"\n"}
        <span style={{ color: '#89726d' }}>━━ BLE MESH ━━  Lagos←[20m]→Kano←[20m]→Abuja</span>{"\n"}
        <span style={{ color: '#89726d' }}>━━ SYNC ━━  Converged: {'{'}patientId, weight, bp{'}'} on all nodes ✓</span>{"\n"}
        <span style={{ color: '#89726d' }}>━━ RELAY ━━  Lagos→Kano→Abuja 2-hop ✓</span>
      </DocsCodeBlock>
    </div>
  );
}

function ConceptsSection() {
  return (
    <div>
      <div className="docs-header" style={{ borderBottom: '1px solid ' + tokens.outlineVariant, paddingBottom: 32, marginBottom: 32 }}>
        <h1 style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: 32, fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-0.02em', color: tokens.onSurface,
          marginBottom: 8
        }}>Core concepts</h1>
        <p style={{
          fontSize: 18, lineHeight: 1.6,
          color: tokens.onSurfaceVariant
        }}>Five ideas that everything else in Kora builds on.</p>
      </div>

      <h2 style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 22, fontWeight: 700, lineHeight: 1.2,
        color: tokens.tertiary, margin: '48px 0 16px'
      }}>1. The Parcel — not a request, a letter</h2>
      <p style={{ marginBottom: 16, lineHeight: 1.7, maxWidth: 680, fontSize: 15 }}>
        HTTP requires a server to be reachable at the moment you send a request. If it isn't, the request fails. A Kora Parcel is different: it is a self-contained, addressed, signed envelope that <em>finds its destination by whatever path exists</em> — BLE, WiFi Direct, SMS, or TCP — and queues if no path exists yet.
      </p>

      <div style={{
        border: '1px solid ' + tokens.outlineVariant,
        borderRadius: 16, padding: 24,
        margin: '16px 0',
        backgroundImage: `
          repeating-linear-gradient(45deg, rgba(74,100,87,0.025) 0, rgba(74,100,87,0.025) 1px, transparent 1px, transparent 8px),
          repeating-linear-gradient(-45deg, rgba(74,100,87,0.025) 0, rgba(74,100,87,0.025) 1px, transparent 1px, transparent 8px)
        `,
        backgroundColor: tokens.surfaceContainerLow
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, border: '1.5px solid ' + tokens.primary,
            background: 'rgba(159,64,45,0.08)', color: tokens.primary
          }}>⬡</div>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: tokens.tertiary
          }}>Parcel anatomy — 153 bytes minimum</span>
        </div>
        <div style={{ overflowX: 'auto', margin: '16px 0 24px' }}>
          <div style={{
            display: 'flex', borderRadius: 12, overflow: 'hidden',
            border: '1px solid ' + tokens.outlineVariant,
            minWidth: 600
          }}>
            {[
              { name: 'VERSION', size: '1B', bg: 'rgba(159,64,45,0.08)' },
              { name: 'TYPE', size: '1B', bg: 'rgba(159,64,45,0.08)' },
              { name: 'SRC NodeID', size: '32B', bg: 'rgba(144,77,0,0.08)' },
              { name: 'DST NodeID', size: '32B', bg: 'rgba(144,77,0,0.08)' },
              { name: 'NONCE', size: '12B', bg: 'rgba(74,100,87,0.08)' },
              { name: 'HLC', size: '8B', bg: 'rgba(74,100,87,0.08)' },
              { name: 'HOPS', size: '1B', bg: tokens.surfaceContainer },
              { name: 'LEN', size: '2B', bg: tokens.surfaceContainer },
              { name: 'PAYLOAD', size: 'N bytes', bg: 'rgba(0,230,118,0.08)', flex: 3 },
              { name: 'SIGNATURE', size: '64B', bg: 'rgba(159,64,45,0.08)', flex: 2 },
            ].map((field, i) => (
              <div key={i} style={{
                flex: field.flex || 1, minWidth: 0, padding: '10px 8px',
                textAlign: 'center', borderRight: i < 9 ? '1px solid ' + tokens.outlineVariant : 'none',
                background: field.bg
              }}>
                <div style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                  fontWeight: 600, whiteSpace: 'nowrap',
                  overflow: 'hidden', textOverflow: 'ellipsis'
                }}>{field.name}</div>
                <div style={{ fontSize: 10, color: tokens.onSurfaceVariant, marginTop: 2 }}>{field.size}</div>
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 13, color: tokens.onSurfaceVariant, margin: 0 }}>
          SRC and DST are 32-byte Ed25519 public keys — the address IS the key. Any node can verify any parcel using only the SRC field. No CA, no DNS lookup required.
        </p>
      </div>

      <h2 style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 22, fontWeight: 700, lineHeight: 1.2,
        color: tokens.tertiary, margin: '48px 0 16px'
      }}>2. NodeID — sovereign identity</h2>
      <p style={{ marginBottom: 16, lineHeight: 1.7, maxWidth: 680, fontSize: 15 }}>
        Every Kora node generates an Ed25519 keypair on first boot. The 32-byte public key becomes the permanent NodeID. This means:
      </p>
      <div style={{ margin: '16px 0' }}>
        <DocsStep num="1" title="No registration required" desc="Devices are self-sovereign. No server needs to allocate an address." />
        <DocsStep num="2" title="Verification without a CA" desc="Any receiver can verify a parcel's authenticity using only the SRC field in the header." />
        <DocsStep num="3" title="Stable across transports" desc="The same NodeID works over BLE, WiFi Direct, SMS, and TCP — identity is above the transport layer." />
      </div>

      <h2 style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 22, fontWeight: 700, lineHeight: 1.2,
        color: tokens.tertiary, margin: '48px 0 16px'
      }}>3. CRDT sync — offline-first by math</h2>
      <p style={{ marginBottom: 16, lineHeight: 1.7, maxWidth: 680, fontSize: 15 }}>
        CRDTs (Conflict-free Replicated Data Types) are data structures where any two versions can always merge deterministically. Three strategies ship with Kora:
      </p>
      <DocsTable
        headers={['Strategy', 'Behaviour', 'Use case']}
        rows={[
          [<code key="s1">LastWriteWins</code>, 'Highest HLC timestamp wins the whole record. Ties go to the incoming version.', 'Editable records (patient vitals, agent notes)'],
          [<code key="s2">AppendOnly</code>, 'First write is immutable. Additional writes are ignored for the same ID.', 'Audit logs, vaccination records, receipts'],
          [<code key="s3">MergeFields</code>, 'Field-by-field union: both nodes\' unique fields survive the merge.', 'Patient profiles built across multiple offline clinics'],
        ]}
      />

      <h2 style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 22, fontWeight: 700, lineHeight: 1.2,
        color: tokens.tertiary, margin: '48px 0 16px'
      }}>4. Hybrid Logical Clock (HLC)</h2>
      <p style={{ marginBottom: 16, lineHeight: 1.7, maxWidth: 680, fontSize: 15 }}>
        The HLC solves causal ordering for events across devices that may never have communicated. It combines wall-clock milliseconds (48 bits) with a logical counter (16 bits). When two events happen in the same millisecond, the counter increments to preserve causality.
      </p>
      <DocsCodeBlock label="Go — reading the HLC">
        clock := hlc.<span style={{ color: '#ffa049' }}>New</span>(){"\n"}
        t1 := clock.<span style={{ color: '#ffa049' }}>Now</span>()&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#89726d' }}>{'// generate timestamp for local event'}</span>{"\n"}
        t2 := clock.<span style={{ color: '#ffa049' }}>Observe</span>(remote) <span style={{ color: '#89726d' }}>{'// advance clock past a remote timestamp'}</span>{"\n"}
        hlc.<span style={{ color: '#ffa049' }}>Compare</span>(t1, t2)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#89726d' }}>{'// -1, 0, or 1'}</span>{"\n"}
        hlc.<span style={{ color: '#ffa049' }}>WallTime</span>(t1)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style={{ color: '#89726d' }}>{'// time.Time extraction'}</span>
      </DocsCodeBlock>

      <h2 style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 22, fontWeight: 700, lineHeight: 1.2,
        color: tokens.tertiary, margin: '48px 0 16px'
      }}>5. Store-and-forward queue</h2>
      <p style={{ marginBottom: 16, lineHeight: 1.7, maxWidth: 680, fontSize: 15 }}>
        <code>node.Send()</code> never returns an error for offline peers. If a destination is unreachable, the parcel enters the queue. When the peer reconnects with the same NodeID, the queue flushes automatically. From the application's perspective, delivery is guaranteed — only the timing varies.
      </p>
      <DocsAlert type="info">
        <strong style={{ color: tokens.tertiary }}>Persistent queue:</strong> Use <code>pkg/store</code> instead of the in-memory queue to survive process restarts. The WAL is fsynced on every write — crash-safe on power loss, which is a real concern in field deployments.
      </DocsAlert>
    </div>
  );
}

function APISection() {
  return (
    <div>
      <div className="docs-header" style={{ borderBottom: '1px solid ' + tokens.outlineVariant, paddingBottom: 32, marginBottom: 32 }}>
        <h1 style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: 32, fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-0.02em', color: tokens.onSurface,
          marginBottom: 8
        }}>API reference</h1>
        <p style={{
          fontSize: 18, lineHeight: 1.6,
          color: tokens.onSurfaceVariant
        }}>Complete reference for all exported types and functions across the 12 Kora packages.</p>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        padding: '16px 24px',
        background: tokens.surfaceContainer,
        border: '1px solid ' + tokens.outlineVariant,
        borderRadius: '16px 16px 0 0'
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, border: '1.5px solid ' + tokens.primary,
          background: 'rgba(159,64,45,0.08)', color: tokens.primary
        }}>⬡</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: tokens.secondary, overflowWrap: 'break-word' }}>
            github.com/koraprotocol/kora/pkg/parcel
          </div>
          <div style={{ fontSize: 12, color: tokens.onSurfaceVariant, marginTop: 2 }}>
            Weave Protocol binary packet format
          </div>
        </div>
      </div>
      <div style={{
        border: '1px solid ' + tokens.outlineVariant,
        borderTop: 'none',
        borderRadius: '0 0 16px 16px',
        padding: 24,
        marginBottom: 48
      }}>
        <h4 style={{
          fontSize: 13, fontWeight: 700,
          color: tokens.primary, margin: '16px 0 8px',
          letterSpacing: '0.05em', textTransform: 'uppercase'
        }}>Types</h4>
        <DocsFnSig>
          <span style={{ color: '#ffb4a5' }}>type</span> <span style={{ color: '#ddc0ba' }}>NodeID</span> [32]<span style={{ color: '#ddc0ba' }}>byte</span>
        </DocsFnSig>
        <p style={{ fontSize: 13, color: tokens.onSurfaceVariant, margin: '4px 0 16px' }}>
          32-byte Ed25519 public key used as a permanent device address. <code>Short()</code> returns the first 3 bytes as hex for logging.
        </p>
        <DocsFnSig>
          <span style={{ color: '#ffb4a5' }}>type</span> <span style={{ color: '#ddc0ba' }}>Parcel</span> <span style={{ color: '#ffb4a5' }}>struct</span> {"{"} Version, Type <span style={{ color: '#ddc0ba' }}>uint8</span>; Src, Dst <span style={{ color: '#ddc0ba' }}>NodeID</span>; Nonce [12]<span style={{ color: '#ddc0ba' }}>byte</span>; HLC <span style={{ color: '#ddc0ba' }}>uint64</span>; HopCount <span style={{ color: '#ddc0ba' }}>uint8</span>; Payload []<span style={{ color: '#ddc0ba' }}>byte</span>; Sig [64]<span style={{ color: '#ddc0ba' }}>byte</span> {"}"}
        </DocsFnSig>
        <h4 style={{
          fontSize: 13, fontWeight: 700,
          color: tokens.primary, margin: '16px 0 8px',
          letterSpacing: '0.05em', textTransform: 'uppercase'
        }}>Functions</h4>
        <DocsFnSig>func (<span style={{ color: '#ddc0ba' }}>p</span> *Parcel) <span style={{ color: '#ffa049' }}>Encode</span>() ([]<span style={{ color: '#ddc0ba' }}>byte</span>, <span style={{ color: '#ddc0ba' }}>error</span>)</DocsFnSig>
        <DocsFnSig>func <span style={{ color: '#ffa049' }}>Decode</span>(data []<span style={{ color: '#ddc0ba' }}>byte</span>) (*<span style={{ color: '#ddc0ba' }}>Parcel</span>, <span style={{ color: '#ddc0ba' }}>error</span>)</DocsFnSig>
        <DocsFnSig>func (<span style={{ color: '#ddc0ba' }}>p</span> *Parcel) <span style={{ color: '#ffa049' }}>BytesToSign</span>() ([]<span style={{ color: '#ddc0ba' }}>byte</span>, <span style={{ color: '#ddc0ba' }}>error</span>)</DocsFnSig>
        <DocsFnSig>func (<span style={{ color: '#ddc0ba' }}>p</span> *Parcel) <span style={{ color: '#ffa049' }}>Size</span>() <span style={{ color: '#ddc0ba' }}>int</span></DocsFnSig>
        <DocsFnSig>func <span style={{ color: '#ffa049' }}>TypeName</span>(t <span style={{ color: '#ddc0ba' }}>uint8</span>) <span style={{ color: '#ddc0ba' }}>string</span>  <span style={{ color: '#89726d' }}>{'// "MESSAGE", "SYNC_REQ", etc.'}</span></DocsFnSig>
        <h4 style={{
          fontSize: 13, fontWeight: 700,
          color: tokens.primary, margin: '16px 0 8px',
          letterSpacing: '0.05em', textTransform: 'uppercase'
        }}>Constants — parcel types</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
          <DocsChip color="primary">0x01 HANDSHAKE</DocsChip>
          <DocsChip color="secondary">0x02 SYNC_REQ</DocsChip>
          <DocsChip color="secondary">0x03 SYNC_DATA</DocsChip>
          <DocsChip color="secondary">0x04 SYNC_ACK</DocsChip>
          <DocsChip color="tertiary">0x05 RELAY</DocsChip>
          <DocsChip color="tertiary">0x06 PING</DocsChip>
          <DocsChip color="primary">0x07 MESSAGE</DocsChip>
          <DocsChip color="warn">0x08 KEY_ROTATE</DocsChip>
          <DocsChip color="warn">0x09 TOMBSTONE</DocsChip>
        </div>
      </div>
    </div>
  );
}

function CLISection() {
  return (
    <div>
      <div className="docs-header" style={{ borderBottom: '1px solid ' + tokens.outlineVariant, paddingBottom: 32, marginBottom: 32 }}>
        <h1 style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: 32, fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-0.02em', color: tokens.onSurface,
          marginBottom: 8
        }}>CLI reference</h1>
        <p style={{
          fontSize: 18, lineHeight: 1.6,
          color: tokens.onSurfaceVariant
        }}>The <code>kora</code> command — simulate, run, deploy, benchmark, and audit your mesh network from the terminal.</p>
      </div>

      {[
        { cmd: 'kora simulate', desc: 'Run a multi-node BLE mesh demo', flags: [
          { name: '--nodes N', desc: 'Number of nodes to simulate (1–3)', default: '3' },
          { name: '--chaos', desc: 'Enable chaos mode: random node disconnects', default: 'false' },
          { name: '--drop-rate N', desc: 'Packet drop percentage in chaos mode', default: '0' },
        ]},
        { cmd: 'kora node', desc: 'Run a persistent mesh node', flags: [
          { name: '--listen ADDR', desc: 'TCP address to listen on', default: ':9001' },
          { name: '--connect ADDR', desc: 'Peer address to connect to on startup', default: '—' },
          { name: '--name NAME', desc: 'Human-readable node name for logs', default: 'kora-node' },
        ]},
        { cmd: 'kora gateway', desc: 'Run a cloud gateway node', flags: [
          { name: '--listen ADDR', desc: 'BLE/TCP listen address', default: ':9000' },
          { name: '--cloud URL', desc: 'Cloud API endpoint. Omit for offline-only mode.', default: '—' },
          { name: '--api-key KEY', desc: 'Bearer token for cloud API auth', default: '—' },
          { name: '--batch-size N', desc: 'Records per upload batch', default: '50' },
        ]},
      ].map((cli, i) => (
        <div key={i} style={{
          border: '1px solid ' + tokens.outlineVariant,
          borderRadius: 16, overflow: 'hidden',
          marginBottom: 16
        }}>
          <div style={{
            background: tokens.surfaceContainer,
            padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
            borderBottom: '1px solid ' + tokens.outlineVariant
          }}>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 14,
              fontWeight: 600, color: tokens.secondary
            }}>{cli.cmd}</span>
            <span style={{
              fontSize: 13, color: tokens.onSurfaceVariant,
              marginLeft: 'auto'
            }}>{cli.desc}</span>
          </div>
          <div style={{ padding: 16 }}>
            <p style={{
              fontSize: 14, color: tokens.onSurfaceVariant,
              marginBottom: 12
            }}>
              {i === 0 ? 'Spins up N nodes in goroutines, places them on a simulated BLE plane, writes CRDT records, connects the mesh, and shows convergence. Ideal for testing before deploying physical hardware.' :
               i === 1 ? 'Starts a long-running Kora node with CRDT sync. Runs until SIGINT. Prints received messages to stdout.' :
               'Acts as a full Kora node that also uploads batched sync data to a cloud HTTP endpoint. Designed to run on a Raspberry Pi at a clinic or district office.'}
            </p>
            <div style={{ marginTop: 8 }}>
              {cli.flags.map((flag, j) => (
                <div key={j} style={{
                  display: 'flex', gap: 16, rowGap: 4,
                  padding: '7px 0', flexWrap: 'wrap',
                  borderBottom: j < cli.flags.length - 1 ? '1px solid ' + tokens.outlineVariant : 'none',
                  fontSize: 13, alignItems: 'baseline'
                }}>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 12,
                    color: tokens.primary, minWidth: 160, flexShrink: 0
                  }}>{flag.name}</span>
                  <span style={{ color: tokens.onSurfaceVariant, lineHeight: 1.5 }}>{flag.desc}</span>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                    color: tokens.tertiary, whiteSpace: 'nowrap',
                    marginLeft: 'auto'
                  }}>{flag.default}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SecuritySection() {
  return (
    <div>
      <div className="docs-header" style={{ borderBottom: '1px solid ' + tokens.outlineVariant, paddingBottom: 32, marginBottom: 32 }}>
        <h1 style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: 32, fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-0.02em', color: tokens.onSurface,
          marginBottom: 8
        }}>Security model</h1>
        <p style={{
          fontSize: 18, lineHeight: 1.6,
          color: tokens.onSurfaceVariant
        }}>Security is structural in Kora — not configurable, not optional. A developer cannot accidentally ship an unencrypted app.</p>
      </div>

      <div className="docs-card-grid" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
        margin: '32px 0'
      }}>
        <DocsCard title="Ed25519 signing" icon={<Shield size={18} />}>
          <p style={{ fontSize: 14, color: tokens.onSurfaceVariant, margin: 0, lineHeight: 1.6 }}>
            Every parcel is signed over all fields except SIG itself. A relay node that modifies any field — including HOP_COUNT — invalidates the signature. The receiver rejects modified parcels immediately.
          </p>
        </DocsCard>
        <DocsCard title="AES-256-GCM payload" icon={<Lock size={18} />}>
          <p style={{ fontSize: 14, color: tokens.onSurfaceVariant, margin: 0, lineHeight: 1.6 }}>
            All payload bytes are AES-256-GCM encrypted. The GCM authentication tag detects any tampering — even a single bit flip in the ciphertext causes decryption to fail.
          </p>
        </DocsCard>
        <DocsCard title="X25519 session keys" icon={<Key size={18} />}>
          <p style={{ fontSize: 14, color: tokens.onSurfaceVariant, margin: 0, lineHeight: 1.6 }}>
            Session keys are derived per-connection via X25519 DH. If a session key is compromised, past sessions remain secure because the DH private keys are unique per-boot.
          </p>
        </DocsCard>
        <DocsCard title="Replay prevention" icon={<Clock size={18} />}>
          <p style={{ fontSize: 14, color: tokens.onSurfaceVariant, margin: 0, lineHeight: 1.6 }}>
            Every parcel carries a 96-bit cryptographically random nonce. The relay router maintains a time-windowed seen-set — duplicate parcels are dropped before processing.
          </p>
        </DocsCard>
      </div>

      <h2 style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 22, fontWeight: 700, lineHeight: 1.2,
        color: tokens.tertiary, margin: '48px 0 16px'
      }}>What a relay node can and cannot do</h2>
      <DocsTable
        headers={['Action', 'Possible?', 'Why']}
        rows={[
          ['Read the payload', <DocsChip color="primary">No</DocsChip>, 'AES-256-GCM encrypted with session key; relay node lacks the decryption key'],
          ['Forge a parcel from another node', <DocsChip color="primary">No</DocsChip>, 'Ed25519 signature — would need the private key'],
          ['Modify HOP_COUNT', <DocsChip color="primary">No</DocsChip>, 'Covered by the Ed25519 signature; modification detected on receipt'],
          ['Drop a parcel', <DocsChip color="warn">Yes</DocsChip>, 'This is why the mesh floods when no route is known'],
          ['Delay a parcel', <DocsChip color="warn">Yes</DocsChip>, 'HLC timestamps provide ordering; delay does not corrupt data'],
          ['Replay an old parcel', <DocsChip color="primary">No</DocsChip>, 'Seen-set deduplication + nonce prevents replay'],
        ]}
      />

      <DocsAlert type="info">
        <strong style={{ color: tokens.tertiary }}>Zero-trust mesh:</strong> Even two devices sitting next to each other on the same BLE connection are treated as untrusted. Every parcel is signed and encrypted. Trust is cryptographic, not topological.
      </DocsAlert>
    </div>
  );
}

function ProtocolSection() {
  return (
    <div>
      <div className="docs-header" style={{ borderBottom: '1px solid ' + tokens.outlineVariant, paddingBottom: 32, marginBottom: 32 }}>
        <h1 style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: 32, fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-0.02em', color: tokens.onSurface,
          marginBottom: 8
        }}>Weave Protocol (WVP) spec</h1>
        <p style={{
          fontSize: 18, lineHeight: 1.6,
          color: tokens.onSurfaceVariant
        }}>The formal specification for the binary protocol that carries all data across the Kora mesh. Protocol version 1.</p>
      </div>

      <h2 style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 22, fontWeight: 700, lineHeight: 1.2,
        color: tokens.tertiary, margin: '48px 0 16px'
      }}>Wire format</h2>
      <p style={{ marginBottom: 16, lineHeight: 1.7, maxWidth: 680, fontSize: 15 }}>
        Every unit of data in Kora is a Parcel. The format is fixed-header binary — no variable-length headers, no text encoding, no optional fields. Every byte has a purpose.
      </p>
      <DocsTable
        headers={['Field', 'Offset', 'Size', 'Description']}
        rows={[
          [<code>VERSION</code>, '0', '1 byte', 'Protocol version. Must be 0x01. Parcels with unknown versions are dropped silently.'],
          [<code>TYPE</code>, '1', '1 byte', 'Parcel type (0x01–0x09). Determines how the payload is processed by the receiver.'],
          [<code>SRC</code>, '2', '32 bytes', "Sender's Ed25519 public key. This IS the NodeID. Used to verify the signature without a CA."],
          [<code>DST</code>, '34', '32 bytes', 'Destination NodeID. All-zeros = broadcast to all peers.'],
          [<code>NONCE</code>, '66', '12 bytes', '96-bit cryptographically random nonce. Serves dual purpose: AES-GCM IV and replay-attack prevention.'],
          [<code>HLC</code>, '78', '8 bytes (BE)', 'Hybrid Logical Clock timestamp. Provides causal ordering across offline nodes.'],
          [<code>HOP_COUNT</code>, '86', '1 byte', 'Number of relay hops taken. Capped at 12. Covered by signature — relay nodes cannot forge.'],
          [<code>PAYLOAD_LEN</code>, '87', '2 bytes (BE)', 'Length of the encrypted payload in bytes. Max 65535.'],
          [<code>PAYLOAD</code>, '89', 'N bytes', 'AES-256-GCM ciphertext + 16-byte auth tag. LZ4 compressed before encryption.'],
          [<code>SIG</code>, '89+N', '64 bytes', 'Ed25519 signature over all fields above. A relay node that modifies any field invalidates this signature.'],
        ]}
      />

      <h2 style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 22, fontWeight: 700, lineHeight: 1.2,
        color: tokens.tertiary, margin: '48px 0 16px'
      }}>Connection handshake</h2>
      <p style={{ marginBottom: 16, lineHeight: 1.7, maxWidth: 680, fontSize: 15 }}>
        When two nodes connect (over TCP, BLE GATT, or any transport), they simultaneously exchange 64-byte handshake payloads and derive a session key.
      </p>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 0,
        margin: '16px 0', flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            background: tokens.primary, color: tokens.onPrimary,
            border: '1px solid ' + tokens.primary,
            borderRadius: 12, padding: '8px 14px',
            fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap'
          }}>Node A</div>
          <div style={{ fontSize: 10, color: tokens.onSurfaceVariant, marginTop: 3, textAlign: 'center' }}>sends 64B</div>
        </div>
        <div style={{ padding: '0 8px', color: tokens.outline, fontSize: 16 }}>→</div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          background: tokens.surfaceContainer,
          border: '1px solid ' + tokens.outlineVariant,
          borderRadius: 12, padding: '8px 12px', textAlign: 'center'
        }}>
          <div>[Ed25519 pub : 32B]</div>
          <div>[X25519 pub  : 32B]</div>
        </div>
        <div style={{ padding: '0 8px', color: tokens.outline, fontSize: 16 }}>←</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            background: tokens.primary, color: tokens.onPrimary,
            border: '1px solid ' + tokens.primary,
            borderRadius: 12, padding: '8px 14px',
            fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap'
          }}>Node B</div>
          <div style={{ fontSize: 10, color: tokens.onSurfaceVariant, marginTop: 3, textAlign: 'center' }}>sends 64B</div>
        </div>
      </div>
      <p style={{ marginBottom: 16, lineHeight: 1.7, maxWidth: 680, fontSize: 15 }}>
        Both sides independently compute <code>sessionKey = X25519(own_dh_priv, peer_dh_pub)</code>. Both arrive at the same 32 bytes — this is the Diffie-Hellman guarantee. All subsequent parcel payloads are AES-256-GCM encrypted with this key.
      </p>
    </div>
  );
}

function DeploySection() {
  return (
    <div>
      <div className="docs-header" style={{ borderBottom: '1px solid ' + tokens.outlineVariant, paddingBottom: 32, marginBottom: 32 }}>
        <h1 style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: 32, fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-0.02em', color: tokens.onSurface,
          marginBottom: 8
        }}>Gateway & deployment</h1>
        <p style={{
          fontSize: 18, lineHeight: 1.6,
          color: tokens.onSurfaceVariant
        }}>Deploy a Kora gateway on a Raspberry Pi 4 at a clinic or district office. Total hardware cost: ~$60.</p>
      </div>

      <h2 style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 22, fontWeight: 700, lineHeight: 1.2,
        color: tokens.tertiary, margin: '48px 0 16px'
      }}>Raspberry Pi gateway setup</h2>
      <DocsStep num="1" title="Install Go on the Pi" desc="" />
      <DocsCodeBlock label="Terminal">
        curl -L https://go.dev/dl/go1.22.linux-arm64.tar.gz | sudo tar -C /usr/local -xz{"\n"}
        export PATH=$PATH:/usr/local/go/bin
      </DocsCodeBlock>
      <DocsStep num="2" title="Build and install" desc="" />
      <DocsCodeBlock label="Terminal">
        git clone https://github.com/koraprotocol/kora && cd kora{"\n"}
        go install ./cmd/kora
      </DocsCodeBlock>
      <DocsStep num="3" title="Run as a systemd service" desc="" />
      <DocsCodeBlock label="/etc/systemd/system/kora-gateway.service">
        [Unit]{"\n"}
        Description=Kora Gateway{"\n"}
        After=network.target{"\n"}
        {"\n"}
        [Service]{"\n"}
        ExecStart=/root/go/bin/kora gateway \{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;--listen :9000 \{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;--cloud https://api.yourapp.com/sync \{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;--api-key $KORA_API_KEY{"\n"}
        Restart=always{"\n"}
        RestartSec=5{"\n"}
        {"\n"}
        [Install]{"\n"}
        WantedBy=multi-user.target
      </DocsCodeBlock>
      <DocsCodeBlock label="Terminal">
        systemctl enable --now kora-gateway{"\n"}
        systemctl status kora-gateway
      </DocsCodeBlock>
    </div>
  );
}

function ArchSection() {
  return (
    <div>
      <div className="docs-header" style={{ borderBottom: '1px solid ' + tokens.outlineVariant, paddingBottom: 32, marginBottom: 32 }}>
        <h1 style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: 32, fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-0.02em', color: tokens.onSurface,
          marginBottom: 8
        }}>Architecture</h1>
        <p style={{
          fontSize: 18, lineHeight: 1.6,
          color: tokens.onSurfaceVariant
        }}>How all layers compose into a complete offline-first mesh system.</p>
      </div>

      <h2 style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 22, fontWeight: 700, lineHeight: 1.2,
        color: tokens.tertiary, margin: '48px 0 16px'
      }}>Layer stack</h2>
      <div style={{
        border: '1px solid ' + tokens.outlineVariant,
        borderRadius: 16, padding: 24,
        backgroundImage: `
          repeating-linear-gradient(45deg, rgba(74,100,87,0.025) 0, rgba(74,100,87,0.025) 1px, transparent 1px, transparent 8px),
          repeating-linear-gradient(-45deg, rgba(74,100,87,0.025) 0, rgba(74,100,87,0.025) 1px, transparent 1px, transparent 8px)
        `,
        backgroundColor: tokens.surfaceContainerLow
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { label: 'Application layer', pkgs: 'pkg/mobile · pkg/schema · pkg/gateway', color: 'rgba(74,100,87,0.12)', border: 'rgba(74,100,87,0.3)', chip: 'Layer 5', chipColor: tokens.tertiary },
            { label: 'Sync + CRDT layer', pkgs: 'pkg/sync · pkg/crdt · pkg/store', color: 'rgba(74,100,87,0.08)', border: 'rgba(74,100,87,0.2)', chip: 'Layer 4', chipColor: tokens.tertiary },
            { label: 'Mesh routing layer', pkgs: 'pkg/relay · pkg/node · pkg/queue', color: 'rgba(159,64,45,0.08)', border: 'rgba(159,64,45,0.2)', chip: 'Layer 3', chipColor: tokens.primary },
            { label: 'Security layer', pkgs: 'pkg/identity · pkg/crypto · pkg/hlc · pkg/parcel', color: 'rgba(159,64,45,0.05)', border: 'rgba(159,64,45,0.15)', chip: 'Layer 2', chipColor: tokens.primary },
            { label: 'Transport layer', pkgs: 'pkg/transport (TCP) · pkg/transport/ble · WiFi Direct · SMS', color: 'rgba(144,77,0,0.08)', border: 'rgba(144,77,0,0.2)', chip: 'Layer 1', chipColor: tokens.secondary },
          ].map((layer, i) => (
            <div key={i} style={{
              background: layer.color,
              border: '1px solid ' + layer.border,
              borderRadius: 12,
              padding: '12px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: 8
            }}>
              <div style={{ flex: '1 1 220px', minWidth: 0 }}><strong>{layer.label}</strong> — <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>{layer.pkgs}</span></div>
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '2px 8px', borderRadius: 100,
                fontSize: 10, fontWeight: 700,
                background: layer.color,
                color: layer.chipColor
              }}>{layer.chip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SchemaSection() {
  return (
    <div>
      <div className="docs-header" style={{ borderBottom: '1px solid ' + tokens.outlineVariant, paddingBottom: 32, marginBottom: 32 }}>
        <h1 style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: 32, fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-0.02em', color: tokens.onSurface,
          marginBottom: 8
        }}>Schema system</h1>
        <p style={{
          fontSize: 18, lineHeight: 1.6,
          color: tokens.onSurfaceVariant
        }}>Declare your data model once. Kora generates CRDT config, validation, sync priority, and typed Go source.</p>
      </div>

      <h2 style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 22, fontWeight: 700, lineHeight: 1.2,
        color: tokens.tertiary, margin: '48px 0 16px'
      }}>Defining entities</h2>
      <DocsCodeBlock label="Go">
        reg := schema.<span style={{ color: '#ffa049' }}>New</span>(){"\n"}
        {"\n"}
        reg.<span style={{ color: '#ffa049' }}>Register</span>(schema.Entity{"{"}{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;Name: <span style={{ color: '#b1cdbd' }}>"HealthRecord"</span>,{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;Fields: schema.Fields{"{"}{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#b1cdbd' }}>"patientId"</span>:  {"{"}Type: schema.TypeString,    Required: <span style={{ color: '#ffcf99' }}>true</span>{"}"},{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#b1cdbd' }}>"weight"</span>:     {"{"}Type: schema.TypeNumber{"}"},{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#b1cdbd' }}>"bloodPress"</span>: {"{"}Type: schema.TypeString{"}"},{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#b1cdbd' }}>"recordedAt"</span>: {"{"}Type: schema.TypeTimestamp, Required: <span style={{ color: '#ffcf99' }}>true</span>{"}"},{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#b1cdbd' }}>"recordedBy"</span>: {"{"}Type: schema.TypeDeviceID{"}"},{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;{"}"},{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;Conflict: crdt.MergeFields,    <span style={{ color: '#89726d' }}>{'// two clinics can add different fields'}</span>{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;Priority: schema.PriorityHigh, <span style={{ color: '#89726d' }}>{'// syncs before lower-priority entities'}</span>{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;TTLDays:  <span style={{ color: '#ffcf99' }}>365</span>,                <span style={{ color: '#89726d' }}>{'// auto-prune after 1 year'}</span>{"\n"}
        {"}"}){"\n"}
        {"\n"}
        reg.<span style={{ color: '#ffa049' }}>Register</span>(schema.Entity{"{"}{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;Name:     <span style={{ color: '#b1cdbd' }}>"VaccinationLog"</span>,{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;Fields:   schema.Fields{"{"}{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#b1cdbd' }}>"patientId"</span>: {"{"}Type: schema.TypeString, Required: <span style={{ color: '#ffcf99' }}>true</span>{"}"},{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#b1cdbd' }}>"vaccine"</span>:   {"{"}Type: schema.TypeString, Required: <span style={{ color: '#ffcf99' }}>true</span>{"}"},{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#b1cdbd' }}>"dose"</span>:      {"{"}Type: schema.TypeNumber{"}"},{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;{"}"},{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;Conflict: crdt.AppendOnly,     <span style={{ color: '#89726d' }}>{'// vaccination records are immutable'}</span>{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;Priority: schema.PriorityHigh,{"\n"}
        {"}"})
      </DocsCodeBlock>
    </div>
  );
}

function MobileSection() {
  return (
    <div>
      <div className="docs-header" style={{ borderBottom: '1px solid ' + tokens.outlineVariant, paddingBottom: 32, marginBottom: 32 }}>
        <h1 style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: 32, fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-0.02em', color: tokens.onSurface,
          marginBottom: 8
        }}>Mobile binding</h1>
        <p style={{
          fontSize: 18, lineHeight: 1.6,
          color: tokens.onSurfaceVariant
        }}>gomobile-compatible interface for Android (Kotlin/Java) and iOS (Swift). One API — string-in, JSON-out, zero maps.</p>
      </div>

      <h2 style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 22, fontWeight: 700, lineHeight: 1.2,
        color: tokens.tertiary, margin: '48px 0 16px'
      }}>Android (Kotlin)</h2>
      <DocsCodeBlock label="build.gradle">
        <span style={{ color: '#89726d' }}>{'// First: gomobile bind -target=android ./pkg/mobile'}</span>{"\n"}
        dependencies {"{"}{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;implementation fileTree(dir: <span style={{ color: '#b1cdbd' }}>'libs'</span>, include: [<span style={{ color: '#b1cdbd' }}>'*.aar'</span>]){"\n"}
        {"}"}
      </DocsCodeBlock>
      <DocsCodeBlock label="MainActivity.kt">
        <span style={{ color: '#ffb4a5' }}>import</span> mobile.Mobile{"\n"}
        {"\n"}
        <span style={{ color: '#ffb4a5' }}>val</span> client = Mobile.<span style={{ color: '#ffa049' }}>newKoraClient</span>(<span style={{ color: '#b1cdbd' }}>"/data/user/0/com.example/kora.db"</span>){"\n"}
        {"\n"}
        <span style={{ color: '#89726d' }}>{'// Register entity schemas'}</span>{"\n"}
        client.<span style={{ color: '#ffa049' }}>registerEntity</span>(<span style={{ color: '#b1cdbd' }}>"HealthRecord"</span>, <span style={{ color: '#b1cdbd' }}>"merge-fields"</span>, <span style={{ color: '#b1cdbd' }}>"high"</span>){"\n"}
        {"\n"}
        <span style={{ color: '#89726d' }}>{'// Start the mesh node'}</span>{"\n"}
        client.<span style={{ color: '#ffa049' }}>listen</span>(<span style={{ color: '#b1cdbd' }}>":9001"</span>) {"\n"}
        client.<span style={{ color: '#ffa049' }}>connect</span>(<span style={{ color: '#b1cdbd' }}>&quot;192.168.1.100:9001&quot;</span>)  <span style={{ color: '#89726d' }}>{'// or use BLE discovery'}</span>{"\n"}
        {"\n"}
        <span style={{ color: '#89726d' }}>{'// Write a record — works fully offline'}</span>{"\n"}
        client.<span style={{ color: '#ffa049' }}>set</span>(<span style={{ color: '#b1cdbd' }}>&quot;HealthRecord&quot;</span>, <span style={{ color: '#b1cdbd' }}>&quot;NG-0042&quot;</span>,{"\n"}
        &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#b1cdbd' }}>"""{'{'}"patientId":"NG-0042","weight":72.5{'}'}"""</span>){"\n"}
        {"\n"}
        <span style={{ color: '#89726d' }}>{'// Read back'}</span>{"\n"}
        <span style={{ color: '#ffb4a5' }}>val</span> json = client.<span style={{ color: '#ffa049' }}>get</span>(<span style={{ color: '#b1cdbd' }}>&quot;HealthRecord&quot;</span>, <span style={{ color: '#b1cdbd' }}>&quot;NG-0042&quot;</span>){"\n"}
        <span style={{ color: '#89726d' }}>{'// → {"patientId":"NG-0042","weight":72.5}'}</span>
      </DocsCodeBlock>

      <DocsAlert type="warn">
        <strong>gomobile restriction:</strong> The mobile package uses only primitive types — string, int, []byte — and defined interfaces. No maps, no channels, no generics. Complex inputs and outputs are JSON strings. This is a gomobile requirement, not a Kora limitation.
      </DocsAlert>
    </div>
  );
}

function PlaceholderSection({ title, subtitle }) {
  return (
    <div>
      <div className="docs-header" style={{ borderBottom: '1px solid ' + tokens.outlineVariant, paddingBottom: 32, marginBottom: 32 }}>
        <h1 style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: 32, fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-0.02em', color: tokens.onSurface,
          marginBottom: 8
        }}>{title}</h1>
        <p style={{
          fontSize: 18, lineHeight: 1.6,
          color: tokens.onSurfaceVariant
        }}>{subtitle}</p>
      </div>
      <p style={{ fontSize: 15, color: tokens.onSurfaceVariant, lineHeight: 1.7 }}>
        This section is being expanded. Check back soon for the complete documentation.
      </p>
    </div>
  );
}

// ── Main App ──
function App() {
  const [page, setPage] = useState('landing');
  const [docsSection, setDocsSection] = useState('intro');
  const [isDocsOpen, setIsDocsOpen] = useState(() => window.innerWidth > 900);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setIsDocsOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDocsSectionChange = (id) => {
    setDocsSection(id);
    if (window.innerWidth <= 900) {
      setIsDocsOpen(false);
    }
  };

  const docsSections = {
    intro: <IntroSection />,
    quickstart: <QuickstartSection />,
    concepts: <ConceptsSection />,
    api: <APISection />,
    cli: <CLISection />,
    schema: <SchemaSection />,
    mobile: <MobileSection />,
    protocol: <ProtocolSection />,
    security: <SecuritySection />,
    deploy: <DeploySection />,
    arch: <ArchSection />,
  };

  if (page === 'docs') {
    return (
      <div style={{ fontFamily: '"Atkinson Hyperlegible", system-ui, sans-serif', background: tokens.background, color: tokens.onSurface, minHeight: '100vh' }}>
        <Navigation onNavigate={setPage} currentPage={page} />
        <div style={{ position: 'relative' }}>
          {/* Reopen control — only present while the sidebar is closed, so there's
              always a way back in, on desktop as well as mobile. Closing is handled
              by the chevron inside the open sidebar, or by tapping the overlay. */}
          {!isDocsOpen && (
            <button
              className="docs-toggle"
              onClick={() => setIsDocsOpen(true)}
              aria-label="Open docs sidebar"
            >
              <Menu size={18} />
            </button>
          )}

          {isDocsOpen && (
            <div
              className="docs-overlay"
              onClick={() => setIsDocsOpen(false)}
              aria-hidden="true"
            />
          )}

          <div style={{ display: 'flex', paddingTop: 64, minHeight: '100vh' }}>
            <DocsSidebar activeSection={docsSection} onSectionChange={handleDocsSectionChange} collapsed={!isDocsOpen} onToggle={() => setIsDocsOpen(v => !v)} />

            <main className="docs-main" style={{ marginLeft: isDocsOpen ? 280 : 0, flex: 1, minHeight: 'calc(100vh - 64px)' }}>
              <div className="docs-content-wrap" style={{
                  display: 'block',
                  padding: '48px 48px 48px 48px',
                  maxWidth: 900
                }}>
                  <div key={docsSection} className="docs-content">
                    {docsSections[docsSection] || <PlaceholderSection title="Coming Soon" subtitle="This documentation section is under construction." />}
                  </div>
                </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: '"Atkinson Hyperlegible", system-ui, sans-serif', background: tokens.background, color: tokens.onSurface }}>
      <Navigation onNavigate={setPage} currentPage={page} />
      <HeroSection onNavigate={setPage} />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PackagesSection onNavigate={setPage} />
      <PerformanceSection />
      <CTASection onNavigate={setPage} />
      <Footer onNavigate={setPage} />
    </div>
  );
}

export default App;