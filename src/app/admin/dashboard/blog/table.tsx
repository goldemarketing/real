'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Eye, Edit } from 'lucide-react'; // ❌ شيلنا Trash2 عشان هنستخدم الزرار الجوكر
import { DataTable } from '@/components/dashboard/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlogPost, Author } from '@/lib/types';

// 👇 1. استدعاء الزرار الجوكر
import DeleteButton from "@/app/admin/dashboard/compounds/DeleteButton";

interface BlogPostsTableRow {
  id: string;
  title: string;
  author: string;
  status: JSX.Element;
  publish_date: string;
  actions: JSX.Element;
}

interface BlogPostsTableProps {
  data: BlogPost[];
  authors?: Author[];
}

const columns: ColumnDef<BlogPostsTableRow>[] = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'author', header: 'Author' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'publish_date', header: 'Published' },
  { accessorKey: 'actions', header: 'Actions' },
];

export function BlogPostsTable({ data }: BlogPostsTableProps) {
  
  // 👇 2. حماية: لو الداتا لسه مجتش، منرجعش حاجة تكسر الصفحة
  if (!data) {
    return <div className="p-4 text-center">No blog posts found.</div>;
  }

  const tableData: BlogPostsTableRow[] = data.map((post) => ({
    id: post.id.toString(),
    title: post.title,
    author: post.author?.name || 'N/A',
    status: (
      <Badge variant={post.status === 'Published' ? 'default' : 'secondary'}>
        {post.status}
      </Badge>
    ),
    publish_date: post.publish_date,
    actions: (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/dashboard/blog/${post.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/dashboard/blog/${post.id}/edit`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        
        {/* 👇 3. الزرار الجوكر (بيكلم API المقالات) */}
        {/* ملحوظة: تأكد من اسم الـ API في الباك إند */}
        {/* لو ممسحش معاك، جرب تغير endpointName لـ "posts" أو "blog" */}
        <DeleteButton 
            id={post.id.toString()} 
            endpointName="blog-posts" 
        />
        
      </div>
    ),
  }));

  return <DataTable columns={columns} data={tableData} />;
}