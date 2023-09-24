import supabase from '../lib/supabase';
//import { decode } from 'base64-arraybuffer';



export default async function insertToProfile(obj) {
    try{
        const { data, error } = await supabase.from('users_profile')
        .insert([obj])

        if(error) { throw new Error('Unknown error occured') }
        return data
    }
    catch(err){ throw new Error(err) } 
}



export const insertToResponders = async (obj) => {
    try{
        const { data, error } = await supabase.from('responders')
        .insert([obj])
        .select()

        if(error) { throw new Error('Unknown error occured') }
        return data[0] // return object
    }
    catch(err){ throw new Error(err) }
}


export const insertToUnames = async (obj) => {
    try{
        const { data, error } = await supabase.from('usernames')
        .insert([obj])
        .select()

        if(error) { throw new Error('Unknown error occured') }
        return data[0] // return object
    }
    catch(err){ throw new Error(err) }
}


