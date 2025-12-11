"use client";

import supabase from "@/lib/supabase";
import { ICoffeeshop } from "@/types/coffeeshop";
import { useEffect, useState } from "react";

export default function DetailMenu({ params }: { params: { id: string } }) {
  const [menu, setMenu] = useState<ICoffeeshop | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      const idNum = Number(params.id);
      if (isNaN(idNum)) return;

      const { data, error } = await supabase
        .from("coffeeshop")
        .select("*")
        .eq("id", idNum)
        .single();

      if (!error && data) {
        setMenu(data);
      }
    };

    fetchMenu();
  }, [params.id]);

  if (!menu) {
    return <div className="container mx-auto py-8">Menu tidak ditemukan.</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">{menu.name}</h1>
      <p className="text-lg text-gray-700 mb-2">Category: {menu.category}</p>
      <p className="text-2xl font-semibold text-green-600 mb-4">Price: ${menu.price}.00</p>

      {menu.image && (
        <img
          src={menu.image}
          alt={menu.name}
          className="w-auto max-w-[500px] h-auto max-h-[500px] object-cover object-center rounded-lg mb-6"
        />
      )}

      {menu.description && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="leading-relaxed">{menu.description}</p>
        </div>
      )}
    </div>
  );
}