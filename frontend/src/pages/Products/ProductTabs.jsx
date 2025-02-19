import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
    loadingProductReview,
    userInfo,
    submitHandler,
    rating,
    setRating,
    comment,
    setComment,
    product,
}) => {
    const { data, isLoading } = useGetTopProductsQuery();
    const [activeTab, setActiveTab] = useState(1);

    if (isLoading) {
        return <Loader />;
    }

    const handleTabClick = (tabNumber) => {
        setActiveTab(tabNumber);
    };

    return (
        <div className="flex flex-col md:flex-row my-10 px-10"> {/* Adjusted padding */}
            <section className="mr-0 md:mr-12 w-full md:w-1/3"> {/* Adjusted margin */}
                {['Write Your Review', 'All Reviews', 'Related Products'].map((tab, index) => (
                    <div
                        key={index}
                        className={`p-4 cursor-pointer text-lg ${activeTab === index + 1 ? "font-bold" : ""}`}
                        onClick={() => handleTabClick(index + 1)}
                    >
                        {tab}
                    </div>
                ))}
            </section>

            <section className="w-full md:w-2/3">
                {activeTab === 1 && (
                    <div className="mt-4">
                        {userInfo ? (
                            <form onSubmit={submitHandler} className="space-y-4">
                                <div>
                                    <label htmlFor="rating" className="block text-xl mb-2">
                                        Rating
                                    </label>
                                    <select 
                                        id="rating" 
                                        required 
                                        value={rating} 
                                        onChange={(e) => setRating(e.target.value)}
                                        className="p-2 border rounded-lg w-full bg-zinc-700"
                                    >
                                        <option value="">Select</option>
                                        <option value="1">Inferior</option>
                                        <option value="2">Decent</option>
                                        <option value="3">Great</option>
                                        <option value="4">Excellent</option>
                                        <option value="5">Exceptional</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="comment" className="block text-xl mb-2">
                                        Comment
                                    </label>
                                    <textarea 
                                        id="comment" 
                                        rows="3" 
                                        required
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="p-2 border rounded-lg w-full bg-zinc-700 text-white"
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={loadingProductReview}
                                    className="bg-pink-600 text-white py-2 px-4 rounded-lg"
                                >
                                    Submit
                                </button>
                            </form>
                        ) : (
                            <p>Please <Link to="/login" className="text-blue-400">sign in</Link> to write a review</p>
                        )}
                    </div>
                )}

                {activeTab === 2 && (
                    <div>
                        {product.reviews.length === 0 && <p>No Reviews</p>}
                        {product.reviews.map((review) => (
                            <div 
                                key={review._id}
                                className="bg-gray-800 p-4 rounded-lg mt-4"
                            >
                                <div className="flex justify-between text-gray-400">
                                    <strong>{review.name}</strong>
                                    <p>{review.createdAt.substring(0, 10)}</p>
                                </div>
                                <p className="my-2">{review.comment}</p>
                                <Ratings value={review.rating} />
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 3 && (
                    <section className="flex flex-wrap justify-center gap-4">
                        {!data ? (
                            <Loader />
                        ) : (
                            data.map((product) => (
                                <SmallProduct key={product._id} product={product} />
                            ))
                        )}
                    </section>
                )}
            </section>
        </div>
    );
};

export default ProductTabs;
