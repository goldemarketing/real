import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPostById } from '@/lib/api'; //
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Edit, ImageIcon } from 'lucide-react';

// رابط السيرفر
const DOMAIN_URL = 'https://4seasons-realestate.com';

interface BlogPostDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPostDetailsPage({ params }: BlogPostDetailsPageProps) {
  const { id } = await params;
  
  // بنجيب البوست بالـ ID
  const post = await getBlogPostById(id, true);

  if (!post) {
    notFound();
  }

  // تجهيز رابط الصورة
  let imageUrl = null;
  // بنشيك على image (الاسم الجديد) أو cover_image (القديم)
  const rawPath = post.image || post.cover_image;
  
  if (rawPath) {
    if (rawPath.startsWith('http')) {
        imageUrl = rawPath;
    } else {
        const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
        imageUrl = `${DOMAIN_URL}${cleanPath}`;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/dashboard/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog Posts
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Post Details</h1>
        </div>
        <Button asChild>
          <Link href={`/admin/dashboard/blog/${post.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Post
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          
          {/* 👇 قسم عرض الصورة (كان ناقص عندك) 👇 */}
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" /> Featured Image
                </CardTitle>
            </CardHeader>
            <CardContent>
                {imageUrl ? (
                    <div className="relative w-full h-64 rounded-md overflow-hidden border bg-gray-100">
                        {/* استخدام img مباشرة لضمان العرض */}
                        <img 
                            src={imageUrl} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-32 bg-gray-50 border-2 border-dashed rounded-md text-muted-foreground">
                        No featured image uploaded
                    </div>
                )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">{post.title}</CardTitle>
                </div>
                <Badge variant={post.status === 'Published' ? 'default' : 'secondary'}>
                  {post.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground border-b pb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Author: <span className="font-medium text-foreground">{post.author?.name || 'Unknown'}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Published: <span className="font-medium text-foreground">{new Date(post.publish_date).toLocaleDateString()}</span></span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Excerpt</h3>
                <p className="text-muted-foreground bg-gray-50 p-3 rounded-md border">
                  {post.excerpt}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Content</h3>
                <div 
                    className="prose prose-sm max-w-none border p-4 rounded-md"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Info</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground block mb-1">Slug</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded block overflow-hidden text-ellipsis">
                    {post.slug}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}