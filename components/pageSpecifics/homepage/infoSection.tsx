'use client'

import { IoMdAdd } from "react-icons/io";
import { GiFamilyTree } from "react-icons/gi";
import { RiCommunityLine } from "react-icons/ri";
import Link from "next/link";
import { useStateStore } from "@/context/stateStore";

export default function InfoSection() {

    const infoStyle = `bg-altContent rounded-lg text-darkText items-center w-full m-2 p-12 shadow-xl shadow-highlight/90 relative overflow-hidden border border-accent hover:bg-opacity-70 hover:scale-105 transition-all duration-300 hover:bg-mainText/80 hover:text-lightText text-sm md:text-lg lg:text-xl flex flex-col items-center justify-center space-y-12 xl:h-full`

    const centeredRowDiv = `flex flex-row justify-center items-center h-1/3 xl:h-1/2 w-full`;

    const height = useStateStore(state => state.heightQuery);
    const maxGridHeight = height < 700 ? 'h-full xl:h-3/4' : 'h-3/4 xl:h-1/2';
    const width = useStateStore(state => state.widthQuery);
    const iconSize = width < 768 ? 25 : 40

    return (
        <div className={`grid grid-cols-1 grid-rows-3 xl:grid-cols-3 xl:grid-rows-1 gap-5 m-2 p-12 w-11/12 lg:w-3/4 xl:w-11/12 bg-transparent relative overflow-hidden ${maxGridHeight}`} style={{ minHeight: '300' }}>
            <button className={infoStyle}>
                <div className={centeredRowDiv}>
                    Create, Save, and Share recipes for yourself and others
                </div>
                <div className={centeredRowDiv}>
                    <IoMdAdd size={iconSize} />
                </div>
            </button>
            <button className={infoStyle}>
                <div className={centeredRowDiv}>
                    Create or join a Family Tree to preserve secret family recipes
                </div>
                <div className={centeredRowDiv}>
                    <GiFamilyTree size={iconSize} />
                </div>
            </button>
            <Link className={`${infoStyle} text-center`} href={'/community?page=1&size=10'}>
                <div className={centeredRowDiv}>
                    Create, post, or save recipes in Public or Private Communities
                </div>
                <div className={centeredRowDiv}>
                    <RiCommunityLine size={iconSize} />
                </div>
            </Link>
        </div>
    )
}