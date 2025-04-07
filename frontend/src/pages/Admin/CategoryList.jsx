import { useState } from "react";
import {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";

import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
    const { data: categories } = useFetchCategoriesQuery();
    const [name, setName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [updatingName, setUpdatingName] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!name) {
            toast.error("Category name is required");
            return;
        }

        try {
            const result = await createCategory({ name }).unwrap();
            if (result.error) {
                toast.error(result.error);
            } else {
                setName("");
                toast.success(`${result.name} is created.`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Creating category failed, try again");
        }
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        if (!updatingName) {
            toast.error("Category name is required");
            return;
        }

        try {
            const result = await updateCategory({
                categoryId: selectedCategory._id,
                updatedCategory: {
                    name: updatingName,
                },
            }).unwrap();

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`${result.name} is updated`);
                setSelectedCategory(null);
                setUpdatingName("");
                setModalVisible(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteCategory = async () => {
        try {
            const result = await deleteCategory(selectedCategory._id).unwrap();

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`${result.name} is deleted.`);
                setSelectedCategory(null);
                setModalVisible(false);
            }
        } catch (error) {
            console.error(error);
            toast.error("Category deletion failed. Try again.");
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full">
          {/* Администраторско меню */}
          <div className="ml-[10rem] flex flex-col md:flex-row z-10">
            <AdminMenu />
          </div>
      
          {/* Основно съдържание */}
          <div className="w-full p-4 mx-auto max-w-screen-xl">
            <div className="text-2xl font-semibold mb-6 text-center">
              Управление на категории
            </div>
      
            {/* Форма за категория */}
            <CategoryForm
              value={name}
              setValue={setName}
              handleSubmit={handleCreateCategory}
            />
            <br />
            <hr className="my-6" />
      
            {/* Списък с категории */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
              {categories?.map((category) => (
                <div key={category._id} className="w-full">
                  <button
                    className="bg-zinc-900 border border-pink-500 text-pink-500 py-3 px-5 rounded-lg w-full transition transform duration-200 hover:scale-105 hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                    onClick={() => {
                      setModalVisible(true);
                      setSelectedCategory(category);
                      setUpdatingName(category.name);
                    }}
                  >
                    <span className="text-lg font-medium">{category.name}</span>
                  </button>
                </div>
              ))}
            </div>
      
            {/* Модал */}
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
              <CategoryForm
                value={updatingName}
                setValue={(value) => setUpdatingName(value)}
                handleSubmit={handleUpdateCategory}
                buttonText="Актуализирай"
                handleDelete={handleDeleteCategory}
              />
            </Modal>
          </div>
        </div>
      );
      
};

export default CategoryList;
