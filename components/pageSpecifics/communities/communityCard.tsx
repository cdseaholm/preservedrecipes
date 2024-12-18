import { ICommunity } from "@/models/types/community";

export default function CommunityCard({ community, index }: { community: ICommunity, index: number }) {
    return (
        <div key={index} className="mb-4 w-full m-1 p-2 border border-mainText/40 bg-mainContent text-mainText text-center rounded-md" style={{ height: '8vh' }}>
            {community.name}
        </div>
    )
}