'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, Calendar } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { BlogPost, Author } from '@/lib/types';

// 👇 رابط السيرفر ورابط الصورة الاحتياطية الثابت
const DOMAIN_URL = 'https://4seasons-realestate.com';
const PLACEHOLDER_URL = 'https://4seasons-realestate.com/images/blog-placeholder.jpg';

const getValidImageUrl = (imagePath: string | null | undefined) => {
  if (!imagePath) return PLACEHOLDER_URL; // لو مفيش صورة، رجع الرابط ده
  
  if (imagePath.startsWith('http')) return imagePath;

  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${DOMAIN_URL}${cleanPath}`;
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

interface PostCardProps {
  post: BlogPost;
  author: Author | null;
}

export function PostCard({ post, author }: PostCardProps) {
  const authorName = author?.name || 'Real Estate Team';
  const authorNameFallback = authorName.split(' ').map(n => n[0]).join('').substring(0, 2);
  const authorImageUrl = author?.picture ? getValidImageUrl(author.picture) : null;
  const postImageUrl = getValidImageUrl(post.cover_image || post.image);

  return (
    <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
          <Link href={`/blog/${post.slug}`} className="block overflow-hidden relative h-56 w-full bg-gray-100">
                <img
                    src={postImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      // لو الصورة الأصلية فشلت، حط رابط الصورة الاحتياطية اللي شغال معاك
                      e.currentTarget.src = PLACEHOLDER_URL;
                    }}
                />
          </Link>
      </CardHeader>
      
      <CardContent className="p-6 flex-grow">
        <CardTitle className="font-headline text-xl mb-3 line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {post.excerpt}
        </p>
      </CardContent>

      <CardFooter className="p-6 bg-secondary/10 flex flex-col items-start gap-4 mt-auto border-t">
        <div className="flex items-center gap-3 w-full">
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            {authorImageUrl && <AvatarImage src={authorImageUrl} alt={authorName} />}
            <AvatarFallback>{authorNameFallback}</AvatarFallback>
          </Avatar>
          <div>
              <p className="font-semibold text-sm">{authorName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(post.publish_date)}</span>
              </div>
          </div>
        </div>

        <Link 
            href={`/blog/${post.slug}`} 
            className={cn(buttonVariants({ variant: "outline" }), "w-full justify-between group")}
        >
            Read Article 
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1"/>
        </Link>
      </CardFooter>
    </Card>
  );
}