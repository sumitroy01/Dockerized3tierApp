import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileStore from "../store/profilestore.js";

const Profile = () => {
  const navigate = useNavigate();
  const {
    hasProfile,
    profileId,
    profile,
    isCreatingProfile,
    isUpdatingProfile,
    isLoadingProfile,
    checkProfile,
    getProfileById,
    fillForm,
    updateProfileById,
  } = profileStore();

  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    disease: "",
    donationGoal: "",
    profilePic: null,
    bio: "", // changed from background
    proofs: null,
  });

  // Load profile if exists
  useEffect(() => {
    (async () => {
      const exists = await checkProfile();
      if (exists && profileId) {
        await getProfileById(profileId);
      } else {
        setForm({
          name: "",
          age: "",
          email: "",
          phone: "",
          disease: "",
          donationGoal: "",
          profilePic: null,
          bio: "",
          proofs: null,
        });
      }
    })();
  }, []);

  // Prefill form if profile is found
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        age: profile.age || "",
        email: profile.email || "",
        phone: profile.phone || "",
        disease: profile.disease || "",
        donationGoal: profile.donationGoal || "",
        profilePic: null,
        bio: profile.bio || "", // use bio instead of background
        proofs: null,
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? (name === "proofs" ? files : files[0]) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      const val = form[key];
      if (val !== null && val !== undefined && val !== "") {
        if (key === "proofs" && val instanceof FileList) {
          Array.from(val).forEach((file) => fd.append("proofs", file));
        } else {
          fd.append(key, val);
        }
      }
    });

    if (hasProfile && profileId) {
      await updateProfileById({ id: profileId, data: fd });
    } else {
      await fillForm(fd);
    }

    navigate("/"); // redirect after success
  };

  const busy = isCreatingProfile || isUpdatingProfile || isLoadingProfile;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
      <div className="bg-white w-full max-w-3xl p-8 rounded-xl shadow-md border border-gray-200">
        <h1 className="text-3xl font-bold text-emerald-600 mb-6 text-center">
          {hasProfile ? "Edit Donation Request" : "Create Donation Request"}
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500" />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input type="number" name="age" value={form.age} onChange={handleChange} min="1" required className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500" />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500" />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500" />
          </div>

          {/* Disease */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Disease / Condition</label>
            <input type="text" name="disease" value={form.disease} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500" />
          </div>

          {/* Donation Goal */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Donation Goal (USD)</label>
            <input type="number" name="donationGoal" value={form.donationGoal} onChange={handleChange} min="1" required className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500" />
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input type="file" name="profilePic" accept="image/*" onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows="4" required className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"></textarea>
          </div>

          {/* Proofs */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Medical Proof / Report</label>
            <input type="file" name="proofs" accept="application/pdf,image/*" multiple onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" />
          </div>

          <button type="submit" disabled={busy} className={`w-full text-white py-3 px-6 rounded-lg transition ${busy ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}>
            {busy ? (hasProfile ? "Updating..." : "Submitting...") : hasProfile ? "Update Request" : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
