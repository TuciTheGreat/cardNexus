import { useEffect, useState } from "react";
import {
    AiOutlineHome,
    AiOutlineShopping,
    AiOutlineLogin,
    AiOutlineUserAdd,
    AiOutlineShoppingCart,
    AiTwotoneWarning,
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


    return (
      <>
        {/* Бутона за хамбургер */}
        <button 
          id="hamburger-menu"
          onClick={toggleSidebar} 
          className="fixed top-4 left-4 z-50 block md:hidden bg-black text-white px-5 py-3 text-2xl rounded-md"
          aria-label="Администраторско меню"
        >
          ☰
        </button>
    
        {/* Странично меню */}
        <div 
          style={{ zIndex: 999 }}
          className={`fixed top-0 left-0 h-full bg-black text-white transition-all duration-300 ease-in-out
            w-3/4 md:w-16 hover:md:w-64
            ${showSidebar ? "translate-x-0 sidebar-open" : "-translate-x-full md:translate-x-0"}
            p-4 flex flex-col justify-between`}
          id="navigation-container"
        >
          <div className="flex flex-col justify-center space-y-4">
            <Link 
              to="/"
              className="flex items-center transition-transform transform hover:translate-x-2 group"
            >
              <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
              <span className="nav-item-name mt-[3rem] ml-2">НАЧАЛО</span>
            </Link>
    
            <Link 
              to="/shop"
              className="flex items-center transition-transform transform hover:translate-x-2 group"
            >
              <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
              <span className="nav-item-name mt-[3rem] ml-2">МАГАЗИН</span>
            </Link>
    
            <Link to="/cart" className="flex relative">
              <div className="flex items-center transition-transform transform hover:translate-x-2">
                <div className="relative mr-2 mt-[3rem]">
                  <AiOutlineShoppingCart size={26} />
                  {cartItems.length > 0 && (
                    <div className="absolute -top-1 -right-2">
                      <span className="px-1.5 py-0.5 text-xs text-white bg-pink-500 rounded-full">
                        {cartItems.reduce((a, c) => a + c.qty, 0)}
                      </span>
                    </div>
                  )}
                </div>
                <span className="nav-item-name mt-[3rem] ml-2">КОЛИЧКА</span>
              </div>
            </Link>
    
            <Link to="/favorite" className="flex relative group">
              <div className="flex items-center transition-transform transform hover:translate-x-2">
                <FaHeart className="mr-2 mt-[3rem]" size={20} />
                <span className="nav-item-name mt-[3rem] ml-2">ЛЮБИМИ</span>
              </div>
              <FavoritesCount />
            </Link>

            <Link 
              to="/banlist"
              className="flex items-center transition-transform transform hover:translate-x-2 group"
            >
              <AiTwotoneWarning className="mr-2 mt-[3rem]" size={26} />
              <span className="nav-item-name mt-[3rem] ml-2">БАНЛИСТ</span>
            </Link>
          </div>
    
          <div className="relative">
            <button 
              onClick={toggleDropdown} 
              className="flex items-center text-gray-800 focus:outline-none w-full overflow-hidden group"
            >
              {userInfo ? (
                <>
                  <span className="text-white truncate max-w-[80px] md:max-w-[60px] hover:md:max-w-full transition-all duration-300">
                    {userInfo.username}
                  </span> 
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ml-1 ${dropdownOpen ? "transform rotate-180" : ""}`}
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
                </>
              ) : (
                <></>
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
                        Табло
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/admin/productlist" 
                        className="block px-4 py-2 hover:bg-gray-900"
                      >
                        Продукти
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/admin/categorylist" 
                        className="block px-4 py-2 hover:bg-gray-900"
                      >
                        Категории
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/admin/orderlist" 
                        className="block px-4 py-2 hover:bg-gray-900"
                      >
                        Поръчки
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/admin/userlist" 
                        className="block px-4 py-2 hover:bg-gray-900"
                      >
                        Потребители
                      </Link>
                    </li>                        
                  </>
                )}
                <li>
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-900">
                    Профил
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logoutHandler}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-900"
                  >
                    Изход
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
                    <span className="nav-item-name">ВХОД</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register"
                    className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
                  >
                    <AiOutlineUserAdd size={26} />
                    <span className="nav-item-name">РЕГИСТРАЦИЯ</span>
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
