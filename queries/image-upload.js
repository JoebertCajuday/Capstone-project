import supabase from '../lib/supabase';
//import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
//import { ATTACHMENTS_URL } from '@env'

const splitTest = function (str) {
  return str.split('\\').pop().split('/').pop();
}

export default async function upload_id(obj, folder) {

    const fileName = await splitTest(obj.uri);

    const { data, error } = await supabase.storage
    .from('respondersid')
    .upload(`${folder}/${fileName}`, decode(obj.base64), {
      contentType: 'image/png',
      cacheControl: '3600',
      upsert: false
    })

    if(error) { return {error}}

    return data
}


export const upload_image = async (obj, folder, bucket) => {

  const fileName = await splitTest(obj.uri);
  const key = process.env.ATTACHMENTS_URL

  const { data, error } = await supabase.storage
  .from(`${bucket}`)
  .upload(`${folder}/${fileName}`, decode(obj.base64), {
    contentType: 'image/png',
    cacheControl: '3600',
    upsert: false
  })

  if(error) { return { error }}

  return url = `${key}${data.path}`
}


export const fetchImage = async (reportId) => {

  const { data, error } = await supabase
    .from('attachments')
    .select('*')
    .eq('report_id', reportId)

    if(error) { throw new Error(error.message) }
    if(!data) { throw new Error("User not found") }

    // return images array
    return data
}


/*export const fetchImgUrl = async (path) => {

  const key = ATTACHMENTS_URL
  const url = `${key}${path}`

  return url
}*/
