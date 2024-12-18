import PaginationWrapper from "@/components/templates/wrappers/paginationWrapper";
import { ICommunity } from "@/models/types/community";
import { Session } from "next-auth";
import CommunityCard from "./communityCard";

export default function CommunityMain({ session, communities, currentPage, numberOfPages }: { session: Session | null, communities: ICommunity[], currentPage: number, numberOfPages: number }) {
  if (session) {
    console.log(session);
  } else {
    console.log('session null')
  }
  return (
    <PaginationWrapper currentPage={currentPage} numberOfPages={numberOfPages}>
        {communities.map((community, index) => (
          <CommunityCard key={index} community={community} index={index} />
        ))}
    </PaginationWrapper>
  )
}