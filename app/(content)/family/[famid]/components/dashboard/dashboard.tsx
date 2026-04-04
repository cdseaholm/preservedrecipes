'use client'

import { IFamily } from "@/models/types/family/family";
import FamilyActivity from "./family-activity";
import { IUser } from "@/models/types/personal/user";
import ListWrapper from "@/components/wrappers/list-wrapper";


export default function FamilyDashboard({ family, user }: { family: IFamily, user: IUser }) {

    const showUser = false;
    if (showUser) {
        //keeping here to rid of unused variable warning, but will probably be used in the future when we add user specific info to the dashboard
        console.log("User info in dashboard:", user, family);
    }

    return (
        <>
            <ListWrapper numberOfPages={1} isPending={false} currentPage={1} searchBar={null} editButtons={null}>
                <FamilyActivity />
            </ListWrapper>
        </>
    )
}