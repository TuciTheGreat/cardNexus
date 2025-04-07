import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

    
const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div className="max-w-sm relative bg-gradient-to-b from-[#1f1f1f] to-[#141414] rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
      <section className="relative overflow-hidden rounded-t-xl">
        <Link to={`/product/${p._id}`}>
          <span className="absolute bottom-3 right-3 bg-pink-500/90 text-white text-sm font-semibold px-3 py-1 rounded-full backdrop-blur-sm z-10">
            {p?.cType}
          </span>
          <img 
            className="cursor-pointer mx-auto transform transition-transform duration-300 group-hover:scale-105"
            src={p.image} 
            alt={p.name}
            style={{ height: "180px", objectFit: "cover" }} 
          />
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h5 className="text-xl font-bold text-white truncate">{p?.name}</h5>
          <p className="text-pink-500 font-bold text-lg ml-2">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>

        <p className="mb-4 text-gray-400 leading-relaxed">
          {p?.description?.substring(0, 60)}...
        </p>

        <section className="flex justify-between items-center">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg text-white hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-md"
          >
            Прочети още
            <svg
              className="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <button
            className="p-2.5 rounded-full bg-gray-800 hover:bg-pink-600 transition-colors duration-200 text-white hover:text-white shadow-sm hover:shadow-pink-500/30"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={22} />
          </button>
        </section>
      </div>
    </div>
);
  
};

export default ProductCard;
