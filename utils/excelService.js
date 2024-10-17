import xlsx from 'xlsx';
import path from 'path';
import { geocode } from './geocodingService.js';

export const processExcelFile = async () => {
  try {
    const filePath = path.join(process.cwd(), 'plantilla_circuitos.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const processedData = [];
    const localCache = {};

    for (const row of data) {
      const local = row['Local'];
      const departamento = row['Departamento'];
      const cacheKey = `${local}-${departamento}`;
      
      if (!localCache[cacheKey]) {
        try {
          const geocodeResult = await geocode(local, departamento);
          localCache[cacheKey] = {
            ...geocodeResult,
            cantidad_circuitos: 1
          };
        } catch (error) {
          console.error(`Error geocoding: ${cacheKey}`, error);
          localCache[cacheKey] = {
            latitude: null,
            longitude: null,
            cantidad_circuitos: 1
          };
        }
      } else {
        localCache[cacheKey].cantidad_circuitos++;
      }

      processedData.push({
        departamento: departamento,
        numeroCircuito: row['Numero'],
        serie: row['Serie/Desde/Hasta'],
        local: local,
        latitude: localCache[cacheKey].latitude,
        longitude: localCache[cacheKey].longitude,
        cantidad_circuitos: localCache[cacheKey].cantidad_circuitos
      });
    }

    return processedData;
  } catch (error) {
    console.error('Error processing Excel file:', error);
    throw error;
  }
};