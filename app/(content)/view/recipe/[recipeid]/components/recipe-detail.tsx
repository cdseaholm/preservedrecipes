'use client'

import ContentWrapper from "@/components/wrappers/contentWrapper";
import NavWrapper from "@/components/wrappers/navWrapper";
import { IUser } from "@/models/types/personal/user";
import { IRecipe } from "@/models/types/recipes/recipe";
import { Badge, Button, LoadingOverlay, Paper, Tabs } from "@mantine/core";
import { useRouter } from "next/navigation";
import { BiArrowBack, BiEditAlt, BiTrash } from "react-icons/bi";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { MdChecklist } from "react-icons/md";
import RecipeDetailHooks from "../hooks/recipe-detail-hooks";
import { toast } from "sonner";

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
                    <section className="flex flex-col gap-4 rounded-md border border-accent/30 bg-mainContent p-5 w-full min-h-[75dvh]">
                        <div className="flex w-full max-w-5xl flex-col gap-5">
                            <div className="flex flex-row flex-wrap items-center justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="flex flex-row items-center gap-1 rounded-md px-2 py-1 text-sm text-blue-600 hover:bg-accent/20"
                                >
                                    <BiArrowBack />
                                    Back
                                </button>
                                <div className="flex flex-row flex-wrap items-center justify-end gap-2">
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
                            <div className="flex flex-col gap-3">
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
                                <p className={`max-w-3xl text-base leading-7 ${recipe.description && recipe.description !== '' ? '' : 'text-gray-400'}`}>{recipe.description && recipe.description !== '' ? recipe.description : 'No description'}</p>
                                <div className="flex flex-row flex-wrap justify-end items-center w-full h-content gap-2">
                                    <Button
                                        type="button"
                                        variant="subtle"
                                        color={isFavorited ? 'red' : 'gray'}
                                        leftSection={isFavorited ? <IoHeart /> : <IoHeartOutline />}
                                        onClick={handleFavorite}
                                    >
                                        {favoriteCount}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="subtle"
                                        color={isSaved ? 'teal' : 'gray'}
                                        leftSection={isSaved ? <FaBookmark /> : <FaRegBookmark />}
                                        onClick={handleSave}
                                    >
                                        {saveCount}
                                    </Button>
                                </div>
                            </div>

                            {recipe.image && (
                                <div
                                    aria-label={recipe.name}
                                    role="img"
                                    className="h-[260px] w-full rounded-md bg-cover bg-center sm:h-[360px] lg:h-[420px]"
                                    style={{ backgroundImage: `url(${recipe.image})` }}
                                />
                            )}
                            <Tabs defaultValue="steps" w={'100%'} className="flex flex-col justify-start items-center w-full h-full overflow-y-auto no-scrollbar p-4 rounded-md">
                                <Tabs.List grow>
                                    <Tabs.Tab value="steps">Steps</Tabs.Tab>
                                    <Tabs.Tab value="ingredients">Ingredients</Tabs.Tab>
                                    <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
                                </Tabs.List>
                                <Tabs.Panel value="steps" w={'100%'}>
                                    <Paper className="flex flex-col gap-3 space-y-2" shadow="sm" p={'md'}>
                                        <h2 className="text-xl font-semibold">Steps</h2>
                                        <ol className="flex flex-col gap-3">
                                            {recipe.steps?.map((step, index) => (
                                                <li key={`${step.stepId}-${index}`} className="rounded-md border border-accent/20 bg-white/40 p-3">
                                                    <p className="text-sm font-semibold text-gray-500">Step {index + 1}</p>
                                                    <p className="leading-7">{step.description}</p>
                                                </li>
                                            ))}
                                        </ol>
                                    </Paper>
                                </Tabs.Panel>
                                <Tabs.Panel value="ingredients" w={'100%'}>
                                    <Paper className="flex flex-col gap-3 space-y-2" shadow="sm" p={'md'}>
                                        <div className="flex flex-row flex-wrap items-center justify-between gap-2">
                                            <h2 className="text-xl font-semibold">Ingredients</h2>
                                            <Button
                                                type="button"
                                                variant="light"
                                                size="xs"
                                                leftSection={<MdChecklist />}
                                                onClick={handleCopyIngredients}
                                            >
                                                Copy Checklist
                                            </Button>
                                        </div>
                                        <ul className="flex flex-col gap-2">
                                            {recipe.ingredients?.map((ingredient, index) => (
                                                <li key={`${ingredient.ingredientId || ingredient.ingredient}-${index}`} className="rounded-md border border-accent/20 bg-white/40 px-3 py-2">
                                                    <span className="font-medium">{ingredient.ingredient}</span>
                                                    {ingredient.quantity && <span className="text-gray-600"> - {ingredient.quantity}</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    </Paper>
                                </Tabs.Panel>
                                <Tabs.Panel value="reviews" w={'100%'}>
                                    <section className="flex flex-col gap-3">
                                        <h2 className="text-xl font-semibold">Reviews</h2>
                                        <p className="rounded-md border border-accent/20 bg-white/40 p-3 text-gray-600">Reviews and comments are coming soon.</p>
                                    </section>
                                </Tabs.Panel>
                            </Tabs>
                        </div>
                    </section>
                </ContentWrapper>
            </NavWrapper>
        </>
    );
}
