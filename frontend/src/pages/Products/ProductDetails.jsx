import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { 
    useGetProductDetailsQuery, 
    useCreateReviewMutation, 
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { 
    FaBox,
    FaClock,
    FaShoppingCart,
    FaStar,
    FaStore, 
} from "react-icons/fa";
import moment from "moment";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
    const {id: productId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const {
        data: product,
        isLoading,
        refetch,
        error,
    } = useGetProductDetailsQuery(productId);

    const { userInfo } = useSelector((state) => state.auth);

    const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            await createReview({
                productId,
                rating,
                comment,
            }).unwrap();
            refetch();
            toast.success("Review created successfully");
        } catch (error) {
            toast.error(error?.data || error.message);
        }
    };

    const addToCartHandler = () => {
        dispatch(addToCart({...product, qty}));
        navigate("/cart");
    };

    return (
        <>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.message}
            </Message>
          ) : (
            <>
              <div className="flex flex-col md:flex-row items-center mt-8 px-4 md:px-10">
                <div className="w-full md:w-1/2">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full max-w-md mx-auto"
                  />
                </div>
      
                <div className="w-full md:w-1/2 flex flex-col px-4">
                  <h2 className="text-2xl font-semibold">{product.name}</h2>
                  <p className="my-4 text-gray-400">{product.description}</p>
                  <p className="text-4xl my-4 font-extrabold">$ {product.price}</p>
      
                  <div className="grid grid-cols-2 gap-4 text-white">
                    <div>
                      <h1 className="flex items-center mb-4">
                        <FaStore className="mr-2" /> Тип карта: {product.cType}
                      </h1>
                      <h1 className="flex items-center mb-4">
                        <FaStar className="mr-2" /> Бустър пакет: {product.boosterPack}
                      </h1>
                      <h1 className="flex items-center mb-4">
                        <FaClock className="mr-2" /> Добавена: {moment(product.createdAt).fromNow()}
                      </h1>
                    </div>
                    <div>
                      <h1 className="flex items-center mb-4">
                        <FaStar className="mr-2" /> Ревюта: {product.numReviews}
                      </h1>
                      <h1 className="flex items-center mb-4">
                        <FaShoppingCart className="mr-2" /> Количество: {product.quantity}
                      </h1>
                      <h1 className="flex items-center mb-4">
                        <FaBox className="mr-2" /> Наличност: {product.countInStock}
                      </h1>
                    </div>
                  </div>
      
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <Ratings value={product.rating} text={`${product.numReviews} ревюта`} />
                    <button
                      onClick={addToCartHandler}
                      disabled={product.countInStock === 0}
                      className="bg-pink-600 text-white py-2 px-6 rounded-lg mt-4 md:mt-0"
                    >
                      Добави в количката
                    </button>
                  </div>
                </div>
              </div>
      
              <div className="mt-10 px-4 md:px-10">
                <ProductTabs
                  loadingProductReview={loadingProductReview}
                  userInfo={userInfo}
                  submitHandler={submitHandler}
                  rating={rating}
                  setRating={setRating}
                  comment={comment}
                  setComment={setComment}
                  product={product} 
                />
              </div>
            </>
          )}
        </>
      );
      
};

export default ProductDetails;
