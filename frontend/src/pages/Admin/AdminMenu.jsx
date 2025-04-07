import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes, FaBars, FaTh, FaPlus, FaBox, FaListUl, FaUsers, FaShoppingBag } from "react-icons/fa";

const AdminMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const menuItems = [
        { path: "/admin/dashboard", name: "Администраторско табло", icon: <FaTh className="mr-3" /> },
        { path: "/admin/categorylist", name: "Създай категория", icon: <FaPlus className="mr-3" /> },
        { path: "/admin/productlist", name: "Създай продукт", icon: <FaBox className="mr-3" /> },
        { path: "/admin/allproductslist", name: "Всички продукти", icon: <FaListUl className="mr-3" /> },
        { path: "/admin/userlist", name: "Управление на потребители", icon: <FaUsers className="mr-3" /> },
        { path: "/admin/orderlist", name: "Управление на поръчки", icon: <FaShoppingBag className="mr-3" /> },
    ];
    
    return (
        <>
            <button
                onClick={toggleMenu}
                className={`fixed top-5 right-7 z-30 p-2 rounded-lg bg-black/20 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-all duration-300 ${
                    isMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
                aria-label="Администраторско меню"
            >
                <FaBars className="text-gray-200 text-xl" />
            </button>
    
            {isMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        onClick={toggleMenu}
                        aria-hidden="true"
                    />
                    
                    <section
                        className="fixed right-0 top-0 h-full w-64 bg-gray-900/95 backdrop-blur-lg z-50 p-4 transform transition-transform duration-300 ease-out shadow-2xl"
                    >
                        <button
                            onClick={toggleMenu}
                            className="absolute top-4 right-4 text-gray-300 hover:text-green-400 transition-colors"
                            aria-label="Затвори менюто"
                        >
                            <FaTimes className="text-2xl" />
                        </button>
    
                        <nav className="mt-12">
                            <ul className="space-y-2">
                                {menuItems.map((item) => (
                                    <li key={item.path}>
                                        <NavLink
                                            to={item.path}
                                            className={({ isActive }) => 
                                                `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                                                    isActive 
                                                        ? "bg-green-400/10 text-green-400 shadow-lg"
                                                        : "text-gray-300 hover:bg-gray-800/60 hover:text-white"
                                                }`
                                            }
                                        >
                                            {item.icon}
                                            <span className="font-medium">{item.name}</span>
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </section>
                </>
            )}
        </>
    );
    
};

export default AdminMenu;