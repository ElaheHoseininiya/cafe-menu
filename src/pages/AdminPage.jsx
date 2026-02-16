import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

function AdminPage() {
    const [menuItems, setMenuItems] = useState([])
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [image, setImage] = useState(null)
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMenu()
    }, [])

    const fetchMenu = async () => {
        const { data } = await supabase.from('menu_items').select('*').order('id', { ascending: false })
        setMenuItems(data || [])
        setLoading(false)
    }

    const uploadImage = async () => {
        if (!image) return null
        const fileName = `${Date.now()}-${image.name}`
        const { error } = await supabase.storage.from('menu-images').upload(fileName, image, { upsert: true })
        if (error) return alert('خطا در آپلود عکس: ' + error.message), null
        const { data } = supabase.storage.from('menu-images').getPublicUrl(fileName)
        return data.publicUrl
    }

    const submitItem = async () => {
        if (!name || !price) return alert('نام و قیمت را وارد کنید')

        let imageUrl = image ? await uploadImage() : null

        if (editingId) {
            await supabase.from('menu_items').update({ name, price, ...(imageUrl && { image_url: imageUrl }) }).eq('id', editingId)
        } else {
            await supabase.from('menu_items').insert([{ name, price, image_url: imageUrl }])
        }

        setName(''); setPrice(''); setImage(null); setEditingId(null)
        fetchMenu()
    }

    const deleteItem = async (id) => {
        await supabase.from('menu_items').delete().eq('id', id)
        fetchMenu()
    }

    return (
        <div style={{ padding: 40, fontFamily: 'sans-serif', maxWidth: 700 }}>
            <h1>پنل ادمین کافه ☕</h1>
            <div style={{ marginBottom: 20 }}>
                <input placeholder="نام محصول" value={name} onChange={e => setName(e.target.value)} style={{ marginRight: 10 }} />
                <input placeholder="قیمت" value={price} onChange={e => setPrice(e.target.value)} style={{ marginRight: 10 }} />
                <input type="file" onChange={e => setImage(e.target.files[0])} style={{ marginRight: 10 }} />
                <button onClick={submitItem}>{editingId ? 'ذخیره تغییرات' : 'اضافه کردن'}</button>
            </div>

            <hr />

            <h2>لیست منو</h2>
            {loading ? <p>در حال بارگذاری...</p> :
                menuItems.length === 0 ? <p>آیتمی ثبت نشده است</p> :
                    <div>
                        {menuItems.map(item => (
                            <div key={item.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 10, borderRadius: 8 }}>
                                {item.image_url && <img src={item.image_url} alt={item.name} style={{ width: 120, borderRadius: 8, marginBottom: 10 }} />}
                                <strong>{item.name}</strong> — {item.price} تومان
                                <div style={{ marginTop: 8 }}>
                                    <button onClick={() => { setName(item.name); setPrice(item.price); setEditingId(item.id) }}>ویرایش</button>
                                    <button onClick={() => deleteItem(item.id)} style={{ marginLeft: 8, color: 'red' }}>حذف</button>
                                </div>
                            </div>
                        ))}
                    </div>}
        </div>
    )
}

export default AdminPage
