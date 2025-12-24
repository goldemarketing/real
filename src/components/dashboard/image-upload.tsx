'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, Trash, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  currentImage?: string;       // للصور المفردة (رابط)
  onUpload: (files: File | File[]) => void; // يرجع ملف واحد أو قائمة
  type?: "location" | "developer" | "compound" | "author-image" | "blog" | "property-main";
  multiple?: boolean;          // 👇 خاصية جديدة عشان الجاليري
  autoUpload?: boolean;
onFileSelect?: (file: File, preview: string) => void;
}

export function ImageUpload({ currentImage, onUpload, multiple = false }: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (currentImage && !multiple) {
      setPreviews([currentImage]);
    }
  }, [currentImage, multiple]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // إنشاء روابط للمعاينة
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    
    if (multiple) {
      setPreviews(prev => [...prev, ...newPreviews]);
      onUpload(acceptedFiles); // نبعت القائمة كلها
    } else {
      setPreviews([newPreviews[0]]);
      onUpload(acceptedFiles[0]); // نبعت ملف واحد
    }
  }, [onUpload, multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
    maxFiles: multiple ? 20 : 1, // لو جاليري اسمح بـ 20 صورة
    multiple: multiple
  });

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    // ملحوظة: في الحالة دي بنمسح البريفيو بس، لكن المسح الفعلي من الفورم بيتم هناك
  };

  return (
    <div className="space-y-4 w-full">
      {/* منطقة الرفع */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 hover:bg-gray-50 transition cursor-pointer
          flex flex-col items-center justify-center gap-3 min-h-[150px]
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        `}
      >
        <input {...getInputProps()} />
        <div className="p-3 bg-gray-100 rounded-full">
          {multiple ? <UploadCloud className="h-6 w-6" /> : <ImagePlus className="h-6 w-6" />}
        </div>
        <div className="text-center">
          <p className="font-medium text-sm text-gray-700">
            {multiple ? "Click or drag images for Gallery" : "Click to upload Main Image"}
          </p>
          <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF</p>
        </div>
      </div>

      {/* عرض الصور المرفوعة (Preview) */}
      {previews.length > 0 && (
        <div className={`grid gap-4 ${multiple ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1'}`}>
          {previews.map((src, index) => (
            <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border">
              <img src={src} alt="Preview" className="w-full h-full object-cover" />
              {!currentImage && ( // زر الحذف يظهر فقط للصور الجديدة المرفوعة حالياً
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}