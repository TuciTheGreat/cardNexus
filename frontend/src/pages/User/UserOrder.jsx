import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
    const { data: orders, isLoading, error } = useGetMyOrdersQuery();

    return (
        <div className="min-h-screen bg-black text-gray-100 flex justify-center items-start overflow-hidden">
          <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-black mt-16 pt-8">
            <h2 className="text-3xl font-bold text-pink-400 mb-8 text-center">Моите поръчки</h2>
      
            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">{error?.data?.error || error.error}</Message>
            ) : (
              <div className="overflow-x-auto pb-4 bg-transparent">
                <table className="w-full min-w-[800px] mx-auto border border-gray-700 rounded-lg shadow-lg bg-transparent">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-pink-300">Изображение</th>
                      <th className="p-4 text-left text-sm font-semibold text-pink-300">ID на поръчката</th>
                      <th className="p-4 text-left text-sm font-semibold text-pink-300">Дата</th>
                      <th className="p-4 text-right text-sm font-semibold text-pink-300">Общо</th>
                      <th className="p-4 text-center text-sm font-semibold text-pink-300">Плащане</th>
                      <th className="p-4 text-center text-sm font-semibold text-pink-300">Доставка</th>
                      <th className="p-4 text-center text-sm font-semibold text-pink-300">Действия</th>
                    </tr>
                  </thead>
      
                  <tbody className="divide-y divide-gray-700 bg-transparent">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-800 transition-colors">
                        <td className="p-4">
                          <img 
                            src={order.orderItems[0].image}
                            alt={order.user}
                            className="w-16 h-16 object-contain rounded-lg"
                          />
                        </td>
                        <td className="p-4 text-gray-300 font-mono text-xs">{order._id}</td>
                        <td className="p-4 text-gray-300 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right text-pink-400 font-medium text-sm">${order.totalPrice}</td>
                        
                        <td className="p-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            order.isPaid 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {order.isPaid ? 'Платено' : 'В очакване'}
                          </span>
                        </td>
                        
                        <td className="p-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            order.isDelivered 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {order.isDelivered ? 'Доставено' : 'В процес на доставка'}
                          </span>
                        </td>
                        
                        <td className="p-4 text-center">
                          <Link 
                            to={`/order/${order._id}`}
                            className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-3 py-2 rounded-lg transition-all font-medium text-xs shadow-lg hover:shadow-xl"
                          >
                            Детайли
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      );
      
    
};

export default UserOrder;
