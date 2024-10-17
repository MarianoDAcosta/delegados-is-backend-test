import mongoose from 'mongoose';

const circuitoSchema = new mongoose.Schema({
  departamento: String,
  numeroCircuito: Number,
  serie: String,
  local: String,
  latitude: Number,
  longitude: Number
});

export default mongoose.model('Circuito', circuitoSchema);