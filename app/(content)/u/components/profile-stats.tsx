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
        <section className="grid h-full min-h-0 grid-cols-2 grid-rows-3 gap-2 sm:grid-cols-3 sm:grid-rows-2 sm:gap-3">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="flex min-h-0 rounded-md border border-accent/15 bg-[var(--surfaceWash)] p-3 shadow-[var(--tightShadow)] transition hover:border-accent/30 sm:p-4"
                >
                    <div className="flex min-h-0 w-full flex-col items-center justify-center text-center">
                        <span className="mb-2 inline-flex size-9 items-center justify-center rounded-md bg-accent/10 text-accent sm:mb-3 sm:size-11">
                            {stat.icon}
                        </span>
                        <p className="text-2xl font-bold leading-none text-accent sm:text-3xl">{stat.value}</p>
                        <p className="mt-1 text-xs font-medium uppercase text-mainText/60">
                            {stat.label}
                        </p>
                    </div>
                </div>
            ))}
        </section>
    );
}
