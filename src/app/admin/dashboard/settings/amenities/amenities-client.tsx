'use client';

import { useState } from 'react';
import { Amenity } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AmenityFormDialog } from '@/components/dashboard/amenity-form-dialog';
import { Edit, Plus } from 'lucide-react';

// 👇 1. استدعاء الزرار الجوكر
import  DeleteButton from "@/app/admin/dashboard/compounds/DeleteButton";

interface AmenitiesPageClientProps {
  initialAmenities: Amenity[];
  count: number;
}

export function AmenitiesPageClient({ initialAmenities, count }: AmenitiesPageClientProps) {
  const [amenities, setAmenities] = useState(initialAmenities);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const router = useRouter();

  const handleFormSuccess = () => {
    router.refresh();
  };

  const tableData = amenities.map((amenity) => ({
    id: amenity.id.toString(),
    name: amenity.name,
    actions: (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedAmenity(amenity);
            setIsFormOpen(true);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        {/* 👇 2. الزرار الجوكر (بيكلم Amenities API) */}
        <DeleteButton 
            id={amenity.id.toString()} 
            endpointName="amenities" 
        />
        
      </div>
    ),
  }));

  const columns = [
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'actions', accessorKey: 'actions', header: 'Actions' },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Amenities</h1>
            <p className="text-muted-foreground">
              Manage property amenities
            </p>
          </div>
          <Button onClick={() => {
            setSelectedAmenity(undefined);
            setIsFormOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Amenity
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Amenities ({count})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={tableData}
              columns={columns}
            />
          </CardContent>
        </Card>
      </div>

      <AmenityFormDialog
        amenity={selectedAmenity}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={handleFormSuccess}
      />
      
      {/* تم حذف AlertDialog لأنه مبقاش ليه لزمة */}
    </>
  );
}