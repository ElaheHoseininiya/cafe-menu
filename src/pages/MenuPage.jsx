    import { useEffect, useState } from "react";
    import { supabase } from "../supabaseClient";

    export default function MenuPage() {
        const [items, setItems] = useState([]);
        const [category, setCategory] = useState("all");

        useEffect(() => {
            fetchMenu();
        }, []);

        async function fetchMenu() {
            const { data, error } = await supabase
                .from("menu_items")
                .select("*")
                .order("id", { ascending: true });

            if (!error) setItems(data);
        }

        const categories = ["all", "coffee", "dessert", "snack"];
        const filteredItems =
            category === "all" ? items : items.filter((item) => item.category === category);

        const fallbackImage = "https://via.placeholder.com/400x300?text=No+Image";

        return (
            <div className="min-h-screen bg-gray-900 py-8 px-4 text-white">
                <h1 className="text-3xl font-bold text-center mb-6">☕ منوی کافه</h1>

                {/* دسته‌بندی */}
                <div className="flex justify-center gap-3 mb-6 flex-wrap">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-full transition-colors duration-300 font-semibold ${category === cat
                                ? "bg-yellow-500 text-gray-900"
                                : "bg-gray-700 text-gray-300 hover:bg-yellow-400 hover:text-gray-900"
                                }`}
                        >
                            {cat === "all" ? "همه" : cat}
                        </button>
                    ))}
                </div>

                {/* کارت‌ها */}
                <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="overflow-hidden flex flex-col items-center bg-gray-800 rounded-lg transition-transform duration-300 hover:scale-105"
                        >
                            {/* کادر عکس با glow آرام و ترکیب رنگ زرد و سفید */}
                            <div className="relative w-full h-64 flex items-center justify-center overflow-hidden p-1">
                                <div
                                    className="w-[85%] h-[85%] rounded-lg relative overflow-hidden bg-gray-800 transition-shadow duration-700 hover:shadow-[0_0_20px_rgba(250,204,21,0.6),0_0_40px_rgba(255,255,255,0.3),0_0_60px_rgba(250,204,21,0.4)]"
                                >
                                    <img
                                        src={item.image_url || fallbackImage}
                                        alt={item.name}
                                        className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                            </div>

                            {/* متن و قیمت */}
                            <div className="w-full text-center p-3 flex flex-col gap-2">
                                <h2 className="text-xl font-semibold text-yellow-400">{item.name}</h2>
                                <p className="text-gray-300 text-sm line-clamp-2 overflow-hidden">
                                    {item.description || "توضیح کوتاه"}
                                </p>
                                <p className="text-lg font-bold text-yellow-400">{item.price} تومان</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }