import { useContext, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import "./Verify.css";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url, setNotification } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    const response = await axios.post(url+"/api/order/verify", {success,orderId,});
    if (response.data.success) {
      ({type:"success",message:"Payment successful!" });
      navigate("/myorders");
    } else {
      setNotification({ type: "error", message: "Payment failed!" });
      navigate("/cart");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
