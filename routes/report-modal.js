import { useState, useEffect } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    ActivityIndicator, 
    Image, 
    TouchableOpacity, 
    ScrollView, 
    Alert, 
    Linking 
} from 'react-native';


import Modal from "react-native-modal";
//import SelectList from 'react-native-dropdown-select-list';
import LoadingScreen from '../components/loading';
import getDirections from 'react-native-google-maps-directions';
import ImageViewer from '../components/image-viewer';
import { MyVideoPlayer } from '../components/video-component';

import { AntDesign, Ionicons } from '@expo/vector-icons';
import { getRprt, updateReport } from '../queries/fetch-reports';
import { fetchImage } from '../queries/image-upload';
import supabase from '../lib/supabase';


export const ImageCont = (props) => {
    
    const [openViewer, setOpenViewer] = useState(false)
    return (
    <>
        <TouchableOpacity style={{marginHorizontal: 5}} onPress={()=> setOpenViewer(true)}>
            <Image source={{uri: `${props.fileUrl}`, scale: 1}} 
                style={{height: 120, width: 100, borderRadius:5, borderWidth: 1}} />
        </TouchableOpacity>

        <ImageViewer ImageUri={props.fileUrl} visible={openViewer} onClose={()=>setOpenViewer(false)} />
    </>
    )
}


const VerifModal = ({visible, initState, exitFunc=()=>{}, reportId}) => {

    const [selected, setSelected] = useState(initState)
    const [options, setOptions] = useState(null)
    const [loading, setLoading] = useState(false)

    const update = async (val) => {
        setLoading(true)
        const response = await updateReport(reportId , val)
        .catch(err => { return Alert.alert('Request Failed', `${err}`)})

        setLoading(false)
        exitFunc()
    }

    // get report statuses
    useEffect( () => {
        (async () => {  
            let { data: report_status, error } = await supabase.from('report_status')
            .select('*')
            
            if(error) return;

            setOptions(report_status)
        })()
    }, [])


    return (
    <Modal isVisible={visible} onBackButtonPress={()=> exitFunc()} onBackdropPress={()=> exitFunc()} >

        <LoadingScreen visible={loading} />

        <View style={{width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>

            <View style={{backgroundColor: '#cce6ff', borderColor: '#9999', 
                borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomWidth: 0.5, }}> 

                <Text style={{alignSelf:'center', fontSize:20, marginVertical: 10, fontWeight: 'bold', }}> 
                    Update Report State </Text>
            </View>

            <View style={[styles.compContainer, {padding: 5, padding: 10,}]}>
                
                {options && options.map(obj => {
                    return(
                        <TouchableOpacity key={obj.id} onPress={() => setSelected(obj.id)}
                            style={{paddingVertical: 10, marginVertical: 3, 
                                borderWidth: 0.5, borderColor: '#9999',
                                borderRadius: 3, backgroundColor: selected === obj.id ? '#ff6666' : '#ffffff',
                            }}
                        >
                            <Text style={{fontSize: 16, fontWeight: 'bold', textAlign: 'center',
                                color: selected === obj.id ? '#ffffff' : '#000000',}}>
                                {obj.status}
                            </Text>
                        </TouchableOpacity>
                    )
                })}

                <TouchableOpacity onPress={() => update(selected)}
                    style={{paddingVertical: 10, borderWidth: 0.8, 
                        borderColor: '#9999', borderRadius: 3, marginTop: 20, 
                        backgroundColor: '#0033cc',
                        opacity: initState === selected ?  0.5 : 1,}} 
                    disabled={(initState === selected ? true : false)} 
                >

                    <Text style={{fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: '#ffffff'}}>
                        UPDATE </Text> 
                </TouchableOpacity>
                
            </View>

        </View>
    </Modal>
    )
}


export const VerificationComponent = ({report}) => {

    const [modal, setModal] = useState(false)

    return (
        <>
            <VerifModal visible={modal} exitFunc={()=> setModal(false)} 
                initState={report.status} reportId={report.id} />

            <View style={[styles.compContainer, {padding: 5, margin: 5,}]}>

                <View style={styles.row}>
                    <Text style={{fontSize: 18, marginBottom: 10}}> Report Status : </Text>
                    <Text style={{fontSize: 18, marginBottom: 10}}>{report?.repStatus?.status}</Text>
                </View>  

                <TouchableOpacity onPress={()=> setModal(true)}
                    style={{
                        padding: 10, borderWidth: 0.5, 
                        borderColor: '#9999', backgroundColor: '#cce6ff',
                        borderRadius: 5, alignItems: 'center'
                    }}
                >
                    <Text style={{fontSize: 16, color: '#ff6600', fontWeight: 'bold'}} > CHANGE </Text>
                </TouchableOpacity>
            </View>
        </>
    )
}


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
    )
}


const WhoHasAccessModal = ({visible, back=()=>{},}) => {
    
    return (
        <Modal isVisible={visible} onBackButtonPress={()=> back()} 
            onBackdropPress={()=> back()} >

            <View style={{width: '100%', backgroundColor: '#fff', borderRadius: 4, padding: 10}}>

                <Text style={{alignSelf:'center', fontSize:20}}>Who has access</Text>

            </View>
        </Modal>
    )
}

const AccessContainer = ({report}) => {

    const [visible, setVisible ] = useState(false);

    return (
        <>
        {report && (
            <TouchableOpacity style={[styles.row, styles.compContainer, {padding: 10, margin: 5,}]}
                onPress={() => {setVisible(true)}}
            >
                <WhoHasAccessModal visible={visible} style={styles.modal} back={()=> setVisible(false)}/>

                <Text style={{fontSize: 18,}}>Accessed by: </Text>
                <Text style={{fontSize: 18,}}>{`${report?.user?.fullname?? ''}`}</Text>  

            </TouchableOpacity>
        )}
        </>
    )
}


const LocationContainer = ({report}) => {

    const handleDirection = () => {
        const loc = { destination: {
                latitude: report?.location.latitude,
                longitude: report?.location.longitude,
            }
        }
        getDirections(loc);
    }

    return (
        <>
        {report.location && (
            <View style={[styles.row, styles.compContainer, {padding: 10, margin: 5,}]}>
                <Text style={{fontSize: 18,}}>Location : </Text>
                <Text style={{fontSize: 18,}}>  {`${report?.brgyName?.brgy_name?? ''}`} </Text>

                {report.location && (
                    <AntDesign name="arrowright" size={24} color="black"  onPress={()=> handleDirection() } />
                )}
            </View>
        )}
        </>
    )
}


const SenderContainer = ({report, user}) => {

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


export const AttachmentComponent = ({attach}) => {
    return (
    <>
        {attach && (

            <View style={[styles.compContainer, {padding: 5, margin: 5,}]}>
                <Text style={{fontSize: 16, marginBottom: 5}}>Attachments </Text>

                <ScrollView horizontal style={{padding:5}}>

                    {attach.map( obj => (
                        obj.file_url.includes('.mp4') ? 
                        <MyVideoPlayer source={obj.file_url} key={`${obj.file_url}`} /> :  
                        <ImageCont fileUrl={obj.file_url} key={obj.file_url}/>
                    ) )}

                </ScrollView>
            </View>
        )}
    </>
    )
}


const InvolvedCountComp = ({report}) => {

    return (
        <>
            {report.involved_count && (

                <View style={[styles.row, styles.compContainer, {padding: 10, margin: 5,}]}>
                    <Text style={{fontSize: 18,}}>  Number of Involved : </Text>
                    <Text style={{fontSize: 18,}}>  {`${report?.involved_count?? ''}`}</Text>
                </View>
            )}
        </>
    )
}


export default function ReportModal({id, onExit=()=>{}, visible, ...props}) {
    //const navigation = useNavigation()
  
    const [report, setReport] = useState(null)
    const [status, setStatus] = useState(null)
    const [attachment, setAttachment] = useState(null)

    useEffect(()=> { 
        // Fetch Report
        (async () => {
            if(id && visible){
                const data = await getRprt(id)
                .catch(err => { return Alert.alert('Request Failed', `${err}`)})

                if(data.attachments){
                    let imgData = await fetchImage(id)
                    .catch(err => { return Alert.alert('Request Failed', `${err}`)})

                    if(imgData[0]) setAttachment(imgData)
                }

                setReport(data) 
                setStatus(data.status)
            }
        })()
    }, [id, visible])

   
    //Listen to database Updates
    useEffect( () => {
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
    <Modal isVisible={visible} style={styles.modal} onBackButtonPress={() => onExit()} >

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

                <InvolvedCountComp report={report} />

                <LocationContainer report={report} />

                <SenderContainer report={report} user={props.user} />

                <AttachmentComponent report={report} attach={attachment}/>

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
        borderWidth: 0.5, 
        borderColor: '#9999',
    },

    videoPreview: {
        width: 100, 
        height: 120, 
        backgroundColor: '#9999',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginHorizontal: 5
    }
});
