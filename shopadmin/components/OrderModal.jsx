import { useState, useEffect } from "react";
import DishInfo from "./DishInfo";
import { db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const OrderModal = ({ setIsActive, selectedOrder }) => {
  const [dishes, setDishes] = useState([]);
  const [status, setStatus] = useState("");

  const orderRef = doc(db, "orders", selectedOrder.id);

  // Fetch initial status
  useEffect(() => {
    const fetchOrder = async () => {
      const docSnap = await getDoc(orderRef);
      if (docSnap.exists()) {
        const orderData = docSnap.data();
        setStatus(orderData.status || "PENDING");
        setDishes(orderData.dishes || []);
      }
    };
    fetchOrder();
  }, [selectedOrder.id]);

  // Update Firestore when status changes
  useEffect(() => {
    if (!status || !selectedOrder?.id) return;
    const updateOrderStatus = async () => {
      await updateDoc(orderRef, { status });
    };
    updateOrderStatus();
  }, [status]);

  const statusDisplay = {
    PENDING: { text: "Order Pending ⏳", color: "text-yellow-400" },
    PREPARING: { text: "Preparing Package ", color: "text-yellow-500" },
    READY: { text: "Ready for Pickup 🛵", color: "text-green-500" },
    PICKEDUP: { text: "Picked Up by Driver 🚲", color: "text-green-500" },
    COMPLETE: { text: "Delivered ✅", color: "text-green-500" },
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div
        className="fixed inset-0 w-full h-full bg-black opacity-60"
        onClick={() => setIsActive(false)}
      ></div>
      <div className="flex items-center min-h-screen px-4 py-8">
        <div className="relative w-full max-w-2xl p-4 mx-auto bg-white rounded-2xl shadow-lg">
          <div className="flex justify-end">
            <button
              className="p-2 text-gray-500 rounded-lg hover:bg-red-100"
              onClick={() => setIsActive(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
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

          <div className="text-center py-3 space-y-3">
            <h4 className="text-xl font-bold text-gray-500">
              Order #{selectedOrder.id}
            </h4>
            <h4 className="text-lg font-bold text-gray-500">
              Current Status:{" "}
              <span className={statusDisplay[status]?.color}>
                {statusDisplay[status]?.text}
              </span>
            </h4>
          </div>

          <div className="flex flex-col gap-y-2">
            <div>
              {dishes.map((dish) => (
                <DishInfo
                  key={dish.dishId}
                  id={dish.dishId}
                  quantity={dish.quantity}
                />
              ))}
            </div>

            <div className="w-full flex py-4 justify-around font-bold text-lg text-gray-700">
              <div>Total:</div>
              <div>Rs. {selectedOrder.total}</div>
            </div>

            <div className="flex justify-center gap-4 mt-3">

              {status === "PENDING" && (
                <button
                  onClick={() => setStatus("PREPARING")}
                  className="px-4 py-2 bg-yellow-200 border-yellow-500 border-l-4 border-b-4 rounded-xl hover:bg-yellow-300 font-bold"
                >
                  Start Preparing
                </button>
              )}

              {status === "PREPARING" && (
                <button
                  onClick={() => setStatus("READY")}
                  className="px-4 py-2 bg-blue-200 border-blue-500 border-l-4 border-b-4 rounded-xl hover:bg-blue-300 font-bold"
                >
                  Mark as Ready
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
