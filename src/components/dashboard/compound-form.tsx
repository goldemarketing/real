'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Compound, Developer, Location, Amenity } from '@/lib/types';
import { createCompound, updateCompound } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/dashboard/image-upload';
import { MultiSelect } from '@/components/dashboard/multi-select';
import { RichTextEditor } from '@/components/dashboard/rich-text-editor';
import { Loader2, Save, Video } from 'lucide-react';

const compoundSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  developer: z.number().min(1, 'Developer is required'),
  location: z.number().min(1, 'Location is required'),
  description: z.string().min(1, 'Description is required'),
  delivery_date: z.string().optional(),
  amenities: z.array(z.number()).optional(),
  min_price: z.coerce.number().min(0).optional(),
  min_area: z.coerce.number().min(0).optional(),
  max_installment_years: z.coerce.number().min(0).optional(),
  video_url: z.string().optional().or(z.literal('')),
});

type CompoundFormData = z.infer<typeof compoundSchema>;

interface CompoundFormProps {
  compound?: Compound;
  developers: Developer[];
  locations: Location[];
  amenities: Amenity[];
}

export function CompoundForm({ compound, developers, locations, amenities }: CompoundFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [mainImage, setMainImage] = useState<string | File>(compound?.main_image || '');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]); 

  const router = useRouter();
  const { toast } = useToast();

  const {
    register, handleSubmit, setValue, watch, formState: { errors },
  } = useForm<CompoundFormData>({
    resolver: zodResolver(compoundSchema),
    defaultValues: {
      name: compound?.name || '',
      developer: compound?.developer?.id,
      location: compound?.location?.id,
      description: compound?.description || '',
      delivery_date: compound?.delivery_date || '',
      // Ensure amenities are mapped correctly to IDs if they come as objects
      amenities: compound?.amenities?.map((a: any) => (typeof a === 'object' ? a.id : a)) || [],
      min_price: compound?.min_price ? Number(compound.min_price) : undefined,
	  min_area: compound?.min_area ? Number(compound.min_area) : undefined,
      max_installment_years: compound?.max_installment_years ? Number(compound.max_installment_years) : undefined,
      video_url: compound?.video_url || '',
    },
  });

  const watchedAmenities = watch('amenities') || [];

  const onSubmit = async (data: CompoundFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('developer', data.developer.toString());
      formData.append('location', data.location.toString());
      formData.append('description', data.description);
      
      if (data.delivery_date) formData.append('delivery_date', data.delivery_date);
      if (data.min_price) formData.append('min_price', data.min_price.toString());
      if (data.min_area) formData.append('min_area', data.min_area.toString());
      if (data.max_installment_years) formData.append('max_installment_years', data.max_installment_years.toString());
      if (data.video_url) formData.append('video_url', data.video_url);

      // Amenities: Append each ID separately
      if (data.amenities && data.amenities.length > 0) {
        data.amenities.forEach(id => formData.append('amenities', id.toString()));
      }

      if (mainImage instanceof File) {
        formData.append('main_image', mainImage);
      }

      galleryFiles.forEach((file) => {
        formData.append('uploaded_images', file);
      });

      if (compound) {
        await updateCompound(compound.id, formData);
        toast({ title: "Success", description: "Compound updated successfully" });
      } else {
        await createCompound(formData);
        toast({ title: "Success", description: "Compound created successfully" });
      }

      router.push('/admin/dashboard/compounds');
      router.refresh();

    } catch (error: any) {
      console.error("Submission Error:", error);
      // Attempt to show detailed server error
      const serverMessage = error.response?.data 
        ? JSON.stringify(error.response.data, null, 2) 
        : error.message || "Unknown error";
      
      toast({ 
        title: "Error Saving Compound", 
        description: serverMessage, 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Basic Info */}
        <Card>
          <CardHeader><CardTitle>Basic Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input {...register('name')} placeholder="Compound Name" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Developer *</Label>
              <Select value={watch('developer')?.toString()} onValueChange={(v) => setValue('developer', parseInt(v))}>
                <SelectTrigger><SelectValue placeholder="Select Developer" /></SelectTrigger>
                <SelectContent>
                  {developers.map(d => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.developer && <p className="text-red-500 text-sm">{errors.developer.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Location *</Label>
              <Select value={watch('location')?.toString()} onValueChange={(v) => setValue('location', parseInt(v))}>
                <SelectTrigger><SelectValue placeholder="Select Location" /></SelectTrigger>
                <SelectContent>
                  {locations.map(l => <SelectItem key={l.id} value={l.id.toString()}>{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader><CardTitle>Media</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Main Image</Label>
              <ImageUpload 
                currentImage={typeof mainImage === 'string' ? mainImage : undefined} 
                onUpload={(file) => setMainImage(file as File)} 
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Video className="w-4 h-4" /> Video URL (YouTube)</Label>
              <Input {...register('video_url')} placeholder="https://youtube.com/..." />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gallery Section */}
      <Card>
        <CardHeader>
          <CardTitle>Gallery Images</CardTitle>
          <CardDescription>Upload multiple images for the compound gallery</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {compound?.images && compound.images.length > 0 && (
            <div className="space-y-2">
              <Label>Existing Gallery Images</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {compound.images.map((img: any) => (
                  <div key={img.id} className="relative aspect-square rounded-md overflow-hidden border group">
                    <img src={img.image_url || img.image} alt="Gallery" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label>Add New Images</Label>
            <ImageUpload 
              multiple={true} 
              onUpload={(files) => {
                if (Array.isArray(files)) {
                  setGalleryFiles(prev => [...prev, ...files]);
                }
              }} 
            />
            {galleryFiles.length > 0 && (
              <p className="text-sm text-green-600 mt-2">
                {galleryFiles.length} new images selected ready to upload.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details & Amenities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <Card className="lg:col-span-2">
           <CardHeader><CardTitle>Description</CardTitle></CardHeader>
           <CardContent>
             <RichTextEditor value={watch('description')} onChange={(v) => setValue('description', v)} />
           </CardContent>
         </Card>

         <Card className="lg:col-span-1">
           <CardHeader><CardTitle>Details & Amenities</CardTitle></CardHeader>
           <CardContent className="space-y-4">
             <div className="grid grid-cols-2 gap-2">
                <div className='space-y-1'>
                    <Label>Start Price</Label>
                    <Input type="number" {...register('min_price')} />
                </div>
                <div className='space-y-1'>
                    <Label>Start Area (m²)</Label>
                    <Input type="number" {...register('min_area')} />
                </div>
             </div>
             <div className="space-y-1">
                <Label>Installments (Years)</Label>
                <Input type="number" {...register('max_installment_years')} />
             </div>
             <div className="space-y-1">
                <Label>Delivery Date</Label>
                <Input type="date" {...register('delivery_date')} />
             </div>
             <div className="space-y-2">
               <Label>Amenities</Label>
               <MultiSelect
                 options={amenities.map(a => ({ value: a.id, label: a.name }))}
                 selectedValues={watchedAmenities}
                 onChange={(vals) => setValue('amenities', vals)}
               />
             </div>
           </CardContent>
         </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
          {compound ? 'Update Compound' : 'Save Compound'}
        </Button>
      </div>
    </form>
  );
}