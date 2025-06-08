import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import MapPickerContainer from "@/components/Map";
import { supabase } from "@/supabase";

const Settings = ({ shopId }) => {
  const [shopData, setShopData] = useState({
    name: "",
    address: "",
    genre: "",
    image: "",
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [image, setImage] = useState(null);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const resRef = doc(db, "shops", shopId);
        const docSnap = await getDoc(resRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setShopData({
            name: data.name || "",
            address: data.address || "",
            genre: data.genre ? data.genre.join(", ") : "",
            image: data.image ? data.image : null
          });
          if (data.latitude && data.longitude) {
            setCoords([data.latitude, data.longitude]);
          }
        }
      } catch (error) {
        console.error("Error fetching shop details:", error);
      }
    };

    if (shopId) {
      fetchShopData();
    }
  }, [shopId]);
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setShopData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    let imageUrl = shopData.image; 
    if (image) {
      const filePath = `shop/${Date.now()}_${image.name}`;
      const { data, error } = await supabase.storage
        .from("shop")
        .upload(filePath, image);
  
      if (error) {
        console.error("Upload error:", error);
        setLoading(false);
        return;
      }
  
      const { data: publicData } = supabase.storage
        .from("shop")
        .getPublicUrl(filePath);
  
      imageUrl = publicData?.publicUrl;
    }
  
    const dataToUpdate = {};
  
    for (const [key, value] of Object.entries(shopData)) {
      if (value.trim() !== "") {
        if (key === "genre") {
          dataToUpdate[key] = value.split(",").map((item) => item.trim());
        } else {
          dataToUpdate[key] = value;
        }
      }
    }
  
    // ✅ Add image URL to update payload here
    dataToUpdate.image = imageUrl;
  
    if (coords) {
      dataToUpdate.latitude = coords[0];
      dataToUpdate.longitude = coords[1];
    }
  
    try {
      const resRef = doc(db, "shops", shopId);
      await updateDoc(resRef, dataToUpdate);
      console.log("Shop details updated successfully");
    } catch (error) {
      console.error("Error updating shop details:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Edit Shop Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shop Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shop Name
          </label>
          <input
            type="text"
            name="name"
            value={shopData.name}
            onChange={handleInputChange}
            placeholder="Enter shop name"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={shopData.address}
            onChange={handleInputChange}
            placeholder="Enter shop address"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent shadow-sm"
          />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shop Image
          </label>
          <label
            htmlFor="imageUpload"
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
      ${
        image || imagePreviewUrl
          ? "border-green-500 bg-green-100"
          : "border-gray-300 bg-white hover:bg-gray-100"
      }
    `}
          >
            {imagePreviewUrl || shopData.image ? (
              <img
                src={imagePreviewUrl || shopData.image}
                alt="Preview"
                className="h-full object-contain"
              />
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
                  Click to upload or drag & drop photo of the shop
                </p>
              </>
            )}
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setImage(file);
              if (file) {
                const previewUrl = URL.createObjectURL(file);
                setImagePreviewUrl(previewUrl);
              }
            }}
            className="hidden"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            3 Things you sell (separated by commas)
          </label>
          <input
            type="text"
            name="genre"
            value={shopData.genre}
            onChange={handleInputChange}
            placeholder="e.g. Bread, Milk, Eggs"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shop Location
          </label>
          <MapPickerContainer setCoords={setCoords} />
          {coords && (
            <p className="text-xs text-gray-500 mt-1">
              Picked coordinates: {coords[0].toFixed(5)}, {coords[1].toFixed(5)}
            </p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full cursor-pointer inline-flex items-center justify-center gap-1 py-2 px-3 mt-2 font-semibold text-sm text-center text-gray-700 bg-green-100 border-l-4 border-b-4 border-green-500 hover:bg-green-100 active:bg-green-400 duration-150 rounded-xl sm:mt-0"
          >
            {loading ? "Updating..." : "Update Details"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
