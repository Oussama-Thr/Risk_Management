import axios from 'axios';

interface Suggestion {
  place_id: string;
  formatted_address: string;
}

export const geocode = async (query: string): Promise<Suggestion[]> => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
      },
    });

    // Map the response to match the Suggestion type
    return response.data.map((item: any) => ({
      place_id: item.osm_id,
      formatted_address: item.display_name,
    }));
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
};