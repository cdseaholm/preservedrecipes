'use client'

import { useStateStore } from "@/context/stateStore";
import { AiOutlineProfile } from "react-icons/ai";
import { GiFamilyTree } from "react-icons/gi";
import { RiUserCommunityLine } from "react-icons/ri";

const GridWrapper = ({ children, back }: { children: React.ReactNode, back: string }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 w-[90%] bg-${back} shadow-md shadow-highlight/90 border border-accent px-3 py-5`}>
      {children}
    </div>
  );
};

const TabBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      {children}
    </div>
  );
};

const ContentBox = ({ contentString, contentElement, index }: { contentString: string, contentElement: React.ReactNode, index: number }) => {
  return (
    <div className="flex flex-col justify-between items-center p-2 w-full h-full">
      <div className='flex flex-row w-full h-[90%] justify-center items-center border border-accent/60'>
        {contentElement}
      </div>
      <div className={`flex flex-row w-full items-center ${index === 1 ? 'text-mainContent hover:text-mainText justify-start' : 'text-blue-400 justify-end hover:text-black/70'} hover:underline cursor-pointer`}>
        {contentString}
      </div>
    </div>
  );
};

const ListWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col justify-evenly items-start w-full h-full p-1 text-sm md:text-base">
      {children}
    </div>
  );
};

const Content = [
  [<AiOutlineProfile size={60} key={0} />, 'Sign up or Log in to create a recipe'],
  [<GiFamilyTree size={60} key={1} />, 'Start your own tree or join your one'],
  [<RiUserCommunityLine size={60} key={2} />, 'Browse communities to join']
];

const Texts = [
  ['The soul of Preserved Recipes is to have the ability to have a place where all of your favorite recipes can be found, or where you can find new ones. With Preserved Recipes you can: ', 'Create recipes', 'Save recipes', 'Rate recipes', 'Alter recipes', 'Share recipes with family and communities'],
  ['The heart of Preserved Recipes is that there should be an easy way to store, view, and maintain recipes from family and friends for generations to come. Use Preserved Recipes to: ', 'Create a family tree', 'Connect family members to the tree', 'Share recipes with your family', 'Recommend new recipes to try alone or together', 'Ask for help altering a recipe'],
  ['The unifying feature of Preserved Recipes is to help any food lover, cooking enthusiast, or those seeking food help, to find, share, or connect with each other. Within these communities users can:', 'Create Public or Private communities', `Define the community's focus like a Recipe Swap Club, or a community dedicated to critiquing and improving recipes`, 'Invite others to join the community', 'Keep the community engaged and updated with the specific focus', 'Enjoy the sense of community when it comes to sharing and trying new recipes']
] as string[][];

export default function InfoTemplate({ tab }: { tab: string }) {
  const width = useStateStore(s => s.widthQuery);
  const back = tab === 'family' ? 'altBack' : 'mainBack';
  const index = tab === 'recipes' ? 0 : tab === 'family' ? 1 : 2;
  const contentString = Content[index][1] as string;
  const contentElement = Content[index][0] as React.ReactNode;
  const lgNoFam = width > 640 && tab !== 'family' ? true : false;
  const indexToUse = lgNoFam ? index : 1;

  return (
    <GridWrapper back={back}>
      {!lgNoFam && <ContentBox contentString={contentString} contentElement={contentElement} index={index} />}
      <TabBox>
        <ListWrapper>
          <h2>{Texts[indexToUse][0]}</h2>
          <ol>
            {Texts[indexToUse].map((text, index) => {
              if (index !== 0) {
                return (
                  <li className="pl-5" key={index}>
                    {`-${text}`}
                  </li>
                )
              }
            })}
          </ol>
        </ListWrapper>
      </TabBox>
      {lgNoFam && <ContentBox contentString={contentString} contentElement={contentElement} index={index} />}
    </GridWrapper>
  );
}