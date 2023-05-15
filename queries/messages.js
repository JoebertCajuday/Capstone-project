//import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabase';

export const pushMessage = async (obj) => {
    try{
        const { data, error } = await supabase.from('report_messages')
        .insert([obj])
        .select()

        if(error) { throw new Error(error.message) }
        if(!data) { throw new Error('Unknown error occured') }
        
        return data[0]
    }
    catch(err){ throw new Error(err) }
};

// Load all grouped message
export const loadMessage = async (id) => {
    try{
        const { data, error } = await supabase.from('report_messages')
        .select('*, username:usernames(*), designation: role(*)')
        .eq('report_id', id)

        if(error) { throw new Error(error.message) }
        if(!data) { throw new Error('Unknown error occured') }

        return data
    }
    catch(err){ throw new Error(err) }
};


// Load all grouped silent message
export const loadSilentMessage = async (id) => {
    try{
        const { data, error } = await supabase.from('silent_messages')
        .select('*, option:question_options(*), questions:questions(*), username:usernames(*)')
        .eq('report_id', id)

        if(error) { throw new Error(error.message) }
        if(!data) { throw new Error('Unknown error occured') }

        return data
    }
    catch(err){ throw new Error(err) }
};


export const pushSilentMessage = async (obj) => {
    try{
        const { data, error } = await supabase.from('silent_messages')
        .insert([obj])
        .select()

        if(error) { throw new Error(error.message) }
        if(!data) { throw new Error('Unknown error occured') }

        return data[0]
    }
    catch(err){ throw new Error(err) }
};


export const fetchSilentMessage = async (id) => {
    try{
        const { data, error } = await supabase.from('silent_messages')
        .select('*, option:question_options(*), questions:questions(*), username:usernames(*)')
        .eq('id', id)

        if(error) { throw new Error(error.message) }
        if(!data) { throw new Error('Unknown error occured') }

        return data[0]
    }
    catch(err){ throw new Error(err) }
};


export const fetchNormalMessage = async (id) => {
    try{
        const { data, error } = await supabase.from('report_messages')
        .select('*, username:usernames(*)')
        .eq('id', id)

        if(error) { throw new Error(error.message) }
        if(!data) { throw new Error('Unknown error occured') }

        return data[0]
    }
    catch(err){ throw new Error(err) }
}
