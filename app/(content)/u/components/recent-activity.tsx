'use client'

import { IReview } from "@/models/types/misc/review";
import { IRecipe } from "@/models/types/recipes/recipe";
import Link from "next/link";

interface RecentActivityProps {
    recentRecipes: IRecipe[];
    reviews: IReview[];
}

export default function RecentActivity({ recentRecipes, reviews }: RecentActivityProps) {
    
    // Combine and sort activities by date
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
     .slice(0, 10); // Show only last 10 activities

    if (activities.length === 0) {
        return (
            <div className="bg-secondaryBack p-8 rounded-lg text-center">
                <p className="text-gray-600 dark:text-gray-400">No recent activity yet.</p>
                <Link 
                    href="/u/recipes/new"
                    className="text-accent hover:underline mt-2 inline-block"
                >
                    Create your first recipe →
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {activities.map((activity, index) => (
                <div 
                    key={index}
                    className="bg-secondaryBack p-4 rounded-lg shadow-md flex items-start gap-4"
                >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                        {activity.type === 'recipe' ? (
                            <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center">
                                📖
                            </div>
                        ) : (
                            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
                                💬
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        {activity.type === 'recipe' ? (
                            <>
                                <p className="font-medium">
                                    Created a new recipe: 
                                    <Link 
                                        href={`/u/recipes/${(activity.data as IRecipe)._id}`}
                                        className="text-accent hover:underline ml-1"
                                    >
                                        {(activity.data as IRecipe).name}
                                    </Link>
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {(activity.data as IRecipe).description?.substring(0, 100)}...
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="font-medium">
                                    {(activity.data as IReview).rating ? 
                                        `Rated a recipe ${(activity.data as IReview).rating}/5` :
                                        'Commented on a recipe'
                                    }
                                </p>
                                {(activity.data as IReview).comment && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {(activity.data as IReview).comment!.substring(0, 100)}...
                                    </p>
                                )}
                            </>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
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