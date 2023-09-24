import { useMutation } from '@tanstack/react-query';
import supabase from '../lib/supabase';


const submit_report = async (object) => {
    try{
        const { data, error } = await supabase.from('reports')
        .insert([object])
        .select()

        if(error) { throw new Error(error.message) }
        
        return data[0] // return data as object
    }
    catch(err){ throw new Error(err) }
};



export const fetchQuestions = async () => {
    try{
        const { data, error } = await supabase.from('questions')
        .select('*')

        if(error) { throw new Error(error.message) }

        return data // return an array
    }
    catch(err) { throw new Error(err) }
}



export const fetchOptions = async (id) => {
    try{
        const { data, error } = await supabase.from('question_options')
        .select('*')
        .eq('question_id', id)

        if(error) { throw new Error(error.message) }

        return data // array
    }
    catch(err){ throw new Error(err) }
}


export default submit_report;