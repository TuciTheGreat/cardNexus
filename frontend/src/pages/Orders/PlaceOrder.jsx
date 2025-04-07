import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);

    const [createOrder, { isLoading, error }] = useCreateOrderMutation();

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate("/shipping");
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

    const dispatch = useDispatch();

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap();
            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);      
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <>
          <ProgressSteps step1 step2 step3 />
          <div className="container mx-auto px-4 py-8 sm:py-10 lg:px-8">
            {cart.cartItems.length === 0 ? (
              <Message>Вашата количка е празна</Message>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm sm:text-base">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-3 py-2">Изображение</th>
                      <th className="px-3 py-2">Продукт</th>
                      <th className="px-3 py-2">Количество</th>
                      <th className="px-3 py-2">Цена</th>
                      <th className="px-3 py-2">Общо</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.cartItems.map((item, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="p-3">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-20 h-20 object-contain"
                          />
                        </td>
                        <td className="p-3">{item.name}</td>
                        <td className="p-3">{item.qty}</td>
                        <td className="p-3">${item.price.toFixed(2)}</td>
                        <td className="p-3 font-semibold">${(item.qty * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
      
            <div className="mt-8 bg-[#181818] p-6 sm:p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Обобщение на поръчката
              </h2>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <ul className="text-lg space-y-2 sm:space-y-0 sm:mr-6">
                  <li>
                    <span className="font-semibold">Артикули:</span> ${cart.itemsPrice}
                  </li>
                  <li>
                    <span className="font-semibold">Доставка:</span> ${cart.shippingPrice}
                  </li>
                  <li>
                    <span className="font-semibold">Данък:</span> ${cart.taxPrice}
                  </li>
                  <li>
                    <span className="font-semibold">Общо:</span> ${cart.totalPrice}
                  </li>
                </ul>
                
                {error && <Message variant="danger">{error.data.message}</Message>}
              </div>
              
              <div className="mt-6">
                <h2 className="text-2xl font-bold mb-3">Доставка</h2>
                <p className="text-gray-300">
                  <strong>Адрес:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city} {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                </p>
              </div>
              
              <div className="mt-6">
                <h2 className="text-2xl font-bold mb-3">Метод на плащане</h2>
                <p className="text-gray-300">
                  <strong>Метод:</strong> {cart.paymentMethod}
                </p>
              </div>
            </div>
            
            <button
              type="button"
              className="mt-6 w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
              disabled={cart.cartItems.length === 0}
              onClick={placeOrderHandler}
            >
              Поръчай
            </button>
            
            {isLoading && <Loader />}
          </div>
        </>
      );
      
    
};

export default PlaceOrder;
