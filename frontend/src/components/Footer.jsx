

import { ShieldCheck, Lock, BadgeCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-emerald-700 text-emerald-50 text-sm py-6 px-4 mt-auto">
      <div className="max-w-6xl mx-auto text-center space-y-2">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          <div className="flex items-center gap-1">
            <BadgeCheck size={16} className="text-yellow-300" />
            NGO Regd. No:{" "}
            <span className="font-medium text-white">123456789</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck size={16} className="text-orange-300" />
            80G & 12A Certified
          </div>
          <div className="flex items-center gap-1">
            <Lock size={16} className="text-teal-200" />
            SSL Secured
          </div>
        </div>
        <p className="text-sm text-emerald-100 mt-1">
          © 2025{" "}
          <span className="font-semibold text-white">
            Hope for All Foundation
          </span>
          . All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
