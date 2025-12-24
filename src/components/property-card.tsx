import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Bath, AreaChart, Star, Rocket, Building2 } from "lucide-react";
import { getImageUrl, getPlaceholderImage, formatPrice, getLocationName } from "@/lib/image-helpers";

interface PropertyCardProps {
  id: number;
  title: string;
  image?: string;
  main_image?: string; 
  imageHint?: string;
  price: string | number;
  beds?: number;
  bedrooms?: number; 
  baths?: number;
  bathrooms?: number; 
  area: number;
  location: string | { name: string }; 
  property_type?: string; 
  is_featured?: boolean; 
  is_new_launch?: boolean; 
  compound?: { name: string } | null; 
  developer?: { name: string } | null; 
}

export function PropertyCard(props: PropertyCardProps) {
  const imageUrl = getImageUrl(
    props.main_image || props.image,
    getPlaceholderImage('property')
  );
  
  const beds = props.bedrooms || props.beds || 0;
  const baths = props.bathrooms || props.baths || 0;
  const locationName = getLocationName(props.location);
  const formattedPrice = formatPrice(props.price);
  
  // 1. Determine if this is a Project (Compound) or a Unit
  const isProject = props.property_type === 'Project' || (beds === 0 && baths === 0 && props.area === 0);

  // 2. Set the correct link based on type
  const href = isProject ? `/compounds/${props.id}` : `/properties/${props.id}`;

  return (
    <Link href={href} className="group h-full flex">
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col w-full group-hover:border-primary">
        <CardHeader className="p-0 relative">
          <div className="relative h-56 w-full">
            <Image
              src={imageUrl}
              alt={`Image of ${props.title}`}
              data-ai-hint={props.imageHint || 'property image'}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          
          {/* Feature badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            {props.is_featured && (
              <Badge variant="secondary" className="text-xs bg-yellow-500 text-white border-none">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {props.is_new_launch && (
              <Badge variant="default" className="text-xs bg-blue-600 text-white border-none">
                <Rocket className="h-3 w-3 mr-1" />
                New Launch
              </Badge>
            )}
            {/* Tag specifically for Projects */}
            {isProject && (
              <Badge variant="default" className="text-xs bg-primary text-white border-none">
                <Building2 className="h-3 w-3 mr-1" />
                Project
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-4 flex-grow">
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="w-fit">{locationName}</Badge>
                {!isProject && props.property_type && (
                <Badge variant="outline" className="w-fit text-xs">{props.property_type}</Badge>
                )}
            </div>
          </div>
          
          <CardTitle className="text-xl font-bold font-headline mb-2 line-clamp-2">{props.title}</CardTitle>
          
          {/* Show Developer Info */}
          {(props.compound || props.developer) && (
            <div className="text-sm text-muted-foreground mb-3">
              {props.compound && !isProject && (
                <p className="truncate">Compound: {props.compound.name}</p>
              )}
              {props.developer && (
                <p className="truncate font-medium text-primary">By: {props.developer.name}</p>
              )}
            </div>
          )}
          
          <p className="text-xl font-bold text-primary mb-1">
             {/* If it's a project with no price set, show "Call for Price" logic handled in parent or here */}
             {String(props.price).includes('NaN') || props.price === "" ? "Call for Price" : formattedPrice}
          </p>
          {isProject && <p className="text-xs text-muted-foreground">Starting Price</p>}

        </CardContent>
        
        {/* Only show Beds/Baths/Area footer if it is NOT a project */}
        {!isProject && (
            <CardFooter className="p-4 bg-primary/5 flex justify-between text-sm text-muted-foreground mt-auto border-t border-primary/10">
            <div className="flex items-center gap-1">
                <BedDouble className="w-4 h-4 text-primary" />
                <span>{beds} Beds</span>
            </div>
            <div className="flex items-center gap-1">
                <Bath className="w-4 h-4 text-primary" />
                <span>{baths} Baths</span>
            </div>
            <div className="flex items-center gap-1">
                <AreaChart className="w-4 h-4 text-primary" />
                <span>{props.area} m²</span>
            </div>
            </CardFooter>
        )}

        {/* For Projects, we can show a "View Details" footer or leave empty */}
        {isProject && (
             <CardFooter className="p-4 bg-primary/5 flex justify-center text-sm font-semibold text-primary mt-auto border-t border-primary/10">
                View Project Details
             </CardFooter>
        )}
      </Card>
    </Link>
  );
}