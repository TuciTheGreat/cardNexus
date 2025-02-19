import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";

const Register = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered");
      } catch (error) {
        toast.error(error?.data?.message || "An error occurred");
      }
    }
  };

  return (
    <section 
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat p-6"
      style={{ 
        backgroundImage: "url('https://preview.redd.it/aluber-the-jester-of-despia-from-yu-gi-oh-v0-l7nxpavi4fac1.png?width=640&crop=smart&auto=webp&s=cbd4dde3a2640afad08419990163c53bf56426c6')", 
        backgroundSize: "cover", 
        backgroundPosition: "center", 
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="bg-black bg-opacity-70 p-8 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4 text-white text-center">Register</h1>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white">Name</label>
            <input
              type="text"
              className="mt-1 p-2 border rounded w-full bg-gray-800 text-white"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Email Address</label>
            <input
              type="email"
              className="mt-1 p-2 border rounded w-full bg-gray-800 text-white"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Password</label>
            <input
              type="password"
              className="mt-1 p-2 border rounded w-full bg-gray-800 text-white"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Confirm Password</label>
            <input
              type="password"
              className="mt-1 p-2 border rounded w-full bg-gray-800 text-white"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button 
            disabled={isLoading} 
            type="submit" 
            className="w-full bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          {isLoading && <Loader />}
        </form>
        <div className="mt-4 text-center">
          <p className="text-white">
            Already have an account? {" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"} className="text-pink-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
