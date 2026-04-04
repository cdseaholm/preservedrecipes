// app/(content)/u/components/recipe-page.tsx
'use client'

import { IRecipe } from "@/models/types/recipes/recipe";
import { IUser } from "@/models/types/personal/user";
import { IIngredient } from "@/models/types/recipes/ingredient";
import NavWrapper from "@/components/wrappers/navWrapper";
import ContentWrapper from "@/components/wrappers/contentWrapper";
import ListWrapper from "@/components/wrappers/list-wrapper";
import InSearchItemButton from "@/components/buttons/inSearchItemButton";
import DeleteButton from "@/components/buttons/deleteButton";
import { BiCheck } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import { useRecipeList } from "@/components/hooks/recipes/recipe-list-hooks";
import SearchBarAndMenu from "@/components/misc/searchBox/searchBar";
import SubMenuDrop from "@/components/nav/header/subMenu/sub-menu-drop";
import MenuPanelHooks from "@/components/hooks/menu/menu-panel-hooks";
import dynamic from "next/dynamic";
import FilterAndSortDetailsRow from "@/components/templates/filter-sort-details-row";
import CardTemplate from "@/components/templates/card-template";
import { Checkbox } from "@mantine/core";

const FilterModal = dynamic(() => import("@/components/modals/filter/filter-modal"), { ssr: false });
const SortModal = dynamic(() => import("@/components/modals/sort/sort-modal"), { ssr: false });

export const sortRecipesKey = [
    { label: 'Name (A-Z)', value: 'name_asc' },
    { label: 'Name (Z-A)', value: 'name_desc' },
    { label: 'Created At (Newest)', value: 'createdAt_desc' },
    { label: 'Created At (Oldest)', value: 'createdAt_asc' },
];

export const filterRecipesKey = [
    { label: 'All Recipes', value: 'all' },
    { label: 'Secret Recipes', value: 'secret' },
    { label: 'Non-Secret Recipes', value: 'non_secret' },
    { label: '3 stars and Above', value: 'three_stars_plus' },
    { label: '5 Stars', value: 'five_stars' },
    { label: 'Favorites', value: 'favorites' },
    { label: 'Saved', value: 'saved' },
    { label: 'My Recipes', value: 'my_recipes' },
];

export default function RecipePage({
    allMixedRecipes,
    userInfo,
    ingredients
}: {
    allMixedRecipes: IRecipe[];
    userInfo: IUser;
    ingredients: IIngredient[];
}) {

    const {
        edit,
        checkedRecipes,
        openFilter,
        openSort,
        filter,
        sort,
        recipeSearch,
        filteredAndSorted,
        handleFilter,
        handleSort,
        setRecipeSearch,
        toggleChecked,
        toggleEdit,
        toggleFilter,
        toggleSort,
        handleBulkDelete,
        checkAll
    } = useRecipeList(allMixedRecipes, userInfo, '/u/recipes', ingredients, null);

    const { handleOpenRecipeModal } = MenuPanelHooks();
    const buttonClass = `flex flex-row items-start hover:bg-accent/20 rounded-md space-x-2 w-full cursor-pointer py-4`;
    const textClass = `text-base md:text-lg lg:text-xl font-medium`;

    return (
        <>
            <NavWrapper
                loadingChild={null}
                userInfo={userInfo}
            >
                <ContentWrapper containedChild paddingNeeded>
                    <FilterAndSortDetailsRow
                        filterLabel={filter}
                        sortLabel={sort}
                    />
                    <ListWrapper
                        numberOfPages={1}
                        isPending={false}
                        currentPage={1}
                        searchBar={
                            <SearchBarAndMenu
                                handleSearch={(e) => setRecipeSearch(e.currentTarget.value)}
                                searchString={recipeSearch || 'Search your recipes'}
                                index={2}
                                leftSection={
                                    edit ? (
                                        <button type="button" onClick={toggleEdit} className={`h-content w-1/3 sm:w-1/4 md:w-1/5 flex flex-row p-1 justify-center items-center hover:bg-gray-100 hover:text-blue-300 text-blue-500 rounded-md text-sm sm:text-base space-x-1 cursor-pointer`} aria-label="Toggle Edit">
                                            <BiCheck />
                                            <p>{'Done'}</p>
                                        </button>
                                    ) : (
                                        <SubMenuDrop subMenu={
                                            [
                                                { title: 'Create New Recipe', onClick: () => handleOpenRecipeModal(null, userInfo, 'personal'), textClass: textClass, buttonClass: buttonClass, label: 'create' },
                                                { title: 'Bulk Edit', onClick: toggleEdit, textClass: textClass, buttonClass: buttonClass, label: 'edit' },
                                                { title: 'Filter', onClick: toggleFilter, textClass: textClass, buttonClass: buttonClass, label: 'view' },
                                                { title: 'Sort', onClick: toggleSort, textClass: textClass, buttonClass: buttonClass, label: 'view' },
                                            ]
                                        } />
                                    )
                                }
                            />
                        }
                        editButtons={edit && (
                            <div className="flex flex-row justify-between items-center w-full px-4 py-6">
                                <Checkbox
                                    checked={checkedRecipes.size === filteredAndSorted.length && filteredAndSorted.length > 0}
                                    className="cursor-pointer w-content"
                                    aria-label="Select all recipes checkbox"
                                    label="Select All"
                                    onClick={checkAll}
                                />
                                <DeleteButton
                                    icon={<FaRegTrashAlt />}
                                    label={`Delete ${checkedRecipes.size}`}
                                    onClick={handleBulkDelete}
                                />
                            </div>
                        )}
                    >
                        {filteredAndSorted.length > 0 ? (
                            filteredAndSorted.map((recipe, index) => (
                                <InSearchItemButton
                                    key={recipe._id}
                                    item={recipe.name}
                                    handleChecked={() => toggleChecked(recipe._id)}
                                    edit={edit}
                                    checked={checkedRecipes.has(recipe._id)}
                                    handleSeeItem={() => handleOpenRecipeModal(recipe, userInfo, 'personal')}
                                >
                                    <CardTemplate
                                        recipeProps={recipe}
                                        communityProps={null}
                                        index={index}
                                        userInfo={userInfo}
                                    />
                                </InSearchItemButton>
                            ))
                        ) : (
                            <ul className="p-2 text-start pl-7">Add a recipe to see it here</ul>
                        )}
                    </ListWrapper>
                </ContentWrapper>
            </NavWrapper >

            {openFilter && (
                <FilterModal
                    open={openFilter}
                    handleClose={toggleFilter}
                    handleFilter={handleFilter}
                    filterData={filterRecipesKey}
                    value={filter}
                />
            )}

            {openSort && (
                <SortModal
                    open={openSort}
                    handleClose={toggleSort}
                    handleSort={handleSort}
                    sortData={sortRecipesKey}
                    value={sort}
                />
            )}
        </>
    );
}