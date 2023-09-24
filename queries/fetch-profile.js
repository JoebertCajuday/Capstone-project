import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabase';


const profile = async () => {
    try{
        const { data, error } = await supabase.from('users_profile')
        .select('*, brgy:barangays(*), userRole:roles(*), accStatus:account_status(*), respo:responders(*, dept:departments(dept_name), verification:responder_status(status)), username:usernames(*)')

        if(error) { throw new Error(error.message) }
        if(!data) { throw new Error("User not found") }

        return data[0]
    }
    catch(err){ throw new Error(err) }
};

const getProfile = () => useQuery(['userProfile'], profile);



export const hotlines = async (id, brgy) => {
    try{
        if(brgy){
            // fetch hotline for users corresponding barangay
            const { data, error } = await supabase.from('hotlines')
            .select('*, barangay:barangays(*), department:departments(*)')
            .eq('brgy', id)
    
            if(error) { throw new Error(error.message) }
            if(!data) { throw new Error("Some unknown error occured") }
    
            if(data) return data[0]
        }
        else{
            // fetch corresponding emergency hotline
            const { data, error } = await supabase.from('hotlines')
            .select('*, brgy:barangays(*), dept:departments(*)')
            .eq('dept', id)
    
            if(error) { throw new Error(error.message) }
            if(!data) { throw new Error("Some unknown error occured") }
            
            if(data) return data[0]
        }
    }catch(err){ throw new Error(err)} 
}

//export const getHotlines = (id, brgy) => 
   // useQuery({queryKey: ['hotlines'], queryFn: () => hotlines(id, brgy)});


export default getProfile;