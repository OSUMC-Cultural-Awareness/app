//import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, FlatList, SafeAreaView, Image } from 'react-native';
import 'react-native-gesture-handler';
import * as React from 'react';
import { useState, useEffect } from "react";
import { Culture } from "/Users/nicklamanna/Desktop/OSUMC-Cultural-Awareness-App/frontend/api/culture";
import { List, ActivityIndicator, Colors, Button, TouchableRipple, FAB } from 'react-native-paper';

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
  btn: {

  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0
  }
});

export function homePage({ navigation }) {
  const [cultures, setCultures] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let cultureNames = await Culture.List();
      setCultures(cultureNames);
    }

    fetchData();
  }, []);

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
        <Button onPress={() => console.log("Pressed!")} >General Disclaimer</Button>
        <TouchableOpacity style={styles.btn} onPress={handleAdminLogin}>
          <Image source={require('../assets/admin_login.png')} style={styles.img} />
        </TouchableOpacity>
      </View>
    );
  };

  const handleAdminLogin = (evt) => {
    navigation.navigate('Admin Login');
    //alert('Pressed!')


  }
  const handleDisclaimer = (evt) => {
    alert('Pressed!');
  }

  if (cultures === null)
    return (<ActivityIndicator animating={true} color={Colors.red800} />)
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FAB icon="plus" style={styles.fab}></FAB>
      <FlatList style={{ flex: 1 }}
        data={cultures}
        keyExtractor={(item, index) => index.toString()}
        //Footer to show below listview
        ListFooterComponent={ListFooter}
        renderItem={({ item }) => {
          return (<TouchableOpacity onPress={() => console.log("Pressed!")}><List.Item
            title={item}
            right={props => <Button icon="delete" onPress={() => Culture.Delete(item, "")}> </Button>}
          />
          </TouchableOpacity>
          )
        }}
      //ListEmptyComponent={EmptyListMessage}
      />
    </SafeAreaView>
  )
}


