import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";

const AllProducts = () => {
    const { data: products, isLoading, isError } = useAllProductsQuery();

    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return <div>Error loading products</div>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-0">
          <div className="flex flex-col md:flex-row items-start justify-center w-full">
            {/* Секция с центрирани продукти */}
            <div className="p-3 flex-grow max-w-4xl">
              {/* Центрирано заглавие */}
              <div className="text-2xl font-bold mb-6 text-white text-center">
                Всички продукти ({products.length})
              </div>
      
              {/* Центрирана мрежа */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="block overflow-hidden bg-gray-900 rounded-lg shadow-lg p-4 border border-gray-700 hover:shadow-xl transition"
                  >
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-contain rounded-md bg-gray-800"
                    />
      
                    <div className="mt-3">
                      <div className="flex justify-between items-center">
                        <h5 className="text-lg font-semibold text-white">
                          {product?.name}
                        </h5>
                        <p className="text-gray-400 text-xs">
                          {moment(product.createAt).format("MMMM Do YYYY")}
                        </p>
                      </div>
      
                      <p className="text-gray-300 text-sm mt-2">
                        {product?.description?.substring(0, 100)}...
                      </p>
      
                      <div className="flex justify-between items-center mt-4">
                        {/* Само бутонът "Актуализирай" е кликаем */}
                        <Link
                          to={`/admin/product/update/${product._id}`}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
                        >
                          Актуализирай
                          <svg
                            className="w-4 h-4 ml-2"
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
                        <p className="font-semibold text-lg text-white">$ {product?.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
      
            {/* Администраторско меню - няма фиксирана ширина, за да се центрират продуктите */}
            <div className="w-full md:w-auto p-3 md:p-0">
              <AdminMenu />
            </div>
          </div>
        </div>
      );
      
};

export default AllProducts;
