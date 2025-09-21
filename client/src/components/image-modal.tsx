import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share, Camera, MapPin, Calendar, Cpu } from "lucide-react";
import { type Photo } from "@shared/schema";

interface ImageModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageModal({ photo, isOpen, onClose }: ImageModalProps) {
  if (!photo) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.img_src;
    link.download = `mars-rover-${photo.rover.name}-sol-${photo.sol}-${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Mars Rover Image - ${photo.rover.name}`,
          text: `Check out this image from Mars captured by the ${photo.rover.name} rover on Sol ${photo.sol}`,
          url: photo.img_src,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(photo.img_src);
    }
  };

  const getCameraDescription = (cameraName: string, fullName: string) => {
    const descriptions: Record<string, string> = {
      'FHAZ': 'Front Hazard Avoidance Camera - Used for navigation and obstacle detection during rover movement.',
      'RHAZ': 'Rear Hazard Avoidance Camera - Monitors the area behind the rover during movement.',
      'MAST': 'Mast Camera - High-resolution imaging system for detailed geological analysis.',
      'PANCAM': 'Panoramic Camera - Captures wide-angle views of the Martian landscape.',
      'NAVCAM': 'Navigation Camera - Provides stereo imaging for navigation planning.',
      'CHEMCAM': 'Chemistry and Camera Complex - Analyzes rock and soil composition.',
      'MAHLI': 'Mars Hand Lens Imager - Close-up imaging of rocks and soil.',
      'MARDI': 'Mars Descent Imager - Captured images during landing sequence.',
    };
    return descriptions[cameraName] || `${fullName} - Advanced imaging system for Mars exploration.`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="p-6 space-y-4">
            <DialogHeader>
              <DialogTitle data-testid="modal-title">
                {photo.rover.name} Rover Image
              </DialogTitle>
            </DialogHeader>
            
            <img
              src={photo.img_src}
              alt={`Mars landscape captured by ${photo.rover.name} rover`}
              className="w-full h-auto rounded-lg"
              data-testid="modal-image"
            />
            
            <div className="flex justify-between items-center">
              <Button
                onClick={handleDownload}
                variant="secondary"
                data-testid="button-download"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                onClick={handleShare}
                className="bg-accent hover:bg-accent/90"
                data-testid="button-share"
              >
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-6 bg-muted/10">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Mission Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center">
                    <Cpu className="mr-2 h-4 w-4" />
                    Rover
                  </span>
                  <span className="text-foreground font-medium" data-testid="modal-rover">
                    {photo.rover.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Sol (Mars Day)
                  </span>
                  <span className="text-foreground font-medium" data-testid="modal-sol">
                    {photo.sol}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Earth Date
                  </span>
                  <span className="text-foreground font-medium" data-testid="modal-earth-date">
                    {photo.earth_date}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center">
                    <Camera className="mr-2 h-4 w-4" />
                    Camera
                  </span>
                  <Badge variant="outline" data-testid="modal-camera">
                    {photo.camera.name}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Camera Information</h4>
              <div className="bg-muted/20 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground" data-testid="modal-camera-description">
                  {getCameraDescription(photo.camera.name, photo.camera.full_name)}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">Mission Status</h4>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-foreground">
                  {photo.rover.status === 'active' ? 'Rover Active' : 'Mission Complete'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
