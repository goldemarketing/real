'use client';

import { useState, useMemo } from 'react';
import { PropertyCard } from "@/components/property-card";
import { Compound } from "@/lib/types";

interface SearchPageClientProps {
  initialCompounds: Compound[];
  locations: { id: number; name: string }[];
  developers: { id: number; name: string }[];
  searchParams: { [key: string]: string | string[] | undefined };
}

export function SearchPageClient({ 
  initialCompounds, 
  locations, 
  developers, 
  searchParams 
}: SearchPageClientProps) {
  const [compounds] = useState(initialCompounds);
  
  const [filters, setFilters] = useState({
    location: searchParams.location as string || '',
    developer: searchParams.developer as string || '',
    search: searchParams.q as string || '',
    // فلاتر جديدة
    minPrice: searchParams.minPrice as string || '',
    maxPrice: searchParams.maxPrice as string || '',
    deliveryYear: searchParams.delivery as string || '',
    installments: searchParams.installments as string || '',
  });

  // توليد قائمة سنوات للاختيار منها (من السنة الحالية + 10 سنوات)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  // Client-side filtering logic
  const filteredCompounds = useMemo(() => {
    return compounds.filter(compound => {
      // 1. Search
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          compound.name.toLowerCase().includes(searchTerm) ||
          (compound.location?.name && compound.location.name.toLowerCase().includes(searchTerm)) ||
          (compound.developer?.name && compound.developer.name.toLowerCase().includes(searchTerm));
        if (!matchesSearch) return false;
      }

      // 2. Location
      if (filters.location && filters.location !== 'all-locations') {
        if (compound.location?.name !== filters.location) return false;
      }

      // 3. Developer
      if (filters.developer && filters.developer !== 'all-developers') {
        if (compound.developer?.name !== filters.developer) return false;
      }

      // 4. Price Range (Assuming compound has `min_price`)
      // ملاحظة: تأكد من أن الحقل في الداتا بيز اسمه min_price أو start_price
      if (filters.minPrice) {
        if (Number(compound.min_price || 0) < Number(filters.minPrice)) return false;
      }
      if (filters.maxPrice) {
        if (Number(compound.min_price || 0) > Number(filters.maxPrice)) return false;
      }

      // 5. Delivery Date (Year)
      if (filters.deliveryYear && filters.deliveryYear !== 'any') {
        if (!compound.delivery_date) return false; // لو مفيش تاريخ استلام نستبعده
        const compoundYear = new Date(compound.delivery_date).getFullYear();
        // نعرض المشاريع التي تسلم في هذه السنة أو قبلها (أو حسب رغبتك: نفس السنة بالضبط)
        if (compoundYear !== Number(filters.deliveryYear)) return false;
      }

      // 6. Installment Years
      if (filters.installments) {
        // نعرض المشاريع التي توفر سنوات تقسيط أكبر من أو تساوي الرقم المطلوب
        // تأكد من أن الحقل في الـ Compound اسمه max_installment_years
        if ((compound.max_installment_years || 0) < Number(filters.installments)) return false;
      }

      return true;
    });
  }, [compounds, filters]);

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          <div className="sticky top-28">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Project Filters</h3>
              
              {/* Search */}
              <div>
                <label className="block text-sm font-medium mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Project name..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all-locations">All Locations</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Developer */}
              <div>
                <label className="block text-sm font-medium mb-2">Developer</label>
                <select
                  value={filters.developer}
                  onChange={(e) => updateFilter('developer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all-developers">All Developers</option>
                  {developers.map(developer => (
                    <option key={developer.id} value={developer.name}>
                      {developer.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium mb-2">Start Price (EGP)</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Installments */}
              <div>
                <label className="block text-sm font-medium mb-2">Installment Years (Up to)</label>
                <input
                  type="number"
                  placeholder="Ex: 8 Years"
                  value={filters.installments}
                  onChange={(e) => updateFilter('installments', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Delivery Year */}
              <div>
                <label className="block text-sm font-medium mb-2">Delivery Year</label>
                <select
                  value={filters.deliveryYear}
                  onChange={(e) => updateFilter('deliveryYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="any">Any Year</option>
                  <option value="2025">Ready to Move (2025)</option>
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <p className="text-muted-foreground mb-8">
            Showing {filteredCompounds.length} Projects.
          </p>
          
          {filteredCompounds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
              {filteredCompounds.map((compound) => (
                <PropertyCard
                  key={compound.id}
                  id={compound.id}
                  title={compound.name}
                  main_image={compound.main_image}
                  location={compound.location}
                  developer={compound.developer}
                  // عرضنا السعر في الكارت
                  price={compound.min_price ? `${compound.min_price.toLocaleString()} EGP` : "Call for Price"}
                  // لإخفاء بيانات الشقق الزائدة
                  property_type="Project"
                  bedrooms={0}
                  bathrooms={0}
                  area={0}
                  compound={null}
                  is_featured={false}
                  is_new_launch={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 animate-fade-in">
              <h2 className="text-2xl font-bold font-headline">No Projects Found</h2>
              <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}