import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import AuthUser from '../components/AuthUser';

const ProductDetails = () => {
  const { user } = AuthUser();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(location.state?.product || null);
  const [availableStock, setAvailableStock] = useState(location.state?.product?.stock_quantity || 0);
  
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);

  const getAuthToken = () => {
    const rawToken = localStorage.getItem('token');
    if (!rawToken) return '';
    try {
      return JSON.parse(rawToken);
    } catch (e) {
      return rawToken;
    }
  };

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const token = getAuthToken();
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const res = await axios.get(`http://localhost:8000/api/products/${id}`, config);
        
        if (res.data.success) {
          setProduct(res.data.product);
          setAvailableStock(res.data.product.stock_quantity);
        }
      } catch (error) {
        console.error('Error refreshing product data:', error);
      }
    };

    if (id) {
      fetchLatestData();
      fetchComments(id);
    }
  }, [id]);

  const fetchComments = async (productId) => {
    setCommentLoading(true);
    try {
      const token = getAuthToken();
      const res = await axios.get(`http://localhost:8000/api/comments/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommentsList(res.data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) return toast.error('Please write a comment.');

    try {
      const token = getAuthToken();
      const payload = {
        user_id: user.id,
        product_id: product.id,
        comment: comment.trim(),
      };

      await axios.post('http://localhost:8000/api/comments', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Comment posted!');
      setComment('');
      fetchComments(product.id); 
    } catch (error) {
      console.error('Failed to post comment:', error);
      toast.error('Failed to post comment.');
    }
  };

 
  const increment = () => {
    if (quantity < availableStock) {
      setQuantity((q) => q + 1);
    } else {
      toast.error("Cannot exceed available stock.");
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = async () => {
    if (user?.role !== 'Customer') {
      toast.error('Only customers can add to cart.');
      return;
    }

   
    if (quantity > availableStock || availableStock === 0) {
      toast.error('Product is out of stock or quantity exceeds availability.');
      return;
    }

    setLoading(true);
    try {
      const token = getAuthToken();
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const payload = {
        user_id: user.id,
        product_id: product.id,
        product_name: product.product_name,
        quantity,
        unit_price: product.price,
        total_price: product.price * quantity,
        image_path: product.image_path,
      };

      await axios.post('http://localhost:8000/api/addchart', payload, config);

      const res = await axios.put(`http://localhost:8000/api/products/update-stock/${product.id}`, {
        quantity: quantity, 
      }, config);

      setAvailableStock(res.data.new_stock); 
      toast.success(`${product.product_name} added to cart!`);
      setQuantity(1); 
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to process request.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToOrder = async () => {
    if (user?.role !== 'Customer') {
      toast.error('Only customers can place orders.');
      return;
    }

    if (availableStock === 0) return toast.error('Out of stock.');

    setLoading(true);
    try {
      const token = getAuthToken();
      const payload = {
        user_id: user.id,
        product_name: product.product_name,
        quantity,
        total_price: product.price * quantity,
        image_path: product.image_path,
        status: 'pending',
      };

      await axios.post('http://localhost:8000/api/orders', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`Order placed successfully!`);
      navigate('/orders');
    } catch (error) {
      toast.error('Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    setCommentLoading(true);
    try {
      const token = getAuthToken();
      await axios.delete(`http://localhost:8000/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Comment removed.');
      fetchComments(product.id); 
    } catch (error) {
      toast.error('Error deleting comment.');
    } finally {
      setCommentLoading(false);
    }
  };

  if (!product) {
    return <p className="p-6 text-center font-bold text-gray-500">Syncing product data...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-10 mb-20 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
            <img
                src={product.image_path || '/images/default-product.jpg'} 
                alt={product.product_name}
                className="w-full h-80 object-cover rounded-xl shadow-sm border"
            />
        </div>

        <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{product.product_name}</h1>
            <p className="text-gray-500 italic mb-4">{product.category}</p>
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            
            <div className="flex items-center justify-between mb-6">
                <p className="text-3xl font-bold text-yellow-600">৳{product.price}</p>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Inventory Status</p>
                    {/* CHANGE: Added Sold Out styling */}
                    <p className={`text-2xl font-mono font-bold ${availableStock === 0 ? 'text-red-500' : 'text-blue-600'}`}>
                        {availableStock === 0 ? 'SOLD OUT' : availableStock}
                    </p>
                </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg mb-6 border border-gray-200">
                <span className="mr-auto font-medium text-gray-700">Select Quantity:</span>
                <button
                    onClick={decrement}
                    disabled={quantity <= 1 || loading || availableStock === 0}
                    className="w-10 h-10 bg-white border rounded-full shadow-sm hover:bg-gray-100 disabled:opacity-30"
                >
                    -
                </button>
                <input
                    type="number"
                    value={availableStock === 0 ? 0 : quantity}
                    readOnly
                    className="w-12 text-center bg-transparent font-bold text-lg"
                />
                <button
                    onClick={increment}
                    disabled={loading || quantity >= availableStock || availableStock === 0}
                    className="w-10 h-10 bg-white border rounded-full shadow-sm hover:bg-gray-100 disabled:opacity-30"
                >
                    +
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={handleAddToCart}
                    
                    disabled={loading || availableStock === 0}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-md disabled:bg-gray-300"
                >
                    {availableStock === 0 ? 'Sold Out' : (loading ? 'Adding...' : 'Add to Cart')}
                </button>
                <button
                    onClick={handleAddToOrder}
                    disabled={loading || availableStock === 0}
                    className="bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-md disabled:bg-gray-300"
                >
                    {availableStock === 0 ? 'N/A' : 'Buy Now'}
                </button>
            </div>
        </div>
      </div>

      <hr className="my-10" />

      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
          <textarea
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What do you think about this product?"
            className="w-full border-none rounded-lg p-4 focus:ring-2 focus:ring-blue-400 shadow-inner"
          ></textarea>
          <div className="flex justify-end mt-3">
              <button
                onClick={handleSubmitComment}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Submit Review
              </button>
          </div>
        </div>

        {commentLoading ? (
          <div className="flex justify-center p-10"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>
        ) : (
          <div className="space-y-4">
            {commentsList.map((cmt) => (
              <div key={cmt.id} className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold uppercase">
                        {cmt.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">{cmt.user?.name || 'Verified User'}</p>
                        <p className="text-xs text-gray-400">{new Date(cmt.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {user?.id === cmt.user_id && (
                    <button onClick={() => handleDeleteComment(cmt.id)} className="text-gray-300 hover:text-red-500 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
                <p className="text-gray-700 ml-13 pl-1">{cmt.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>

  );

};

export default ProductDetails;