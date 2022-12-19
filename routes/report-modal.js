import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, 
    TouchableOpacity, ScrollView, Alert, Linking} from 'react-native';

import Modal from "react-native-modal";
import SelectList from 'react-native-dropdown-select-list'
import LoadingScreen from '../components/loading';
//import { useNavigation } from '@react-navigation/native';
import getDirections from 'react-native-google-maps-directions'
import ImageViewer from '../components/image-viewer';

import { AntDesign, Ionicons } from '@expo/vector-icons';
import { getRprt, updateReport } from '../queries/fetch-reports';
import { queryClient } from '../lib/global-utils';
import { fetchImage } from '../queries/image-upload';
import supabase from '../lib/supabase';


const ImageHeader = (props) => {
    const label = ['', 'Fire', 'Accident', 'Conflicts', 'Other', 'Rescue', 'Silent']

return(
    <View style={[styles.row, {justifyContent: 'flex-start'}]}>
        <Image style={{width: 75, height: 75}}
            source={props.type === 1 ? require('../assets/flames.png') : 
                props.type === 2 ? require('../assets/collision.png') : 
                props.type === 3 ? require('../assets/fight.png') : 
                props.type === 4 ? require('../assets/more.png') :
                props.type === 5 ? require('../assets/rescue.png') :
                require('../assets/alert.png')}
        />

        <View style={{flexDirection: 'column', justifyContent: 'flex-end', marginLeft: 10}}>
            <Text style={{fontSize:25, color:'#ff6666', fontWeight:'bold'}}>{label[props.type]}</Text>
            <Text style={{fontSize: 16}}>Time sent : 
                {`    ${props.report?.created_at.substring(0, 10)}`}    
                {`    ${props.report?.created_at.substring(11, 16)}`}
            </Text>
        </View>
    </View>
)}


export const ImageCont = (props) => {
    
    const [openViewer, setOpenViewer] = useState(false)

    return (
    <>
        <TouchableOpacity style={{marginHorizontal: 5}} onPress={()=> setOpenViewer(true)}>
            <Image source={{uri: `${props.fileUrl}`, scale: 1}} 
                style={{height: 130, width: 100, borderRadius:5, borderWidth: 1}} 
            />
        </TouchableOpacity>

        <ImageViewer ImageUri={props.fileUrl} visible={openViewer} onClose={()=>setOpenViewer(false)} />

        
    </>
    )
}


const VerifModal = ({visible, cbFunc=()=>{},}) => {
    return (
    <Modal isVisible={visible}>
        <View style={{width: '100%', backgroundColor: '#fff', borderRadius: 4, padding: 10}}>

            <Text style={{alignSelf:'center', fontSize:20}}>Confirm action</Text>

            <Text style={{marginTop:20, fontSize:18}}>The report state will be changed to the value selected. Please click continue to confirm</Text>

            <Text style={{marginTop:20, fontSize:16, padding: 5, backgroundColor: '#cce6ff', borderRadius: 3}}>
                Please note that when a report is set as rejected, the user who sent the report will be blocked from sending any other reports. </Text>

            <View style={{flexDirection:'row', justifyContent:'space-evenly', marginTop:20}}>
                
                <TouchableOpacity onPress={()=> cbFunc() }
                    style={{padding: 10, borderRadius: 3, backgroundColor: '#ff6666', width: 130}}>
                    <Text style={{alignSelf: 'center', fontSize: 18, color: '#fff'}}>CANCEL</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=> cbFunc(true)}
                    style={{padding: 10, borderRadius: 3, backgroundColor: '#0099e6', width: 130}}>
                    <Text style={{alignSelf: 'center', fontSize: 18, color: '#fff'}}>CONTINUE</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
    )
}


export const VerificationComponent = ({report, visible }) => {

    const [verifState, setVerif] = useState(null)
    const [selectData, setSelectData] = useState(null)
    const [placeHolder, setPlaceHolder] = useState(null)
    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSetVerifState = () => setModal(true)

    const onProceed = async (value) => {
        if(!value) { setModal(false); return }

        setLoading(true)
        let update = await updateReport(report?.id, verifState)

        if(update.error){
            Alert.alert('Request Failed', 'Please try again later')
        }

        setLoading(false)
        setModal(false)
        return
    }

    // get report statuses
    useEffect( () => {
        (async () => {  
            let { data: report_status, error } = await supabase
            .from('report_status').select('*')

            if(error) return

            setSelectData([])
            report_status.map( e => {
                setSelectData(name => [...name, {key: e.id, value: e.status}])
            })
        })()
    }, [])


    useEffect( () => {
        if(selectData){
            selectData.map( e => { 
                if(e.key === report?.status){ setPlaceHolder(e.value) } 
            })
        }
    }, [selectData, report])


    return (
        <>
            <VerifModal visible={modal} cbFunc={ val => onProceed(val)}/>

            <LoadingScreen visible={loading} />
            <View style={[styles.compContainer, {padding: 5, margin: 5,}]}>
                {selectData && placeHolder && (
                <>
                    <Text style={{fontSize: 16, marginBottom: 10}}>Set report as :</Text>
                    <SelectList 
                        setSelected={ value => setVerif(value)} 
                        placeholder={`${placeHolder}`}
                        onSelect={ () => onSetVerifState() }
                        data={selectData} 
                    />
                </>
                )}
            </View>
        
        </>
    )
}


const LocationContainer = ({report}) => {

    const [data, setData] = useState(null)

    const handleDirection = () => {
        const loc = { destination: {
                latitude: data?.location.latitude,
                longitude: data?.location.longitude,
            }
        }
        getDirections(loc);
    }

    useEffect( () => {
        (async () => {
            if(report?.id){
                const dat = await getRprt(report?.id)
                if(dat) { setData(dat); }
            }
        })()
    }, [report])

    return (
        <>
        {data && (
            <View style={[styles.row, styles.compContainer, {padding: 10, margin: 5,}]}>
                <Text style={{fontSize: 18,}}>  Location : </Text>
                <Text style={{fontSize: 18,}}>  {`${data?.brgyName?.brgy_name?? ''}`} </Text>

                {report.location && (
                    <AntDesign name="arrowright" size={24} color="black"  onPress={()=> handleDirection() } />
                )}
            </View>
        )}
        </>
    )
}


const UserContainer = ({report, user}) => {

    const onCallPress = () => { Linking.openURL(`tel:${report?.number}`) }

    return (
        <>
        {report && (
            <View style={[styles.row, styles.compContainer, {padding: 10, margin: 5,}]}>
                <Text style={{fontSize: 18,}}>Sender : </Text>
                <Text style={{fontSize: 18,}}>{`${report?.user?.fullname?? ''}`}</Text>  

                {(report?.sender_id !== user?.user_id && user?.role !== 1) ? 
                    <Ionicons name="call" size={24} color="green" onPress={()=> onCallPress()}/> 
                    : <Text style={{opacity: 0}}>.</Text> 
                } 
            </View>
        )}
        </>
    )
}


export const AttachmentComponent = ({report}) => {

    const [images, setImages] = useState(null)

    useEffect( () => { (async () => {  
        if(report?.attachments) {
            let imgData = await fetchImage(report?.id)
            if(imgData) setImages(imgData)
        }
    })() }, [])

    return (
    <>
        {images && (

            <View style={[styles.compContainer, {padding: 10, margin: 5,}]}>
                <Text style={{fontSize: 16, marginBottom: 5}}>Attachments </Text>

                <ScrollView horizontal style={{padding:5}}>

                {images.map( obj => ( 
                    <ImageCont fileUrl={obj.file_url} key={obj.file_url}/>
                ) )}

                </ScrollView>
            </View>
        )}
    </>
    )
}



export default function ReportModal({id, onExit=()=>{}, visible, ...props}) {
    //const navigation = useNavigation()
  
    const [report, setReport] = useState(null)
    const [status, setStatus] = useState(null)


    useEffect(()=> { 
        (async () => {
            if(id && visible){
                const data = await getRprt(id)
                if(data) { 
                    setReport(data)
                    setStatus(data.status) 
                }
            }
        })()
    }, [id, visible])

   
    useEffect( ()=> {
        // Listen to database Updates
        if(visible && id){
            const channelModal = supabase.channel('db-changes')
            .on('postgres_changes',
            {event:'UPDATE', schema:'public', table:'reports', filter:`id=eq.${id}`},
            (payload) => { setStatus(payload.new.status) }
            ).subscribe()

            return () => { supabase.removeChannel(channelModal) }
        }
    }, [visible])


  return (

    <Modal isVisible={visible} style={styles.modal}>
        <View style={styles.container}>

        {report && ( 
            <>
                <View style={[styles.header, {borderColor: status === 1 ? '#000000' :
                    status === 2 ? '#3399ff' : status === 3 ? '#009900' : '#ff6666'} ]}>

                    <Text style={{fontSize:25, fontWeight:'bold', marginLeft: 5,}}>
                        {report?.sender_id === props.user?.user_id ? 'Report Submitted' : 'New Report'}
                    </Text>
                    <AntDesign name="closesquare" size={35} color="red" onPress={()=> onExit()}/>
                </View>
            
                <ImageHeader type={report.type} report={report} /> 
               
                <LocationContainer report={report} />

                <UserContainer report={report} user={props.user} />

                <AttachmentComponent report={report} />    

                {props.user.role === 2 && report.sender_id !== props.user.user_id && (
                    <VerificationComponent report={report} user={props.user}/>
                )}
            </>
            )}

            {!report && (
                <View style={{padding: 10, justifyContent: 'center', alignItems: 'center',}}>
                    <ActivityIndicator size="large" color="#3399ff" />
                </View>
            )}

        </View> 
    </Modal>
  );
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    header: {
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 10,
    },
    row: {
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    btn: { borderRadius: 4, width: '100%', },

    mdBtnTxt: {
        fontSize: 18, 
        padding: 10, 
        color: '#fff', 
        alignSelf: 'center',
    },

    compContainer: {
        backgroundColor: '#f2f2f2', 
        borderRadius: 3, 
        borderWidth: 0.3, 
        borderColor: '#9999',
    }
});
