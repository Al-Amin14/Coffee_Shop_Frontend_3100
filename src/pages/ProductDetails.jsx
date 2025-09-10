import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import AuthUser from '../components/AuthUser'; 

const ProductDetails = () => {
  const { user } = AuthUser();
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);

  
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (product?.id) {
      fetchComments(product.id);
    }
  }, [product]);

  
  const fetchComments = async (productId) => {
    setCommentLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/comments/${productId}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });
      setCommentsList(res.data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments.');
    } finally {
      setCommentLoading(false);
    }
  };

  
  const handleSubmitComment = async () => {
    if (!comment.trim()) return toast.error('Please write a comment.');

    try {
      const payload = {
        user_id: user.id,
        product_id: product.id,
        comment: comment.trim(),
      };

      await axios.post('http://localhost:8000/api/comments', payload, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });

      toast.success('Comment posted!');
      setComment('');
      fetchComments(product.id); 
    } catch (error) {
      console.error('Failed to post comment:', error);
      toast.error('Failed to post comment.');
    }
  };

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = async () => {
    if (user?.role !== 'Customer') {
      toast.error('Only customers can add to cart.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: user.id,
        product_id: product.id,
        product_name: product.product_name,
        quantity,
        unit_price: product.price,
        total_price: product.price * quantity,
        image_path: product.image_path,
      };

      await axios.post('http://localhost:8000/api/addchart', payload, {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      });

      toast.success(`${product.product_name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToOrder = async () => {
    if (user?.role !== 'Customer') {
      toast.error('Only customers can place orders.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: user.id,
        product_name: product.product_name,
        quantity,
        total_price: product.price * quantity,
        image_path: product.image_path,
        status: 'pending',
      };

      await axios.post('http://localhost:8000/api/orders', payload, {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      });

      toast.success(`Order placed for ${quantity} ${product.product_name}(s)!`);
      navigate('/orders');
    } catch (error) {
      toast.error('Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setCommentLoading(true);
    try {
      console.log('Deleting comment with ID:', commentId);

      await axios.delete(`http://localhost:8000/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });

      toast.success('Comment deleted!');
      fetchComments(product.id); 
    } catch (error) {
      toast.error('Failed to delete comment.');
      console.error('Error deleting comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

 
  if (!product) {
    return <p className="p-6">No product data found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <img
        src={product.image_path}
        alt={product.product_name}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <h1 className="text-3xl font-bold mb-2">{product.product_name}</h1>
      <p className="text-gray-700 mb-4">{product.description}</p>
      <p className="text-xl font-semibold text-yellow-700 mb-6">৳{product.price}</p>

    
      <div className="flex items-center mb-6">
        <p className="mr-4 font-semibold">Quantity of product:</p>
        <button
          onClick={decrement}
          disabled={quantity <= 1 || loading}
          className="px-3 py-1 bg-gray-300 rounded-l disabled:opacity-50"
        >
          -
        </button>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val >= 1) setQuantity(val);
          }}
          disabled={loading}
          className="w-16 text-center border-t border-b border-gray-300"
        />
        <button
          onClick={increment}
          disabled={loading}
          className="px-3 py-1 bg-gray-300 rounded-r"
        >
          +
        </button>
      </div>

      
      <div className="flex gap-4 mb-8">
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
        <button
          onClick={handleAddToOrder}
          disabled={loading}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Ordering...' : 'Place Order'}
        </button>
      </div>

      
      <div className="border-t pt-6">
        <h2 className="text-2xl font-bold mb-4">Customer Comments</h2>

        <div className="mb-4">
          <textarea
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          ></textarea>
          <button
            onClick={handleSubmitComment}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Post Comment
          </button>
        </div>

      
        {commentLoading ? (
          <p>Loading comments...</p>
        ) : commentsList.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <div className="space-y-6">
            {commentsList.map((cmt, index) => (
              <div
                key={cmt.id}
                className={`p-4 bg-gray-50 border border-gray-200 rounded-lg ${
                  index > 0 ? 'mt-4' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                 
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xl font-semibold text-white">
                        {cmt.user?.name?.charAt(0)}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-800">
                      {cmt.user?.name || 'Anonymous'}
                    </p>
                  </div>

                 
                  {user?.id === cmt.user_id && (
                    <button
                      onClick={() => handleDeleteComment(cmt.id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="mt-2 text-gray-700">{cmt.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
