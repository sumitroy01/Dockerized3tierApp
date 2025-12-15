import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileStore from "../store/profilestore";

const Benefitted = () => {
  const { achievedProfiles, isLoadingAchieved, getAchievedProfiles } = profileStore();
  const navigate = useNavigate();

  useEffect(() => {
    getAchievedProfiles();
  }, [getAchievedProfiles]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Benefitted Profiles 🎉</h1>

      {isLoadingAchieved ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : achievedProfiles.length === 0 ? (
        <p className="text-center text-gray-500">No completed campaigns yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {achievedProfiles.map((p) => (
            <div
              key={p._id}
              className="relative bg-white shadow-lg rounded-xl p-4 hover:shadow-2xl transition cursor-pointer"
              onClick={() => navigate(`/profile/${p._id}`)}
            >
              <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
                Goal Achieved
              </span>
              <img
                src={p.profilePic || "https://via.placeholder.com/150"}
                alt={p.name}
                className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-green-100"
              />
              <h3 className="text-lg font-semibold text-center mt-4">{p.name}</h3>
              <p className="text-sm text-center text-gray-500">Disease: {p.disease || "N/A"}</p>
              <p className="text-sm text-center text-gray-600 mt-1">
                Goal: ₹{p.donationGoal || 0}
              </p>
              <p className="text-xs text-center text-gray-400 mt-1">
                Reached on {p.goalMetAt ? new Date(p.goalMetAt).toLocaleDateString() : "-"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Benefitted;
