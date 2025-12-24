'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Testimonial } from '@/lib/types'; // استورد النوع الأصلي

// تعريف الأعمدة هنا في ملف Client
export const columns: ColumnDef<Testimonial>[] = [
  {
    accessorKey: 'client_name',
    header: 'Client Name',
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          {value}/5 ⭐
        </Badge>
      );
    },
  },
  {
    accessorKey: 'quote',
    header: 'Quote',
    cell: ({ row }) => {
      const quote = row.original.quote || '';
      return (
        <span className="text-muted-foreground italic">
          {quote.length > 50 ? `${quote.substring(0, 50)}...` : quote}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      // هنا نقدر نوصل للـ ID عشان الزراير تشتغل بعدين
      const id = row.original.id;
      
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => console.log('Edit', id)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => console.log('Delete', id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];