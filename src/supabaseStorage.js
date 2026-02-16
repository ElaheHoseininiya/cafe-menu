import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xjrfdujwvaiigkelcwip.supabase.co'
const supabaseKey = 'sb_publishable_WMZOZy6xrGTK_lo0j9I7Sg_BLnCg5yQ'
export const supabase = createClient(supabaseUrl, supabaseKey)

export async function uploadMenuImage(file) {
    if (!file) return null

    // ✅ تبدیل اسم فایل به safe (حروف انگلیسی، اعداد، نقطه و -)
    const fileName = `${Date.now()}-${file.name
        .replace(/\s/g, '_')         // فاصله‌ها به _
        .replace(/[^\w.-]/g, '')}`   // حذف کاراکترهای غیرمجاز

    const { data, error } = await supabase.storage
        .from('menu-images')   // نام bucket
        .upload(fileName, file, { upsert: true })  // اگر فایل تکراری بود جایگزین شود

    if (error) {
        console.error('Upload error:', error)
        return null
    }

    const { publicUrl } = supabase
        .storage
        .from('menu-images')
        .getPublicUrl(fileName)

    return publicUrl
}
