import { useState } from "react";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { supabase } from "@/supabase"; 

const AddItemModal = ({ setIsActive, shopId }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("g");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    if (image) {
      const filePath = `shop/${Date.now()}_${image.name}`;
      const { data, error } = await supabase.storage
        .from("shop") 
        .upload(filePath, image);

      if (error) {
        console.error("Upload error:", error);
        return;
      }

      const { data: publicData } = supabase.storage
        .from("shop")
        .getPublicUrl(filePath);

      imageUrl = publicData?.publicUrl;
      console.log("Public URL:", imageUrl);
    }

    await addDoc(collection(db, "items"), {
      shopId,
      name,
      description,
      price: parseFloat(price),
      amount: parseFloat(amount),
      unit,
      image: imageUrl,
    });

    setIsActive(false);
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div
        className="fixed inset-0 w-full h-full bg-black opacity-60"
        onClick={() => setIsActive(false)}
      ></div>
      <div className="flex items-center min-h-screen px-4 py-8">
        <div className="relative w-full max-w-2xl p-4 mx-auto bg-white rounded-xl shadow-lg">
          <div className="flex justify-end">
            <button
              className="p-2 text-gray-500 rounded-lg hover:bg-red-100"
              onClick={() => setIsActive(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mx-auto"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="max-w-sm mx-auto py-3 space-y-3 text-center">
            <h4 className="text-2xl font-bold text-gray-800">Add Item</h4>
            <form onSubmit={handleSubmit}>
              <div className="relative my-6">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Item Name"
                  className="w-full pl-2 pr-3 py-2 text-gray-500 bg-transparent outline-none border-2 focus:border-green-500 shadow-sm rounded-lg"
                />
              </div>

              <div className="relative my-6">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price (e.g., 100)"
                  className="w-full pl-2 pr-3 py-2 text-gray-500 bg-transparent outline-none border-2 focus:border-green-500 shadow-sm rounded-lg"
                />
              </div>

              <div className="relative my-6">
                <label
                  htmlFor="imageUpload"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer 
                  ${
                    image
                      ? "border-green-500 bg-green-100"
                      : "border-gray-300 bg-white hover:bg-gray-100"
                  }`}
                >
                  {image ? (
                    <p className="text-green-700 font-medium">
                      Image Selected: {image.name}
                    </p>
                  ) : (
                    <>
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">
                        Click to upload or drag & drop photo of the product
                      </p>
                    </>
                  )}
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="hidden"
                />
              </div>

              <div className="relative my-6">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full pl-2 pr-3 py-2 text-gray-500 bg-transparent outline-none border-2 focus:border-green-500 shadow-sm rounded-lg"
                />
              </div>

              <div className="relative my-6 flex gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Quantity (e.g., 500)"
                  className="flex-1 pl-2 pr-3 py-2 text-gray-500 bg-transparent outline-none border-2 focus:border-green-500 shadow-sm rounded-lg"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="flex-1 pl-2 pr-3 py-2 text-gray-500 bg-transparent outline-none border-2 focus:border-green-500 shadow-sm rounded-lg"
                >
                  <option value="g">grams (g)</option>
                  <option value="kg">kilograms (kg)</option>
                  <option value="pc">pieces (pcs)</option>
                  <option value="L">liters (L)</option>
                  <option value="ml">mililiters (mL)</option>
                </select>
              </div>

              <button className="w-full my-3 cursor-pointer items-center gap-x-2 text-gray-700 text-base p-2 rounded-xl  hover:bg-green-100 active:bg-green-400 duration-150 bg-green-100 border-l-4 border-b-4 border-green-500">
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
