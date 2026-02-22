import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function AdminPage() {
    const [menuItems, setMenuItems] = useState([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("coffee");
    const [image, setImage] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        const { data, error } = await supabase
            .from("menu_items")
            .select("*")
            .order("id", { ascending: false });

        if (!error) {
            setMenuItems(data || []);
        }

        setLoading(false);
    };

    const uploadImage = async () => {
        if (!image) return null;

        const fileName = `${Date.now()}-${image.name}`;

        const { error } = await supabase.storage
            .from("menu-images")
            .upload(fileName, image, { upsert: true });

        if (error) {
            alert("خطا در آپلود عکس");
            return null;
        }

        const { data } = supabase.storage
            .from("menu-images")
            .getPublicUrl(fileName);

        return data.publicUrl;
    };

    const submitItem = async () => {
        if (!name || !price) {
            alert("نام و قیمت را وارد کنید");
            return;
        }

        let imageUrl = image ? await uploadImage() : null;

        if (editingId) {
            const updateData = {
                name,
                price,
                description,
                category,
            };

            if (imageUrl) {
                updateData.image_url = imageUrl;
            }

            await supabase
                .from("menu_items")
                .update(updateData)
                .eq("id", editingId);
        } else {
            await supabase.from("menu_items").insert([
                {
                    name,
                    price,
                    description,
                    category,
                    image_url: imageUrl,
                },
            ]);
        }

        // ریست فرم
        setName("");
        setPrice("");
        setDescription("");
        setCategory("coffee");
        setImage(null);
        setEditingId(null);

        fetchMenu();
    };

    const deleteItem = async (id) => {
        await supabase.from("menu_items").delete().eq("id", id);
        fetchMenu();
    };

    const startEdit = (item) => {
        setName(item.name || "");
        setPrice(item.price || "");
        setDescription(item.description || "");
        setCategory(item.category || "coffee");
        setEditingId(item.id);
    };

    return (
        <div style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 800 }}>
            <h1>پنل ادمین کافه ☕</h1>

            <div style={{ marginBottom: 30 }}>
                <input
                    placeholder="نام محصول"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ marginRight: 10 }}
                />

                <input
                    placeholder="قیمت"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ marginRight: 10 }}
                />

                <input
                    placeholder="توضیح کوتاه"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ marginRight: 10 }}
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ marginRight: 10 }}
                >
                    <option value="coffee">قهوه</option>
                    <option value="dessert">دسر</option>
                    <option value="snack">اسنک</option>
                </select>

                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    style={{ marginRight: 10 }}
                />

                <button onClick={submitItem}>
                    {editingId ? "ذخیره تغییرات" : "اضافه کردن"}
                </button>
            </div>

            <hr />

            <h2>لیست منو</h2>

            {loading ? (
                <p>در حال بارگذاری...</p>
            ) : menuItems.length === 0 ? (
                <p>آیتمی ثبت نشده است</p>
            ) : (
                menuItems.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            border: "1px solid #ddd",
                            padding: 15,
                            marginBottom: 15,
                            borderRadius: 8,
                        }}
                    >
                        {item.image_url && (
                            <img
                                src={item.image_url}
                                alt={item.name}
                                style={{
                                    width: 120,
                                    borderRadius: 8,
                                    marginBottom: 10,
                                }}
                            />
                        )}

                        <strong>{item.name}</strong> — {item.price} تومان
                        <p>{item.description}</p>
                        <small>دسته: {item.category}</small>

                        <div style={{ marginTop: 10 }}>
                            <button onClick={() => startEdit(item)}>ویرایش</button>

                            <button
                                onClick={() => deleteItem(item.id)}
                                style={{ marginLeft: 10, color: "red" }}
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default AdminPage;