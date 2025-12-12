import supabase from "@/lib/supabase";

export default async function DetailMenu({ params }: { params: { id: string } }) {
  const idNum = Number(params.id);
  if (isNaN(idNum)) {
    return <div className="container mx-auto py-8">Menu tidak ditemukan.</div>;
  }

  const { data, error } = await supabase
    .from("coffeeshop")
    .select("*")
    .eq("id", idNum)
    .single();

  if (!data || error) {
    return <div className="container mx-auto py-8">Menu tidak ditemukan.</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">{data.name}</h1>
      <p className="text-lg text-gray-700 mb-2">Category: {data.category}</p>
      <p className="text-2xl font-semibold text-green-600 mb-4">Price: ${data.price}.00</p>

      {data.image && (
        <img
          src={data.image}
          alt={data.name}
          className="w-auto max-w-[500px] h-auto max-h-[500px] object-cover object-center rounded-lg mb-6"
        />
      )}

      {data.description && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="leading-relaxed">{data.description}</p>
        </div>
      )}
    </div>
  );
}
