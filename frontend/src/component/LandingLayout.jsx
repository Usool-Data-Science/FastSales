import React, { useState } from "react";
import LandingSidebar from "./LandingSidebar";
import { Outlet } from "react-router-dom";
// import { FaBars } from "react-icons/fa";

const LandingLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState();
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile Screen sizes */}
      <div className="flex md:hidden p-4 bg-fastsalebg text-fastsaletext z-20">
        <button onClick={toggleSidebar}>
          {/* <FaBars size={24} /> */}
          ===
        </button>
        <h1 className="ml-4 text-md sm:text-xl font-medium">Home Page</h1>
      </div>
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black opacity-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      {/* Sidebar */}
      <div
        className={`bg-fastsalebg w-64 min-h-screen text-fastsaletext absolute md:relative transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:translate-x-0 md:static md:block z-20`}
      >
        <LandingSidebar />
      </div>
      {/* Main Content */}
      <div className="grow p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default LandingLayout;
