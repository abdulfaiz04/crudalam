"use client"; 

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea";
import supabase from "@/lib/supabase";
import { ICoffeeshop } from "@/types/coffeeshop";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, FormEvent } from "react";
import { toast } from "sonner";

const AdminPage = () => {
    const [coffeeshop, setCoffeeshop] = useState<ICoffeeshop[]>([]);
    const [createDialog, setCreateDialog] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<{
        menu: ICoffeeshop;
        action: "edit" | "delete";
    } | null>(null);

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
    
    const handleAddMenu = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fromData = new FormData(e.currentTarget);

        try {
            const {data, error} = await supabase.from('coffeeshop').insert(Object.fromEntries(fromData)).select();

            if(error) console.log("error: ", error);
            else {
                if(data) {
                    setCoffeeshop((prev) => [...prev, ...data])
                }
                toast("Menu Added Successfully");
                setCreateDialog(false);
            }
        } catch (error) {
            console.log("error: ", error);
        }
    };

    const handleDeleteMenu = async () => {
        try {
            const {data, error} = await supabase.from('coffeeshop').delete().eq("id", selectedMenu?.menu.id);

            if(error) console.log("error: ", error);
            else {
                setCoffeeshop((prev) => prev.filter((menu) => menu.id !== selectedMenu?.menu.id),
            );
                toast("Menu Deleted Successfully");
                setSelectedMenu(null);
            }
        } catch (error) {
            console.log("error: ", error);
        }
    }

    const handleEditMenu = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fromData = new FormData(e.currentTarget);
        const newData = Object.fromEntries(fromData);

        try {
            const {error} = await supabase.from('coffeeshop').update(newData).eq("id",selectedMenu?.menu.id);

            if(error) console.log("error: ", error);
            else {
                setCoffeeshop((prev) => prev.map((menu) => menu.id === selectedMenu?.menu.id ? {...menu, ...newData} : menu))
                toast("Menu Edit Successfully");
                setSelectedMenu(null);
            }
        } catch (error) {
            console.log("error: ", error);
        }
    };

    return(
        <div className="container mx-auto py-8">
            <div className="mb-4 w-full flex justify-between">
                <div className="text-3xl font-bold">Menu</div>
                <Dialog open={createDialog} onOpenChange={setCreateDialog}>
                    <DialogTrigger asChild>
                        <Button className="font-bold">Add Menu</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <form onSubmit={handleAddMenu} className="space-y-4">
                            <DialogHeader>
                                <DialogTitle>Add Menu</DialogTitle>
                                <DialogDescription>Create a new menu by insert data in this form.</DialogDescription>
                            </DialogHeader>
                            <div className="grid w-full gap-4">
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" placeholder="Insert Name" required/>
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="price">Price</Label>
                                    <Input id="price" name="price" placeholder="Insert Price" required/>
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="image">Image</Label>
                                    <Input id="image" name="image" placeholder="Insert Image" required/>
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="category">Category</Label>
                                    <Select name="category" required>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select category"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Category</SelectLabel>
                                                <SelectItem value="Coffee">Coffee</SelectItem>
                                                <SelectItem value="Non Coffee">Non Coffee</SelectItem>
                                                <SelectItem value="Pastries">Pastries</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" placeholder="Insert Description" required
                                    className="resize-none h-32"/>
                                </div>
                            </div>
                            <DialogFooter>
                            <DialogClose>
                                <Button type="button" variant="secondary" className="cursor-pointer">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" variant="secondary" className="cursor-pointer">
                                    Create
                                </Button>
                        </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
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
                                                <DropdownMenuItem onClick={() => setSelectedMenu({menu, action: "edit"})}>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setSelectedMenu({menu, action: "delete"})} className="text-red-700">Delete</DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Dialog open={selectedMenu !== null && selectedMenu.action ==="delete"} onOpenChange={(open) => {
                if(!open) {
                    setSelectedMenu(null);
                }
            }}>
                    <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Delete Menu</DialogTitle>
                                <DialogDescription>Are you sure want to delete. {selectedMenu?.menu.name}</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                            <DialogClose>
                                <Button variant="secondary" className="cursor-pointer">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button onClick={handleDeleteMenu} variant="destructive" className="cursor-pointer">
                                    Delete
                                </Button>
                        </DialogFooter>
                    </DialogContent>
            </Dialog>
            <Dialog open={selectedMenu !== null && selectedMenu.action ==="edit"} onOpenChange={(open) => {
                if(!open) {
                    setSelectedMenu(null);
                }
            }}>
                    <DialogContent className="sm:max-w-md">
                        <form onSubmit={handleEditMenu} className="space-y-4">
                            <DialogHeader>
                                <DialogTitle>Edit Menu</DialogTitle>
                                <DialogDescription>Make changes to your menu.</DialogDescription>
                            </DialogHeader>
                            <div className="grid w-full gap-4">
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" placeholder="Insert Name" required
                                    defaultValue={selectedMenu?.menu.id}/>
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="price">Price</Label>
                                    <Input id="price" name="price" placeholder="Insert Price" required
                                    defaultValue={selectedMenu?.menu.price}/>
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="image">Image</Label>
                                    <Input id="image" name="image" placeholder="Insert Image" required
                                    defaultValue={selectedMenu?.menu.image}/>
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="category">Category</Label>
                                    <Select name="category" defaultValue={selectedMenu?.menu.category} required>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select category"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Category</SelectLabel>
                                                <SelectItem value="Coffee">Coffee</SelectItem>
                                                <SelectItem value="Non Coffee">Non Coffee</SelectItem>
                                                <SelectItem value="Pastries">Pastries</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" placeholder="Insert Description" required
                                    className="resize-none h-32"
                                    defaultValue={selectedMenu?.menu.description}/>
                                </div>
                            </div>
                            <DialogFooter>
                            <DialogClose>
                                <Button type="button" variant="secondary" className="cursor-pointer">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" variant="secondary" className="cursor-pointer">
                                    Edit
                                </Button>
                        </DialogFooter>
                        </form>
                    </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminPage;