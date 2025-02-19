import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    useCreateProductMutation,
    useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [cType, setCType] = useState("");
    const [boosterPack, setBoosterPack] = useState("");
    const [year, setYear] = useState("");
    const [stock, setStock] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();

    const [uploadProductImage] = useUploadProductImageMutation();
    const [createProduct] = useCreateProductMutation();
    const { data: categories } = useFetchCategoriesQuery();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const productData = new FormData();
            productData.append("image", image);
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("category", category);
            productData.append("quantity", quantity);
            productData.append("cType", cType);
            productData.append("boosterPack", boosterPack);
            productData.append("year", year);
            productData.append("countInStock", stock);

            const { data } = await createProduct(productData);

            if (data.error) {
                toast.error("Product create failed. Try again.");
            } else {
                toast.success(`${data.name} is created`);
                navigate("/");
            }
        } catch (error) {
            console.error(error);
            toast.error("Product create failed. Try again.");
        }
    };

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);

        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
            setImageUrl(res.image);
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-900 text-white min-h-screen flex justify-center items-center">
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
                <AdminMenu />
                <div className="md:w-3/4 p-6 bg-gray-800 rounded-lg shadow-lg mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-center">Create Product</h2>

                    {imageUrl && (
                        <div className="text-center mb-4">
                            <img
                                src={imageUrl}
                                alt="product"
                                className="block mx-auto max-h-[200px] rounded-lg" 
                            />
                        </div>
                    )}

                    <div className="mb-6">
                        <label className="border border-gray-600 text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-4 bg-gray-700 hover:bg-gray-600">
                            {image ? image.name : "Upload Image"}
                            <input 
                                type="file" 
                                name="image"
                                accept="image/*"
                                onChange={uploadFileHandler}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { label: "Name", value: name, setValue: setName },
                            { label: "Price", value: price, setValue: setPrice, type: "number" },
                            { label: "Quantity", value: quantity, setValue: setQuantity, type: "number" },
                            { label: "Card Type", value: cType, setValue: setCType },
                            { label: "Booster Pack", value: boosterPack, setValue: setBoosterPack },
                            { label: "Year", value: year, setValue: setYear, type: "number" },
                            { label: "Count In Stock", value: stock, setValue: setStock, type: "number" },
                        ].map(({ label, value, setValue, type = "text" }) => (
                            <div key={label}>
                                <label className="block mb-2 font-semibold">{label}</label>
                                <input type={type} className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-pink-500" value={value} onChange={(e) => setValue(e.target.value)} />
                            </div>
                        ))}
                        <div>
                            <label className="block mb-2 font-semibold">Category</label>
                            <select className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-pink-500" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">Select a category</option>
                                {categories?.map((c) => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <label className="block mt-6 font-semibold">Description</label>
                    <textarea className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white h-24 focus:ring-2 focus:ring-pink-500" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

                    <button onClick={handleSubmit} className="py-4 px-10 mt-6 w-full md:w-auto rounded-lg text-lg font-bold bg-pink-600 hover:bg-pink-500">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
