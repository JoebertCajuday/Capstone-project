import React, { useState, useRef } from 'react';
import { View, StyleSheet, Button, Dimensions } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import VideoPlayer from 'expo-video-player';
import { ResizeMode } from 'expo-av';

import * as ScreenOrientation from 'expo-screen-orientation'
import { setStatusBarHidden } from 'expo-status-bar'


export default function VideoPlayerMe({source}) {

  const video = useRef(null);
  //const [status, setStatus] = useState({});

  const setToFullscreen = async () => {
    video.current.presentFullscreenPlayer()
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)
  }

  const exitFullscreen = async () => {
    video.current.dismissFullscreenPlayer()
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT)
  }

  return (
    <View style={styles.container}>

      <Video 
        ref={video}
        style={styles.video}
        source={{ uri: source, }}
        useNativeControls
        resizeMode = "contain"
        isLooping
        //onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <Button onPress={() => {setToFullscreen()}} title="Press me"/>
    </View>
  );
}

export const MyVideoPlayer = ({source}) => {
  const [inFullscreen2, setInFullsreen2] = useState(false)
  const refVideo2 = useRef(null)

  return (
    <VideoPlayer 
      videoProps={{ 
        resizeMode: ResizeMode.CONTAIN, 
        source: { uri: source }, 
        ref: refVideo2
      }} 
      fullscreen={{
        inFullscreen: inFullscreen2,
        enterFullscreen: async () => {
          await refVideo2.current.presentFullscreenPlayer()
          setStatusBarHidden(true, 'fade')
          setInFullsreen2(!inFullscreen2)
          //await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)
          //refVideo2.current.setStatusAsync({ shouldPlay: true, })
        },
        exitFullscreen: async () => {
          await refVideo2.current.dismissFullscreenPlayer()
          setStatusBarHidden(false, 'fade')
          setInFullsreen2(!inFullscreen2)
          //await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT)
        },
      }}

      style={{
        videoBackgroundColor: 'black',
        height: inFullscreen2 ? Dimensions.get('window').width : 160,
        width: inFullscreen2 ? Dimensions.get('window').height : 350,
      }}
    /> 
  )
}

const styles = StyleSheet.create({ 
  container: {
    backgroundColor: '#3333',
    borderRadius: 4,
    height: 150,
  },

  video: {
    ...StyleSheet.absoluteFillObject,
  }
}); 