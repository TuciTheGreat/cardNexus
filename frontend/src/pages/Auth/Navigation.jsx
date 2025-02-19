import { useEffect, useState } from "react";
import {
    AiOutlineHome,
    AiOutlineShopping,
    AiOutlineLogin,
    AiOutlineUserAdd,
    AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";


const Navigation = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleSidebar = () => {
        setShowSidebar((prev) => !prev);
    };

    const closeSidebar = (e) => {
      if (!e.target.closest("#navigation-container") && !e.target.closest("#hamburger-menu")) {
          setShowSidebar(false);
      }
  };

  useEffect(() => {
      if (showSidebar) {
          document.addEventListener("click", closeSidebar);
      } else {
          document.removeEventListener("click", closeSidebar);
      }
      return () => document.removeEventListener("click", closeSidebar);
  }, [showSidebar]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate("/login");            
        } catch (error) {
            console.error(error);
        }
    };


    return( 
      <>
      {/* Hamburger Button */}
      <button 
                id="hamburger-menu"
                onClick={toggleSidebar} 
                className="fixed top-4 left-4 z-50 block xl:hidden lg:block md:block bg-black text-white px-5 py-3 text-2xl rounded-md"
            >
                ☰
            </button>

            {/* Sidebar */}
            <div 
                style={{ zIndex: 999 }}
                className={`fixed top-0 left-0 h-full bg-black text-white transition-transform duration-500 ease-in-out w-[15%] lg:w-[20%] md:w-[25%] xl:w-[4%] hover:w-[15%] p-4 flex flex-col justify-between ${showSidebar ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}`}
                id="navigation-container"
            >
            <div className="flex flex-col justify-center space-y-4">
                <Link 
                  to="/"
                  className="flex items-center transition-transform transform
                  hover:translate-x-2"
                >
                  <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
                  <span className="hidden nav-item-name mt-[3rem]">HOME</span>{" "}
                </Link>

                <Link 
                  to="/shop"
                  className="flex items-center transition-transform transform
                  hover:translate-x-2"
                >
                  <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
                  <span className="hidden nav-item-name mt-[3rem]">SHOP</span>{" "}
                </Link>

                <Link to="/cart" className="flex relative">
                  <div className="flex items-center transition-transform transform hover:translate-x-2">
                    <AiOutlineShoppingCart className="mr-2 mt-[3rem]" size={26} />
                    <span className="hidden nav-item-name mt-[3rem]">CART</span>{" "}
                  </div>

                  <div className="absolute top-9">
                    {cartItems.length > 0 && (
                      <span>
                        <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                          {cartItems.reduce((a, c) => a + c.qty, 0)}
                        </span>
                      </span>
                    )}
                  </div>
                </Link>

                <Link to="/favorite" className="flex relative">
                  <div className="flex justify-center items-center transition-transform transform
                  hover:translate-x-2">
                    <FaHeart className="mr-2 mt-[3rem]" size={20} />
                    <span className="hidden nav-item-name mt-[3rem]">FAVORITE</span>{" "}
                  </div>
                  <FavoritesCount />
                </Link>
            </div>

            <div className="relative">
              <button 
                onClick={toggleDropdown} 
                className="flex items-center text-gray-8000 focus:outline-none"
              >
                {userInfo ? (
                  <span className="text-white">{userInfo.username}</span> 
                ) : (
                  <></>
                )}

                {userInfo && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ml-1 ${
                      dropdownOpen ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    />
                  </svg>
                )}
              </button>

              {dropdownOpen && userInfo && (
                <ul
                  className={`absolute right-0 mt-2 mr-14 space-y-2 bg-gray-950 text-white ${
                    !userInfo.isAdmin ? "-top-20" : "-top-80"
                  }`}
                >
                  {userInfo.isAdmin && (
                    <>
                      <li>
                        <Link 
                          to="/admin/dashboard" 
                          className="block px-4 py-2 hover:bg-gray-900"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/admin/productlist" 
                          className="block px-4 py-2 hover:bg-gray-900"
                        >
                          Products
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/admin/categorylist" 
                          className="block px-4 py-2 hover:bg-gray-900"
                        >
                          Category
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/admin/orderlist" 
                          className="block px-4 py-2 hover:bg-gray-900"
                        >
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/admin/userlist" 
                          className="block px-4 py-2 hover:bg-gray-900"
                        >
                          Users
                        </Link>
                      </li>                        
                    </>
                  )}
                  <li>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-900">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logoutHandler}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-900"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}


              {!userInfo && (
                <ul>
                  <li>
                    <Link 
                      to="/login"
                      className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
                    >
                      <AiOutlineLogin className="mr-2 mt-[4px]" size={26} />
                      <span className="hidden nav-item-name">LOGIN</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/register"
                      className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
                    >
                      <AiOutlineUserAdd size={26} />
                      <span className="hidden nav-item-name">REGISTER</span>
                    </Link>
                  </li>
                </ul>
              )}         
        </div>
      </div>
      </>
    );
};

export default Navigation;
