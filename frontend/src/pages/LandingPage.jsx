import React, { useEffect, useRef } from "react";
import { DotLottiePlayer } from "@dotlottie/react-player";
import { useNavigate } from "react-router-dom";
import profileStore from "../store/profilestore";

const LandingPage = () => {
  const { getAllProfiles, allProfiles, isLoadingProfiles } = profileStore();
  const navigate = useNavigate();
  const profilesRef = useRef(null);

  useEffect(() => {
    getAllProfiles();
  }, [getAllProfiles]);

  const handleScrollToProfiles = () => {
    profilesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-green-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Support. Save. Smile.
            </h1>
            <p className="text-lg mb-6 max-w-xl mx-auto md:mx-0">
              We're on a mission to connect people with those in urgent need of medical donations.
              Every rupee can make a difference. Be a part of the change today.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              {/* ✅ Primary CTA => /benefitted */}
              <button
                onClick={() => navigate("/benefitted")}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                See Who Got Help 🎉
              </button>

              {/* Secondary: scroll to profiles */}
              <button
                onClick={handleScrollToProfiles}
                className="px-6 py-3 bg-white text-green-700 border border-green-600 rounded-lg hover:bg-green-50 transition"
              >
                Explore Active Profiles
              </button>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <DotLottiePlayer
              src="https://lottie.host/be69ae27-d863-449d-b517-c24e01bbaae9/d6ynaMZYvW.lottie"
              background="transparent"
              speed="1"
              style={{ width: "300px", height: "300px" }}
              loop
              autoplay
            />
          </div>
        </div>
      </section>

      {/* Profiles Section */}
      <section ref={profilesRef} className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Available Profiles</h2>

          {/* ✅ Link to Benefitted Page */}
          <button
            onClick={() => navigate("/benefitted")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            See Who Got Help 🎉
          </button>
        </div>

        {isLoadingProfiles ? (
          <p className="text-center text-gray-500">Loading profiles...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {allProfiles
              ?.filter((profile) => !profile.goalMet) // ✅ only show non-achieved
              .map((profile) => (
                <div
                  key={profile._id}
                  className="bg-white shadow-lg rounded-xl p-4 hover:shadow-2xl transition cursor-pointer"
                  onClick={() => navigate(`/profile/${profile._id}`)}
                >
                  <img
                    src={profile.profilePic || "https://via.placeholder.com/150"}
                    alt={profile.name}
                    className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-green-100"
                  />
                  <h3 className="text-lg font-semibold text-center mt-4">
                    {profile.name}
                  </h3>
                  <p className="text-sm text-center text-gray-500">
                    Disease: {profile.disease || "N/A"}
                  </p>
                  <p className="text-sm text-center text-gray-600 mt-1">
                    Goal: ₹{profile.donationGoal || "0"}
                  </p>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* Final Call to Action */}
      <section className="bg-green-600 text-white py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Together, We Can Save Lives</h2>
        <p className="mb-6">Be someone's hope. Start donating now and make a lasting impact.</p>
        <a
          href="/signup"
          className="inline-block px-6 py-3 bg-white text-green-700 font-semibold rounded hover:bg-gray-100 transition"
        >
          Join Us
        </a>
      </section>
    </div>
  );
};

export default LandingPage;
