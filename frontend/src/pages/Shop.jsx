import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { setCategories, setProducts, setChecked } from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector((state) => state.shop);

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter((product) => {
          return (
            product.price.toString().includes(priceFilter) ||
            product.price === parseInt(priceFilter, 10)
          );
        });
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleCardtypeClick = (cType) => {
    const productsByCardtype = filteredProductsQuery.data?.filter(
      (product) => product.cType === cType
    );
    dispatch(setProducts(productsByCardtype));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value ? [...checked, id] : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueCardtypes = [
    ...Array.from(new Set(filteredProductsQuery.data?.map((product) => product.cType).filter((cType) => cType !== undefined))),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <>
      <div className="max-w-[90%] mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-4 rounded-xl w-full md:w-[15rem] min-h-screen overflow-y-auto relative shadow-2xl">
            <h2 className="text-lg font-bold text-center py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full mb-4 text-white">
              Филтър по категории
            </h2>
            <div className="space-y-3">
              {categories?.map((c) => (
                <div key={c._id} className="group">
                  <label className="flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 group-hover:bg-white/10 cursor-pointer">
                    <input
                      type="checkbox"
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-5 h-5 accent-pink-500 bg-gray-700 border-gray-600 rounded focus:ring-pink-500"
                    />
                    <span className="text-gray-300 group-hover:text-white">{c.name}</span>
                  </label>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-bold text-center py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full mb-4 mt-6 text-white">
              Филтър по тип карта
            </h2>
            <div className="space-y-3">
              {uniqueCardtypes?.map((cType) => (
                <label key={cType} className="flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 hover:bg-white/10 cursor-pointer">
                  <input
                    type="radio"
                    name="cType"
                    onChange={() => handleCardtypeClick(cType)}
                    className="w-5 h-5 accent-pink-500 bg-gray-700 border-gray-600 rounded-full focus:ring-pink-500"
                  />
                  <span className="text-gray-300 hover:text-white">{cType}</span>
                </label>
              ))}
            </div>

            <h2 className="text-lg font-bold text-center py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full mb-4 mt-6 text-white">
              Филтър по цена
            </h2>
            <div className="p-2">
              <input
                type="text"
                placeholder="Въведете цена"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="p-2 mt-4">
              <button
                className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg text-white font-semibold hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-pink-500/20"
                onClick={() => window.location.reload()}
              >
                Нулирай
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <h2 className="text-center mb-4 text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {products?.length} Продукти
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.length === 0 ? <Loader /> : products?.map((p) => <ProductCard key={p._id} p={p} />)}
            </div>
          </div>
        </div>
      </div>
    </>
);
  
};

export default Shop;
