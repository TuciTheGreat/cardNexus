import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
    useUpdateProductMutation, 
    useDeleteProductMutation, 
    useGetProductByIdQuery,
    useUploadProductImageMutation, 
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductUpdate = () => {
    const params = useParams();

    const { data: productData } = useGetProductByIdQuery(params._id);

    const [image, setImage] = useState(productData?.image || "");
    const [name, setName] = useState(productData?.name || "");
    const [description, setDescription] = useState(productData?.description || "");
    const [price, setPrice] = useState(productData?.price || "");
    const [quantity, setQuantity] = useState(productData?.quantity || "");
    const [category, setCategory] = useState(productData?.category || "");
    const [cType, setCType] = useState(productData?.cType || "");
    const [boosterPack, setBoosterPack] = useState(productData?.boosterPack || "");
    const [year, setYear] = useState(productData?.year || "");
    const [stock, setStock] = useState(productData?.countInStock);

    const navigate = useNavigate();

    const { data: categories = [] } = useFetchCategoriesQuery();
    const [uploadProductImage] = useUploadProductImageMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    useEffect(() => {
        if (productData && productData._id) {
            setName(productData.name);
            setDescription(productData.description);
            setPrice(productData.price);
            setCategory(productData.category?._id);
            setQuantity(productData.quantity);
            setCType(productData.cType);
            setBoosterPack(productData.boosterPack);
            setYear(productData.year);
            setImage(productData.image);
        }
    }, [productData]);


    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);

        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success("Item added successfully");
            setImage(res.image);
        } catch (error) {
            console.error(error);
            toast.error("Item added successfully");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("image", image);
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("quantity", quantity);
            formData.append("cType", cType);
            formData.append("boosterPack", boosterPack);
            formData.append("year", year);
            formData.append("countInStock", stock);

            console.log(formData);
            
            const { data } = await updateProduct({productId: params._id, formData});

            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success("Product successfully updated");
                navigate("/admin/allproductslist");
            }
        } catch (error) {
            console.log(error);
            toast.error("Product update failed. Try again.");
        }
    };

    const handleDelete = async () => {
        try {
            let answer = window.confirm("Are you sure you want to delete this product?");

            if (!answer) return;

            const { data } = await deleteProduct(params._id);
            toast.success(`${data.name} is deleted`);
            navigate("/admin/allproductslist");
        } catch (error) {
            console.log(error);
            toast.error("Delete failed. Try again.")
        }
    };


    return (
      <div className="container mx-auto px-4 py-8 bg-gray-900 text-white min-h-screen flex justify-center items-center">
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
          <AdminMenu />
          <div className="md:w-3/4 p-6 bg-gray-800 rounded-lg shadow-lg mx-auto mt-6 md:mt-0">
            <h1 className="text-3xl font-bold mb-6 text-center">Актуализиране на продукт</h1>
    
            {image && (
              <div className="text-center mb-6">
                <img
                  src={image}
                  alt="Продукт"
                  className="block mx-auto max-h-[250px] object-cover rounded-lg border-2 border-gray-700"
                />
              </div>
            )}
    
            <div className="mb-6">
              <label className="border text-white px-6 py-3 w-full text-center rounded-lg cursor-pointer font-semibold transition-all duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {image ? image.name : "Качи изображение"}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="hidden"
                />
              </label>
            </div>
    
            <div className="space-y-6">
              {/* Формови полета */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-white">Име</label>
                  <input
                    type="text"
                    className="w-full p-4 mt-2 border border-gray-700 rounded-lg bg-[#101011] text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="price" className="text-sm font-medium text-white">Цена</label>
                  <input
                    type="number"
                    className="w-full p-4 mt-2 border border-gray-700 rounded-lg bg-[#101011] text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
    
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="quantity" className="text-sm font-medium text-white">Количество</label>
                  <input
                    type="number"
                    className="w-full p-4 mt-2 border border-gray-700 rounded-lg bg-[#101011] text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="cType" className="text-sm font-medium text-white">Тип карта</label>
                  <input
                    type="text"
                    className="w-full p-4 mt-2 border border-gray-700 rounded-lg bg-[#101011] text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={cType}
                    onChange={(e) => setCType(e.target.value)}
                  />
                </div>
              </div>
    
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="boosterPack" className="text-sm font-medium text-white">Бустър пакет</label>
                  <input
                    type="text"
                    className="w-full p-4 mt-2 border border-gray-700 rounded-lg bg-[#101011] text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={boosterPack}
                    onChange={(e) => setBoosterPack(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="year" className="text-sm font-medium text-white">Година</label>
                  <input
                    type="number"
                    className="w-full p-4 mt-2 border border-gray-700 rounded-lg bg-[#101011] text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
              </div>
    
              <div className="mb-6">
                <label htmlFor="description" className="text-sm font-medium text-white">Описание</label>
                <textarea
                  className="w-full p-4 mt-2 border border-gray-700 rounded-lg bg-[#101011] text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
    
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="stock" className="text-sm font-medium text-white">Наличност</label>
                  <input
                    type="number"
                    className="w-full p-4 mt-2 border border-gray-700 rounded-lg bg-[#101011] text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
    
                <div>
                  <label htmlFor="category" className="text-sm font-medium text-white">Категория</label>
                  <select
                    className="w-full p-4 mt-2 border border-gray-700 rounded-lg bg-[#101011] text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id} className="bg-zinc-700">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
    
              <div className="flex flex-col sm:flex-row justify-between gap-6 mt-8">
                <button
                  onClick={handleSubmit}
                  className="w-full sm:w-auto py-3 px-8 rounded-lg text-lg font-bold bg-green-600 hover:bg-green-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Изпрати
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full sm:w-auto py-3 px-8 rounded-lg text-lg font-bold bg-pink-600 hover:bg-pink-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  Изтрий
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    
};

export default ProductUpdate;