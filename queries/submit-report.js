import { useMutation } from '@tanstack/react-query';
import supabase from '../lib/supabase';

const submit_report = async (object) => {

    const { data, error } = await supabase
    .from('reports')
    .insert([object])
    .select()

    if(error) { return { error: error.message} }

    // return data as object
    return data[0]
};
export default submit_report;




export const fetchQuestions = async () => {

    const { data, error } = await supabase
    .from('questions')
    .select('*')

    if(error) { return { error: error.message} }

    // return array
    return data
}



export const fetchOptions = async (id) => {

    const { data, error } = await supabase
    .from('question_options')
    .select('*')
    .eq('question_id', id)

    if(error) { return { error: error.message} }

    //console.log(data)

    // return array
    return data
}