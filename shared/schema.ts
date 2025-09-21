import { z } from "zod";

export const cameraSchema = z.object({
  id: z.number(),
  name: z.string(),
  rover_id: z.number(),
  full_name: z.string(),
});

export const roverSchema = z.object({
  id: z.number(),
  name: z.string(),
  landing_date: z.string(),
  launch_date: z.string(),
  status: z.string(),
  max_sol: z.number(),
  max_date: z.string(),
  total_photos: z.number(),
});

export const photoSchema = z.object({
  id: z.number(),
  sol: z.number(),
  camera: cameraSchema,
  img_src: z.string(),
  earth_date: z.string(),
  rover: roverSchema,
});

export const marsRoverPhotosResponseSchema = z.object({
  photos: z.array(photoSchema),
});

export const roverStatsSchema = z.object({
  totalPhotos: z.number(),
  activeSol: z.number(),
  activeRovers: z.number(),
});

export type Camera = z.infer<typeof cameraSchema>;
export type Rover = z.infer<typeof roverSchema>;
export type Photo = z.infer<typeof photoSchema>;
export type MarsRoverPhotosResponse = z.infer<typeof marsRoverPhotosResponseSchema>;
export type RoverStats = z.infer<typeof roverStatsSchema>;

export const ROVER_NAMES = ['curiosity', 'opportunity', 'spirit'] as const;
export type RoverName = typeof ROVER_NAMES[number];

export const CAMERA_TYPES = {
  all: 'All Cameras',
  fhaz: 'Front Hazard Avoidance',
  rhaz: 'Rear Hazard Avoidance',
  mast: 'Mast Camera',
  chemcam: 'Chemistry and Camera',
  mahli: 'Hand Lens Imager',
  mardi: 'Descent Imager',
  navcam: 'Navigation Camera',
  pancam: 'Panoramic Camera',
} as const;

export type CameraType = keyof typeof CAMERA_TYPES;
