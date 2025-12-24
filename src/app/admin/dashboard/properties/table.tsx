'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Edit, Star, Rocket } from 'lucide-react';
import { Property } from '@/lib/types';
import { DataTable } from '@/components/dashboard/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// 👇 1. استدعاء الزرار الجوكر (تأكد إن المسار ده صح حسب مكان ملفك)
import DeleteButton from "@/app/admin/dashboard/compounds/DeleteButton";

interface PropertiesTableProps {
  data: Property[];
}

const columns: ColumnDef<Property>[] = [
  {
    accessorKey: 'main_image',
    header: 'Image',
    cell: ({ row }) => {
      const property = row.original;
      return (
        <div className="h-12 w-12 relative rounded-lg overflow-hidden bg-gray-100">
          {property.main_image ? (
            <Image
              src={property.main_image}
              alt={property.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const property = row.original;
      return (
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{property.title}</span>
            {property.is_featured && (
              <Badge variant="secondary" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {property.is_new_launch && (
              <Badge variant="default" className="text-xs">
                <Rocket className="h-3 w-3 mr-1" />
                New Launch
              </Badge>
            )}
          </div>
          <span className="text-sm text-gray-500">{property.property_type}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'compound',
    header: 'Compound',
    cell: ({ row }) => {
      const property = row.original;
      return property.compound ? (
        <span className="text-sm">{property.compound.name}</span>
      ) : (
        <span className="text-sm text-gray-400">Standalone</span>
      );
    },
  },
  {
    accessorKey: 'developer',
    header: 'Developer',
    cell: ({ row }) => {
      const property = row.original;
      return property.developer ? (
        <span className="text-sm">{property.developer.name}</span>
      ) : (
        <span className="text-sm text-gray-400">-</span>
      );
    },
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => {
      const property = row.original;
      return property.location ? (
        <span className="text-sm">{property.location.name}</span>
      ) : (
        <span className="text-sm text-gray-400">-</span>
      );
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const property = row.original;
      return (
        <span className="font-medium">
          EGP {parseFloat(property.price).toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: 'area',
    header: 'Area',
    cell: ({ row }) => {
      const property = row.original;
      return (
        <span className="text-sm">
          {property.area} sqm
        </span>
      );
    },
  },
  {
    accessorKey: 'bedrooms',
    header: 'Bedrooms',
    cell: ({ row }) => {
      const property = row.original;
      return (
        <span className="text-sm">
          {property.bedrooms} bed, {property.bathrooms} bath
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const property = row.original;
      return (
        // 👇 2. غيرنا الـ Dropdown لصف من الأزرار عشان يبقى أسهل في الاستخدام
        <div className="flex items-center gap-2">
            
            {/* زرار العرض */}
            <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/dashboard/properties/${property.id}`}>
                    <Eye className="h-4 w-4" />
                </Link>
            </Button>

            {/* زرار التعديل */}
            <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/dashboard/properties/${property.id}/edit`}>
                    <Edit className="h-4 w-4" />
                </Link>
            </Button>

            {/* 👇 3. الزرار الجوكر (مسح العقارات) */}
            <DeleteButton 
                id={property.id.toString()} 
                endpointName="properties"  // 👈 هنا السر: بنقوله امسح من العقارات
            />

        </div>
      );
    },
  },
];

export function PropertiesTable({ data }: PropertiesTableProps) {
  return <DataTable columns={columns} data={data} searchKey="title" searchPlaceholder="Search properties..." />;
}