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
    <div className="bg-gray-900 text-white min-h-screen mt-8 sm:mt-0 flex flex-col">
      {!keyword && <Header />}

      <main className="flex-1">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">
            {isError?.data.message || isError.error}
          </Message>
        ) : (
          <>
            {/* Заглавие и бутон за пазаруване */}
            <div className="text-center py-8 px-4">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-wide">
                ⚡ Специални Yu-Gi-Oh! Карти ⚡
              </h1>
              <Link
                to="/shop"
                className="mt-4 inline-block bg-red-600 hover:bg-red-500 text-white font-bold rounded-full py-3 px-6 text-lg shadow-md transition"
              >
                🛒 Пазарувай сега
              </Link>
            </div>

            {/* Мрежа от продукти */}
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
      </main>

      <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12 pl-4 sm:pl-14 md:pl-20 lg:pl-20 xl:pl-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold">CardNexus</h3>
              <p className="mt-2 text-gray-400">Rare Yu-Gi-Oh! cards — authenticated & shipped worldwide.</p>
              <div className="mt-4 flex items-center space-x-3">
                <a aria-label="twitter" href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 7.5c-.6.3-1.2.4-1.9.5.7-.4 1.3-1 1.6-1.7-.6.4-1.3.6-2 .8-.6-.7-1.5-1.2-2.4-1.2-1.8 0-3.2 1.7-2.8 3.4-2.4-.1-4.6-1.3-6-3.1-.8 1.4-.4 3.2 1 4.1-.5 0-1-.2-1.4-.4 0 1.6 1.1 3 2.6 3.3-.5.1-1 .1-1.5 0 .4 1.3 1.6 2.2 3 2.3-1.1.8-2.5 1.2-3.9 1.2H5c1.4.9 3 1.4 4.7 1.4 5.6 0 8.7-4.6 8.7-8.6v-.4c.6-.4 1.1-1 1.5-1.6-.6.3-1.3.5-2 .6"/>
                  </svg>
                </a>
                <a aria-label="instagram" href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.2A3.8 3.8 0 1015.8 12 3.8 3.8 0 0012 8.2zM18 7.5a1 1 0 11-2 0 1 1 0 012 0z"/>
                  </svg>
                </a>
                <a aria-label="discord" href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h14l2-2V6a2 2 0 00-2-2zM9.5 13.5c0 .8-.7 1.5-1.5 1.5S6.5 14.3 6.5 13.5 7.2 12 8 12s1.5.7 1.5 1.5zm6 0c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5 1.5.7 1.5 1.5z"/>
                  </svg>
                </a>
              </div>
            </div>

            
            <div>
              <h4 className="font-semibold mb-2">Support</h4>
              <ul className="space-y-1 text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white">Shipping</Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">Contact</Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">Terms</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Join Newsletter</h4>
              <p className="text-gray-400 text-sm">Be the first to know about drops and promos.</p>
              <form className="mt-3 flex w-full">
                <input
                  aria-label="email"
                  type="email"
                  placeholder="Email address"
                  className="w-full px-3 py-2 rounded-l-md bg-gray-800 border border-gray-700 placeholder-gray-500 focus:outline-none"
                />
                <button className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-r-md font-semibold">Subscribe</button>
              </form>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-6 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm text-gray-400">
            <div>© {new Date().getFullYear()} CardNexus. All rights reserved.</div>
            <div className="mt-4 sm:mt-0 space-x-4">
              <Link to="/privacy" className="hover:text-white">Privacy</Link>
              <Link to="/sitemap" className="hover:text-white">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
  
};

export default Home;
