import mongoose from 'mongoose';

const billItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  code: String,
  price: Number,
  quantity: Number,
  subtotal: Number,
});

const billSchema = new mongoose.Schema({
  customer: {
    name: String,
    mobile: String,
  },
  items: [billItemSchema],
  total: Number,
  pdfUrl: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Bill', billSchema); 