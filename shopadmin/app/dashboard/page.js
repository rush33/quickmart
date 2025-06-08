"use client";
import { useState, useEffect } from "react";
import { navigation } from "@/data/navigation";
import { navsFooter } from "@/data/navsFooter";
import Orders from "@/components/Orders";
import OrderHistory from "@/components/OrderHistory";
import Settings from "@/components/Settings";
import Items from "@/components/Items";
import { db } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Spinner from "@/components/Spinner";

const Sidebar = () => {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [shop, setShop] = useState({});
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const shopId = localStorage.getItem("shopAdminId");

    if (!shopId) {
      console.error("No shopId found in localStorage");
      return;
    }

    const resRef = doc(db, "shops", shopId);

    // Setup real-time listener
    const unsubscribe = onSnapshot(
      resRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setShop({ ...data, id: docSnapshot.id });
        } else {
          console.log("No shop data found!");
        }
      },
      (error) => {
        console.error("Error listening to shop changes:", error);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="flex-none w-3/12 fixed top-0 left-0 h-full border-r bg-white sm:w-80">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-20 flex items-center px-8">
            <p className="font-bold text-2xl">Dashboard</p>
          </div>

          {/* Navigation */}
          <ul className="flex-1 overflow-auto px-4 text-base font-medium">
            {navigation.map((item, index) => (
              <li key={index} onClick={() => setActive(index)}>
                <div
                  className={`my-3 flex items-center gap-x-2 p-2 rounded-xl cursor-pointer hover:bg-green-100 duration-150 ${
                    active === index
                      ? "bg-green-100 border-l-4 border-b-4 border-green-500"
                      : "text-gray-700"
                  }`}
                >
                  <span className="text-gray-500">{item.icon}</span>
                  {item.name}
                </div>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="px-4 pb-4 border-t">
            <ul>
              <li onClick={handleLogout} className="cursor-pointer">
                <div className="flex items-center gap-x-2 p-2 rounded-xl hover:bg-green-100 duration-150">
                  <span className="text-gray-500">{navsFooter[0].icon}</span>
                  Logout
                </div>
              </li>
            </ul>

            <div className="flex items-center gap-x-4 mt-4">
              <Image
                width={40}
                height={40}
                src={shop.image || "https://img.icons8.com/office/40/shop.png"}
                alt="shop"
                className="rounded-full"
              />
              <div>
                <span className="block text-gray-700 font-bold">
                  {shop.name || "Shop Name"}
                </span>
                <span className="block text-gray-500 text-sm">
                  {shop.address || "Address"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-auto w-9/12 ml-[25%]">
        {active === 0 && <Orders shopId={shop.id} />}
        {active === 1 && <Items shopId={shop.id} />}
        {active === 2 && <OrderHistory shopId={shop.id} />}
        {active === 3 && <Settings shopId={shop.id} />}
      </main>
    </div>
  );
};

export default Sidebar;
