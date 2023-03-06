import * as ScreenOrientation from 'expo-screen-orientation'
import { Dimensions, ScrollView, StyleSheet, Text } from 'react-native'
import { ResizeMode } from 'expo-av'
import { setStatusBarHidden } from 'expo-status-bar'
import React, { useRef, useState } from 'react'
import VideoPlayer from 'expo-video-player'

export default CustomVideoPlayer = () => {
  const [inFullscreen, setInFullsreen] = useState(false)
  const [inFullscreen2, setInFullsreen2] = useState(false)
  const [isMute, setIsMute] = useState(false)
  const refVideo = useRef(null)
  const refVideo2 = useRef(null)
  const refScrollView = useRef(null)

  return (
    <ScrollView
      scrollEnabled={!inFullscreen2}
      ref={refScrollView}
      onContentSizeChange={() => {
        if (inFullscreen2) {
          refScrollView.current.scrollToEnd({ animated: true })
        }
      }}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >


      <Text style={styles.text}>With Mute</Text>
      <VideoPlayer
        videoProps={{
          shouldPlay: false,
          resizeMode: ResizeMode.CONTAIN,
          source: {
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          isMuted: isMute,
        }}
        mute={{
          enterMute: () => setIsMute(!isMute),
          exitMute: () => setIsMute(!isMute),
          isMute,
        }}
        style={{ height: 160 }}
      />

      <Text style={styles.text}>Fullscren icon hidden</Text>
      <VideoPlayer
        videoProps={{
          shouldPlay: false,
          resizeMode: ResizeMode.CONTAIN,
          source: {
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
        }}
        fullscreen={{
          visible: false,
        }}
        style={{ height: 160 }}
      />

      <Text style={styles.text}>Ref - clicking on Enter/Exit fullscreen changes playing</Text>
      <VideoPlayer
        videoProps={{
          shouldPlay: false,
          resizeMode: ResizeMode.CONTAIN,
          source: {
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          ref: refVideo,
        }}
        fullscreen={{
          enterFullscreen: () => {
            setInFullsreen(!inFullscreen)
            refVideo.current.setStatusAsync({
              shouldPlay: true,
            })
          },
          exitFullscreen: () => {
            setInFullsreen(!inFullscreen)
            refVideo.current.setStatusAsync({
              shouldPlay: false,
            })
          },
          inFullscreen,
        }}
        style={{ height: 160 }}
      />

      <Text style={styles.text}>Fullscren</Text>
      <VideoPlayer
        videoProps={{
          shouldPlay: false,
          resizeMode: ResizeMode.CONTAIN,
          source: {
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          ref: refVideo2,
        }}
        fullscreen={{
          inFullscreen: inFullscreen2,
          enterFullscreen: async () => {
            setStatusBarHidden(true, 'fade')
            setInFullsreen2(!inFullscreen2)
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)
            refVideo2.current.setStatusAsync({
              shouldPlay: true,
            })
          },
          exitFullscreen: async () => {
            setStatusBarHidden(false, 'fade')
            setInFullsreen2(!inFullscreen2)
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT)
          },
        }}
        style={{
          videoBackgroundColor: 'black',
          height: inFullscreen2 ? Dimensions.get('window').width : 160,
          width: inFullscreen2 ? Dimensions.get('window').height : 320,
        }}
      />

      <Text style={styles.text}>Custom title</Text>
      <VideoPlayer
        videoProps={{
          shouldPlay: false,
          resizeMode: ResizeMode.CONTAIN,
          source: {
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
        }}
        style={{
          videoBackgroundColor: 'black',
        }}
        header={<Text style={{ color: '#FFF' }}>Custom title</Text>}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  text: {
    marginTop: 36,
    marginBottom: 12,
  },
})
