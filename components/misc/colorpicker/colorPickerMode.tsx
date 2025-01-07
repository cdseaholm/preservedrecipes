'use client'

import CustomColorPicker from './customColorPicker';
import MainFooter from '@/components/nav/footer';
import MainHeaderMock from './mock/headerMock';
import InfoSectionMock from './mock/homepage/infoSectionMock';
import MiscSectionMock from './mock/homepage/miscSectionMock';
import WelcomeSectionMock from './mock/homepage/welcomeSectionMock';
import { Popover } from '@mantine/core';
import { GoInfo } from 'react-icons/go';
import { forwardRef } from 'react';
import ThemeToggle from '@/components/buttons/themeToggle';

const MyInfoIcon = forwardRef<HTMLDivElement>(
  (props, ref) => (
    <div ref={ref} {...props} className='cursor-pointer'>
      <GoInfo />
    </div>
  )
);

MyInfoIcon.displayName = 'MyInfoIcon';

export default function ColorPickerMode() {

  const handleColorChange = (which: string, color: string) => {
    document.documentElement.style.setProperty(`--${which}-rgb`, color);
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className='flex flex-col w-full md:w-4/5 h-full md:ml-[20%]'>
        <MainHeaderMock />
        <main className="flex flex-col justify-start items-center w-screen h-vh scrollbar-thin scrollbar-webkit top-[75px]" style={{ overflowX: 'hidden', overflowY: 'auto' }}>
          <section className='flex flex-col justify-center items-center w-full h-full bg-mainBack '>
            <WelcomeSectionMock />
          </section>
          <section className='flex flex-col justify-center items-center w-full h-full bg-altBack'>
            <InfoSectionMock />
          </section>
          <section className='flex flex-col justify-center items-center w-full h-full bg-mainBack'>
            <MiscSectionMock id='about-section' />
          </section>
          <MainFooter />
        </main>
      </div>
      <aside className='flex w-full h-1/3 flex-col md:w-1/5 md:h-full p-4 fixed md:left-0 bottom-0 md:top-0 z-40 bg-white overflow-auto border-t border-black'>
        <div className='flex flex-row justify-between items-center px-2'>
          <Popover width={200} position='bottom-start' withArrow shadow="md">
            <Popover.Target>
              <MyInfoIcon />
            </Popover.Target>
            <Popover.Dropdown styles={{ dropdown: { backgroundColor: 'GrayText', color: 'white' } }}>
              {`Refresh screen to reset. Or click color picker to see your chosen color with predefined opacity's and background images`}
            </Popover.Dropdown>
          </Popover>
          <ThemeToggle />
        </div>
        <CustomColorPicker colorName="mainBack" onChange={handleColorChange} defaultColor="#f9f4ef" />
        <CustomColorPicker colorName="mainContent" onChange={handleColorChange} defaultColor="#fffffe" />
        <CustomColorPicker colorName="altContent" onChange={handleColorChange} defaultColor="#eaddcf" />
        <CustomColorPicker colorName="accent" onChange={handleColorChange} defaultColor="#f25042" />
        <CustomColorPicker colorName="highlight" onChange={handleColorChange} defaultColor="#8c7851" />
        <CustomColorPicker colorName="altBack" onChange={handleColorChange} defaultColor="#fffffe" />
        <CustomColorPicker colorName="mainText" onChange={handleColorChange} defaultColor="#8B4513" />
        <CustomColorPicker colorName="lightText" onChange={handleColorChange} defaultColor="#ffffff" />
        <CustomColorPicker colorName="darkText" onChange={handleColorChange} defaultColor="#000000" />
      </aside>
    </div>
  );
}