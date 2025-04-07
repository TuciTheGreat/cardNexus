import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Custom Arrow Components
const CustomPrevArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
    onClick={onClick}
  >
    <FaChevronLeft className="text-xl sm:text-2xl" />
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
    onClick={onClick}
  >
    <FaChevronRight className="text-xl sm:text-2xl" />
  </button>
);

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="mb-4 w-full max-w-[1000px] mx-auto relative sm:w-[90%] md:w-[80%] lg:w-[100%] sm:ml-2 md:ml-4 lg:ml-6">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <Slider {...settings} className="w-full relative">
          {products.map((product) => (
            <div key={product._id} className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
              {/* Изображение на продукта */}
              <img
                src={product.image}
                alt={product.name}
                className="rounded-lg w-full h-[400px] object-contain sm:h-[250px] md:h-[300px] lg:h-[400px]"
              />
  
              {/* Информация за продукта */}
              <div className="mt-4 text-left">
                <h2 className="text-lg sm:text-xl font-bold">{product.name}</h2>
                <p className="text-pink-400 text-sm sm:text-base font-semibold">
                  ${product.price}
                </p>
                <p className="text-gray-300 text-xs sm:text-sm mt-2">
                  {product.description.substring(0, 170)}...
                </p>
              </div>
  
              {/* Детайли за продукта */}
              <div className="mt-4 flex flex-wrap justify-between text-xs sm:text-sm text-gray-400">
                <div className="flex items-center">
                  <FaStore className="mr-2 text-pink-400" /> Тип: {product.cType}
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-2 text-blue-400" /> Добавена: {moment(product.createdAt).fromNow()}
                </div>
              </div>
  
              <div className="mt-4 flex flex-wrap justify-between text-xs sm:text-sm text-gray-400">
                <div className="flex items-center">
                  <FaStar className="mr-2 text-yellow-400" /> Ревюта: {product.numReviews}
                </div>
                <div className="flex items-center">
                  <FaStar className="mr-2 text-yellow-400" /> Оценка: {Math.round(product.rating)}
                </div>
                <div className="flex items-center">
                  <FaShoppingCart className="mr-2 text-green-400" /> Количество: {product.quantity}
                </div>
                <div className="flex items-center">
                  <FaBox className="mr-2 text-red-400" /> Наличност: {product.countInStock}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
  
};

export default ProductCarousel;
