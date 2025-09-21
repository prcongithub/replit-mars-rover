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
    let errorMessage = `Failed to fetch photos: ${response.statusText}`;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      }
    } catch (e) {
      // If JSON parsing fails, use default error message
    }
    throw new Error(errorMessage);
  }

  try {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format from server');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Failed to parse server response. Please try again.');
  }
}

export async function fetchRoverStats(): Promise<RoverStats> {
  const response = await fetch('/api/stats');

  if (!response.ok) {
    let errorMessage = `Failed to fetch stats: ${response.statusText}`;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      }
    } catch (e) {
      // If JSON parsing fails, use default error message
    }
    throw new Error(errorMessage);
  }

  try {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format from server');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Failed to parse server response. Please try again.');
  }
}

export async function fetchRoverManifest(rover: RoverName) {
  const response = await fetch(`/api/manifests/${rover}`);

  if (!response.ok) {
    let errorMessage = `Failed to fetch rover manifest: ${response.statusText}`;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      }
    } catch (e) {
      // If JSON parsing fails, use default error message
    }
    throw new Error(errorMessage);
  }

  try {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format from server');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Failed to parse server response. Please try again.');
  }
}
