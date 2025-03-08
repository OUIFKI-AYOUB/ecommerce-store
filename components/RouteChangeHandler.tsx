"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Loading from '@/components/ui/loading'; // Adjust the import path as necessary

const withLoading = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const handleStart = (url: string) => {
        if (url !== router.asPath) {
          setLoading(true);
        }
      };

      const handleComplete = (url: string) => {
        if (url === router.asPath) {
          setLoading(false);
        }
      };

      router.events.on('routeChangeStart', handleStart);
      router.events.on('routeChangeComplete', handleComplete);
      router.events.on('routeChangeError', handleComplete);

      return () => {
        router.events.off('routeChangeStart', handleStart);
        router.events.off('routeChangeComplete', handleComplete);
        router.events.off('routeChangeError', handleComplete);
      };
    }, [router]);

    return (
      <>
        {loading ? <Loading /> : <WrappedComponent {...props} />}
      </>
    );
  };
};

export default withLoading;
