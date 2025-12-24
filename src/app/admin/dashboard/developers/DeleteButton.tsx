'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { deleteDeveloper } from '@/lib/api';

interface DeleteButtonProps {
  id: string | number; // ✅ كده بقى جوكر بجد (يقبل أرقام ونصوص)
  endpointName: string;
}

// 👇 التعديل هنا: استخدام export function (بدون default) عشان التوافق مع الجدول
export function DeleteButton({ id }: DeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this developer?')) return;
    
    setIsLoading(true);
    try {
      await deleteDeveloper(Number(id));
      toast({ title: 'Success', description: 'Developer deleted successfully' });
      router.refresh();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete developer', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isLoading}>
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  );
}