

//import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Button, FlatList, SafeAreaView, Image } from 'react-native';
import 'react-native-gesture-handler';
import * as React from 'react';
import { useState } from "react";

const styles = StyleSheet.create({
    emptyListStyle: {
      padding: 10,
      fontSize: 18,
      textAlign: 'center',
    },
    itemStyle: {
      padding: 10,
    },
    img: {
      padding: 35,
      height: 70,
      width: '25%'
    },
    headerFooterStyle: {
      width: '100%',
      height: 45,
      backgroundColor: '#606070',
    },
    bottomFooterStyle: {
     flex: 1,
     flexDirection: 'row',
     justifyContent: 'space-between',
      width: '100%',
      height: 80,
      backgroundColor: '#606070',
    },
    textStyle: {
      textAlign: 'center',
      color: '#fff',
      fontSize: 18,
      padding: 7,
    },
});

export function homePage({ navigation }) {
    const [cultureGroup, setCultureGroup] = useState("");
    const [delCultureGroup, deleteCultureGroup] = useState("");
    const [cultureGenData, setGenCultureData] = useState("");
    const [cultureSpecData, setCultureSpecData] = useState("");

    const handleDisclaimer = (evt) => {
          alert('Pressed!');
      }
    
    const handleAdminLogin = (evt) => {
          navigation.navigate('Admin Login');
          //alert('Pressed!')
          

    }

    const EmptyListMessage = ({ item }) => {
          return (
            // Flat List Item
            <Text style={styles.emptyListStyle} onPress={() => getItem(item)}>
              No Data Found
            </Text>
          );
        };
      
        const ItemView = ({ item }) => {
          return (
            // Flat List Item
            <Text style={styles.itemStyle} onPress={() => getItem(item)}>
              {item.id}
              {'.'}
              {item.title.toUpperCase()}
            </Text>
          );
        };
      
        const ItemSeparatorView = () => {
          return (
            // Flat List Item Separator
            <View
              style={{
                height: 0.5,
                width: '100%',
                backgroundColor: '#C8C8C8',
              }}
            />
          );
        };
      
        const ListHeader = () => {
          //View to set in Header
          return (
            <View style={styles.headerFooterStyle}>
              <Text style={styles.textStyle}>Cultural Awareness Home Page</Text>
            </View>
          );
        };
      
        const ListFooter = () => {
          //View to set in Footer
          return (
            <View style={styles.bottomFooterStyle}>
              <Button title="General Disclaimer" style="margin:50%" onPress={handleDisclaimer} />
              <TouchableOpacity style={styles.btn} onPress={handleAdminLogin}>
              <Image source={require('../assets/admin_login.png')}  style={styles.img}/>
              </TouchableOpacity>
            </View>
          );
        };
      
        const getItem = (item) => {
          // Function for click on an item
          alert('Id : ' + item.id + ' Title : ' + item.title);
        };

        const [dataSource, setDataSource] = useState([
          { id: 1, title: 'Button' },
          { id: 2, title: 'Card' },
          { id: 3, title: 'Input' },
          { id: 4, title: 'Avatar' },
          { id: 5, title: 'CheckBox' },
          { id: 6, title: 'Header' },
          { id: 7, title: 'Icon' },
          { id: 8, title: 'Lists' },
          { id: 9, title: 'Rating' },
          { id: 10, title: 'Pricing' },
          { id: 11, title: 'Avatar' },
          { id: 12, title: 'CheckBox' },
          { id: 13, title: 'Header' },
          { id: 14, title: 'Icon' },
          { id: 15, title: 'Lists' },
          { id: 16, title: 'Rating' },
          { id: 17, title: 'Pricing' },
        ]);

    return (
          <SafeAreaView style={{ flex: 1 }}>
            <FlatList
              data={dataSource} 
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={ItemSeparatorView}
              //Header to show above listview
              ListHeaderComponent={ListHeader}
              //Footer to show below listview
              ListFooterComponent={ListFooter}
              renderItem={ItemView}
              ListEmptyComponent={EmptyListMessage}
            />
          </SafeAreaView>
      
    );
}

