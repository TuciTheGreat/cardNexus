import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-full max-w-[220px] sm:max-w-[250px] lg:max-w-[280px] p-3 bg-gray-800 rounded-lg shadow-md flex flex-col sm:ml-2 md:ml-4 lg:ml-6">
      <div className="relative flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="h-[200px] w-full object-contain rounded-md" // Ensuring full image display
        />
        <div className="absolute top-2 right-2">
          <HeartIcon product={product} />
        </div>
      </div>
      <div className="p-3">
        <Link to={`/product/${product._id}`} className="block text-lg font-bold">
          {product.name}
        </Link>
        <span className="text-red-400 text-sm font-medium">${product.price}</span>
      </div>
    </div>
  );
};

export default SmallProduct;
