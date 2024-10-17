import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 86400, checkperiod: 120 });

export const geocode = async (local, departamento) => {
  const cacheKey = `${local}-${departamento}`;
  const cachedResult = cache.get(cacheKey);
  
  if (cachedResult) {
    return cachedResult;
  }

  try {
    const query = `${local}, ${departamento}, Uruguay`;
    console.log(`Geocoding query: ${query}`); // Para depuración

    const response = await axios.get('http://api.positionstack.com/v1/forward', {
      params: {
        access_key: process.env.POSITIONSTACK_API_KEY,
        query: query,
        country: 'UY',
        limit: 1
      }
    });

    console.log('PositionStack response:', JSON.stringify(response.data, null, 2)); // Para depuración

    if (response.data.data && response.data.data.length > 0) {
      const result = {
        latitude: response.data.data[0].latitude,
        longitude: response.data.data[0].longitude
      };

      cache.set(cacheKey, result);
      return result;
    }

    throw new Error('No se encontraron resultados de geocodificación');
  } catch (error) {
    console.error('Error en la geocodificación:', error.response ? error.response.data : error.message);
    throw error;
  }
};