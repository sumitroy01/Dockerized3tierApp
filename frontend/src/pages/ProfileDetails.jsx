import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import profileStore from "../store/profilestore";
import donationStore from "../store/donationStore";

const ProfileDetails = () => {
  const { id } = useParams();
  const { getAllProfiles, allProfiles } = profileStore();
  const { createOrder, verifyPayment, loading } = donationStore();

  const [profile, setProfile] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [amount, setAmount] = useState(""); // custom donation amount
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (window.Razorpay) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("Razorpay script loaded");
      setScriptLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      setScriptLoaded(false);
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!allProfiles.length) {
      getAllProfiles();
    }
  }, [allProfiles, getAllProfiles]);

  useEffect(() => {
    const found = allProfiles.find((p) => String(p._id) === String(id));
    if (found) {
      setProfile(found);
    }
  }, [allProfiles, id]);

  if (!profile) {
    return <p className="text-center text-gray-500 mt-8">Loading profile...</p>;
  }

  const proofs = Array.isArray(profile.proofs)
    ? profile.proofs
    : profile.proofs
    ? [profile.proofs]
    : [];

  const handleDonate = async () => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!scriptLoaded || !window.Razorpay) {
      console.error("Razorpay not loaded");
      alert("Payment gateway not ready. Try again shortly.");
      return;
    }

    const orderData = await createOrder(profile._id, numericAmount);
    if (!orderData) {
      return window.location.href = "/";
    }

    // Razorpay options
    const options = {
      key: orderData.key,
      amount: Math.round(numericAmount * 100), // paise
      currency: "INR",
      name: profile.name || "Donation",
      description: "Donation",
      order_id: orderData.orderId,

      handler: async (response) => {
       
        console.log("Razorpay handler invoked", response);

        try {
       
          await verifyPayment({
            ...response,
            profileId: profile._id,
            amount: numericAmount,
          });
          console.log("verifyPayment returned");
        } catch (err) {
          console.error("verifyPayment threw error:", err);
        } finally {
          window.location.href = "/";
        }
      },

      modal: {
        ondismiss: function () {
          console.log("User dismissed Razorpay modal");
          window.location.href = "/";
        }
      },

      prefill: {
        name: "",
        email: "",
        contact: ""
      },

      theme: { color: "#22c55e" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/" className="text-green-600 hover:underline mb-4 inline-block">
        ← Back to Profiles
      </Link>

      <div className="bg-white shadow-lg rounded-xl p-6 overflow-hidden">
        <div className="flex flex-col items-center text-center px-4">
          <img
            src={profile.profilePic || "https://via.placeholder.com/150"}
            alt={profile.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-green-100"
          />
          <h1 className="text-3xl font-bold mt-4 break-words text-center">
            {profile.name}
          </h1>

          {profile.bio ? (
            <p
              className={`text-gray-700 mt-2 italic max-w-xl transition-all duration-300 ${
                expanded ? "" : "line-clamp-3"
              }`}
            >
              {profile.bio}
            </p>
          ) : (
            <p className="text-gray-400 mt-2 italic">No bio available</p>
          )}

          {profile.bio && profile.bio.length > 100 && (
            <button
              className="text-green-600 text-sm mt-2 hover:underline"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Read Less" : "Read More"}
            </button>
          )}
        </div>

        <div className="mt-6 space-y-3 text-gray-700 px-4 break-words">
          <p><strong>Age:</strong> {profile.age || "N/A"}</p>
          <p><strong>Email:</strong> {profile.email || "N/A"}</p>
          <p><strong>Phone:</strong> {profile.phone || "N/A"}</p>
          <p><strong>Disease:</strong> {profile.disease || "N/A"}</p>
          <p><strong>Donation Goal:</strong> ₹{profile.donationGoal || "0"}</p>
        </div>

        <div className="mt-6 px-4">
          <p><strong>Collected:</strong> ₹{profile.donatedAmount || 0}</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{
                width: `${Math.min((profile.donatedAmount / profile.donationGoal) * 100, 100)}%`,
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {Math.min(((profile.donatedAmount / profile.donationGoal) * 100).toFixed(1), 100)}% of goal reached
          </p>
        </div>

        <div className="mt-6 px-4">
          <input
            type="number"
            placeholder="Enter donation amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded-lg p-2 w-full mb-3"
          />
          <button
            onClick={handleDonate}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Donate"}
          </button>
        </div>

        {proofs.length > 0 && (
          <div className="mt-6 px-4">
            <h2 className="font-semibold mb-2">Proof Documents:</h2>
            <div className="grid grid-cols-3 gap-3">
              {proofs.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Proof ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80"
                  onClick={() => setActiveIndex(idx)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {activeIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button className="absolute top-5 right-5 text-white text-3xl" onClick={() => setActiveIndex(null)}>✕</button>
          <button className="absolute left-5 text-white text-3xl" onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : proofs.length - 1))}>‹</button>
          <img src={proofs[activeIndex]} alt={`Proof enlarged ${activeIndex + 1}`} className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg" />
          <button className="absolute right-5 text-white text-3xl" onClick={() => setActiveIndex((prev) => (prev < proofs.length - 1 ? prev + 1 : 0))}>›</button>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
