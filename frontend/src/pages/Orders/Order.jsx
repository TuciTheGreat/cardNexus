import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { 
    useDeliverOrderMutation,
    useGetOrderDetailsQuery,
    useGetPaypalClientIdQuery,
    usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
    const { id: orderId } = useParams();

    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
    const { userInfo } = useSelector((state) => state.auth);

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    const {
        data: paypal,
        isLoading: loadingPayPal,
        error: errorPayPal,
    } = useGetPaypalClientIdQuery();


    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadingPayPalScript = async () => {
                paypalDispatch({
                    type: "resetOptions",
                    value: {
                        "client-id": paypal.clientId,
                        currency: "USD",
                    }
                })
                paypalDispatch({ type: "setLoadingStatus", value: "pending" })
            }

            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadingPayPalScript();
                }
            }
        }
    }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                await payOrder({ orderId, details });
                refetch();
                toast.success("Order is paid");     
            } catch (error) {
                toast.error(error?.data?.message || error.message);
            }
        });
    }

    function createOrder(data, actions){
        return actions.order.create({
            purchase_units: [{ amount: { value: order.totalPrice } }],
        })
        .then((orderID) => {
            return orderID;
        });
    }

    function onError(err) {
        toast.error(err.message);
    }

    const deliverHandler = async () => {
        await deliverOrder(orderId);
        refetch();
    };

    return isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.data.message}</Message>
      ) : (
        <div className="min-h-screen bg-black w-full">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 max-w-7xl">
            {/* Секция с артикули от поръчката */}
            <div className="lg:w-2/3 w-full">
              <div className="bg-gray-900 rounded-xl shadow-xl p-6 border border-gray-800">
                <h2 className="text-2xl font-bold text-pink-400 mb-6">Артикули от поръчката</h2>
                {order.orderItems.length === 0 ? (
                  <Message>Поръчката е празна</Message>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="px-3 py-2 text-left text-sm font-semibold text-pink-300">Изображение</th>
                          <th className="px-3 py-2 text-left text-sm font-semibold text-pink-300">Продукт</th>
                          <th className="px-3 py-2 text-center text-sm font-semibold text-pink-300">Количество</th>
                          <th className="px-3 py-2 text-right text-sm font-semibold text-pink-300">Цена</th>
                          <th className="px-3 py-2 text-right text-sm font-semibold text-pink-300">Общо</th>
                        </tr>
                      </thead>
      
                      <tbody className="divide-y divide-gray-700">
                        {order.orderItems.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-800 transition-colors">
                            <td className="p-3">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-20 h-20 object-contain rounded-lg" 
                              />
                            </td>
                            <td className="p-3">
                              <Link 
                                to={`/product/${item.product}`}
                                className="text-pink-400 hover:text-pink-300 font-medium transition-colors"
                              >
                                {item.name}
                              </Link>
                            </td>
                            <td className="p-3 text-center text-gray-300">{item.qty}</td>
                            <td className="p-3 text-right text-gray-300">${item.price.toFixed(2)}</td>
                            <td className="p-3 text-right font-medium text-pink-400">
                              ${(item.qty * item.price).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
      
            {/* Секция за данни за доставка и обобщение */}
            <div className="lg:w-1/3 w-full flex flex-col gap-8">
              <div className="bg-gray-900 rounded-xl shadow-xl p-6 border border-gray-800">
                <h2 className="text-2xl font-bold text-pink-400 mb-4">Данни за доставка</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">ID на поръчката:</label>
                    <p className="text-gray-300 font-mono">{order._id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Име:</label>
                    <p className="text-gray-300">{order.user.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Имейл:</label>
                    <p className="text-gray-300 break-all">{order.user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Адрес:</label>
                    <p className="text-gray-300">
                      {order.shippingAddress.address},<br />
                      {order.shippingAddress.city} {order.shippingAddress.postalCode},<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Метод на плащане:</label>
                    <p className="text-gray-300">{order.paymentMethod}</p>
                  </div>
                  <div className="mt-4">
                    {order.isPaid ? (
                      <Message variant="success">Платено на {order.paidAt}</Message>
                    ) : (
                      <Message variant="danger">Не е платено</Message>
                    )}
                  </div>
                </div>
              </div>
      
              <div className="bg-gray-900 rounded-xl shadow-xl p-6 border border-gray-800">
                <h2 className="text-2xl font-bold text-pink-400 mb-4">Обобщение на поръчката</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Артикули:</span>
                    <span className="text-pink-400">${order.itemsPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Доставка:</span>
                    <span className="text-pink-400">${order.shippingPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Данък:</span>
                    <span className="text-pink-400">${order.taxPrice}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-700 pt-3">
                    <span className="text-lg font-bold text-pink-300">Общо:</span>
                    <span className="text-lg font-bold text-pink-300">${order.totalPrice}</span>
                  </div>
                </div>
      
                {!order.isPaid && (
                  <div className="mt-6">
                    {loadingPay && <Loader />}
                    {isPending ? (
                      <Loader />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                          style={{ 
                            color: "blue",
                            layout: "horizontal",
                            tagline: false
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
      
                {loadingDeliver && <Loader />}
                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <button
                    type="button"
                    className="w-full mt-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl"
                    onClick={deliverHandler}
                  >
                    Маркирай като доставено
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
      
};

export default Order;
