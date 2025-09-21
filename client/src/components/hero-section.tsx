import { useQuery } from "@tanstack/react-query";
import { fetchRoverStats } from "@/lib/nasa-api";
import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSection() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: fetchRoverStats,
  });

  return (
    <section className="text-center mb-12 fade-in">
      <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
        Explore Mars Through
        <span className="text-primary block">Rover Eyes</span>
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
        Discover the Red Planet through stunning images captured by NASA's Mars rovers. 
        Journey across alien landscapes and witness the wonder of space exploration.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
        <div className="bg-card border border-border rounded-lg p-6">
          {isLoading ? (
            <Skeleton className="h-8 w-16 mx-auto mb-2" />
          ) : (
            <div className="text-3xl font-bold text-primary" data-testid="stat-total-photos">
              {stats?.totalPhotos.toLocaleString() || '0'}
            </div>
          )}
          <div className="text-sm text-muted-foreground">Total Photos</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          {isLoading ? (
            <Skeleton className="h-8 w-16 mx-auto mb-2" />
          ) : (
            <div className="text-3xl font-bold text-accent" data-testid="stat-active-sol">
              {stats?.activeSol.toLocaleString() || '0'}
            </div>
          )}
          <div className="text-sm text-muted-foreground">Current Sol</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          {isLoading ? (
            <Skeleton className="h-8 w-16 mx-auto mb-2" />
          ) : (
            <div className="text-3xl font-bold text-green-400" data-testid="stat-active-rovers">
              {stats?.activeRovers || '0'}
            </div>
          )}
          <div className="text-sm text-muted-foreground">Active Rovers</div>
        </div>
      </div>
    </section>
  );
}
