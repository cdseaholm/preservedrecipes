'use client'

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
        { label: 'Recipes', value: recipeCount, icon: '📖' },
        { label: 'Favorites', value: favoriteCount, icon: '❤️' },
        { label: 'Communities', value: communityCount, icon: '👥' },
        { label: 'Ratings', value: ratingsGiven, icon: '⭐' },
        { label: 'Comments', value: commentsMade, icon: '💬' },
        { label: 'Days', value: timeBeingMember, icon: '📅' },
    ];

    return (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
            {stats.map((stat, index) => (
                <div 
                    key={index}
                    className="bg-secondaryBack p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                    <div className="flex flex-col items-center text-center">
                        <span className="text-2xl sm:text-3xl mb-1 sm:mb-2">{stat.icon}</span>
                        <p className="text-xl sm:text-2xl font-bold text-accent">{stat.value}</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {stat.label}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}