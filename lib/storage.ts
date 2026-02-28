import { supabase } from './supabase';

// ฟังก์ชันช่วยอัปโหลดรูปภาพจาก URI (React Native)
export async function uploadImageAsync(uri: string, fileName?: string, bucket = 'pickcher') {
  try {
    // ดึง blob จาก URI
    const response = await fetch(uri);
    const blob = await response.blob();

    const extMatch = uri.split('.').pop()?.split('?')[0];
    const ext = extMatch || 'jpg';
    const name = fileName || `${Date.now()}.${ext}`;
    const path = `uploads/${name}`;

    console.log('uploadImageAsync: uploading', { uri, name, path });
    const { data, error } = await supabase.storage.from(bucket).upload(path, blob, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) {
      console.error('uploadImageAsync: upload error', error);
      throw error;
    }

    // ดึง public URL (bucket ต้องตั้งเป็น public หรือมี policy ที่อนุญาต)
    const { publicUrl } = supabase.storage.from(bucket).getPublicUrl(path).data;
    console.log('uploadImageAsync: uploaded', { path: data?.path || path, publicUrl });

    return {
      path: data?.path || path,
      publicUrl: publicUrl || null,
    };
  } catch (err) {
    console.error('uploadImageAsync error:', err);
    throw err;
  }
}

// ฟังก์ชันเพื่อลบไฟล์
export async function deleteFile(path: string, bucket = 'pickcher') {
  const { data, error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
  return data;
}

// ฟังก์ชันเพื่อสร้าง signed URL ชั่วคราว (ถ้า bucket เป็น private)
export async function createSignedUrl(path: string, expiresInSeconds = 60, bucket = 'pickcher') {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSeconds);
  if (error) throw error;
  return data?.signedUrl;
}
