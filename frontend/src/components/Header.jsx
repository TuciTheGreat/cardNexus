import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) return <Loader />;
  if (error) return <h1 className="text-red-500 text-center">ERROR</h1>;

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold">🌟 Top Duelist Picks 🌟</h1>
      </div>

      <div className="container mx-auto px-4 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Small Product Showcase */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((product) => (
              <SmallProduct key={product._id} product={product} />
            ))}
          </div>

          {/* Product Carousel */}
          <div className="w-full sm:w-[80%] mx-auto">
            {/* Apply Tailwind's width classes for smaller screen sizes */}
            <ProductCarousel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
