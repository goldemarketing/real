import { BlogPostEditClient } from '../../blog-post-edit-client';

// 👇 1. تعديل النوع ليقبل Promise
interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  // 👇 2. لازم نعمل await هنا الأول
  const resolvedParams = await params;

  // 👇 3. نستخدم المتغير الجديد
  return <BlogPostEditClient id={resolvedParams.id} />;
}