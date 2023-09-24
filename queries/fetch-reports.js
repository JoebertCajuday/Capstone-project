import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabase';



export const getRprt = async (report_id) => { // fetch specific reports
    try{
        const { data, error } = await supabase.from('reports')
        .select('*, user:usernames(*), repType:report_type(type_name), repStatus:report_status(status), brgyName:barangays(brgy_name)')
        .eq('id', report_id)

        //if(error) { return { 'error': error.message } }
        if(error) { throw new Error(error.message)}
        if(!data){ throw new Error('Some unknown error has occured. Please try again later.')}

        return data[0];
    }
    catch(err){ throw new Error(err) }
};



const getReports = async () => {
    try{
        const { data, error } = await supabase.from('reports')
        .select('*')

        //if(error) { return { 'error': error.message } }
        //if(!data) { return { 'error': 'Some unknown error has occured' } }
        if(error) { throw new Error(error.message) }
        if(!data) { throw new Error('Some unknown error has occured') }

        // return an array of objects
        return data;
    }
    catch(err){ throw new Error(err) }
};



export const updateReport = async (id, statusid) => {
    try{
        const { data, error } = await supabase.from('reports')
        .update({ status: statusid })
        .eq('id', id)
        .select()
        
        //if(error) { return { 'error': 'Some unknown error has occured' } }
        //if(!data) { return { 'error': 'Some unknown error has occured' } }
        if(error) { throw new Error('Some unknown error has occured') }
        if(!data) { throw new Error('Some unknown error has occured') }

        return data
    }
    catch(err){ throw new Error(err) } 
};


export default getReports;
export const getAllReports = () => useQuery({queryKey: ['reports'], queryFn: () => getReports()})