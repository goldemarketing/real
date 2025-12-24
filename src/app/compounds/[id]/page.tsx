import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Building, Calendar, Wallet, Banknote, CheckCircle2, Phone, MessageCircle, PlayCircle } from 'lucide-react';
import { getCompoundById } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getImageUrl, getPlaceholderImage } from '@/lib/image-helpers';

export default async function CompoundDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const compound = await getCompoundById(resolvedParams.id);

  if (!compound) {
    return notFound();
  }

  const imageUrl = getImageUrl(
    compound.main_image, 
    getPlaceholderImage('property')
  );

  const CONTACT_PHONE = "+201015670391";
  const WHATSAPP_NUMBER = "201015670391";

  return (
    <div className="min-h-screen bg-background pb-12">
      
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full bg-muted">
        <Image
          src={imageUrl}
          alt={compound.name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 py-8 text-white">
          <Badge className="mb-4 bg-primary text-primary-foreground hover:bg-primary/90">
            {compound.status || 'Under Construction'}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-2">{compound.name}</h1>
          <div className="flex items-center gap-2 text-lg opacity-90">
            <MapPin className="h-5 w-5" />
            <span>{compound.location?.name}</span>
            <span className="mx-2">•</span>
            <Building className="h-5 w-5" />
            <span>by {compound.developer?.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Key Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex flex-col items-center text-center">
                <Banknote className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm text-muted-foreground">Starting Price</span>
                <span className="font-bold text-lg">
                  {compound.min_price ? `${Number(compound.min_price).toLocaleString()} EGP` : 'Ask for Price'}
                </span>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex flex-col items-center text-center">
                <Wallet className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm text-muted-foreground">Installments</span>
                <span className="font-bold text-lg">
                  {compound.max_installment_years ? `Up to ${compound.max_installment_years} Years` : 'Cash / N.A'}
                </span>
              </div>

              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex flex-col items-center text-center">
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm text-muted-foreground">Delivery</span>
                <span className="font-bold text-lg">
                  {compound.delivery_date || 'Ready to Move'}
                </span>
              </div>
            </div>

            {/* About Section */}
            <div>
              <h2 className="text-2xl font-bold font-headline mb-4 border-b pb-2">About the Project</h2>
              <div 
                className="prose max-w-none text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: compound.description }} 
              />
            </div>

            {/* Amenities */}
            {compound.amenities && compound.amenities.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold font-headline mb-4 border-b pb-2">Amenities & Facilities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {compound.amenities.map((amenity: any) => (
                    <div key={amenity.id} className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="font-medium">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 👇👇 (1) قسم معرض الصور (Gallery Section) 👇👇 */}
            {compound.images && compound.images.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold font-headline mb-4 border-b pb-2">Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {compound.images.map((img: any, index: number) => (
                    <div key={img.id || index} className="relative aspect-video rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group border">
                      <Image
                        src={img.image_url || img.image} // استخدام الرابط الكامل
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 👇👇 (2) قسم الفيديو (Video Section) 👇👇 */}
            {compound.video_url && (
              <div>
                <h2 className="text-2xl font-bold font-headline mb-4 border-b pb-2 flex items-center gap-2">
                  <PlayCircle className="w-6 h-6 text-red-600" /> Project Video
                </h2>
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={compound.video_url.replace("watch?v=", "embed/")}
                    title="Project Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

          </div>

          {/* Sidebar / Contact */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold font-headline mb-2">Interested?</h3>
              <p className="text-muted-foreground mb-6">Contact us to get the latest brochure and unit availability.</p>
              
              <div className="space-y-3">
                <Link href={`tel:${CONTACT_PHONE}`} className="block w-full">
                  <Button className="w-full text-lg h-12 gap-2 shadow-md hover:shadow-lg transition-all">
                    <Phone className="h-5 w-5" />
                    Call Us Now
                  </Button>
                </Link>

                <Link 
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=I'm interested in ${compound.name}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block w-full"
                >
                  <Button variant="outline" className="w-full text-lg h-12 gap-2 text-green-600 border-green-200 hover:text-green-700 hover:bg-green-50">
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}