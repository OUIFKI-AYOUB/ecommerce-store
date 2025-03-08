'use client';

import { useEffect, useState } from 'react';
import PageLoader from "@/components/page-loader";  // Ensure you import the PageLoader component
import { usePathname } from 'next/navigation';

export default function ClientLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate data fetching
      // Replace this with your actual data fetching logic using Prisma
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate a delay
      setLoading(false);
    };

    fetchData();
  }, [pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);  // Scroll to the top on page change
  }, [pathname]);

  return (
    <>
      {loading && <PageLoader />}  {/* Show loader while loading */}
      <div className={loading ? "blur-sm" : ""}>  {/* Apply blur effect to the background when loading */}
        {children}
      </div>
    </>
  );
}