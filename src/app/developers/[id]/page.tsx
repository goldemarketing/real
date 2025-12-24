import { Suspense } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getDeveloperById, getCompounds } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Building, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// دالة لجلب البيانات
async function getDeveloperData(id: string) {
  const developer = await getDeveloperById(id);
  // هات كمان المشروعات الخاصة بالمطور ده
  const compoundsData = await getCompounds({ developer: id });
  return { developer, compounds: compoundsData.results };
}

export default async function DeveloperDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { developer, compounds } = await getDeveloperData(resolvedParams.id);

  if (!developer) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header Section */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Logo */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl shadow-sm border p-4 flex items-center justify-center overflow-hidden">
              {developer.logo ? (
                <Image
                  src={developer.logo}
                  alt={developer.name}
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              ) : (
                <Building className="w-16 h-16 text-muted-foreground/30" />
              )}
            </div>
            
            {/* Name & Stats */}
            <div className="text-center md:text-left space-y-4 flex-1">
              <h1 className="text-3xl md:text-4xl font-bold font-headline">{developer.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  <span>{compounds.length} Projects</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-12">
        
        {/* Description */}
        {developer.description && (
          <section>
            <h2 className="text-2xl font-bold font-headline mb-4">About {developer.name}</h2>
            <div 
              className="prose max-w-none text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: developer.description }} 
            />
          </section>
        )}

        {/* Developer's Projects */}
        <section>
          <h2 className="text-2xl font-bold font-headline mb-6">Projects by {developer.name}</h2>
          
          {compounds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {compounds.map((compound) => (
                <Link key={compound.id} href={`/compounds/${compound.id}`} className="group">
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:border-primary/50">
                    <div className="relative h-48 w-full bg-muted">
                      {compound.main_image ? (
                        <Image
                          src={compound.main_image}
                          alt={compound.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Building className="w-10 h-10 text-muted-foreground/20" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                          {compound.status}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {compound.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{typeof compound.location === 'object' ? compound.location?.name : 'Location'}</span>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="text-sm font-semibold">
                          {compound.min_price ? `${Number(compound.min_price).toLocaleString()} EGP` : 'Ask for Price'}
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-xl bg-muted/20">
              <p className="text-muted-foreground">No projects listed for this developer yet.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}