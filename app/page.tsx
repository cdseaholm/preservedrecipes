'use client'

import { LoadingSpinner } from '@/components/misc/loadingSpinner';
import React, { useEffect, useState } from 'react';
import Homepage from './(content)/homepage/page';

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(false)
  }, [loading]);

  return (
    loading ? (
      <LoadingSpinner screen={true} />
    ) : (
      <Homepage />
    )
  )
}