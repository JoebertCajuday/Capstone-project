import supabase from '../lib/supabase';
//import { decode } from 'base64-arraybuffer';


export default async function insertToProfile(obj) {

    const { data, error } = await supabase
    .from('users_profile')
    .insert([obj])

    if(error) { return { error: error.message} }
    return data 
}



export const insertToResponders = async (obj) => {

    const { data, error } = await supabase
    .from('responders')
    .insert([obj])
    .select()

    if(error) { return { error: error.message} }
    return data[0] // return object
}


export const insertToUnames = async (obj) => {

    const { data, error } = await supabase
    .from('usernames')
    .insert([obj])
    .select()

    if(error) { return { error: error.message} }
    return data[0] // return object
}


