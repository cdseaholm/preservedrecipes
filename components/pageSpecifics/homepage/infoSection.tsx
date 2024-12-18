'use client'

import { IoMdAdd } from "react-icons/io";
import { GiFamilyTree } from "react-icons/gi";
import { RiCommunityLine } from "react-icons/ri";
import Link from "next/link";

const infoStyle = `bg-altContent
                rounded-lg 
                text-darkText 
                items-center
                w-full
                md:w-full
                p-3
                h-full
                shadow-xl
                shadow-highlight/90
                relative 
                overflow-hidden
                border
                border-accent
                hover:bg-opacity-70
                hover:scale-105
                transition-all 
                duration-300
                hover:bg-mainText/80
                hover:text-lightText
                text-lg
                md:text-xl
                flex flex-col items-center justify-center space-y-12
                `

export default function InfoSection() {
    return (
        <div className="flex flex-row items-center justify-center w-5/6 xl:w-11/12 xl:h-2/3 h-4/5 xl:px-12 xl:py-32 xl:m-5 m-2 p-5 bg-transparent relative overflow-hidden">
            <div className={`grid grid-cols-1 grid-rows-3 xl:grid-cols-3 xl:grid-rows-1 gap-5 w-full h-full`}>
                <button className={infoStyle}>
                    <div className="flex flex-row justify-center items-center">Create, Save, and Share recipes for yourself and others</div>
                    <div  className="flex flex-row justify-center items-center"><IoMdAdd size={40}/></div>
                </button>
                <button className={infoStyle}>
                    <div>Create or join a Family Tree to preserve secret family recipes</div>
                    <div  className="flex flex-row justify-center items-center"><GiFamilyTree size={40}/></div>
                </button>
                <Link className={infoStyle} href={'/community'}>
                    <div>Create, post, or save recipes in Public or Private Communities</div>
                    <div  className="flex flex-row justify-center items-center"><RiCommunityLine size={40}/></div>
                </Link>
            </div>
        </div>
    )
}