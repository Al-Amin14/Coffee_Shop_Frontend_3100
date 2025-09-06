import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verifying...');

  useEffect(() => {
    const id = searchParams.get('id');
    const token = searchParams.get('token');
    if (!id || !token) return setMessage('Invalid verification link.');

    axios
      .get(`http://localhost:8000/api/email/verify/${id}/${token}`)
      .then(() => setMessage('Email verified successfully!'))
      .catch((err) => setMessage(err.response?.data?.message || 'Verification failed.'));
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-50 to-orange-50">
      <h2 className="text-2xl font-semibold text-gray-800 bg-white p-6 rounded-xl shadow-md">{message}</h2>
    </div>
  );
};

export default VerifyEmail;
