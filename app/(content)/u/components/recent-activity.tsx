'use client'

import { IReview } from "@/models/types/misc/review";
import { IRecipe } from "@/models/types/recipes/recipe";
import { IconBook2, IconMessageCircle } from "@tabler/icons-react";
import Link from "next/link";

interface RecentActivityProps {
    recentRecipes: IRecipe[];
    reviews: IReview[];
    limit?: number;
}

export default function RecentActivity({ recentRecipes, reviews, limit = 10 }: RecentActivityProps) {

    const activities: Array<{
        type: 'recipe' | 'review';
        date: Date | string;
        data: IRecipe | IReview;
    }> = [
        ...recentRecipes.map(recipe => ({
            type: 'recipe' as const,
            date: recipe.createdAt,
            data: recipe
        })),
        ...reviews.map(review => ({
            type: 'review' as const,
            date: review.createdAt,
            data: review
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);

    if (activities.length === 0) {
        return (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-md border border-dashed border-accent/25 bg-[var(--surfaceWash)] p-8 text-center">
                <p className="font-semibold text-mainText">No recent activity yet.</p>
                <Link
                    href="/u/recipes/new"
                    className="mt-2 inline-block text-sm font-medium text-accent hover:underline"
                >
                    Create your first recipe
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {activities.map((activity, index) => (
                <div
                    key={index}
                    className="flex items-start gap-3 rounded-md border border-accent/10 bg-[var(--surfaceWash)] p-3 shadow-sm sm:gap-4 sm:p-4"
                >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent sm:size-11">
                        {activity.type === 'recipe' ? <IconBook2 size={21} /> : <IconMessageCircle size={21} />}
                    </div>

                    <div className="min-w-0 flex-1">
                        {activity.type === 'recipe' ? (
                            <>
                                <p className="font-medium leading-snug text-mainText">
                                    Created a new recipe:{' '}
                                    <Link
                                        href={`/view/recipe/${(activity.data as IRecipe)._id}`}
                                        className="text-accent hover:underline"
                                    >
                                        {(activity.data as IRecipe).name}
                                    </Link>
                                </p>
                                {(activity.data as IRecipe).description && (
                                    <p className="mt-1 line-clamp-2 text-sm text-mainText/65">
                                        {(activity.data as IRecipe).description}
                                    </p>
                                )}
                            </>
                        ) : (
                            <>
                                <p className="font-medium leading-snug text-mainText">
                                    {(activity.data as IReview).rating
                                        ? `Rated a recipe ${(activity.data as IReview).rating}/5`
                                        : 'Commented on a recipe'}
                                </p>
                                {(activity.data as IReview).comment && (
                                    <p className="mt-1 line-clamp-2 text-sm text-mainText/65">
                                        {(activity.data as IReview).comment}
                                    </p>
                                )}
                            </>
                        )}
                        <p className="mt-2 text-xs font-medium uppercase text-mainText/45">
                            {new Date(activity.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
