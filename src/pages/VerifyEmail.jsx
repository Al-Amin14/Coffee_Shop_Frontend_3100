import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verifying...');

  useEffect(() => {
    const id = searchParams.get('id');
    const token = searchParams.get('token');

    if (!id || !token) {
      setMessage('Invalid verification link.');
      return;
    }

    axios.get(`http://localhost:8000/api/email/verify/${id}/${token}`)
      .then(response => {
        setMessage('Email verified successfully!');
      })
      .catch(error => {
        setMessage(error.response?.data?.message || 'Verification failed.');
      });
  }, [searchParams]);

  return (
    <div className="verify-container">
      <h2>{message}</h2>
    </div>
  );
};

export default VerifyEmail;
