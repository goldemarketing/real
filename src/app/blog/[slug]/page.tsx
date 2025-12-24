import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { BlogPostImage } from '@/components/blog-post-image'; // 👇 استدعاء المكون الجديد

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://4seasons-realestate.com';

const getValidImageUrl = (imagePath: string | null | undefined) => {
  if (!imagePath) return '/images/blog-placeholder.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  // تأكد إننا بنشيل /api/public لو موجودة عشان الصورة تظهر صح
  return `${API_BASE_URL.replace('/api/public', '')}${cleanPath}`;
};

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const postImageUrl = getValidImageUrl(post.cover_image || post.image);

  return (
    <article className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
      <Button variant="ghost" className="mb-8 pl-0 hover:pl-2 transition-all" asChild>
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Link>
      </Button>

      <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight font-headline">
        {post.title}
      </h1>

      <div className="flex items-center gap-6 text-muted-foreground mb-8 border-b pb-8">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{new Date(post.publish_date).toLocaleDateString()}</span>
        </div>
        {post.author && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="font-medium">
              {typeof post.author === 'object' ? post.author.name : 'Team'}
            </span>
          </div>
        )}
      </div>

      <div className="relative w-full h-[300px] md:h-[500px] mb-10 rounded-xl overflow-hidden shadow-lg border border-gray-100">
        {/* 👇 استخدام المكون الجديد بدلاً من Image مباشرة */}
        <BlogPostImage 
          src={postImageUrl} 
          alt={post.title} 
        />
      </div>

      <div 
        className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-headline prose-a:text-primary"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
    </article>
  );
}