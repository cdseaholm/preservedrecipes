'use client'

import { useState } from 'react';
import { ColorInput } from '@mantine/core';
import { hexToRgb } from '@/utils/userHelpers/colorUtils';

export default function CustomColorPicker({ colorName, onChange, defaultColor }: { colorName: string, onChange: (which: string, color: string, opacity: number) => void, defaultColor: string }) {
  const [color, setColor] = useState(defaultColor);
  const [opacity, setOpacity] = useState(1);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    const rgbColor = hexToRgb(newColor);
    onChange(colorName, rgbColor, opacity);
  };

  const handleOpacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = parseFloat(event.target.value);
    setOpacity(newOpacity);
    const rgbColor = hexToRgb(color);
    onChange(colorName, rgbColor, newOpacity);
  };

  return (
    <div className="flex flex-col items-center justify-evenly border-b border-black py-5">
      <ColorInput value={color} onChange={handleColorChange} label={`${colorName} color`} placeholder={color} format="hex" defaultValue={defaultColor} />
      <>
          <label htmlFor={colorName} className="mt-2 pt-2 border-t border-neutral-200 text-xs">{`${colorName} opacity`}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={handleOpacityChange}
            className="w-full"
          />
      </>
    </div>
  );
}