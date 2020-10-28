import { StatusBar } from 'expo-status-bar';
//import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Button, FlatList, SafeAreaView, Image } from 'react-native';
import 'react-native-gesture-handler';
import * as React from 'react';


export function adminDashboard({ navigation }) {
    return (
          <View style={styles.container}>
                

                <Button
                title="Manage Culture Data"
                onPress={() => navigation.navigate('homePage')}
                />


          <View style={styles.container}>
          </View>
                <StatusBar style="auto" />
          </View>
    );
}