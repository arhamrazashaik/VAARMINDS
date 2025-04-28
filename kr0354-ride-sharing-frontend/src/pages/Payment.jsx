import React, { useEffect } from 'react';
import axios from 'axios';
// Assuming you have a useCart or similar hook

export function Payment() {

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const proceedPayment = async () => {
    try {
      const data = await axios.post("http://localhost:5000/razorpay/create-order", {
        amount: state.totalFare
      });

      const options = {
        key: 'rzp_test_ZYP4VtDJ8ML7aq',
        amount: state.totalFare * 100,
        currency: "INR",
        order_id: data.data.OrderId,
        handler: function (response) {
          alert("Payment Successful! Booking Confirmed.");
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rpz1 = new window.Razorpay(options);
      rpz1.open();
      rpz1.on('payment.failed', function (response) {
        alert("Payment Failed! Please try again.");
      });

    } catch (err) {
      console.error("Payment Error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Cab Booking Payment</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Ride Details</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Pickup Location"
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Drop Location"
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="datetime-local"
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Pickup Date & Time"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Cab Type:</span>
              <span className="font-semibold">{state.cabType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Distance:</span>
              <span className="font-semibold">{state.distance} km</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Estimated Fare:</span>
              <span className="font-bold text-green-600">₹{state.totalFare.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={proceedPayment}
          className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors font-semibold"
        >
          Pay & Confirm Booking
        </button>
      </div>
    </div>
  );
}

export default Payment;
