"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { BlogPostsTable } from './table';
import { getAdminBlogPosts } from '@/lib/api'; //
import { BlogPost } from '@/lib/types'; 

export default function BlogPage() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('page_size')) || 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. محاولة جلب البيانات
        const data = await getAdminBlogPosts({
          page,
          page_size: pageSize,
        });

        console.log("Blog Data Received:", data); // 👈 بص في الكونسول (F12) وشوف ده هيطبع إيه

        // 2. تحديث الحالة
        if (data && data.results) {
          setPosts(data.results);
          setCount(data.count || 0);
        } else {
          setPosts([]);
          setCount(0);
        }
        
      } catch (err: any) {
        console.error("Failed to load blog posts:", err);
        setError(err.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog content
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/blog/new">
            Add New Post
          </Link>
        </Button>
      </div>

      {/* عرض رسالة الخطأ لو حصلت مشكلة */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
          Error loading posts: {error}. Please check console (F12) for details.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Posts ({count})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading posts...</div>
          ) : posts.length === 0 ? (
             <div className="py-8 text-center text-muted-foreground">
                No posts found. Try adding a new one!
             </div>
          ) : (
            <BlogPostsTable data={posts} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}