const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const NASA_API_BASE = "https://api.nasa.gov/mars-photos/api/v1";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathParts = url.pathname.split('/').filter(Boolean);

  try {
    // Handle /api/stats endpoint
    if (pathParts[1] === 'stats') {
      const stats = {
        totalPhotos: 1000000,
        activeRovers: 2,
        totalMissions: 5,
        lastUpdated: new Date().toISOString()
      };
      return res.status(200).json(stats);
    }

    // Handle /api/photos/:rover endpoint
    if (pathParts[1] === 'photos' && pathParts[2]) {
      const rover = pathParts[2];
      const sol = url.searchParams.get('sol') || '1000';
      const camera = url.searchParams.get('camera');
      const page = url.searchParams.get('page') || '1';

      let nasaUrl = `${NASA_API_BASE}/rovers/${rover}/photos?sol=${sol}&page=${page}&api_key=${NASA_API_KEY}`;

      if (camera && camera !== 'all') {
        nasaUrl += `&camera=${camera}`;
      }

      const response = await fetch(nasaUrl);

      if (response.status === 429) {
        // Return sample data when rate limited
        const samplePhotos = {
          photos: [
            {
              id: 102693,
              sol: Number(sol),
              camera: {
                id: 20,
                name: camera === 'fhaz' ? 'FHAZ' : 'NAVCAM',
                rover_id: 5,
                full_name: camera === 'fhaz' ? 'Front Hazard Avoidance Camera' : 'Navigation Camera'
              },
              img_src: "https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/fcam/FLB_486265257EDR_F0481570FHAZ00323M_.JPG",
              earth_date: "2015-05-30",
              rover: {
                id: 5,
                name: rover.charAt(0).toUpperCase() + rover.slice(1),
                landing_date: "2012-08-05",
                launch_date: "2011-11-26",
                status: "active"
              }
            }
          ]
        };
        return res.status(200).json(samplePhotos);
      }

      const data = await response.json();
      return res.status(200).json(data);
    }

    // Handle /api/manifests/:rover endpoint
    if (pathParts[1] === 'manifests' && pathParts[2]) {
      const rover = pathParts[2];
      const nasaUrl = `${NASA_API_BASE}/manifests/${rover}?api_key=${NASA_API_KEY}`;

      const response = await fetch(nasaUrl);
      const data = await response.json();
      return res.status(200).json(data);
    }

    // Unknown API route
    return res.status(404).json({ message: 'API endpoint not found' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      message: error.message || 'Internal server error'
    });
  }
}