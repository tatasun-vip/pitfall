import * as React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { WorldId } from './data';

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  name?: WorldId | 'mark' | 'compass' | 'proof' | 'voice' | 'mask' | 'alt' | 'room';
};

const common = (size: number, color: string, strokeWidth: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 32 32',
  fill: 'none' as const
});

const pathProps = (color: string, strokeWidth: number) => ({
  stroke: color,
  strokeWidth,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
});

export function SymbolIcon({ name = 'mark', size = 24, color = '#20171d', strokeWidth = 2.2 }: IconProps) {
  const p = pathProps(color, strokeWidth);
  if (name === 'mark') return <Svg {...common(size, color, strokeWidth)}><Path {...p} d="M16 3l10 5v8c0 6.5-4.2 10.6-10 13-5.8-2.4-10-6.5-10-13V8l10-5z"/><Path {...p} d="M16 9v8"/><Path {...p} d="M16 22h.01"/></Svg>;
  if (name === 'compass') return <Svg {...common(size, color, strokeWidth)}><Circle {...p} cx="16" cy="16" r="11"/><Path {...p} d="M20.5 11.5l-2.4 6.6-6.6 2.4 2.4-6.6 6.6-2.4z"/></Svg>;
  if (name === 'proof') return <Svg {...common(size, color, strokeWidth)}><Path {...p} d="M9 5h10l4 4v18H9z"/><Path {...p} d="M19 5v5h5"/><Path {...p} d="M12 17h8M12 22h5"/></Svg>;
  if (name === 'voice') return <Svg {...common(size, color, strokeWidth)}><Path {...p} d="M16 5a4 4 0 0 0-4 4v7a4 4 0 0 0 8 0V9a4 4 0 0 0-4-4z"/><Path {...p} d="M7 15a9 9 0 0 0 18 0"/><Path {...p} d="M16 24v4"/></Svg>;
  if (name === 'mask') return <Svg {...common(size, color, strokeWidth)}><Path {...p} d="M6 12c3-4 17-4 20 0v6c0 5-4 9-10 9S6 23 6 18z"/><Path {...p} d="M11 17h5M21 17h-5"/><Path {...p} d="M12 22c2 1 6 1 8 0"/></Svg>;
  if (name === 'alt') return <Svg {...common(size, color, strokeWidth)}><Path {...p} d="M7 20c6-10 12-10 18 0"/><Path {...p} d="M9 20h14"/><Path {...p} d="M12 24h8"/><Path {...p} d="M16 8v7"/><Path {...p} d="M12 12l4-4 4 4"/></Svg>;
  if (name === 'room') return <Svg {...common(size, color, strokeWidth)}><Path {...p} d="M6 8h20v13H13l-6 5v-5H6z"/><Path {...p} d="M11 13h10M11 17h6"/></Svg>;
  if (name === 'campus') return <Svg {...common(size, color, strokeWidth)}><Path {...p} d="M5 12l11-6 11 6-11 6z"/><Path {...p} d="M9 15v6c4 3 10 3 14 0v-6"/></Svg>;
  if (name === 'travel') return <Svg {...common(size, color, strokeWidth)}><Path {...p} d="M7 24l18-16"/><Path {...p} d="M20 7l5 1-1 5"/><Path {...p} d="M9 10l5 5M17 18l5 5"/></Svg>;
  if (name === 'work') return <Svg {...common(size, color, strokeWidth)}><Rect {...p} x="7" y="10" width="18" height="14" rx="3"/><Path {...p} d="M12 10V8h8v2M7 16h18"/></Svg>;
  if (name === 'home') return <Svg {...common(size, color, strokeWidth)}><Path {...p} d="M6 15l10-8 10 8"/><Path {...p} d="M9 14v12h14V14"/><Path {...p} d="M13 26v-7h6v7"/></Svg>;
  if (name === 'shop') return <Svg {...common(size, color, strokeWidth)}><Path {...p} d="M9 12h14l-1 14H10z"/><Path {...p} d="M12 12a4 4 0 0 1 8 0"/><Path {...p} d="M10 17h12"/></Svg>;
  return <Svg {...common(size, color, strokeWidth)}><Path {...p} d="M16 5c4 5 8 8 8 13a8 8 0 0 1-16 0c0-5 4-8 8-13z"/><Path {...p} d="M12 19c2 2 6 2 8 0"/></Svg>;
}

export function BrandMark({ size = 38 }: { size?: number }) {
  return <SymbolIcon name="mark" size={size} color="#fff" strokeWidth={2.45} />;
}
