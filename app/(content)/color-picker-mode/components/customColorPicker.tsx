'use client'

import { useState } from 'react';

export default function CustomColorPicker({ colorName, defaultColor }: { colorName: string, defaultColor: string }) {
  const [color, setColor] = useState<string>(defaultColor);

  const handleChange = (event: any) => {
    const newColor = event.target.value;
    setColor(newColor);
    document.documentElement.style.setProperty(`--${colorName}`, newColor);
  };

  return (
    <div className="flex flex-col items-center justify-evenly border-b border-accent py-5">
      <label htmlFor="colorInput" className="block mb-2 text-mainText">{`Change Test Color: ${colorName}`}</label>
      <input
        type="color"
        id="colorInput"
        value={color}
        onChange={handleChange}
        className="border border-mainText p-2"
        aria-label='Color Change'
      />
    </div>
  );
}