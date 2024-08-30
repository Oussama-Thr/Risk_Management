import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  username: { type: String, required: true },
  status: { type: String, enum: ['Open', 'Resolved'], default: 'Open' },
  riskLevel: { type: String, enum: ['Undefined', 'High', 'Medium', 'Low'], default: 'Undefined' },
  date: { type: Date, },
  createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

export default Report;
