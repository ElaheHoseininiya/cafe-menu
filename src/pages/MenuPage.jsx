import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

function MenuPage() {
    const [menuItems, setMenuItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMenu()
    }, [])

    const fetchMenu = async () => {
        const { data } = await supabase
            .from('menu_items')
            .select('*')
            .order('id', { ascending: false })
        setMenuItems(data || [])
        setLoading(false)
    }

    return (
        <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
            <h1>منوی کافه ☕</h1>

            {loading ? (
                <p>در حال بارگذاری...</p>
            ) : (
                <div>
                    {menuItems.map(item => (
                        <div
                            key={item.id}
                            style={{
                                border: '1px solid #ddd',
                                padding: 15,
                                marginBottom: 15,
                                borderRadius: 10
                            }}
                        >
                            {item.image_url && (
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    style={{ width: '100%', maxWidth: 300, borderRadius: 10, marginBottom: 10 }}
                                />
                            )}
                            <h3>{item.name}</h3>
                            <p>{item.price} تومان</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MenuPage








// import { useEffect, useState } from 'react'
// import { supabase } from '../supabaseClient'

// function MenuPage() {
//     const [menuItems, setMenuItems] = useState([])
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         fetchMenu()
//     }, [])

//     const fetchMenu = async () => {
//         const { data } = await supabase
//             .from('menu_items')
//             .select('*')
//             .order('id', { ascending: false })
//         setMenuItems(data || [])
//         setLoading(false)
//     }

//     return (
//         <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
//             <h1>منوی کافه ☕</h1>

//             {loading ? (
//                 <p>در حال بارگذاری...</p>
//             ) : (
//                 <div>
//                     {menuItems.map(item => (
//                         <div
//                             key={item.id}
//                             style={{
//                                 border: '1px solid #ddd',
//                                 padding: 15,
//                                 marginBottom: 15,
//                                 borderRadius: 10
//                             }}
//                         >
//                             {item.image_url && (
//                                 <img
//                                     src={item.image_url}
//                                     alt={item.name}
//                                     style={{
//                                         width: '100%',
//                                         maxWidth: 300,
//                                         borderRadius: 10,
//                                         marginBottom: 10
//                                     }}
//                                 />
//                             )}
//                             <h3>{item.name}</h3>
//                             <p>{item.price} تومان</p>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     )
// }

// export default MenuPage
