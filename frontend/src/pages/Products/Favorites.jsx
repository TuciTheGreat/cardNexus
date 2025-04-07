import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
    const favorites = useSelector(selectFavoriteProduct);
    console.log(favorites);

    return (
        <div className="px-4 sm:px-6 md:px-20 lg:px-28">
          <h1 className="text-2xl font-bold text-center mt-8 mb-6">
            Любими продукти
          </h1>
      
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {favorites.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </div>
      );
      
};

export default Favorites;
