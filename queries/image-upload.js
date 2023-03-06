import supabase from '../lib/supabase';
//import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
//import { ATTACHMENTS_URL } from '@env'

const splitTest = function (str) { return str.split('\\').pop().split('/').pop() }


export default async function upload_id(obj, folder) {
    try{
      const fileName = splitTest(obj.uri);

      const { data, error } = await supabase.storage.from('respondersid')
      .upload(`${folder}/${fileName}`, decode(obj.base64), {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      })

      if(error) { throw new Error(error.message)}

      const { data: url } = await supabase.storage.from('respondersid')
      .getPublicUrl(`${data.path}`)

      return url.publicUrl
    }
    catch(err){ throw new Error(err) } 
}



export const upload_image = async (obj, folder, bucket) => {
  try{
    const fileName = await splitTest(obj.uri);
    const key = process.env.ATTACHMENTS_URL

    const { data, error } = await supabase.storage.from(`${bucket}`)
    .upload(`${folder}/${fileName}`, decode(obj.base64), {
      contentType: 'image/png',
      cacheControl: '3600',
      upsert: false
    })

    if(error) { throw new Error(error.message) }
    return url = `${key}${data.path}`
  }
  catch(err){ throw new Error(err) }
}




export const fetchImage = async (reportId) => {
  try{
    const { data, error } = await supabase.from('attachments')
    .select('*')
    .eq('report_id', reportId)

    if(error) { throw new Error(error.message) }
    if(!data) { throw new Error("User not found") }

    // return images array
    return data
  }
  catch(err){ throw new Error(err) }
}

