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



/*const tus = require('tus-js-client')

const projectId = ''
const token = ''

function uploadFile(bucketName, fileName, file) {
  return new Promise((resolve, reject) => {
    var upload = new tus.Upload(file, {
      endpoint: `https://${projectId}.supabase.co/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${token}`,
        'x-upsert': 'true', // optionally set upsert to true to overwrite existing files
      },
      uploadDataDuringCreation: true,
      metadata: {
        bucketName: bucketName,
        objectName: fileName,
        contentType: 'image/png',
        cacheControl: 3600,
      },
      chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
      onError: function (error) {
        console.log('Failed because: ' + error)
        reject(error)
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
        console.log(bytesUploaded, bytesTotal, percentage + '%')
      },
      onSuccess: function () {
        // console.log(upload)
        console.log('Download %s from %s', upload.file.name, upload.url)
        resolve()
      },
    })

    // Check if there are any previous uploads to continue.
    return upload.findPreviousUploads().then(function (previousUploads) {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0])
      }

      // Start the upload
      upload.start()
    })
  })
}*/

