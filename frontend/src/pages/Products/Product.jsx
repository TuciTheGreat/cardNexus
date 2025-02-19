import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-full sm:w-[18rem] md:w-[20rem] lg:w-[22rem] p-3 relative mx-auto mb-8 sm:ml-2 md:ml-4 lg:ml-6">
      {/* Product Card */}
      <div className="relative bg-[#1e1e2e] rounded-2xl shadow-lg p-4 flex flex-col items-center transition duration-300 hover:scale-[1.02]">
        {/* Product Image */}
        <div className="bg-[#2a2a3a] w-full h-[280px] rounded-xl flex justify-center items-center">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[260px] object-contain rounded-md"
          />
        </div>

        {/* Heart Icon */}
        <div className="absolute top-4 right-4">
          <HeartIcon product={product} />
        </div>

        {/* Product Name */}
        <div className="mt-4 text-center">
          <Link to={`/product/${product._id}`} className="block">
            <h2 className="text-lg font-semibold text-gray-200">{product.name}</h2>
          </Link>
        </div>
      </div>

      {/* Price Tag */}
<div className="absolute bottom-6 right-5 bg-[#3a3a4a] text-pink-300 text-xs font-medium px-2 py-1 rounded-full">
  ${product.price}
</div>

    </div>
  );
};

export default Product;
