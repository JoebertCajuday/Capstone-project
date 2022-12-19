import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabase';

const profile = async () => {
    const { data, error } = await supabase.from('barangays').select('*')

    if(error) { return { error: error.message } }
    if(!data) { return { error: 'Some unknown error has occured' } }
    return data
};

const getBrgy = () => useQuery({queryKey: ['getBrgys'], queryFn : profile, staleTime: Infinity});
export default getBrgy;


const departments = async () => {
    const { data, error } = await supabase.from('departments').select('*')

    if(error) { return { error: error.message } }
    if(!data) { return { error: 'Some unknown error has occured' } }
    return data
}
export const getDept = () => useQuery({queryKey: ['getDepts'], queryFn : departments, staleTime: Infinity});


const types = async () => {
    const { data, error } = await supabase.from('report_type').select('*')

    if(error) { return { error: error.message } }
    if(!data) { return { error: 'Some unknown error has occured' } }
    return data
}
export const getType = () => useQuery({queryKey: ['getTypes'], queryFn : types, staleTime: Infinity});


const status = async () => {
    const { data, error } = await supabase.from('report_status').select('*')

    if(error) { return { error: error.message } }
    if(!data) { return { error: 'Some unknown error has occured' } }
    return data
}
export const getStatus = () => useQuery({queryKey: ['getStats'], queryFn : status, staleTime: Infinity});