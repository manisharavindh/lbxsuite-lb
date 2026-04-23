import React, { useEffect, useRef } from 'react';

const InteractiveGrid = ({ easterEgg = false }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });

    const gridSize = 30;
    const opacity = 0.04;
    const parallaxFactor = 0.4;
    const DECAY_MS = 800;

    let width, height, columns, rows;
    let scrollY = window.scrollY;
    let rafId;

    // Track active/hovered cells for fading effect
    const activeCells = new Map();

    // Previous grid cell for interpolation
    let prevCol = null;
    let prevRow = null;
    let lastMoveTime = 0;

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

    // Bresenham line algorithm to get all grid cells between two points
    const getLineCells = (c0, r0, c1, r1) => {
      const cells = [];
      let dc = Math.abs(c1 - c0);
      let dr = Math.abs(r1 - r0);
      const sc = c0 < c1 ? 1 : -1;
      const sr = r0 < r1 ? 1 : -1;
      let err = dc - dr;
      let c = c0;
      let r = r0;

      while (true) {
        cells.push([c, r]);
        if (c === c1 && r === r1) break;
        const e2 = 2 * err;
        if (e2 > -dr) { err -= dr; c += sc; }
        if (e2 < dc) { err += dc; r += sr; }
      }
      return cells;
    };

    // Activate a cell and its 4 cardinal neighbors
    const activateCell = (c, r, now) => {
      activeCells.set(`${c},${r}`, now);

      // Light up immediate neighbors to create a slight glow radius
      const neighbors = [[c - 1, r], [c + 1, r], [c, r - 1], [c, r + 1]];
      for (let i = 0; i < neighbors.length; i++) {
        const nc = neighbors[i][0];
        const nr = neighbors[i][1];
        const key = `${nc},${nr}`;
        if (!activeCells.has(key) || (now - activeCells.get(key) > 500)) {
          // Set neighbors to an older timestamp so they appear dimmer
          activeCells.set(key, now - 400);
        }
      }
    };

    const onPointerMove = (e) => {
      // Disable hover effect on mobile screens and touch inputs
      if (window.innerWidth < 768 || e.pointerType === 'touch') return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const pixelOffset = (scrollY * parallaxFactor) % gridSize;

      const c = Math.floor(mouseX / gridSize);
      const r = Math.floor((mouseY + pixelOffset) / gridSize);

      const now = performance.now();

      // If significant time has passed since the last mouse move event (> 100ms), 
      // assume the mouse left the window or rested, and prevent interpolation jumping.
      if (now - lastMoveTime > 100) {
        prevCol = null;
        prevRow = null;
      }
      lastMoveTime = now;

      if (prevCol !== null && prevRow !== null && (prevCol !== c || prevRow !== r)) {
        // Interpolate all cells along the path from previous to current
        const pathCells = getLineCells(prevCol, prevRow, c, r);
        const totalCells = pathCells.length;
        for (let i = 0; i < totalCells; i++) {
          // Stagger timestamps slightly along the trail for a natural flow
          const trailTime = now - ((totalCells - 1 - i) * 12);
          activateCell(pathCells[i][0], pathCells[i][1], trailTime);
        }
      } else {
        activateCell(c, r, now);
      }

      prevCol = c;
      prevRow = r;
    };

    const onPointerLeave = () => {
      prevCol = null;
      prevRow = null;
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove);
    document.addEventListener('mouseleave', onPointerLeave);

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

        // Remove old cells
        if (age > DECAY_MS) {
          activeCells.delete(key);
          continue;
        }

        const [cStr, rStr] = key.split(',');
        const c = parseInt(cStr);
        const r = parseInt(rStr);

        const cellX = c * gridSize;
        const cellY = r * gridSize - pixelOffset;
        const baseBoxSize = gridSize;

        const intensity = Math.max(0, 1 - (age / DECAY_MS));

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

        // Default colors
        let frontFace = '#FF5655';
        let rightFace = '#b33c3b';
        let bottomFace = '#8c2f2e';

        // Apply easter egg full spectrum rotating hues
        if (easterEgg) {
          // Uses coordinates and time to continuously cycle through the full 360 degree color wheel
          // Creates a stunning, completely multi-colored rainbow effect
          const hue = Math.floor((c * 5 + r * 5 + time * 0.06)) % 360;

          // Adjusted saturation and lightness to match the "soft" pastel-like intensity of the original #FF5655 accent
          frontFace = `hsl(${hue}, 90%, 68%)`;
          rightFace = `hsl(${hue}, 55%, 48%)`;
          bottomFace = `hsl(${hue}, 50%, 38%)`;
        }

        // Draw Right Face (isometric 3D side)
        ctx.fillStyle = rightFace;
        ctx.beginPath();
        ctx.moveTo(rectX + currentBoxSize, rectY);
        ctx.lineTo(rectX + currentBoxSize + depth, rectY + depth);
        ctx.lineTo(rectX + currentBoxSize + depth, rectY + currentBoxSize + depth);
        ctx.lineTo(rectX + currentBoxSize, rectY + currentBoxSize);
        ctx.fill();

        // Draw Bottom Face (isometric 3D side)
        ctx.fillStyle = bottomFace;
        ctx.beginPath();
        ctx.moveTo(rectX, rectY + currentBoxSize);
        ctx.lineTo(rectX + depth, rectY + currentBoxSize + depth);
        ctx.lineTo(rectX + currentBoxSize + depth, rectY + currentBoxSize + depth);
        ctx.lineTo(rectX + currentBoxSize, rectY + currentBoxSize);
        ctx.fill();

        // Draw Front Face (main color)
        ctx.fillStyle = frontFace;
        ctx.fillRect(rectX, rectY, Math.max(0, currentBoxSize), Math.max(0, currentBoxSize));
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(rafId);
    };
  }, [easterEgg]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default InteractiveGrid;
