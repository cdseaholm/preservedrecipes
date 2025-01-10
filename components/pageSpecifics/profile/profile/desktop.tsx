// 'use client'

// import LinkTextButton from "@/components/buttons/linkTextButtons"
// import { Avatar } from "@mantine/core"
// import { ChangeEvent, useState } from "react";
// import ProfileSearchAndAdd from "@/components/misc/searchBox/searchAndAdd"

// export default function DesktopProfilePage({ userName, handleCreate, userInfo }: { userName: string, handleCreate: (which: string, open: boolean) => void, userInfo: string }) {

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
//         <section className="flex flex-row justify-between items-center h-full w-full overflow-hidden bg-mainBack min-h-[550px] p-2 rounded-md">
//             <div className="flex flex-col justify-start items-center py-6 h-full w-1/4 text-center bg-mainContent pl-2 rounded-md">
//                 <div className="flex flex-col justify-start items-center h-1/2 bg-mainBack w-full border border-accent/50 rounded-t-md pt-3">
//                     {`${userName}'s Profile`}
//                     <Avatar radius={'xl'} />
//                     <LinkTextButton link={'/profile/settings'} content="Profile Settings" />
//                     <LinkTextButton link="/account" content="Account Settings" />
//                     <LinkTextButton link="/account" content="Account History" />
//                 </div>
//                 <div className="flex flex-col justify-start items-center h-1/2 bg-mainBack w-full rounded-b-md border-x border-b border-accent/50 pt-3">
//                     {userInfo ? (
//                         <LinkTextButton link="/family/settings" content="Family Settings" />
//                     ) : (
//                         <p>Create a family</p>
//                     )}
//                 </div>
//             </div>
//             <div className="flex flex-col justify-start items-center gap-4 py-6 bg-mainContent h-full w-3/4">
//                 <ProfileSearchAndAdd type="recipe" options={options} handleCreate={handleCreate} handleSearch={handleRecipeSearch} mobile={false}/>
//                 <ProfileSearchAndAdd type="community" options={communityOptions} handleCreate={handleCreate} handleSearch={handleCommunitySearch} mobile={false}/>
//             </div>
//         </section>
//     )
// }