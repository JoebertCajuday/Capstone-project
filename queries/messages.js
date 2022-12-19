//import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabase';

export const pushMessage = async (obj) => {
    const { data, error } = await supabase
    .from('report_messages')
    .insert([obj])
    .select()

    if(error) { return { error: error.message } }
    if(!data) { return { error: 'Some unknown error has occured' } }
    //console.log(data)
    return data[0]
};

// Load all grouped message
export const loadMessage = async (id) => {
    const { data, error } = await supabase
    .from('report_messages')
    .select('*, username:usernames(*)')
    .eq('report_id', id)

    if(error) { return { error: error.message } }
    if(!data) { return { error: 'Some unknown error has occured' } }


    return data
};


// Load all grouped silent message
export const loadSilentMessage = async (id) => {
    const { data, error } = await supabase
    .from('silent_messages')
    .select('*, option:question_options(*), questions:questions(*), username:usernames(*)')
    .eq('report_id', id)

    if(error) { return { error: error.message } }
    if(!data) { return { error: 'Some unknown error has occured' } }

    return data
};


export const pushSilentMessage = async (obj) => {
    const { data, error } = await supabase
    .from('silent_messages')
    .insert([obj])
    .select()

    if(error) { return { error: error.message } }
    if(!data) { return { error: 'Some unknown error has occured' } }

    return data[0]
};


export const fetchSilentMessage = async (id) => {
    const { data, error } = await supabase
    .from('silent_messages')
    .select('*, option:question_options(*), questions:questions(*), username:usernames(*)')
    .eq('id', id)

    if(error) { return { error: error.message } }
    if(!data) { return { error: 'Some unknown error has occured' } }

    //console.log(data[0])

    return data[0]
};


export const fetchNormalMessage = async (id) => {
    const { data, error } = await supabase
    .from('report_messages')
    .select('*, username:usernames(*)')
    .eq('id', id)

    if(error) { return { error: error.message } }
    if(!data) { return { error: 'Some unknown error has occured' } }

    return data[0]
}
