'use client'

import WelcomeSection from '@/components/pageSpecifics/homepage/welcomeSection';
import InfoSection from '@/components/pageSpecifics/homepage/infoSection';
import MiscSection from '@/components/pageSpecifics/homepage/miscSection';
import CustomColorPicker from './customColorPicker';
import MainFooter from '@/components/nav/footer';
import MainHeader from '@/components/nav/header';
import MainTemplate from '@/components/templates/mainTemplate';

export default function ColorPickerMode() {
  const handleColorChange = (which: string, color: string, opacity: number) => {
    document.documentElement.style.setProperty(`--${which}-rgb`, color);
    document.documentElement.style.setProperty(`--${which}-opacity`, opacity.toString());
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className='flex flex-col w-full md:w-4/5 h-full md:ml-[20%]'>
        <MainHeader />
        <MainTemplate>
          <section className='flex flex-col justify-center items-center w-full h-full bg-mainBack'>
            <WelcomeSection user={null} />
          </section>
          <section className='flex flex-col justify-center items-center w-full h-full bg-mainText/70'>
            <InfoSection />
          </section>
          <section className='flex flex-col justify-center items-center w-full h-full bg-mainBack'>
            <MiscSection id='about-section' />
          </section>
          <MainFooter />
        </MainTemplate>
      </div>
      <aside className='flex w-full h-1/3 flex-col md:w-1/5 md:h-full p-4 fixed md:left-0 bottom-0 md:top-0 z-40 bg-white overflow-auto border-t border-black'>
        <div className='flex flex-row w-full h-full items-center justify-center'>
          To reset, refresh page
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
    </div >
  );
}