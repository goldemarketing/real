'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { BlogPost, Author } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/dashboard/image-upload';
import { RichTextEditor } from '@/components/dashboard/rich-text-editor';
import { createBlogPost, updateBlogPost } from '@/lib/api';
import { getImageUrl } from '@/lib/image-helpers';
import { Loader2, Save, X } from 'lucide-react';

// ... (نفس الـ Schema والكود المساعد) ...
const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.number().min(1, 'Author is required'),
  status: z.enum(['Published', 'Draft']),
  publish_date: z.string().optional(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

interface BlogFormProps {
  post?: BlogPost;
  authors: Author[];
}

const extractMediaPath = (value: string | null | undefined): string => {
  if (!value) return '';
  try {
    if (value.startsWith('http://') || value.startsWith('https://')) {
      const parsed = new URL(value);
      return parsed.pathname || '';
    }
  } catch (error) {}
  return value.startsWith('/') ? value : `/${value}`;
};

export function BlogForm({ post, authors }: BlogFormProps) {
  const initialImagePath = useMemo(() => extractMediaPath(post?.image), [post?.image]);
  const initialPreview = useMemo(() => (post?.image ? getImageUrl(post.image) : null), [post?.image]);

  const [isLoading, setIsLoading] = useState(false);
  // هنستخدم imageFile عشان نخزن الملف الحقيقي
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialPreview);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      author: post?.author?.id,
      status: post?.status || 'Draft',
      publish_date: post?.publish_date || '',
    },
  });

  const onSubmit = async (data: BlogPostFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { author, ...rest } = data;
      
      const formData = {
        ...rest,
        // 👇 هنا بنبعت الملف (File) لو موجود، عشان السيرفر يقبله
        image: imageFile, 
        author: author ?? null,
      };

      console.log("Submitting Data:", formData);

      if (post) {
        await updateBlogPost(Number(post.id), formData as any);
      } else {
        await createBlogPost(formData as any);
      }

      router.push('/admin/dashboard/blog');
    } catch (error) {
      console.error("Submit Error:", error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save blog post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the basic details for the blog post</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" {...register('title')} placeholder="Enter post title" />
              {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea id="excerpt" {...register('excerpt')} placeholder="Brief description" rows={3} />
              {errors.excerpt && <p className="text-sm text-red-600">{errors.excerpt.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Select value={watch('author')?.toString()} onValueChange={(value) => setValue('author', parseInt(value))}>
                <SelectTrigger><SelectValue placeholder="Select an author" /></SelectTrigger>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.id.toString()}>{author.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.author && <p className="text-sm text-red-600">{errors.author.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={watch('status')} onValueChange={(value: 'Published' | 'Draft') => setValue('status', value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="publish_date">Publish Date</Label>
                <Input id="publish_date" type="date" {...register('publish_date')} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Featured Image</CardTitle>
            <CardDescription>Upload a featured image</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              currentImage={imagePreview || undefined}
              type="blog"
              // 👇 بنوقف الرفع التلقائي عشان نمسك الملف ونبعته مع الفورم
              autoUpload={false} 
              // 👇 بنستخدم onFileSelect عشان ناخد الملف ونحطه في الـ state
              onFileSelect={(file, previewUrl) => {
                setImageFile(file); // مسكنا الملف!
                setImagePreview(previewUrl);
              }}
              // 👇 دالة وهمية عشان نرضي المكون وميضربش Error
              onUpload={() => {}}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>Write the full content</CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            value={watch('content')}
            onChange={(value) => setValue('content', value)}
            placeholder="Write your blog post content here..."
          />
          {errors.content && <p className="text-sm text-red-600 mt-2">{errors.content.message}</p>}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          <X className="h-4 w-4 mr-2" /> Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {post ? 'Update' : 'Create'} Post
        </Button>
      </div>
    </form>
  );
}