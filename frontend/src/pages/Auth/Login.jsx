import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();
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

        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
        } catch (error) {
            toast.error(error?.data?.message || error.message);
        }
    };

    return (
        <section
            className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat p-6"
            style={{
                backgroundImage:
                    'url("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/13714538-e319-4cce-9062-6941ce18525d/dht1hnv-41a703de-44d6-410b-9cc4-f7da3304843e.png/v1/fill/w_1280,h_721,q_80,strp/fallen_of_albaz__wallpaper__by_nhociory_dht1hnv-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzIxIiwicGF0aCI6IlwvZlwvMTM3MTQ1MzgtZTMxOS00Y2NlLTkwNjItNjk0MWNlMTg1MjVkXC9kaHQxaG52LTQxYTcwM2RlLTQ0ZDYtNDEwYi05Y2M0LWY3ZGEzMzA0ODQzZS5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.vs1GQHfwDB0X1KqT6EqfsRwQXw1NfMDwyA5Qrl-eUyI")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="bg-black bg-opacity-70 p-8 rounded-lg w-full max-w-md">
                <h1 className="text-2xl font-semibold mb-4 text-white text-center">Sign In</h1>
                <form onSubmit={submitHandler} className="space-y-4">
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
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
                    >
                        {isLoading ? "Signing In..." : "Sign In"}
                    </button>
                    {isLoading && <Loader />}
                </form>
                <div className="mt-4 text-center">
                    <p className="text-white">
                        New Customer?{" "}
                        <Link to={redirect ? `/register?redirect=${redirect}` : "/register"} className="text-pink-500 hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Login;
