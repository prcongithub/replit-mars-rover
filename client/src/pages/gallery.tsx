import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, AlertCircle } from "lucide-react";
import { fetchRoverPhotos } from "@/lib/nasa-api";
import { type Photo, type RoverName, type CameraType } from "@shared/schema";

import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import FilterSection from "@/components/filter-section";
import ImageCard from "@/components/image-card";
import ImageModal from "@/components/image-modal";

export default function Gallery() {
  const [selectedRover, setSelectedRover] = useState<RoverName>('curiosity');
  const [selectedCamera, setSelectedCamera] = useState<CameraType>('all');
  const [selectedSol, setSelectedSol] = useState(1000);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['/api/photos', selectedRover, selectedSol, selectedCamera, page],
    queryFn: () => fetchRoverPhotos(selectedRover, selectedSol, selectedCamera, page),
  });

  // Update photos when data changes
  useEffect(() => {
    if (data?.photos) {
      if (page === 1) {
        setAllPhotos(data.photos);
      } else {
        setAllPhotos(prev => [...prev, ...data.photos]);
      }
    }
  }, [data, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
    setAllPhotos([]);
  }, [selectedRover, selectedCamera, selectedSol]);

  const handleImageClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const LoadingSkeleton = () => (
    <div className="gallery-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
          <Skeleton className="h-64 w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ErrorState = () => (
    <div className="text-center py-12">
      <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Images</h3>
      <p className="text-muted-foreground mb-4">
        {error instanceof Error ? error.message : 'Unable to fetch Mars rover images. Please try again.'}
      </p>
      <Button
        onClick={() => window.location.reload()}
        data-testid="button-retry"
      >
        Try Again
      </Button>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No Images Found</h3>
      <p className="text-muted-foreground">
        No images were found for the selected filters. Try adjusting your search criteria.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroSection />
        
        <FilterSection
          selectedRover={selectedRover}
          selectedCamera={selectedCamera}
          selectedSol={selectedSol}
          onRoverChange={setSelectedRover}
          onCameraChange={setSelectedCamera}
          onSolChange={setSelectedSol}
        />

        {isError ? (
          <ErrorState />
        ) : isLoading && page === 1 ? (
          <LoadingSkeleton />
        ) : allPhotos.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <section className="gallery-grid mb-8" data-testid="image-gallery">
              {allPhotos.map((photo) => (
                <ImageCard
                  key={photo.id}
                  photo={photo}
                  onClick={() => handleImageClick(photo)}
                />
              ))}
            </section>

            {data?.photos && data.photos.length > 0 && (
              <div className="text-center mt-12">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-8 py-4 font-medium inline-flex items-center space-x-2"
                  data-testid="button-load-more"
                >
                  <span>{isLoading ? 'Loading...' : 'Load More Images'}</span>
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <ImageModal
        photo={selectedPhoto}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">About the Mission</h3>
              <p className="text-sm text-muted-foreground">
                NASA's Mars rover missions have revolutionized our understanding of the Red Planet. 
                These robotic explorers continue to capture stunning images and conduct scientific research.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Data Source</h3>
              <p className="text-sm text-muted-foreground">
                Images sourced from NASA's Mars Rover Photos API. 
                All photos are public domain and available for educational and research purposes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <span className="sr-only">Twitter</span>
                  🐦
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <span className="sr-only">Facebook</span>
                  📘
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <span className="sr-only">Instagram</span>
                  📷
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 NASA Mars Rover Gallery. Powered by NASA's Open Data Initiative.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
