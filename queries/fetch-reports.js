import supabase from '../lib/supabase';


export const getRprt = async (report_id) => { // fetch specific reports

    const { data, error } = await supabase
    .from('reports')
    .select('*, user:usernames(*), repType:report_type(type_name), repStatus:report_status(status), brgyName:barangays(brgy_name)')
    .eq('id', report_id)

    if(error) { return { error: error.message } }
    if(!data) { return { error: 'Some unknown error has occured' } }

    return data[0];
};



const getReports = async () => {

    const { data, error } = await supabase
    .from('reports')
    .select('*')

    if(error) { return { error: error.message } }
    if(!data) { return { error: 'Some unknown error has occured' } }

    // return an array of objects
    return data;
};


export default getReports;


export const updateReport = async (id, statusid) => {

    const { data, error } = await supabase
    .from('reports')
    .update({ status: statusid })
    .eq('id', id)
    .select()
    
    if(error) { return { error: 'Some unknown error has occured' } }
    if(!data) { return { error: 'Some unknown error has occured' } }

    return data
};
