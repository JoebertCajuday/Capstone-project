import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabase';


const barangays = async () => {

    try {
        let list = []
        const { data, error } = await supabase.from('barangays').select('*')

        if(error) { 
            //return { error: error.message } 
            throw new Error(error.message)
        }
        if(!data) { 
            //return { error: 'Some unknown error has occured' } 
            throw new Error('Some unknown error has occured. Please try again later.')
        }

        // set the return value to selectlist value
        data.map( obj => { list = [...list, {key: obj.id, value: obj.brgy_name}] } )

        return list
    }
    catch(err){ throw new Error(err) }
};

const getBrgy = () => useQuery({queryKey: ['getBrgys'], queryFn : barangays, staleTime: Infinity});



// fetch departments
const departments = async () => {
    try{
        let list = []
        const { data, error } = await supabase.from('departments').select('*')

        if(error) { throw new Error(error.message) }
        if(!data) { throw new Error('Some unknown error has occured. Please try again later.') }

        // set the return value to selectlist value
        data.map( obj => { list = [...list, {key: obj.id, value: obj.dept_name}] } )

        return list
    }
    catch(err){ throw new Error(err) }
}

export const getDept = () => useQuery({queryKey: ['getDepts'], queryFn : departments, staleTime: Infinity});



const types = async () => {
    try{
        const { data, error } = await supabase.from('report_type').select('*')

        if(error) { throw new Error(error.message) }
        if(!data) { throw new Error('Some unknown error has occured. Please try again later.') }

        return data
    }
    catch(err) { throw new Error(err)}
}

export const getType = () => useQuery({queryKey: ['getTypes'], queryFn : types, staleTime: Infinity});



const status = async () => {
    try{
        const { data, error } = await supabase.from('report_status').select('*')

        if(error) { throw new Error(error.message) }
        if(!data) { throw new Error('Some unknown error has occured. Please try again later.') }

        return data
    }
    catch(err){ throw new Error(err)}
}

export const getStatus = () => useQuery({queryKey: ['getStats'], queryFn : status, staleTime: Infinity});


export default getBrgy;