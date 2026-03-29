import React from 'react';
import { Link } from 'react-router-dom';

/**
 * AnimatedButton — Perfect vertical ticker hover.
 * 
 * Uses CSS grid with both rows in the same cell. The container height
 * equals exactly one row. A wrapper translates both rows upward on hover.
 */
const AnimatedButton = ({
  href,
  to,
  children,
  className = '',
  variant = 'primary',
  onClick,
  size = 'md',
}) => {
  const Tag = to ? Link : (href ? 'a' : 'button');

  const sizeMap = {
    sm: { padding: 'px-5 py-2.5', text: 'text-sm', gap: 'gap-2' },
    md: { padding: 'px-6 py-3', text: 'text-sm', gap: 'gap-2' },
    lg: { padding: 'px-8 py-4', text: 'text-lg', gap: 'gap-3' },
  };

  const variantStyles = {
    primary: {
      base: 'bg-[#FF5555] text-white',
      overlayBg: '#FFFFFF',
      overlayText: '#141414',
    },
    outline: {
      base: 'bg-transparent text-white border border-white/20',
      overlayBg: '#FF5555',
      overlayText: '#FFFFFF',
    },
    nav: {
      base: 'bg-[#FF5555] text-white',
      overlayBg: '#FFFFFF',
      overlayText: '#141414',
    },
  };

  const styles = variantStyles[variant] || variantStyles.primary;
  const s = sizeMap[size] || sizeMap.md;

  return (
    <Tag
      to={to}
      href={!to && href ? href : undefined}
      onClick={onClick}
      className={`anim-btn relative rounded font-sans font-bold cursor-pointer ${s.text} ${styles.base} ${className}`}
      style={{ display: 'inline-block', overflow: 'hidden' }}
    >
      {/* 
        Sizing ghost — invisible, in flow, determines button height.
        This span sets the button's natural dimensions via padding.
      */}
      <span
        className={`invisible block ${s.padding} ${s.gap}`}
        style={{ display: 'flex', alignItems: 'center', gap: 'inherit' }}
        aria-hidden="true"
      >
        {children}
      </span>

      {/* 
        Sliding wrapper — absolutely positioned over the ghost.
        Contains both visible rows. Translates -50% on hover.
      */}
      <span className="anim-btn-slider" style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
        {/* Row 1: default state */}
        <span
          className={`flex items-center justify-center ${s.padding} ${s.gap}`}
          style={{ whiteSpace: 'nowrap' }}
        >
          {children}
        </span>
        {/* Row 2: hover state */}
        <span
          className={`flex items-center justify-center ${s.padding} ${s.gap}`}
          style={{
            whiteSpace: 'nowrap',
            backgroundColor: styles.overlayBg,
            color: styles.overlayText,
          }}
        >
          {children}
        </span>
      </span>
    </Tag>
  );
};

export default AnimatedButton;
