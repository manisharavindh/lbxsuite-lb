import React, { useEffect, useRef } from 'react';

const InteractiveGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });

    const gridSize = 30; // Updated from 36px to 30px
    const gap = 0; // Removed gap to allow perfect cell-filling
    const opacity = 0.04; // Increased opacity to make the grid lines properly visible
    const parallaxFactor = 0.4;

    let width, height, columns, rows;
    let scrollY = window.scrollY;
    let rafId;

    // Track active/hovered cells for fading effect
    const activeCells = new Map();

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

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const pixelOffset = (scrollY * parallaxFactor) % gridSize;

      const c = Math.floor(mouseX / gridSize);
      const r = Math.floor((mouseY + pixelOffset) / gridSize);

      const now = performance.now();

      // Store current time for the hovered cell
      activeCells.set(`${c},${r}`, now);

      // Light up immediate neighbors to create a slight glow radius
      const neighbors = [[c - 1, r], [c + 1, r], [c, r - 1], [c, r + 1]];
      neighbors.forEach(([nc, nr]) => {
        const key = `${nc},${nr}`;
        if (!activeCells.has(key) || (now - activeCells.get(key) > 500)) {
          // Set neighbors to an older timestamp so they appear dimmer
          activeCells.set(key, now - 400);
        }
      });
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove);

    const draw = (time) => {
      if (!time) time = performance.now();

      // Skip expensive canvas operations if nothing changed
      if (activeCells.size === 0 && scrollY === draw.lastScrollY) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      draw.lastScrollY = scrollY;

      ctx.clearRect(0, 0, width, height);

      const pixelOffset = (scrollY * parallaxFactor) % gridSize;

      // Draw base grids (as crisp lines matching NotFoundPage style) FIRST
      ctx.strokeStyle = '#FFFFFF';
      ctx.globalAlpha = opacity;
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      // Vertical lines
      for (let c = -1; c <= columns; c++) {
        const x = c * gridSize;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      
      // Horizontal lines
      for (let r = -1; r <= rows; r++) {
        const y = r * gridSize - pixelOffset;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      
      ctx.stroke();

      // Draw active grids with #FF5655 and fade out effect AFTER (so they overlap as before)
      for (const [key, timestamp] of activeCells.entries()) {
        const age = time - timestamp;

        // Remove old cells (decay time: 800ms)
        if (age > 800) {
          activeCells.delete(key);
          continue;
        }

        const [cStr, rStr] = key.split(',');
        const c = parseInt(cStr);
        const r = parseInt(rStr);

        const cellX = c * gridSize;
        const cellY = r * gridSize - pixelOffset;
        const baseBoxSize = gridSize; // no structural gap needed for overlap effect

        const intensity = Math.max(0, 1 - (age / 800));

        // Scale from 1.0 to 1.08 based on intensity to keep the overlap constrained and subtle
        const scale = 1.0 + (intensity * 0.08);
        const currentBoxSize = baseBoxSize * scale;

        // Calculate center of original box to scale from center
        const centerX = cellX + baseBoxSize / 2;
        const centerY = cellY + baseBoxSize / 2;

        // 3D depth pop out amount
        const depth = intensity * 6; // Max 6px pop out depth

        // Shift up and left slightly to simulate popping towards the viewer
        const rectX = centerX - currentBoxSize / 2 - depth / 2;
        const rectY = centerY - currentBoxSize / 2 - depth / 2;

        ctx.globalAlpha = intensity * 0.9;

        // Draw Right Face (isometric 3D side)
        ctx.fillStyle = '#b33c3b'; // darker red
        ctx.beginPath();
        ctx.moveTo(rectX + currentBoxSize, rectY);
        ctx.lineTo(rectX + currentBoxSize + depth, rectY + depth);
        ctx.lineTo(rectX + currentBoxSize + depth, rectY + currentBoxSize + depth);
        ctx.lineTo(rectX + currentBoxSize, rectY + currentBoxSize);
        ctx.fill();

        // Draw Bottom Face (isometric 3D side)
        ctx.fillStyle = '#8c2f2e'; // even darker red
        ctx.beginPath();
        ctx.moveTo(rectX, rectY + currentBoxSize);
        ctx.lineTo(rectX + depth, rectY + currentBoxSize + depth);
        ctx.lineTo(rectX + currentBoxSize + depth, rectY + currentBoxSize + depth);
        ctx.lineTo(rectX + currentBoxSize, rectY + currentBoxSize);
        ctx.fill();

        // Draw Front Face (main color)
        ctx.fillStyle = '#FF5655';
        ctx.fillRect(rectX, rectY, Math.max(0, currentBoxSize), Math.max(0, currentBoxSize));
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
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
