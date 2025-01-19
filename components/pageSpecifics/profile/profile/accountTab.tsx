import { toast } from "sonner";

const ProfileButton = ({ which }: { which: string }) => {

    return (
        <button onClick={() => toast.info(which)}>
            {which}
        </button>
    )
}

export default function AccountTab({ familyPermissions }: { familyPermissions: boolean }) {

    const profileTabs = ['Profile Settings', 'Account Settings', 'Account History', 'Family Settings'];

    return (
        <div className={`bg-mainBack p-1 w-full h-[600px] flex flex-col justify-center items-center pt-3 px-5 pb-5 space-y-5`}>
            {profileTabs.map((tab, index) => 
                index === 3 && familyPermissions === false ? null : <ProfileButton which={tab} key={index} />
            )}
        </div>
    )
}