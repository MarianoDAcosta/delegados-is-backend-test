import express from 'express';
import { processExcelFile } from '../utils/excelService.js';

const router = express.Router();

router.get('/api', async (req, res) => {
  try {
    const processedData = await processExcelFile();
    res.json(processedData);
  } catch (error) {
    console.error('Error processing Excel file:', error);
    res.status(500).json({ message: 'Error processing Excel file', error: error.message });
  }
});

export default router;