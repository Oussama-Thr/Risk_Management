export default function handler(req, res) {
    if (req.method === 'GET') {
      const travelRisks = [
        { id: 1, name: 'Conflict Zones', level: 'Critical' },
        { id: 2, name: 'Natural Disasters', level: 'Critical' },
        { id: 3, name: 'High Crime Locations', level: 'Critical' },
      ];
      res.status(200).json(travelRisks);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }