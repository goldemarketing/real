import { getBlogPosts, getAuthorById } from '@/lib/api';
import type { BlogPost, Author } from '@/lib/types';
import { PostCard } from '@/components/post-card';

// تحديث الصفحة كل 60 ثانية
export const revalidate = 60; 

export default async function BlogPage() {
  // 1. هات المقالات المنشورة
  const postsData = await getBlogPosts({ status: 'Published' });
  
  if (!postsData || !postsData.results || postsData.results.length === 0) {
    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <h2 className="text-2xl font-bold mb-2">No blog posts yet</h2>
            <p className="text-muted-foreground">Check back soon for market updates.</p>
        </div>
    );
  }

  // 2. تجهيز البيانات (الحل هنا 👇)
  const postsWithAuthors = await Promise.all(
    postsData.results.map(async (post: BlogPost) => {
      let author: Author | null = null;
      
      if (post.author) {
        // 🛑 التعديل الذكي:
        // لو author عبارة عن object، يبقى الداتا جات جاهزة، استخدمها علطول
        if (typeof post.author === 'object') {
            author = post.author as unknown as Author;
        } 
        // لو author عبارة عن رقم أو نص، يبقى محتاجين نجيبه من الـ API
        else {
            author = await getAuthorById((post.author as any).toString());
        }
      }

      return { post, author };
    })
  );

  return (
    <div className="container mx-auto py-12 px-4 md:py-20">
      <div className="text-center mb-16">
        <div className="py-1">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
            Real Estate Insights
          </h1>
        </div>
        <div className="py-1">
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your source for the latest news, tips, and trends in the Egyptian property market.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {postsWithAuthors.map(({ post, author }) => (
          <PostCard key={post.id} post={post} author={author} />
        ))}
      </div>
    </div>
  );
}