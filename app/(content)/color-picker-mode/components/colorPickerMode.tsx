'use client'

import CustomColorPicker from './customColorPicker';
import { Popover } from '@mantine/core';
import { GoInfo } from 'react-icons/go';
import { forwardRef } from 'react';
import ThemeToggle from '@/components/buttons/themeToggle';
import WelcomeSection from '../../homepage/sections/welcomeSection';
import InfoTemplate from '../../homepage/sections/infoTemplate';
import AboutSection from '../../homepage/sections/miscSection';

const MyInfoIcon = forwardRef<HTMLDivElement>(
  (props, ref) => (
    <div ref={ref} {...props} className='cursor-pointer'>
      <GoInfo />
    </div>
  )
);

MyInfoIcon.displayName = 'MyInfoIcon';

export default function ColorPickerMode() {

  const sectionClass = `flex flex-col justify-center px-4 py-32 items-center w-full overflow-hidden`;
  const bgImage = `bg-[url(/images/istockphoto-recipebook.jpg)]`;
  const defaultColors = [
    { name: 'mainBack', defaultColor: "#f9f4ef" },
    { name: 'mainContent', defaultColor: "#fffffe" },
    { name: 'altContent', defaultColor: "#eaddcf" },
    { name: 'accent', defaultColor: "#f25042" },
    { name: 'highlight', defaultColor: "#8c7851" },
    { name: 'altBack', defaultColor: "#fffffe" },
    { name: 'mainText', defaultColor: "#8B4513" },
    { name: 'lightText', defaultColor: "#ffffff" },
    { name: 'darkText', defaultColor: "#000000" },
  ] as { name: string, defaultColor: string }[]

  return (
    <div className="flex flex-col justify-start items-center w-full">
      <div className='flex flex-col w-full md:w-4/5 md:ml-[20%]'>
        <section className={`flex flex-col justify-start items-center w-full overflow-hidden bg-mainBack h-content ${bgImage} bg-no-repeat bg-cover`}>
          <WelcomeSection />
        </section>
        <section className={`${sectionClass} bg-altBack/60`}>
          <InfoTemplate tab={'recipes'} />
        </section>
        <section className={`${sectionClass} bg-mainBack`}>
          <InfoTemplate tab={'family'} />
        </section>
        <section className={`${sectionClass} bg-altBack/60`}>
          <AboutSection id="about-section" />
        </section>
      </div>
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
    </div>
  );
}