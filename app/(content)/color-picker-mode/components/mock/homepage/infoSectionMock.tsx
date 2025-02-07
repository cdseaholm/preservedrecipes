'use client'

import { IoMdAdd } from "react-icons/io";
import { GiFamilyTree } from "react-icons/gi";
import { RiCommunityLine } from "react-icons/ri";
import { toast } from "sonner";
import { useStateStore } from "@/context/stateStore";

export default function InfoSectionMock() {

    const infoStyle = `bg-altContent rounded-lg text-darkText items-center w-full p-3 shadow-xl shadow-highlight/90 relative overflow-hidden border border-accent hover:bg-opacity-70 hover:scale-105 transition-all duration-300 hover:bg-mainText/80 hover:text-lightText text-sm md:text-lg lg:text-xl flex flex-col items-center justify-center space-y-12 xl:h-full`

    const centeredRowDiv = `flex flex-row justify-center items-center h-1/3 xl:h-1/2 w-full`;

    const height = useStateStore(state => state.heightQuery);
    const maxGridHeight = height < 700 ? 'h-full xl:h-3/4' : 'h-3/4 xl:h-1/2';

    return (
        <div className={`grid grid-cols-1 grid-rows-3 xl:grid-cols-3 xl:grid-rows-1 gap-5 m-2 p-12 w-11/12 lg:w-3/4 xl:w-11/12 bg-transparent relative overflow-hidden ${maxGridHeight}`} style={{ minHeight: '300' }}>
            <button className={infoStyle} onClick={() => toast.info('You would create, save, or share a recipe for yourself now')} aria-label="Recipe Promo">
                <div className={centeredRowDiv}>Create, Save, and Share recipes for yourself and others</div>
                <div className={centeredRowDiv}><IoMdAdd size={40} /></div>
            </button>
            <button className={infoStyle} onClick={() => toast.info('You would create or join a Family Tree now')} aria-label="Family Promo">
                <div className={centeredRowDiv}>Create or join a Family Tree to preserve secret family recipes</div>
                <div className={centeredRowDiv}><GiFamilyTree size={40} /></div>
            </button>
            <button className={infoStyle} onClick={() => toast.info('You would create, post, or save a recipe now')} aria-label="Communities Promo">
                <div className={centeredRowDiv}>Create, post, or save recipes in Public or Private Communities</div>
                <div className={centeredRowDiv}><RiCommunityLine size={40} /></div>
            </button>
        </div>
    )
}