import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyHallBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const bookingId = searchParams.get('bookingId');
    const success = searchParams.get('success');

    const verifyPayment = async () => {
      try {
        const response = await axios.post('http://localhost:4000/api/hall/verify', null, {
          params: { bookingId, success },
        });

        if (response.data.success) {
          toast.success("Payment verified successfully!");
          setTimeout(() => {
            navigate('/myorders');
          }, 3000);
        } else {
          toast.error("Payment verification failed.");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        toast.error("Error verifying payment.");
      }
    };

    verifyPayment();
  }, [location, navigate]);

  return (
    <div>
      <ToastContainer />
      <h1>Verifying Payment...</h1>
    </div>
  );
};

export default VerifyHallBooking;
