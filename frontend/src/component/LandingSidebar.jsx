import React from "react";
import { BsShop } from "react-icons/bs";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { Link, NavLink, useNavigate } from "react-router-dom";

const LandingSidebar = () => {
  const navigate = useNavigate();
  const navLinks = [
    { name: "Products", url: "/products", icon: <BsShop /> },
    { name: "Orders", url: "/orders", icon: <HiOutlineShoppingCart /> },
  ];
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link className="text-4xl font-extrabold" to="#">
          FastSales
        </Link>
      </div>
      {/* <h2 className="text-xl font-medium mb-6 text-center">Home Page</h2> */}
      <nav className="flex flex-col space-y-4">
        {navLinks.map((navItem) => (
          <NavLink
            to={navItem.url}
            key={navItem.name}
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white px-4 py-2 rounded flex item-center space-x-2"
                : "text-fastsalestext hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            }
          >
            {navItem.icon} <span>{navItem.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default LandingSidebar;
