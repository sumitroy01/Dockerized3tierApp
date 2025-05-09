import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { LogOut, MessageSquare, Settings, User, Clock } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { expiryTime, setExpiryTime } = useChatStore();
  const [showDropdown, setShowDropdown] = useState(false);

  const expiryOptions = [
    { label: "Off", value: "off" },
    { label: "1 Min", value: 60000 },
    { label: "2 Min", value: 120000 },
    { label: "5 Min", value: 300000 },
  ];

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Expiry Time Dropdown */}
            <div className="relative">
              <button
                className="btn btn-sm flex gap-2"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">
                  Disappearing:{" "}
                  {expiryOptions.find((o) => o.value === expiryTime)?.label ||
                    "Off"}
                </span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-36 bg-blue border rounded-lg shadow-lg">
                  {expiryOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`block w-full px-4 py-2 text-left hover:bg-gray-500 ${
                        expiryTime === option.value ? "font-bold" : ""
                      }`}
                      onClick={() => {
                        setExpiryTime(option.value);
                        setShowDropdown(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link to={"/settings"} className="btn btn-sm gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
