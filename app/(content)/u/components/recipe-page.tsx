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
import { useRecipeList } from "@/app/(content)/u/recipes/hooks/recipe-list-hooks";
import SearchBarAndMenu from "@/components/misc/searchBox/searchBar";
import SubMenuDrop from "@/components/nav/header/subMenu/sub-menu-drop";
import MenuPanelHooks from "@/components/hooks/menu/menu-panel-hooks";
import dynamic from "next/dynamic";
import FilterAndSortDetailsRow from "@/components/templates/filter-sort-details-row";
import CardTemplate from "@/components/templates/card-template";
import { Button, Checkbox, Container } from "@mantine/core";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStateStore } from "@/context/stateStore";
import UserSpaceTemplate from "./user-space-template";

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

    const router = useRouter();
    const setGlobalLoading = useStateStore(state => state.setGlobalLoading);
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
    const recipesPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / recipesPerPage));
    const visibleRecipes = filteredAndSorted.slice((currentPage - 1) * recipesPerPage, currentPage * recipesPerPage);

    return (
        <>
            <NavWrapper
                userInfo={userInfo}
            >
                <ContentWrapper containedChild paddingNeeded>
                    <Container size="xl" px="sm" w="100%">
                        <UserSpaceTemplate user={userInfo} primaryActionLabel="View Profile" primaryActionHref="/u/profile">
                            <FilterAndSortDetailsRow
                                filterLabel={filter}
                                sortLabel={sort}
                            />
                            <ListWrapper
                                numberOfPages={totalPages}
                                isPending={false}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                                searchBar={
                                    <SearchBarAndMenu
                                        handleSearch={(e) => {
                                            setCurrentPage(1);
                                            setRecipeSearch(e.currentTarget.value);
                                        }}
                                        searchString={recipeSearch || 'Search your recipes'}
                                        index={2}
                                        leftSection={
                                            edit ? (
                                                <button type="button" onClick={toggleEdit} className={`flex flex-row items-center justify-center py-1 px-2 w-1/4 sm:w-1/5 md:w-1/6 lg:w-1/8 bg-stone-100 cursor-pointer hover:bg-stone-300 hover:text-blue-300 text-blue-500 rounded-md text-sm sm:text-base cursor-pointer`} aria-label="Toggle Edit">
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
                                {visibleRecipes.length > 0 ? (
                                    visibleRecipes.map((recipe, index) => (
                                        <InSearchItemButton
                                            key={recipe._id}
                                            item={recipe.name}
                                            handleChecked={() => toggleChecked(recipe._id)}
                                            edit={edit}
                                            checked={checkedRecipes.has(recipe._id)}
                                            handleSeeItem={() => {
                                                setGlobalLoading(true);
                                                router.push(`/view/recipe/${recipe._id}`)
                                            }}
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
                                    <div className="flex w-full flex-col items-center justify-center gap-3 rounded-md border border-dashed border-accent/30 bg-mainBack/60 p-6 text-center">
                                        <p className="text-base font-semibold text-mainText">No recipes found</p>
                                        <p className="max-w-md text-sm text-mainText/70">
                                            Create your first recipe, or adjust the search and filters to show more results.
                                        </p>
                                        <Button type="button" variant="light" onClick={() => handleOpenRecipeModal(null, userInfo, 'personal')}>
                                            Create recipe
                                        </Button>
                                    </div>
                                )}
                            </ListWrapper>
                        </UserSpaceTemplate>
                    </Container>
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
