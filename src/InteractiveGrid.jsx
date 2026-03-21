import React, { useEffect, useRef } from 'react';

const InteractiveGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });

    const gridSize = 25;
    const gap = 1;
    const opacity = 0.03; // Very subtle grid overlay to match dark modern theme
    const parallaxFactor = 0.4;

    let width, height, columns, rows;
    let scrollY = window.scrollY;
    let rafId;

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      columns = Math.ceil(width / gridSize) + 2;
      rows = Math.ceil(height / gridSize) + 2;
    };

    init();

    let resizeTimeout;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(init, 150);
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = opacity;

      const pixelOffset = (scrollY * parallaxFactor) % gridSize;

      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < columns; c++) {
          const cellX = c * gridSize;
          const cellY = r * gridSize - pixelOffset;
          const boxSize = gridSize - gap * 2;
          ctx.fillRect(cellX + gap, cellY + gap, boxSize, boxSize);
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default InteractiveGrid;
