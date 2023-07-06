import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Loading = () => {
  return (
    <View style={{ height:700, alignItems: 'center', justifyContent:'center' }}>
        <ActivityIndicator size="large" color="green" />
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({})