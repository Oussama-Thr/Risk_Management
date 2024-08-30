import axios from 'axios';

export const geocode = async (query: string) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
};
