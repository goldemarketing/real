'use client';

import { useState } from 'react';
import { Location } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LocationFormDialog } from '@/components/dashboard/location-form-dialog';
import { Edit, Plus } from 'lucide-react';

// 👇 1. استدعاء الزرار الجوكر
import DeleteButton from "@/app/admin/dashboard/compounds/DeleteButton";

interface LocationsPageClientProps {
  initialLocations: Location[];
  count: number;
}

export function LocationsPageClient({ initialLocations, count }: LocationsPageClientProps) {
  // لاحظ إننا شيلنا state الحذف المعقدة، الكود بقى أنظف بكتير
  const [locations, setLocations] = useState(initialLocations);
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const router = useRouter();

  const handleFormSuccess = () => {
    router.refresh();
  };

  const tableData = locations.map((location) => ({
    id: location.id.toString(),
    name: location.name,
    slug: location.slug,
    actions: (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedLocation(location);
            setIsFormOpen(true);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        {/* 👇 2. الزرار الجوكر (بيكلم Locations API) */}
        <DeleteButton 
            id={location.id.toString()} 
            endpointName="locations" 
        />
        
      </div>
    ),
  }));

  const columns = [
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'slug', accessorKey: 'slug', header: 'Slug' },
    { id: 'actions', accessorKey: 'actions', header: 'Actions' },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Locations</h1>
            <p className="text-muted-foreground">
              Manage property locations
            </p>
          </div>
          <Button onClick={() => {
            setSelectedLocation(undefined);
            setIsFormOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Location
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Locations ({count})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={tableData}
              columns={columns}
            />
          </CardContent>
        </Card>
      </div>

      <LocationFormDialog
        location={selectedLocation}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={handleFormSuccess}
      />
      
      {/* شيلنا الـ AlertDialog من هنا خلاص مبقاش ليه لازمة */}
    </>
  );
}