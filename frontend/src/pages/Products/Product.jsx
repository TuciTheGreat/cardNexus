import { Link } from "react-router-dom"
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-[30rem] ml-[2rem] p-3 relative">
        <div className="relative">
            <img 
                src={product.image} 
                alt={product.name} 
                className="w-[20rem] rounded"
            />
            <div className="ml-[21rem]">
                <HeartIcon product={product} />
            </div>
        </div>

        <div className="p-4">
            <Link to={`/product/${product._id}`}>
                <h2 className="flex justify-between items-center">
                    <div className="text-lg">{product.name}</div>
                    <span className="bg-slate-700 text-pink-300 text-sm font-medium mr-20 px-2.5 py-0.5
                    rounded-full dark:bg-pink-900 dark:text-pink-300">
                        $ {product.price}
                    </span>
                </h2>
            </Link>
        </div>

    </div>
  );
};

export default Product;
