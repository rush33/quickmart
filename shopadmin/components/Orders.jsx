import { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import OrdersList from "./OrdersList";

const Orders = ({ shopId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!shopId) return;

    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("shopId", "==", shopId),
      orderBy("createdAt", "desc"),
      where("status", "==", "PENDING")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let item = [];
      querySnapshot.forEach((doc) => {
        item.push({ ...doc.data(), id: doc.id });
      });
      setOrders(item);
    });

    return unsubscribe;
  }, [shopId]);
  console.log("orders", orders);

  return (
    <>
      <OrdersList orders={orders} />
    </>
  );
};

export default Orders;
