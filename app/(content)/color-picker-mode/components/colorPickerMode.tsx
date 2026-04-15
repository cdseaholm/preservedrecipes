'use client'

import CustomColorPicker from './customColorPicker';
import { Popover } from '@mantine/core';
import { GoInfo } from 'react-icons/go';
import { forwardRef } from 'react';
import ThemeToggle from '@/components/buttons/themeToggle';
import ContentWrapper from '@/components/wrappers/contentWrapper';
import Homepage from '../../homepage/components/mainHome';

const MyInfoIcon = forwardRef<HTMLDivElement>(
  (props, ref) => (
    <div ref={ref} {...props} className='cursor-pointer'>
      <GoInfo />
    </div>
  )
);

MyInfoIcon.displayName = 'MyInfoIcon';

export default function ColorPickerMode() {

  // const sectionClass = `flex flex-col justify-center px-4 py-32 items-center w-full overflow-hidden`;
  // const bgImage = `bg-[url(/images/istockphoto-recipebook.jpg)]`;
  const defaultColors = [
    { name: 'mainBack', defaultColor: "#f9f4ef" },
    { name: 'cardBack', defaultColor: "#fffffe" },
    { name: 'accent', defaultColor: "#f25042" },
    { name: 'highlight', defaultColor: "#8c7851" },
    { name: 'altBack', defaultColor: "#fffffe" },
    { name: 'mainText', defaultColor: "#8B4513" },
    { name: 'lightText', defaultColor: "#ffffff" },
  ] as { name: string, defaultColor: string }[]

  return (
    <ContentWrapper containedChild={false} paddingNeeded={true}>
      <Homepage />
      <aside className='flex w-full h-1/3 flex-col md:w-1/5 md:h-full p-4 fixed md:left-0 bottom-0 md:top-0 z-40 bg-mainBack overflow-auto border-t border-black text-mainText'>
        <div className='flex flex-row justify-between items-center px-2'>
          <Popover width={200} position='bottom-start' withArrow shadow-sm="md">
            <Popover.Target>
              <MyInfoIcon />
            </Popover.Target>
            <Popover.Dropdown styles={{ dropdown: { backgroundColor: 'GrayText', color: 'white' } }}>
              {`Refresh screen to reset. Or click color picker to see your chosen color with predefined opacity's and background images`}
            </Popover.Dropdown>
          </Popover>
          <ThemeToggle />
        </div>
        {defaultColors.map((color, index) => <CustomColorPicker colorName={color.name} defaultColor={color.defaultColor} key={index} />)}
      </aside>
    </ContentWrapper>
  );
}