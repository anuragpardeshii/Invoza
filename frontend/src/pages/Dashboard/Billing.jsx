import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "./DashboardLayout";

function Billing() {
  const [mobile, setMobile] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [code, setCode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const codeInputRef = useRef();

  useEffect(() => {
    // Fetch all products for code lookup
    axios
      .get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setProducts(res.data));
  }, []);

  const handleAddItem = () => {
    setError("");
    const product = products.find((p) => p.code === code || p._id === code);
    if (!product) {
      setError("Product not found");
      return;
    }
    if (quantity < 1) {
      setError("Quantity must be at least 1");
      return;
    }
    setItems([
      ...items,
      {
        code: product.code,
        name: product.name,
        price: product.price,
        quantity,
        product: product._id,
      },
    ]);
    setCode("");
    setQuantity(1);
    codeInputRef.current?.focus();
  };

  const handleRemoveItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleCreateBill = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/bills",
        {
          customer: { name: customerName, mobile },
          items,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setBill(res.data);
      setItems([]);
      setSuccess("Bill created!");
    } catch (err) {
      setError(err.response?.data?.message || "Bill creation failed");
    }
    setLoading(false);
  };

  return (
    <>
    

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <caption class="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            Our products
            <p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Browse a list of Flowbite products designed to help you work and play, stay organized, get answers, keep in touch, grow your business, and more.</p>
        </caption>
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Product name
                </th>
                <th scope="col" class="px-6 py-3">
                    Color
                </th>
                <th scope="col" class="px-6 py-3">
                    Category
                </th>
                <th scope="col" class="px-6 py-3">
                    Price
                </th>
                <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Edit</span>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Apple MacBook Pro 17"
                </th>
                <td class="px-6 py-4">
                    Silver
                </td>
                <td class="px-6 py-4">
                    Laptop
                </td>
                <td class="px-6 py-4">
                    $2999
                </td>
                <td class="px-6 py-4 text-right">
                    <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                </td>
            </tr>
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Microsoft Surface Pro
                </th>
                <td class="px-6 py-4">
                    White
                </td>
                <td class="px-6 py-4">
                    Laptop PC
                </td>
                <td class="px-6 py-4">
                    $1999
                </td>
                <td class="px-6 py-4 text-right">
                    <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                </td>
            </tr>
            <tr class="bg-white dark:bg-gray-800">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Magic Mouse 2
                </th>
                <td class="px-6 py-4">
                    Black
                </td>
                <td class="px-6 py-4">
                    Accessories
                </td>
                <td class="px-6 py-4">
                    $99
                </td>
                <td class="px-6 py-4 text-right">
                    <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                </td>
            </tr>
        </tbody>
    </table>
</div>
{/* 
      <div className="p-4 sm:ml-64">
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-4">Billing</h2>
          <div className="flex gap-4 mb-4">
            <input
              className="border p-2 rounded w-1/2"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <input
              className="border p-2 rounded w-1/2"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <div className="flex gap-4 mb-4">
            <input
              ref={codeInputRef}
              className="border p-2 rounded w-1/2"
              placeholder="Scan barcode or enter code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <input
              className="border p-2 rounded w-1/4"
              type="number"
              min="1"
              placeholder="Qty"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleAddItem}
            >
              Add
            </button>
          </div>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          {items.length > 0 && (
            <table className="min-w-full bg-white rounded shadow mb-4">
              <thead>
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Code</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Qty</th>
                  <th className="p-2 border">Subtotal</th>
                  <th className="p-2 border">Remove</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border">{item.name}</td>
                    <td className="p-2 border">{item.code}</td>
                    <td className="p-2 border">{item.price}</td>
                    <td className="p-2 border">{item.quantity}</td>
                    <td className="p-2 border">{item.price * item.quantity}</td>
                    <td className="p-2 border">
                      <button
                        className="text-red-600"
                        onClick={() => handleRemoveItem(idx)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="flex justify-end mb-4">
            <button
              className="bg-green-600 text-white px-6 py-2 rounded"
              onClick={handleCreateBill}
              disabled={loading || items.length === 0}
            >
              Create Bill
            </button>
          </div>
          {success && <div className="text-green-600 mb-2">{success}</div>}
          {bill && bill.pdfUrl && (
            <div className="mt-4">
              <a
                href={bill.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline"
              >
                Download Bill PDF
              </a>
            </div>
          )}
        </div>
      </div> */}
    </>
  );
}

export default Billing;
