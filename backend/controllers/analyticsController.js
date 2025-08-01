import Bill from '../models/Bill.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

export const getTopSellers = async (req, res) => {
  // Aggregate top 5 best selling products
  const result = await Bill.aggregate([
    { $unwind: '$items' },
    { $group: { _id: '$items.product', totalSold: { $sum: '$items.quantity' } } },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
    { $unwind: '$product' },
    { $project: { _id: 0, product: '$product.name', code: '$product.code', totalSold: 1 } }
  ]);
  res.json(result);
};

export const getSalesStats = async (req, res) => {
  // Group sales by week, month, year
  const groupBy = req.query.groupBy || 'week';
  let dateFormat;
  if (groupBy === 'week') dateFormat = '%Y-%U';
  else if (groupBy === 'month') dateFormat = '%Y-%m';
  else dateFormat = '%Y';
  const result = await Bill.aggregate([
    { $group: {
      _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
      total: { $sum: '$total' },
      count: { $sum: 1 }
    } },
    { $sort: { _id: 1 } }
  ]);
  res.json(result);
}; 