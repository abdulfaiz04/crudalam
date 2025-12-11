"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import  supabase  from "@/lib/supabase"; 
import { ICoffeeshop } from "@/types/coffeeshop";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => { 
  const [coffeeshop, setCoffeeshop] = useState<ICoffeeshop[]>([]);

  useEffect(() => {
    const fetchCoffeeshop = async () => {
      const { data, error } = await supabase.from('coffeeshop').select("*");
      if (error) {
        console.error('Error fetching coffeeshop:', error);
      } else {
        setCoffeeshop(data);
      }
    };

    fetchCoffeeshop();
  }, []); 

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Menu</h1> {/* ✅ text-3xl, bukan text-3-xl */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {coffeeshop.map((menu: ICoffeeshop) => (
          <Card key={menu.id}>
            <CardContent className="pt-4">
              <Image
                src={menu.image}
                alt={menu.name}
                width={200}
                height={200}
                className="w-full h-[30vh] object-cover rounded-lg"
              />
              <div className="mt-4 flex justify-between">
                <div>
                  <h4 className="font-semibold text-xl">{menu.name}</h4>
                  <p>{menu.category}</p>
                </div>
                <p className="font-semibold text-2xl">${menu.price}.00</p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/menu/${menu.id}`} className="w-full">
                <Button className="w-full font-bold" size="lg">
                Detail Menu
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;