import { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import ImageViewer from '../components/image-viewer';
import { MyVideoPlayer } from '../components/video-component';

import { fetchImage } from '../queries/image-upload';


const ImageContainer = (props) => {
    const [openViewer, setOpenViewer] = useState(false)

    return (
        <View style={{alignItems: props.report?.sender_id === props.user?.user_id ? 'flex-end' : 'flex-start'}}>
            <TouchableOpacity style={styles.imageBtn} onPress={() => setOpenViewer(true) } >
                <Image source={{uri: `${props.fileUrl}`, scale: 1}} style={{height: 130, width: 100, borderRadius: 5}}/>

                <ImageViewer ImageUri={props.fileUrl} visible={openViewer} onClose={()=>setOpenViewer(false)} />
            </TouchableOpacity>
        </View>
    )
}



export default function AttachmentDisplayer({ report, user, ...props}) {

    const [attachedImg, setAttachedImg] = useState(null) 
    //const [fullcreen, setFullscreen] = useState(false)

    // Load initial data and messages
    useEffect( () => {
        (async () => {

            // Report attachments
            if(report?.attachments){ // fetch images if there is any
                let images = await fetchImage(report?.id)
                .catch(err => { return } )

                if(images) { setAttachedImg(images) }
                else alert('Failed to fetch report images')
            }
        })()
    }, [])
      
    return(
    <>
        {attachedImg && attachedImg.map( obj => (

            obj?.file_url.includes('.mp4') ? 
                <MyVideoPlayer source={obj?.file_url} key={`${obj?.file_url}`} />
                :  
                <ImageContainer 
                    key={`${obj?.file_url}`} 
                    fileUrl={obj?.file_url} 
                    user={user} 
                    report={report}
                />
        )) }
    </>
    )
}
    

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 10 },

    imageBtn: {
        backgroundColor: '#cce6ff',
        marginVertical: 5,
        borderRadius: 5,
    },
                    
});
