'use client'

import { useModalStore } from "@/context/modalStore";
import { IPost } from "@/models/types/misc/post";
import { BiPlus } from "react-icons/bi";
import { toast } from "sonner";
import { MdOutlineFeed } from "react-icons/md";
import { PiUsers } from "react-icons/pi";
import { GrUserSettings } from "react-icons/gr";
import { LuSettings2 } from "react-icons/lu";
import { useWindowSizes } from "@/context/width-height-store";

export default function SpecCommunitiesSubMenu({ userIsMember, publicCommunity, userIsAdmin, handleTab, closeDrawer }: { userIsMember: boolean, publicCommunity: boolean, userIsAdmin: boolean, handleTab: (tab: 'posts' | 'members' | 'community-settings' | 'user-settings') => void, closeDrawer: () => void }) {

    const { width } = useWindowSizes();
    const buttonClass = `flex flex-row justify-between items-center px-6 hover:bg-accent/20 rounded-md space-x-2 w-full cursor-pointer py-4 mb-2 truncate`;
    const textClass = `text-base md:text-lg lg:text-xl font-medium truncate`;
    const setOpenPostModal = useModalStore(state => state.setOpenPostModal);

    const attemptToJoin = () => {
        if (publicCommunity) {
            toast.success('You have joined the community!');
            closeDrawer();
        } else {
            toast.info('Request to join sent to admins!');
            closeDrawer();
        }
    }

    const toRender = !userIsMember && !userIsAdmin ? (
        <button onClick={attemptToJoin} type="button" className={buttonClass}><p className={textClass}>{publicCommunity ? 'Join Community' : 'Request to Join'}</p></button>
    ) : (
        <>
            {/**Could maybe make a "Feed" that shows all community/family/your own creations/posts? */}
            <button onClick={() => { setOpenPostModal({} as IPost); closeDrawer(); }} type="button" className={buttonClass}><p className={textClass}>Create Post</p>{width > 380 ? <BiPlus size={20} /> : null}</button>
            <button onClick={() => { handleTab('posts'); closeDrawer(); }} type="button" className={buttonClass}><p className={textClass}>Posts</p>{width > 380 ? <MdOutlineFeed size={20} /> : null}</button>
            {/**Instead of having seperate views for admins/members, combing this into one and then having the admins be able to manage there. And put Join requests here*/}
            <button onClick={() => { handleTab('members'); closeDrawer(); }} type="button" className={buttonClass}><p className={textClass}>Community Members</p>{width > 380 ? <PiUsers size={20} /> : null}</button>
            {/**I think the "view admins" should just be a "ViewMembers page" will filters? */}
            {userIsAdmin && (
                <button onClick={() => { handleTab('community-settings'); closeDrawer(); }} type="button" className={buttonClass}><p className={textClass}>Community Settings</p>{width > 380 ? <LuSettings2 size={20} /> : null}</button>
            )}
            <button onClick={() => { handleTab('user-settings'); closeDrawer(); }} type="button" className={buttonClass}><p className={textClass}>User Settings</p>{width > 380 ? <GrUserSettings size={20} /> : null}</button>
        </>
    )

    return toRender;

}