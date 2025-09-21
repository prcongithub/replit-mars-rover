import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin } from "lucide-react";
import { type Photo } from "@shared/schema";

interface ImageCardProps {
  photo: Photo;
  onClick: () => void;
}

export default function ImageCard({ photo, onClick }: ImageCardProps) {
  const getCameraBadgeColor = (cameraName: string) => {
    switch (cameraName.toLowerCase()) {
      case 'fhaz':
      case 'rhaz':
        return 'bg-primary/20 text-primary';
      case 'pancam':
      case 'navcam':
        return 'bg-accent/20 text-accent';
      case 'mast':
      case 'chemcam':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-secondary/20 text-secondary-foreground';
    }
  };

  return (
    <Card 
      className="image-card cursor-pointer overflow-hidden border-border"
      onClick={onClick}
      data-testid={`card-photo-${photo.id}`}
    >
      <div className="relative">
        <img
          src={photo.img_src}
          alt={`Mars landscape captured by ${photo.rover.name} rover`}
          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground" data-testid={`text-rover-${photo.rover.name.toLowerCase()}`}>
            {photo.rover.name}
          </h3>
          <Badge className={`text-xs px-2 py-1 ${getCameraBadgeColor(photo.camera.name)}`}>
            {photo.camera.name}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3" data-testid={`text-date-${photo.id}`}>
          Sol {photo.sol} • {photo.earth_date}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center">
            <Camera className="mr-1 h-3 w-3" />
            <span className="truncate" title={photo.camera.full_name}>
              {photo.camera.full_name}
            </span>
          </span>
          <span className="flex items-center">
            <MapPin className="mr-1 h-3 w-3" />
            Mars
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
