import React from 'react';
import { StyleSheet, View, Button } from 'react-native';

const NavBar = ({ onPressDownload }) => {
  return (
    <View style={styles.container}>
      <Button title="Download" onPress={onPressDownload} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NavBar;
