'use client'

import ContentWrapper from "@/components/wrappers/contentWrapper";
import NavWrapper from "@/components/wrappers/navWrapper";
import { IUser } from "@/models/types/personal/user";
import { IRecipe } from "@/models/types/recipes/recipe";
import { Badge, Button, LoadingOverlay, Tabs } from "@mantine/core";
import { useRouter } from "next/navigation";
import { BiArrowBack, BiEditAlt, BiTrash } from "react-icons/bi";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { MdChecklist } from "react-icons/md";
import RecipeDetailHooks from "../hooks/recipe-detail-hooks";
import { toast } from "sonner";
import { Image } from '@mantine/core';
import ListWrapper from "@/components/wrappers/list-wrapper";

type RecipeDetailProps = {
    recipe: IRecipe;
    currentUser: IUser | null;
    creatorName: string;
};

export default function RecipeDetail({ recipe, currentUser, creatorName }: RecipeDetailProps) {

    const router = useRouter();
    const userOwnsRecipe = currentUser?._id === recipe.creatorID;
    const averageRating = recipe.reviews?.length
        ? (recipe.reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / recipe.reviews.length).toFixed(1)
        : null;


    const { loading, favoriteCount, saveCount, isFavorited, handleFavorite, isSaved, handleSave, handleDelete, handleEdit } = RecipeDetailHooks({ recipe: recipe, currentUser: currentUser, userOwnsRecipe: userOwnsRecipe })

    const handleCopyIngredients = async () => {
        const ingredients = recipe.ingredients || [];

        if (ingredients.length === 0) {
            toast.info("No ingredients to copy");
            return;
        }

        const checklist = [
            `Shopping list for ${recipe.name}`,
            "",
            ...ingredients.map((ingredient) => {
                const quantity = ingredient.quantity?.trim();
                const name = ingredient.ingredient?.trim();
                return `[ ] ${quantity ? `${quantity} ` : ''}${name}`;
            }),
        ].join("\n");

        try {
            await navigator.clipboard.writeText(checklist);
            toast.success("Ingredient checklist copied");
        } catch {
            toast.error("Could not copy checklist");
        }
    };

    return (
        <>
            <NavWrapper userInfo={currentUser}>
                <ContentWrapper containedChild paddingNeeded>
                    <LoadingOverlay visible={loading} />
                    <section className="flex w-full max-w-7xl flex-col items-center justify-start gap-4 rounded-md border border-accent/30 bg-mainContent p-3 min-h-[75dvh] sm:p-5">
                        <div className="flex w-full flex-row items-stretch justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex w-fit flex-row items-center gap-1 rounded-md px-2 py-1 text-sm text-blue-600 hover:bg-accent/20 cursor-pointer"
                            >
                                <BiArrowBack aria-hidden="true" />
                                Back
                            </button>
                            <div className="flex flex-row flex-wrap items-center justify-start gap-2 sm:justify-end">
                                {userOwnsRecipe && (
                                    <>
                                        <Button type="button" variant="light" leftSection={<BiEditAlt />} onClick={handleEdit}>
                                            Edit
                                        </Button>
                                        <Button type="button" variant="light" color="red" leftSection={<BiTrash />} onClick={handleDelete}>
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] lg:items-start">
                            <div className="order-2 flex min-w-0 flex-col gap-3 lg:order-1 h-full">
                                <div className="flex flex-row flex-wrap items-center gap-2">
                                    {recipe.secret && <Badge color="red">Private</Badge>}
                                    {recipe.recipeType && <Badge color="teal">{recipe.recipeType}</Badge>}
                                    <Badge color="gray">{averageRating ? `${averageRating} rating` : 'No rating'}</Badge>
                                    {averageRating && <p aria-label="Reviews" title="Reviews">{`${averageRating} Reviews`}</p>}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-semibold">{recipe.name}</h1>
                                    <p className="text-sm text-gray-600">By {creatorName}</p>
                                </div>
                                <div className="flex flex-row h-full w-full items-start justify-start rounded-md bg-white/50 px-3 py-2">
                                    <p className={`text-base leading-7 ${recipe.description && recipe.description !== '' ? '' : 'text-gray-400 '}`}>{recipe.description && recipe.description !== '' ? recipe.description : 'No description'}</p>
                                </div>
                                <div className="flex w-full flex-row flex-wrap items-end justify-start gap-2 h-content">
                                    <Button
                                        type="button"
                                        variant="subtle"
                                        color={isFavorited ? 'red' : 'gray'}
                                        leftSection={isFavorited ? <IoHeart /> : <IoHeartOutline />}
                                        onClick={handleFavorite}
                                        size={'compact-lg'}
                                    >
                                        {favoriteCount}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="subtle"
                                        color={isSaved ? 'teal' : 'gray'}
                                        leftSection={isSaved ? <FaBookmark /> : <FaRegBookmark />}
                                        onClick={handleSave}
                                        size={'compact-lg'}
                                    >
                                        {saveCount}
                                    </Button>
                                </div>
                            </div>
                            <div className="order-1 w-full overflow-hidden rounded-md bg-white/50 lg:order-2">
                                <Image
                                    radius="md"
                                    src={recipe.image || null}
                                    className="h-35 w-auto object-contain sm:h-54 lg:h-[220px]"
                                    fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                                    alt={recipe.image ? `${recipe.name} recipe image` : 'Recipe image placeholder'}
                                />
                            </div>
                        </div>

                        <Tabs defaultValue="steps" w={'100%'} className="flex flex-col justify-start items-center w-full h-full overflow-y-auto no-scrollbar rounded-md" p={0}>
                            <ListWrapper searchBar={
                                <Tabs.List grow w={'100%'}>
                                    <Tabs.Tab value="steps">Instructions</Tabs.Tab>
                                    <Tabs.Tab value="ingredients">Ingredients</Tabs.Tab>
                                    <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
                                </Tabs.List>
                            } numberOfPages={1} currentPage={1} isPending={false} editButtons={null}>

                                <Tabs.Panel value="steps" w={'100%'}>
                                    {recipe.steps && recipe.steps.length > 0 ? (
                                        <ol className="flex flex-col gap-3">
                                            {recipe.steps.map((step, index) => (
                                                <li key={`${step.stepId}-${index}`} className="rounded-md border border-accent/20 bg-white/40 p-3">
                                                    <p className="text-sm font-semibold text-gray-500">Step {index + 1}</p>
                                                    <p className="leading-7">{step.description}</p>
                                                </li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <p className="rounded-md border border-dashed border-accent/30 bg-white/40 p-4 text-center text-gray-600">
                                            No instructions have been added yet.
                                        </p>
                                    )}
                                </Tabs.Panel>
                                <Tabs.Panel value="ingredients" w={'100%'}>
                                    <div className="flex flex-row flex-wrap items-center justify-end gap-2 pb-2">
                                        <Button
                                            type="button"
                                            variant="light"
                                            size="xs"
                                            leftSection={<MdChecklist />}
                                            onClick={handleCopyIngredients}
                                        >
                                            Copy List
                                        </Button>
                                    </div>
                                    {recipe.ingredients && recipe.ingredients.length > 0 ? (
                                        <ul className="flex flex-col gap-2">
                                            {recipe.ingredients.map((ingredient, index) => (
                                                <li key={`${ingredient.ingredientId || ingredient.ingredient}-${index}`} className="rounded-md border border-accent/20 bg-white/40 px-3 py-2">
                                                    <span className="font-medium">{ingredient.ingredient}</span>
                                                    {ingredient.quantity && <span className="text-gray-600"> - {ingredient.quantity}</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="rounded-md border border-dashed border-accent/30 bg-white/40 p-4 text-center text-gray-600">
                                            No ingredients have been added yet.
                                        </p>
                                    )}
                                </Tabs.Panel>
                                <Tabs.Panel value="reviews" w={'100%'}>
                                    <p className="rounded-md border border-accent/20 bg-white/40 p-3 text-gray-600">Reviews and comments are coming soon.</p>
                                </Tabs.Panel>
                            </ListWrapper>
                        </Tabs>
                    </section>
                </ContentWrapper>
            </NavWrapper>
        </>
    );
}
