import { type RoverStats } from "@shared/schema";

export interface IStorage {
  getRoverStats(): Promise<RoverStats>;
}

export class MemStorage implements IStorage {
  async getRoverStats(): Promise<RoverStats> {
    // Return basic stats - in a real app this might be cached or computed
    return {
      totalPhotos: 47832,
      activeSol: 4127,
      activeRovers: 3,
    };
  }
}

export const storage = new MemStorage();
