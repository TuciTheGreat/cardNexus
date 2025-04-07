import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice"; 
import { Link } from "react-router-dom";
import { useProfileMutation } from "../../redux/api/usersApiSlice";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    setUsername(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password != confirmPassword) {
        toast.error("Password do not match");
    } else {
        try {
            const res = await updateProfile({
                _id: userInfo._id,
                username,
                email,
                password,
            }).unwrap();
            dispatch(setCredentials({ ...res }));
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error?.data?.message || error.message);
        }
    }
  };

  return (
    <div className="container mx-auto px-4 mt-16 md:mt-24 mb-8 min-h-screen">
      <div className="flex justify-center items-start">
        <div className="w-full max-w-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-white/10 mx-2 sm:mx-0">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Редактиране на профила
            </h2>
            <p className="text-gray-400 mt-1 md:mt-2 text-sm sm:text-base">
              Актуализирайте вашата лична информация
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-4 md:space-y-6">
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2">
                  Име
                </label>
                <input 
                  type="text" 
                  placeholder="Въведете име" 
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-zinc-800/70 border border-white/10 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 text-sm sm:text-base"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2">
                  Имейл
                </label>
                <input 
                  type="email" 
                  placeholder="Въведете имейл" 
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-zinc-800/70 border border-white/10 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 text-sm sm:text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2">
                  Парола
                </label>
                <input 
                  type="password" 
                  placeholder="Въведете парола" 
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-zinc-800/70 border border-white/10 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 text-sm sm:text-base"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2">
                  Потвърдете паролата
                </label>
                <input 
                  type="password" 
                  placeholder="Потвърдете парола" 
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-zinc-800/70 border border-white/10 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 text-sm sm:text-base"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
              <button 
                type="submit" 
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg font-medium sm:font-semibold text-white hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] text-sm sm:text-base shadow-md hover:shadow-pink-500/20"
              >
                Актуализирай
              </button>

              <Link
                to="/user-orders"
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-center border border-pink-600 text-pink-400 hover:text-pink-300 rounded-lg font-medium sm:font-semibold hover:bg-pink-600/10 transition-all transform hover:scale-[1.02] text-sm sm:text-base"
              >
                Моите поръчки
              </Link>
            </div>
          </form>

          {loadingUpdateProfile && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Loader />
            </div>
          )}
        </div>
      </div>
    </div>
);
  
};

export default Profile;
