import { Suspense } from 'react';
import { getTestimonials } from '@/lib/api';
import { DataTable } from '@/components/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { columns } from './columns'; // 👇 استيراد الأعمدة من الملف الجديد

interface TestimonialsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function TestimonialsPage({ searchParams }: TestimonialsPageProps) {
  // Fetch data
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const pageSize = searchParams.page_size ? parseInt(searchParams.page_size as string) : 10;

  const testimonialsData = await getTestimonials({
    page,
    page_size: pageSize,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground">
            Manage customer testimonials
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Testimonial
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Testimonials ({testimonialsData.count})</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <DataTable
              // 👇 بنبعت الداتا الخام، والأعمدة هي اللي هتظبط شكلها
              data={testimonialsData.results} 
              columns={columns}
              pagination={{
                currentPage: page,
                totalPages: Math.ceil(testimonialsData.count / pageSize),
                totalCount: testimonialsData.count,
                pageSize,
                baseUrl: '/admin/dashboard/settings/testimonials',
                showPageSizeSelector: true,
              }}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}