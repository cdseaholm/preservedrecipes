'use client'

import { useState } from 'react';
import { ColorInput } from '@mantine/core';
import HexToRgb from '@/utils/userHelpers/colorUtils';

export default function CustomColorPicker({ colorName, onChange, defaultColor }: { colorName: string, onChange: (which: string, color: string) => void, defaultColor: string }) {
  const [color, setColor] = useState<string>(defaultColor);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    const rgbColor = HexToRgb({hex: newColor});
    onChange(colorName, rgbColor);
  };

  return (
    <div className="flex flex-col items-center justify-evenly border-b border-black py-5">
      <ColorInput value={color} onChange={handleColorChange} label={`${colorName} color`} placeholder={color} format={`hex`} defaultValue={defaultColor} />
    </div>
  );
}