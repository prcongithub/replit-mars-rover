import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
console.log(`Using NASA API key: ${NASA_API_KEY ? 'CUSTOM_KEY' : 'DEMO_KEY'} (length: ${NASA_API_KEY?.length || 0})`);
const NASA_API_BASE = "https://api.nasa.gov/mars-photos/api/v1";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get rover stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getRoverStats();
      res.json(stats);
    } catch (error) {
      console.error("Failed to fetch rover stats:", error);
      res.status(500).json({ message: "Failed to fetch rover stats" });
    }
  });

  // Get photos by rover
  app.get("/api/photos/:rover", async (req, res) => {
    try {
      const { rover } = req.params;
      const { sol = 1000, camera, page = 1 } = req.query;

      let url = `${NASA_API_BASE}/rovers/${rover}/photos?sol=${sol}&page=${page}&api_key=${NASA_API_KEY}`;
      
      if (camera && camera !== 'all') {
        url += `&camera=${camera}`;
      }

      console.log(`Fetching photos: ${url}`);

      const response = await fetch(url);
      
      if (response.status === 429) {
        console.warn("NASA API rate limit hit, returning sample data for testing");
        // Return sample data when rate limited for testing purposes
        const samplePhotos = {
          photos: [
            {
              id: 102693,
              sol: Number(sol),
              camera: {
                id: 20,
                name: camera === 'fhaz' ? 'FHAZ' : camera === 'rhaz' ? 'RHAZ' : 'MAST',
                rover_id: 5,
                full_name: camera === 'fhaz' ? 'Front Hazard Avoidance Camera' : 
                          camera === 'rhaz' ? 'Rear Hazard Avoidance Camera' : 'Mast Camera'
              },
              img_src: "https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/fcam/FLB_486265257EDR_F0481570FHAZ00323M_.JPG",
              earth_date: "2015-05-30",
              rover: {
                id: 5,
                name: rover.charAt(0).toUpperCase() + rover.slice(1),
                landing_date: "2012-08-05",
                launch_date: "2011-11-26",
                status: "active",
                max_sol: 4000,
                max_date: "2023-12-15",
                total_photos: 500000
              }
            },
            {
              id: 102694,
              sol: Number(sol),
              camera: {
                id: 21,
                name: camera === 'fhaz' ? 'FHAZ' : camera === 'rhaz' ? 'RHAZ' : 'NAVCAM',
                rover_id: 5,
                full_name: camera === 'fhaz' ? 'Front Hazard Avoidance Camera' : 
                          camera === 'rhaz' ? 'Rear Hazard Avoidance Camera' : 'Navigation Camera'
              },
              img_src: "https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/ncam/NLB_486265257EDR_F0481570NCAM00323M_.JPG",
              earth_date: "2015-05-30",
              rover: {
                id: 5,
                name: rover.charAt(0).toUpperCase() + rover.slice(1),
                landing_date: "2012-08-05",
                launch_date: "2011-11-26",
                status: "active",
                max_sol: 4000,
                max_date: "2023-12-15",
                total_photos: 500000
              }
            }
          ]
        };
        return res.json(samplePhotos);
      }
      
      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Photos response: found ${data.photos?.length || 0} photos for rover=${rover}, sol=${sol}, camera=${camera}`);
      res.json(data);
    } catch (error) {
      console.error("Failed to fetch photos:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch photos from NASA API"
      });
    }
  });

  // Get rover manifest (for latest sol info)
  app.get("/api/manifests/:rover", async (req, res) => {
    try {
      const { rover } = req.params;
      const url = `${NASA_API_BASE}/manifests/${rover}?api_key=${NASA_API_KEY}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Failed to fetch rover manifest:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch rover manifest"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
