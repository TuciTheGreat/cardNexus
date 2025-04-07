import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const addToCartHandler = (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
    };

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate("/login?redirect=/shipping");
    };

    return (
        <div className="container flex flex-col md:flex-row justify-center items-start flex-wrap mx-auto mt-8 px-4">
          {cartItems.length === 0 ? (
            <div className="text-center mt-8 flex justify-center items-start h-screen">
              <p className="text-xl">
                Вашата количка е празна{" "}
                <Link to="/shop" className="text-pink-500">
                  Отидете в магазина
                </Link>
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col w-full md:w-3/4">
                <h1 className="text-2xl font-semibold mb-4 text-center md:text-left">
                  Количка за пазаруване
                </h1>
      
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col md:flex-row items-center md:items-start mb-4 pb-2 border-b border-gray-700"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
      
                    <div className="flex-1 mt-2 md:mt-0 md:ml-4 text-center md:text-left">
                      <Link to={`/product/${item._id}`} className="text-pink-500">
                        {item.name}
                      </Link>
                      <div className="mt-2 text-white">{item.cType}</div>
                      <div className="mt-2 text-white font-bold">$ {item.price}</div>
                    </div>
      
                    <div className="w-24 mt-2 md:mt-0">
                      <select
                        className="w-full p-1 border rounded bg-zinc-700"
                        value={item.qty}
                        onChange={(e) =>
                          addToCartHandler(item, Number(e.target.value))
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
      
                    <div className="mt-2 md:mt-0 md:ml-4">
                      <button
                        className="text-red-500"
                        onClick={() => removeFromCartHandler(item._id)}
                      >
                        <FaTrash className="ml-2 md:ml-4 mt-1" />
                      </button>
                    </div>
                  </div>
                ))}
      
                <div className="mt-8 w-full md:w-1/2 mx-auto">
                  <div className="p-4 rounded-lg text-center md:text-left">
                    <h2 className="text-xl font-semibold mb-2">
                      Артикули ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                    </h2>
      
                    <div className="text-2xl font-bold">
                      $ {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                    </div>
      
                    <button
                      className="bg-pink-500 mt-4 py-2 px-4 rounded-full text-lg w-full"
                      disabled={cartItems.length === 0}
                      onClick={checkoutHandler}
                    >
                      Преминете към плащане
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      );
      
};

export default Cart;
