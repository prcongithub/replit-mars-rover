import { type Photo, type RoverName, type CameraType, type RoverStats } from "@shared/schema";

export async function fetchRoverPhotos(
  rover: RoverName, 
  sol: number = 1000, 
  camera: CameraType = 'all',
  page: number = 1
): Promise<{ photos: Photo[] }> {
  const params = new URLSearchParams({
    sol: sol.toString(),
    page: page.toString(),
  });

  if (camera !== 'all') {
    params.append('camera', camera);
  }

  const response = await fetch(`/api/photos/${rover}?${params}`);
  
  if (response.status === 429) {
    throw new Error('NASA API rate limit exceeded. Please wait a moment and try again.');
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch photos: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchRoverStats(): Promise<RoverStats> {
  const response = await fetch('/api/stats');
  
  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchRoverManifest(rover: RoverName) {
  const response = await fetch(`/api/manifests/${rover}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch rover manifest: ${response.statusText}`);
  }

  return response.json();
}
