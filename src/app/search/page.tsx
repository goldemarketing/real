import { Suspense } from 'react';
import { SearchPageClient } from "@/components/search-page-client";
import { Skeleton } from '@/components/ui/skeleton';
import { getCompounds, getLocations, getDevelopers } from "@/lib/api"; 
// 👇 1. استيراد الـ Popup
import { LeadPopup } from '@/components/lead-popup';

function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      ))}
    </div>
  )
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const resolvedSearchParams = await searchParams;

  // Fetch data: Compounds instead of Properties
  const [initialCompoundsData, locationsData, developersData] = await Promise.all([
    getCompounds({
      location: resolvedSearchParams.location as string,
      developer: resolvedSearchParams.developer as string,
      search: resolvedSearchParams.q as string,
      min_price: resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined,
      max_price: resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined,
      delivery_year: resolvedSearchParams.delivery ? Number(resolvedSearchParams.delivery) : undefined,
      min_installment_years: resolvedSearchParams.installments ? Number(resolvedSearchParams.installments) : undefined,
    }),
    getLocations(),
    getDevelopers(),
   ]);

  return (
    // 👇 2. استخدمنا Fragment (<>) عشان نقدر نحط عنصرين جنب بعض
    <>
      <LeadPopup /> 
      
      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchPageClient
          initialCompounds={initialCompoundsData.results}
          locations={locationsData.results}
          developers={developersData.results}
          searchParams={resolvedSearchParams}
        />
      </Suspense>
    </>
  );
}