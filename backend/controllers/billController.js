import Bill from '../models/Bill.js';
import Product from '../models/Product.js';
import cloudinary from 'cloudinary';
import PDFDocument from 'pdfkit';
import streamBuffers from 'stream-buffers';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createBill = async (req, res) => {
  try {
    const { customer, items } = req.body;
    let total = 0;
    const billItems = await Promise.all(items.map(async (item) => {
      const product = await Product.findOne({ $or: [{ code: item.code }, { _id: item.product }] });
      if (!product) throw new Error('Product not found');
      const subtotal = product.price * item.quantity;
      total += subtotal;
      return {
        product: product._id,
        name: product.name,
        code: product.code,
        price: product.price,
        quantity: item.quantity,
        subtotal,
      };
    }));
    const bill = await Bill.create({ customer, items: billItems, total });

    // PDF generation
    const doc = new PDFDocument();
    const bufferStream = new streamBuffers.WritableStreamBuffer();
    doc.pipe(bufferStream);
    doc.fontSize(18).text('Invoice/Bill', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Customer: ${customer.name || ''}`);
    doc.text(`Mobile: ${customer.mobile || ''}`);
    doc.text(`Date: ${new Date().toLocaleString()}`);
    doc.moveDown();
    doc.text('Items:');
    billItems.forEach((item, idx) => {
      doc.text(`${idx + 1}. ${item.name} (${item.code}) x${item.quantity} @ ₹${item.price} = ₹${item.subtotal}`);
    });
    doc.moveDown();
    doc.fontSize(14).text(`Total: ₹${total}`, { align: 'right' });
    doc.end();

    bufferStream.on('finish', async () => {
      const pdfBuffer = bufferStream.getContents();
      if (pdfBuffer) {
        // Upload to Cloudinary
        const uploadRes = await cloudinary.v2.uploader.upload_stream(
          { resource_type: 'raw', folder: 'bills', public_id: `bill_${bill._id}` },
          async (error, result) => {
            if (error) {
              return res.status(500).json({ message: 'Cloudinary upload failed', error });
            }
            bill.pdfUrl = result.secure_url;
            await bill.save();
            res.status(201).json(bill);
          }
        );
        // Write buffer to upload stream
        uploadRes.end(pdfBuffer);
      } else {
        res.status(500).json({ message: 'PDF generation failed' });
      }
    });
  } catch (err) {
    res.status(400).json({ message: 'Bill creation failed', error: err.message });
  }
};

export const getBills = async (req, res) => {
  const bills = await Bill.find().sort({ createdAt: -1 });
  res.json(bills);
}; 