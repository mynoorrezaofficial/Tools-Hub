import { useRef, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';

export default function HeroCard3D({ icon: Icon, title, description, iconGradient, glowColor, shadowColor, width = 200 }) {
  const sceneRef = useRef(null);
  const cardRef  = useRef(null);
  const shineRef = useRef(null);
  const rafRef   = useRef(null);
  const target   = useRef({ x: 0, y: -20 });
  const current  = useRef({ x: 0, y: -20 });
  const hovering = useRef(false);

  // ── Smooth animation loop ──────────────────────────────────────────
  const tick = useCallback(() => {
    const speed = hovering.current ? 0.10 : 0.05;
    current.current.x += (target.current.x - current.current.x) * speed;
    current.current.y += (target.current.y - current.current.y) * speed;

    if (cardRef.current) {
      cardRef.current.style.transform =
        `rotateX(${current.current.x}deg) rotateY(${current.current.y}deg)`;
    }

    // Shine follows tilt
    if (shineRef.current) {
      const sx = 50 + (current.current.y / 14) * 28;
      const sy = 50 - (current.current.x / 14) * 28;
      shineRef.current.style.background =
        `radial-gradient(circle at ${sx}% ${sy}%, rgba(255,255,255,0.28) 0%, transparent 65%)`;
    }

    const dist = Math.hypot(
      current.current.x - target.current.x,
      current.current.y - target.current.y
    );
    if (dist > 0.04) rafRef.current = requestAnimationFrame(tick);
  }, []);

  // ── Mouse handlers ─────────────────────────────────────────────────
  const onMove = useCallback((e) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = ((e.clientX - rect.left)  / rect.width  - 0.5) * 2;
    const dy = ((e.clientY - rect.top)   / rect.height - 0.5) * 2;
    target.current = { x: -dy * 14, y: dx * 14 };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const onEnter = () => { hovering.current = true; };

  const onLeave = useCallback(() => {
    hovering.current = false;
    target.current   = { x: 0, y: -20 };
    cancelAnimationFrame(rafRef.current);
    rafRef.current   = requestAnimationFrame(tick);
  }, [tick]);

  return (
    // ── Scene: defines 3D perspective space ──────────────────────────
    <div
      ref={sceneRef}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ perspective: '1000px', width: `${width}px`, cursor: 'default' }}
    >
      {/* ── Card: rotates in 3D space ─────────────────────────────── */}
      <div
        ref={cardRef}
        style={{
          transformStyle : 'preserve-3d',
          willChange     : 'transform',
          background     : 'rgba(255,255,255,0.2)',
          backdropFilter : 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          border         : '1px solid rgba(255,255,255,0.1)',
          borderRadius   : '24px',
          padding        : '20px',
          position       : 'relative',
          overflow       : 'hidden',
          boxShadow      : `0 28px 64px -12px ${shadowColor || 'rgba(0,0,0,0.18)'}, inset 0 1px 0 rgba(255,255,255,0.55)`,
        }}
      >
        {/* ── Layer 1: Shine overlay (follows cursor) ─────────────── */}
        <div
          ref={shineRef}
          style={{
            position     : 'absolute',
            inset        : 0,
            borderRadius : '24px',
            pointerEvents: 'none',
            zIndex       : 5,
            background   : 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.22) 0%, transparent 65%)',
          }}
        />

        {/* ── Layer 2: Icon — highest Z (pops out most) ───────────── */}
        <div style={{ transform: 'translateZ(50px)', position: 'relative', zIndex: 6, marginBottom: '12px' }}>
          <div style={{
            width        : '44px',
            height       : '44px',
            borderRadius : '14px',
            background   : iconGradient,
            display      : 'flex',
            alignItems   : 'center',
            justifyContent: 'center',
            boxShadow    : `0 10px 28px -4px ${glowColor}`,
          }}>
            <Icon size={20} color="white" />
          </div>
        </div>

        {/* ── Layer 3: Title — medium Z ────────────────────────────── */}
        <div style={{ transform: 'translateZ(28px)', position: 'relative', zIndex: 6, marginBottom: '6px' }}>
          <p style={{ fontWeight: 900, fontSize: '13px', color: '#1e293b', lineHeight: 1.3, margin: 0 }}>
            {title}
          </p>
        </div>

        {/* ── Layer 4: Description — low Z ────────────────────────── */}
        <div style={{ transform: 'translateZ(12px)', position: 'relative', zIndex: 6, marginBottom: '14px' }}>
          <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, lineHeight: 1.55, margin: 0 }}>
            {description}
          </p>
        </div>

        {/* ── Layer 5: Arrow — medium-high Z ──────────────────────── */}
        <div style={{ transform: 'translateZ(38px)', position: 'relative', zIndex: 6 }}>
          <div style={{
            width       : '28px',
            height      : '28px',
            borderRadius: '50%',
            background  : 'rgba(255,255,255,0.65)',
            display     : 'flex',
            alignItems  : 'center',
            justifyContent: 'center',
          }}>
            <ChevronRight size={14} color="#64748b" />
          </div>
        </div>
      </div>
    </div>
  );
}
