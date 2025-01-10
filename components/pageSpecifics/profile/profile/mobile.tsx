// 'use client'

// import { Avatar, Tabs } from "@mantine/core"
// import { useState, ChangeEvent } from "react"
// import FamilyTabs from "./profileMobileTabs/familyTab"
// import SettingsTab from "./profileMobileTabs/settingsTab"
// import { FiSettings } from "react-icons/fi"
// import Link from "next/link"

// export default function MobileProfilePage({ userName, handleCreate, userInfo }: { userName: string, handleCreate: (which: string, open: boolean) => void, userInfo: string }) {

//     const [recipeSearch, setRecipeSearch] = useState('');
//     const [communitySearch, setCommunitySearch] = useState('');
//     const recipes = ['Chicken', 'Beef', 'Potatoes'];
//     const communities = ['1', '2', '3'];

//     const options = recipes
//         .filter((item) => item.toLowerCase().includes(recipeSearch.toLowerCase().trim()))
//         .map((item) => (
//             <button value={item} key={item} className="flex flex-row w-[100%] text-sm lg:text-md hover:bg-gray-200 hover:text-highlight p-2 text-start pl-7">
//                 -{item}
//             </button>
//         ));

//     const communityOptions = communities.filter((item) => item.toLowerCase().includes(communitySearch.toLowerCase().trim())).map((item) => (
//         <button value={item} key={item} className="flex flex-row w-[100%] text-sm lg:text-md hover:bg-gray-200 hover:text-highlight p-2 text-start pl-7">
//             -{item}
//         </button>
//     ))

//     const handleRecipeSearch = (e: ChangeEvent<HTMLInputElement>) => {
//         setRecipeSearch(e.currentTarget.value)
//     }

//     const handleCommunitySearch = (e: ChangeEvent<HTMLInputElement>) => {
//         setCommunitySearch(e.currentTarget.value);
//     }

//     return (
//         <section className="flex flex-col justify-center items-center w-full overflow-y-hidden overflow-x-auto bg-mainBack min-h-[750px] p-2">
//             <div className="flex flex-row justify-between items-center h-fit w-full bg-mainContent rounded-t-md divide-x text-xs sm:text-sm">
//                 <p className="flex flex-row justify-start items-center h-fit w-fit bg-mainContent p-2 pl-4">
//                     {`${userName}'s Profile`}
//                     <Link href={`/profile/settings`} className="text-md lg:text-base text-blue-500 hover:bg-gray-100 hover:text-blue-300 p-2 rounded-md">
//                         <FiSettings />
//                     </Link>
//                 </p>
//                 <div className="flex flex-col justify-center items-center h-fit w-fit bg-mainContent p-2">
//                     <Avatar radius={'xl'} />
//                 </div>
//             </div>
//             <Tabs defaultValue={'personal'} style={{ width: '100%', minHeight: '100%', height: '100%' }}>
//                 <div className="flex flex-row justify-between items-start h-fit w-full bg-mainContent rounded-t-md divide-x">
//                     <Tabs.List>
//                         <Tabs.Tab value="personal">
//                             Personal
//                         </Tabs.Tab>
//                         <Tabs.Tab value='family'>
//                             Family
//                         </Tabs.Tab>
//                         <Tabs.Tab value='settings'>
//                             Settings
//                         </Tabs.Tab>
//                     </Tabs.List>
//                 </div>
//                 <div className="flex flex-row justify-center items-start w-full h-[700px] bg-mainContent rounded-b-md">
//                     {/* <Tabs.Panel value="personal" w={'100%'} h={'100%'}>
//                         <PersonalTabs options={options} communityOptions={communityOptions} handleCreate={handleCreate} handleCommunitySearch={handleCommunitySearch} handleRecipeSearch={handleRecipeSearch} />
//                     </Tabs.Panel> */}
//                     <Tabs.Panel value="family">
//                         <FamilyTabs userInfo={userInfo} />
//                     </Tabs.Panel>
//                     <Tabs.Panel value="settings">
//                         <SettingsTab />
//                     </Tabs.Panel>
//                 </div>
//             </Tabs>
//         </section >
//     )
// }