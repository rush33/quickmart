import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddItemModal from "./AddItemModal";
import MenuItem from "./MenuItem";

const Items = ({ shopId }) => {
  const [isActive, setIsActive] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!shopId) return;
    getItems();
    setIsRemoved(false);
  }, [isActive, isRemoved]);

  const getItems = async () => {
    const itemsRef = collection(db, "items");
    const q = query(itemsRef, where("shopId", "==", shopId));

    await getDocs(q).then((querySnapshot) => {
      let item = [];
      querySnapshot.forEach((doc) => {
        item.push({ ...doc.data(), id: doc.id });
      });
      setItems(item);
    });
  };

  return (
    <div className="max-w-4xl pt-8 px-4 md:px-8">
      {isActive && (
        <AddItemModal setIsActive={setIsActive} shopId={shopId} />
      )}
      <MenuItem
        setIsActive={setIsActive}
        items={items}
        setIsRemoved={setIsRemoved}
      />
    </div>
  );
};

export default Items;
