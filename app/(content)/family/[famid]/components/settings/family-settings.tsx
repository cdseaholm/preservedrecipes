'use client'

import ActionButton from "@/components/buttons/basicActionButton"
import FamilySettingsHooks from "@/app/(content)/family/[famid]/hooks/family-settings-hooks"
import { useNavigation } from "@/components/hooks/menu/use-navigation-hook"
import { useFamilyStore } from "@/context/familyStore"
import { useUserStore } from "@/context/userStore"
import { IFamily } from "@/models/types/family/family"
import { IUser } from "@/models/types/personal/user"
import { FaRegTrashAlt, FaSignOutAlt } from "react-icons/fa"
import { LeaveFamily } from "@/utils/server-actions/family/members"
import { toast } from "sonner"


export default function FamilySettings({ userFamAdminPrivs, family, userInfo }: { userFamAdminPrivs: boolean, family: IFamily, userInfo: IUser }) {

    const { navigate } = useNavigation();
    const { handleConfirmFam, submitChange, handleChangeStatuses, editFamMemStatusForm, changeFamNameForm } = FamilySettingsHooks();
    const numOfAdmins = family.familyMembers.filter(member => member.permissionStatus === 'Admin').length;
    const leavingWouldRemoveOnlyAdmin = userFamAdminPrivs && numOfAdmins <= 1;
    const setFamily = useFamilyStore(s => s.setFamily);
    const setUserInfo = useUserStore(s => s.setUserInfo);

    const handleLeaveFamily = async () => {
        if (leavingWouldRemoveOnlyAdmin) {
            toast.error("Assign another admin before leaving this family.");
            return;
        }
        const confirmLeave = confirm("Are you sure you want to leave the family?");
        if (confirmLeave) {
            const leaving = await LeaveFamily(family._id, '/');
            if (!leaving) {
                toast.error("Error leaving family. Please try again later.");
                return;
            }
            if (leaving.success) {
                setFamily({} as IFamily);
                const newUserInfo = { ...userInfo, userFamilyID: '' };
                setUserInfo(newUserInfo);
                toast.success("You have left the family.");
                navigate("/");
            } else {
                toast.error("Error leaving family: " + leaving.message);
            }
        }
    }

    const buttonItems =
        <div className="flex flex-col justify-start items-center space-y-12 pt-12 w-full flex-1 min-h-[40dvh]">
            <h1 className="text-xl md:text-2xl underline">Account Settings</h1>

            {userFamAdminPrivs && <ActionButton buttonTitle="Change Family name" action={() => submitChange({ changeFamNameForm: changeFamNameForm, userFamAdminPrivs: userFamAdminPrivs, family: family })} width="w-4/5 sm:w-3/5 md:w-1/2" />}

            {userFamAdminPrivs && <ActionButton buttonTitle="Add/Remove Admins" action={() => handleChangeStatuses({ editFamMemStatusForm: editFamMemStatusForm, family: family })} width="w-4/5 sm:w-3/5 md:w-1/2" />}

            {userFamAdminPrivs && <ActionButton buttonTitle="Edit Members" action={() => {
                navigate(`/family/${family._id}/members`);
            }} width="w-4/5 sm:w-3/5 md:w-1/2" />}

            <button type="button" className={`flex flex-row justify-center items-center border border-neutral-200 rounded-md hover:bg-yellow-200 bg-yellow-400 p-2 w-1/2 text-xs sm:text-sm cursor-pointer`} onClick={handleLeaveFamily} aria-label={'Leave family'}>
                <FaSignOutAlt className="inline mr-2" />
                <p>Leave Family</p>
            </button>

            {userFamAdminPrivs && <button type="button" className={`flex flex-row justify-center items-center border border-neutral-200 rounded-md hover:bg-red-200 bg-red-400 p-2 w-1/2 text-xs sm:text-sm cursor-pointer`} onClick={() => handleConfirmFam(userFamAdminPrivs, family)} aria-label={'Delete family'}>
                <FaRegTrashAlt className="inline mr-2" />
                <p>Delete Family</p>
            </button>}
        </div>

    return (
        buttonItems
    )
}
