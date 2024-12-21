import PaginationWrapper from "@/components/templates/wrappers/paginationWrapper";
import { ICommunity } from "@/models/types/community";
import CommunityCard from "./communityCard";

export default function CommunityMain({ communities, currentPage, numberOfPages }: { communities: ICommunity[], currentPage: number, numberOfPages: number }) {
  
  return (
    <PaginationWrapper currentPage={currentPage} numberOfPages={numberOfPages}>
        {communities.map((community, index) => (
          <CommunityCard key={index} community={community} index={index} />
        ))}
    </PaginationWrapper>
  )
}