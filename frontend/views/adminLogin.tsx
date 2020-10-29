import { StatusBar } from 'expo-status-bar';
//import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Button, FlatList, SafeAreaView, Image } from 'react-native';
import 'react-native-gesture-handler';
import * as React from 'react';

const styles = StyleSheet.create({
    container: {
      padding: 10,
      fontSize: 18,
      textAlign: 'center',
    }
});

export function adminLogin({ navigation }) {

    // const getItem = (item) => {
    //       // Function for click on an item
    //       alert('Id : ' + item.id + ' Title : ' + item.title);
    // };

    return (
          <View style={styles.container}>
                
                <Text>Login</Text>
                <TextInput placeholder="Email Address"></TextInput>
                <TextInput placeholder="Password"></TextInput>

                <Button
                title="Login"
                onPress={() => navigation.navigate('Home Page')}
                />


          <View style={styles.container}>
          </View>
                <StatusBar style="auto" />
          </View>
    );
}

