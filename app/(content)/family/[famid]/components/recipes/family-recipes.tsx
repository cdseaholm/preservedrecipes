'use client'

import { IUser } from "@/models/types/personal/user"
import { IFamily } from "@/models/types/family/family"
import ListWrapper from "@/components/wrappers/list-wrapper"
import { IIngredient } from "@/models/types/recipes/ingredient"
import { IRecipe } from "@/models/types/recipes/recipe"
import { filterRecipesKey, sortRecipesKey } from "@/app/(content)/u/components/recipe-page"
import FilterModal from "@/components/modals/filter/filter-modal"
import SortModal from "@/components/modals/sort/sort-modal"
import { useRecipeList } from "@/app/(content)/u/recipes/hooks/recipe-list-hooks";
import MenuPanelHooks from "@/components/hooks/menu/menu-panel-hooks"
import FilterAndSortDetailsRow from "@/components/templates/filter-sort-details-row"
import ChooseRecipeModal from "@/components/modals/recipe/choose-recipe"
import FamilyRecipesSearchBar from "./family-recipes-search-bar"
import { FamilyRecipesCheckboxes } from "./family-recipes-extra-comps"
import { useState } from "react"
import InSearchItemButton from "@/components/buttons/inSearchItemButton"
import CardTemplate from "@/components/templates/card-template"
import { useRouter } from "next/navigation"
import { useStateStore } from "@/context/stateStore"
import { Button, Group } from "@mantine/core"

export default function FamilyRecipes({
    userInfo,
    family,
    ingredients,
    familyRecipes,
    userRecipes
}: {
    userInfo: IUser;
    family: IFamily;
    ingredients: IIngredient[];
    familyRecipes: IRecipe[];
    userRecipes: IRecipe[];
}) {

    const router = useRouter();
    const setGlobalLoading = useStateStore(state => state.setGlobalLoading)

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
        handleBulkRemoveFromFamily,
        checkAll,
        openChooseRecipe,
        toggleChooseRecipe,
        handleAddRecipe,
        modalLoading
    } = useRecipeList(familyRecipes, userInfo, `/family/${family._id}/recipes`, ingredients, family);

    const adminPermission = family.familyMembers.find(
        (mem) => mem.familyMemberEmail === userInfo.email
    )?.permissionStatus === 'Admin';

    const { handleOpenRecipeModal } = MenuPanelHooks();
    const recipesPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / recipesPerPage));
    const visibleRecipes = filteredAndSorted.slice((currentPage - 1) * recipesPerPage, currentPage * recipesPerPage);

    return (
        <>
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
                    <FamilyRecipesSearchBar
                        recipeSearch={recipeSearch}
                        toggleEdit={toggleEdit}
                        edit={edit}
                        toggleChooseRecipe={toggleChooseRecipe}
                        toggleFilter={toggleFilter}
                        toggleSort={toggleSort}
                        handleOpenRecipeModal={handleOpenRecipeModal}
                        userInfo={userInfo}
                        adminPermission={adminPermission}
                        setRecipeSearch={(search) => {
                            setCurrentPage(1);
                            setRecipeSearch(search);
                        }}
                    />
                }
                editButtons={edit && (
                    <FamilyRecipesCheckboxes
                        checkedRecipes={checkedRecipes}
                        filteredAndSorted={filteredAndSorted}
                        checkAll={checkAll}
                        handleBulkRemoveFromFamily={handleBulkRemoveFromFamily}
                    />
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
                                setGlobalLoading(true)
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
                        <p className="text-base font-semibold text-mainText">No family recipes found</p>
                        <p className="max-w-md text-sm text-mainText/70">
                            Add one of your recipes to this family space, create a new family recipe, or adjust the search and filters.
                        </p>
                        {adminPermission && (
                            <Group justify="center" gap="sm">
                                <Button type="button" variant="light" onClick={toggleChooseRecipe}>
                                    Add existing
                                </Button>
                                <Button type="button" onClick={() => handleOpenRecipeModal(null, userInfo, 'family')}>
                                    Create recipe
                                </Button>
                            </Group>
                        )}
                    </div>
                )}
            </ListWrapper>
            {openFilter && (
                <FilterModal
                    open={openFilter}
                    handleClose={toggleFilter}
                    handleFilter={handleFilter}
                    filterData={filterRecipesKey}
                    value={filter}
                />
            )
            }

            {
                openSort && (
                    <SortModal
                        open={openSort}
                        handleClose={toggleSort}
                        handleSort={handleSort}
                        sortData={sortRecipesKey}
                        value={sort}
                    />
                )
            }
            {openChooseRecipe && (
                <ChooseRecipeModal
                    open={openChooseRecipe}
                    userRecipes={userRecipes}
                    handleAddRecipe={(recipe) => {
                        handleAddRecipe(recipe);
                        toggleChooseRecipe();
                    }}
                    handleCloseRecipeChoose={toggleChooseRecipe}
                    modalLoading={modalLoading}
                />
            )}
        </>
    );
}
