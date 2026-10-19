import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailerPos, setTrailerPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch / mobile devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let animId;

    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      const isInteractive = target.closest('a, button, input, textarea, [role="button"], .interactive-hover');
      setIsHovering(!!isInteractive);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const loop = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setTrailerPos({ x: currentX, y: currentY });
      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Precision Core Dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-cyan-400 pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${isHovering ? 0 : 1})`,
        }}
      />
      {/* Outer Floating Glow Ring */}
      <div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 border transition-all duration-300 ease-out ${
          isHovering
            ? 'w-12 h-12 bg-indigo-500/20 border-cyan-400 shadow-glow-cyan scale-110 backdrop-blur-sm'
            : 'w-8 h-8 border-indigo-400/50 bg-indigo-500/5'
        }`}
        style={{
          transform: `translate3d(${trailerPos.x - (isHovering ? 24 : 16)}px, ${trailerPos.y - (isHovering ? 24 : 16)}px, 0)`,
        }}
      />
    </>
  );
}
