'use client'

import { IUser } from "@/models/types/personal/user"
import { IFamily } from "@/models/types/family/family"
import ListWrapper from "@/components/wrappers/list-wrapper"
import { IIngredient } from "@/models/types/recipes/ingredient"
import { IRecipe } from "@/models/types/recipes/recipe"
import { filterRecipesKey, sortRecipesKey } from "@/app/(content)/u/components/recipe-page"
import FilterModal from "@/components/modals/filter/filter-modal"
import SortModal from "@/components/modals/sort/sort-modal"
import { useRecipeList } from "@/components/hooks/recipes/recipe-list-hooks";
import MenuPanelHooks from "@/components/hooks/menu/menu-panel-hooks"
import FilterAndSortDetailsRow from "@/components/templates/filter-sort-details-row"
import ChooseRecipeModal from "@/components/modals/recipe/choose-recipe"
import FamilyRecipesSearchBar from "./family-recipes-search-bar"
import { FamilyRecipeInSearchItems, FamilyRecipesCheckboxes } from "./family-recipes-extra-comps"

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

    return (
        <>
            <FilterAndSortDetailsRow
                filterLabel={filter}
                sortLabel={sort}
            />
            <ListWrapper
                numberOfPages={1}
                isPending={false}
                currentPage={1}
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
                        setRecipeSearch={setRecipeSearch}
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
                {filteredAndSorted.length > 0 ? (
                    filteredAndSorted.map((recipe, index) => (
                        <FamilyRecipeInSearchItems
                            key={recipe._id}
                            recipe={recipe}
                            index={index}
                            toggleChecked={toggleChecked}
                            checkedRecipes={checkedRecipes}
                            edit={edit}
                            handleOpenRecipeModal={handleOpenRecipeModal}
                            userInfo={userInfo}
                        />
                    ))
                ) : (
                    <ul className="p-2 text-start pl-7">Add a recipe to see it here</ul>
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