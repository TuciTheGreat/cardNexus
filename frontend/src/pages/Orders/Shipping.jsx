import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { 
    saveShippingAddress,
    savePaymentMethod,  
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const [paymentMethod, setPaymentMethod] = useState("PayPal");
    const [address, setAddress] = useState(shippingAddress.address || "");
    const [city, setCity] = useState(shippingAddress.city || "");
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
    const [country, setCountry] = useState(shippingAddress.country || "");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        dispatch(savePaymentMethod(paymentMethod));
        navigate("/placeorder");
    };

    // Payment
    useEffect(() => {
        if (!shippingAddress.address) {
            navigate("/shipping");
        }
    }, [navigate, shippingAddress]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <ProgressSteps step1 step2 />
          
          <div className="mt-8 md:mt-16 flex justify-center items-start">
            <form onSubmit={submitHandler} className="w-full max-w-[40rem] bg-[#141416] rounded-xl p-6 sm:p-8 shadow-2xl">
              <h1 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Данни за доставка
              </h1>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Адрес</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 text-gray-100 placeholder-gray-500"
                    placeholder="Въведете адрес"
                    value={address}
                    required
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
      
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Град</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 text-gray-100 placeholder-gray-500"
                      placeholder="Въведете град"
                      value={city}
                      required
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Пощенски код</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 text-gray-100 placeholder-gray-500"
                      placeholder="Въведете пощенски код"
                      value={postalCode}
                      required
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                </div>
      
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Държава</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 text-gray-100 placeholder-gray-500"
                    placeholder="Въведете държава"
                    value={country}
                    required
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
      
                <div className="pt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-4">Метод на плащане</label>
                  <div className="p-4 rounded-lg bg-gray-900 border border-gray-700 hover:border-pink-500 transition-colors">
                    <label className="flex items-center space-x-4 cursor-pointer">
                      <input
                        type="radio"
                        className="form-radio h-5 w-5 text-pink-500 border-2 border-gray-600 checked:border-pink-500"
                        name="paymentMethod"
                        value="PayPal"
                        checked={paymentMethod === "PayPal"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span className="text-gray-300 font-medium">PayPal</span>
                    </label>
                  </div>
                </div>
              </div>
      
              <button
                className="mt-8 w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-lg transform hover:scale-[1.02] active:scale-95"
                type="submit"
              >
                Продължете към плащане
              </button>
            </form>
          </div>
        </div>
      );
      
};

export default Shipping;
