'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Developer } from '@/lib/types';
import { createDeveloper, updateDeveloper } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/dashboard/image-upload';
import { RichTextEditor } from '@/components/dashboard/rich-text-editor';
import { Loader2, Save } from 'lucide-react';

const developerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

type DeveloperFormData = z.infer<typeof developerSchema>;

interface DeveloperFormProps {
  developer?: Developer;
}

export function DeveloperForm({ developer }: DeveloperFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [logo, setLogo] = useState<string | File>(developer?.logo || '');
  const [image, setImage] = useState<string | File>(developer?.image || '');

  const router = useRouter();
  const { toast } = useToast();

  const {
    register, handleSubmit, setValue, watch, formState: { errors },
  } = useForm<DeveloperFormData>({
    resolver: zodResolver(developerSchema),
    defaultValues: {
      name: developer?.name || '',
      description: developer?.description || '',
    },
  });

  const onSubmit = async (data: DeveloperFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      
      if (data.description) {
        formData.append('description', data.description);
      }

      // 🔴 أهم نقطة: إرسال الصورة فقط لو كانت ملف جديد (File)
      if (logo instanceof File) {
        formData.append('logo', logo);
      }

      if (image instanceof File) {
        formData.append('image', image);
      }

      if (developer) {
        await updateDeveloper(developer.id, formData);
        toast({ title: "Success", description: "Developer updated successfully" });
      } else {
        await createDeveloper(formData);
        toast({ title: "Success", description: "Developer created successfully" });
      }

      router.push('/admin/dashboard/developers');
      router.refresh();

    } catch (error: any) {
      console.error("Submission Error:", error);
      const msg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      toast({ title: "Error", description: `Failed to save: ${msg}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Basic Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input {...register('name')} placeholder="Developer Name" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <RichTextEditor 
                value={watch('description') || ''} 
                onChange={(v) => setValue('description', v)} 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Media</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Logo</Label>
              <ImageUpload 
                currentImage={typeof logo === 'string' ? logo : undefined} 
                onUpload={(file) => setLogo(file as File)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <ImageUpload 
                currentImage={typeof image === 'string' ? image : undefined} 
                onUpload={(file) => setImage(file as File)} 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
          {developer ? 'Update Developer' : 'Create Developer'}
        </Button>
      </div>
    </form>
  );
}