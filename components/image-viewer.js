import React from 'react';
import ImageView from 'react-native-image-viewing'



export default function ImageViewer({ImageUri, visible, onClose = () => {}}) {

    const imgArray = [{uri: ImageUri, key: ImageUri}]

    return (
        <ImageView 
            images={imgArray}
            imageIndex={0}
            visible={visible}
            onRequestClose={() => onClose()}
            presentationStyle='overFullScreen'
        />
    )
}