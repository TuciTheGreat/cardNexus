import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <div className="bg-gray-900 text-white min-h-screen mt-8 sm:mt-0">
      {!keyword && <Header />}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          {/* Title & Shop Button */}
          <div className="text-center py-8 px-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-wide">
              ⚡ Special Yu-Gi-Oh! Cards ⚡
            </h1>
            <Link
              to="/shop"
              className="mt-4 inline-block bg-red-600 hover:bg-red-500 text-white font-bold rounded-full py-3 px-6 text-lg shadow-md transition"
            >
              🛒 Shop Now
            </Link>
          </div>

          {/* Product Grid */}
          <div className="container mx-auto px-4 sm:px-8 md:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.products.map((product) => (
                <div key={product._id} className="flex justify-center">
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
