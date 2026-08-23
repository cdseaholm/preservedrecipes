'use client'

import {
    IconBook2,
    IconCalendarStats,
    IconHeart,
    IconMessageCircle,
    IconStar,
    IconUsers,
} from "@tabler/icons-react";

interface ProfileStatsProps {
    recipeCount: number;
    communityCount: number;
    favoriteCount: number;
    ratingsGiven: number;
    commentsMade: number;
    timeBeingMember: number;
}

export default function ProfileStats({
    recipeCount,
    communityCount,
    favoriteCount,
    ratingsGiven,
    commentsMade,
    timeBeingMember
}: ProfileStatsProps) {

    const stats = [
        { label: 'Recipes', value: recipeCount, icon: <IconBook2 size={22} /> },
        { label: 'Favorites', value: favoriteCount, icon: <IconHeart size={22} /> },
        { label: 'Communities', value: communityCount, icon: <IconUsers size={22} /> },
        { label: 'Ratings', value: ratingsGiven, icon: <IconStar size={22} /> },
        { label: 'Comments', value: commentsMade, icon: <IconMessageCircle size={22} /> },
        { label: 'Days', value: timeBeingMember, icon: <IconCalendarStats size={22} /> },
    ];

    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="rounded-md border border-accent/15 bg-[var(--surfaceWash)] p-3 shadow-[var(--tightShadow)] transition hover:border-accent/30 sm:p-4"
                >
                    <div className="flex flex-col items-center text-center">
                        <span className="mb-2 inline-flex size-9 items-center justify-center rounded-md bg-accent/10 text-accent">
                            {stat.icon}
                        </span>
                        <p className="text-xl font-bold text-accent sm:text-2xl">{stat.value}</p>
                        <p className="mt-1 text-xs font-medium uppercase text-mainText/60">
                            {stat.label}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
