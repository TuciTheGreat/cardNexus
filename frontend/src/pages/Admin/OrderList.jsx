import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
    const { data: orders, isLoading, error } = useGetOrdersQuery();

    return (
    <>
        {isLoading ? (
            <Loader />
        ) : error ? (
            <Message variant="danger">
                {error?.data?.message || error.error}
            </Message>
        ) : (
            <div className="flex flex-col bg-black text-gray-100 min-h-screen">
                {/* Adjust padding to avoid content being hidden behind sidebar */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pl-64"> 
                    <AdminMenu />
                    <h2 className="text-3xl font-bold text-pink-400 mb-6">Order List</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="text-left p-4">ITEMS</th>
                                    <th className="text-left p-4">ID</th>
                                    <th className="text-left p-4">USER</th>
                                    <th className="text-left p-4">DATE</th>
                                    <th className="text-left p-4">TOTAL</th>
                                    <th className="text-left p-4">PAID</th>
                                    <th className="text-left p-4">DELIVERED</th>
                                    <th className="text-left p-4">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-800 transition-colors">
                                        <td className="p-4">
                                            <img 
                                                src={order.orderItems[0].image}
                                                alt={order._id}
                                                className="w-20 h-20 object-contain rounded-lg"
                                            />
                                        </td>
                                        <td className="p-4 text-gray-300">{order._id}</td>
                                        <td className="p-4 text-gray-300">{order.user ? order.user.username : "N/A"}</td>
                                        <td className="p-4 text-gray-300">{order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}</td>
                                        <td className="p-4 text-pink-400 font-medium">${order.totalPrice}</td>
                                        <td className="p-4">
                                            {order.isPaid ? (
                                                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
                                                    Completed
                                                </span>
                                            ) : (
                                                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {order.isDelivered ? (
                                                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
                                                    Completed
                                                </span>
                                            ) : (
                                                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <Link to={`/order/${order._id}`}>
                                                <button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all font-medium shadow-lg hover:shadow-xl">
                                                    More
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}
    </>
);

};

export default OrderList;
