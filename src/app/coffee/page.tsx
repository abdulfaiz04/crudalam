"use client"; 

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import supabase from "@/lib/supabase";
import { ICoffeeshop } from "@/types/coffeeshop";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const AdminPage = () => {
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

    return(
        <div className="container mx-auto py-8">
            <div className="mb-4 w-full flex justify-between">
                <div className="text-3xl font-bold">Menu</div>
                <Button className="font-bold">Add Menu</Button>
            </div>
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {coffeeshop.map((menu: ICoffeeshop) => (
                            <TableRow key={menu.id}>
                                <TableCell className="flex gap-3 items-center w-full">
                                    <Image width={50} height={50} src={menu.image} alt={menu.name} className="aspect-square object-cover rounded-lg"
                                    />
                                    {menu.name}
                                </TableCell>
                                <TableCell>
                                    {menu.description.split(" ").slice(0, 6).join(" ") +"..."}
                                </TableCell>
                                <TableCell>{menu.category}</TableCell>
                                <TableCell>${menu.price}.00</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild className="cursor-pointer">
                                            <Ellipsis/>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuLabel className="font-bold">
                                                Action
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>Update</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-700">Delete</DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminPage;