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
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <div className="bg-[#151515] p-3 rounded-lg w-full md:w-[13rem] min-h-screen overflow-y-auto relative">
            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">Filter by Categories</h2>
            <div className="p-5">
              {categories?.map((c) => (
                <div key={c._id} className="mb-2">
                  <label className="flex items-center space-x-2 text-white">
                    <input type="checkbox" onChange={(e) => handleCheck(e.target.checked, c._id)} className="w-4 h-4" />
                    <span>{c.name}</span>
                  </label>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">Filter by Card Type</h2>
            <div className="p-5">
              {uniqueCardtypes?.map((cType) => (
                <label key={cType} className="flex items-center space-x-2 mb-2 text-white">
                  <input type="radio" name="cType" onChange={() => handleCardtypeClick(cType)} className="w-4 h-4" />
                  <span>{cType}</span>
                </label>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">Filter by Price</h2>
            <div className="p-5">
              <input
                type="text"
                placeholder="Enter Price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full px-3 py-2 bg-[#151515] border-gray-500 text-white placeholder-gray-400 border rounded-lg focus:outline-none focus:ring"
              />
            </div>

            <div className="p-5 pt-0">
              <button
                className="w-full border border-gray-500 bg-[#151515] py-2 rounded-lg text-white"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="w-full">
            <h2 className="text-center mb-2 text-white">{products?.length} Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.length === 0 ? <Loader /> : products?.map((p) => <ProductCard key={p._id} p={p} />)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
