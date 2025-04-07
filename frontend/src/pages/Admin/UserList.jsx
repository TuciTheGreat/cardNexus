import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { 
    useGetUsersQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import Message from "../../components/Message";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  const {data: users, refetch, isLoading, error} = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteUser(id);
      } catch (error) {
        toast.error(error.data.message || error.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });

      setEditableUserId(null);
      refetch();
    } catch (error) {
      toast.error(error.data.message || error.error);
    }
  };

  return (
    <div className="p-4">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data.message || error.error}
        </Message>
      ) : (
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
  
          {/* Desktop View - Table */}
          <div className="hidden md:block w-full md:w-4/5 mx-auto overflow-x-auto mt-8">
            <table className="w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">ИМЕ</th>
                  <th className="px-4 py-2 text-left">ИМЕЙЛ</th>
                  <th className="px-4 py-2 text-left">АДМИН</th>
                  <th className="px-4 py-2 text-left">ДЕЙСТВИЯ</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-100 hover:text-black transition-all"
                  >
                    <td className="px-4 py-2">{user._id}</td>
  
                    <td className="px-4 py-2">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) => setEditableUserName(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {user.username}{" "}
                          <button
                            onClick={() => toggleEdit(user._id, user.username, user.email)}
                            className="ml-2 text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </td>
  
                    <td className="px-4 py-2">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editableUserEmail}
                            onChange={(e) => setEditableUserEmail(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <p>{user.email}</p>
                          <button
                            onClick={() => toggleEdit(user._id, user.username, user.email)}
                            className="ml-2 text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </td>
  
                    <td className="px-4 py-2">
                      {user.isAdmin ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </td>
  
                    <td className="px-4 py-2">
                      {!user.isAdmin && (
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Mobile View - Cards */}
          <div className="md:hidden w-full mx-auto overflow-x-auto mt-14">
            {users.map((user) => (
              <div
                key={user._id}
                className="border p-4 rounded-lg shadow hover:text-black transition-all mb-4"
              >
                <div className="text-sm text-gray-500">ID: {user._id}</div>
                <div className="font-bold text-lg">{user.username}</div>
                <div className="text-gray-600">{user.email}</div>
                <div className="text-sm">
                  Админ: {user.isAdmin ? (
                    <FaCheck className="text-green-500 inline" />
                  ) : (
                    <FaTimes className="text-red-500 inline" />
                  )}
                </div>
  
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => toggleEdit(user._id, user.username, user.email)}
                    className="bg-blue-500 text-white px-3 py-1 rounded flex items-center"
                  >
                    <FaEdit className="mr-1" /> Редактирай
                  </button>
                  {!user.isAdmin && (
                    <button
                      onClick={() => deleteHandler(user._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded flex items-center"
                    >
                      <FaTrash className="mr-1" /> Изтрий
                    </button>
                  )}
                </div>
  
                {editableUserId === user._id && (
                  <div className="mt-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={editableUserName}
                        onChange={(e) => setEditableUserName(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        value={editableUserEmail}
                        onChange={(e) => setEditableUserEmail(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                      <button
                        onClick={() => updateHandler(user._id)}
                        className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
                      >
                        <FaCheck />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );  
};

export default UserList;
