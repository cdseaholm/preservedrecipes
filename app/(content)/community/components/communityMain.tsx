'use client'

import PaginationWrapper from "@/components/wrappers/paginationWrapper";
import { ICommunity } from "@/models/types/community";
import CommunityCard from "./communityCard";
import { LoadingSpinner } from "@/components/misc/loadingSpinner";
import { useEffect, useState } from "react";

export default function CommunityMain({ communities, currentPage, numberOfPages }: { communities: ICommunity[], currentPage: number, numberOfPages: number }) {

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(false);
  }, [])

  return (
    loading ? (

      <LoadingSpinner screen={true}/>

    ) : (
      <PaginationWrapper currentPage={currentPage} numberOfPages={numberOfPages}>
        {communities.map((community, index) => (
          <CommunityCard key={index} community={community} index={index} />
        ))
        }
      </PaginationWrapper >
    )
  )
}