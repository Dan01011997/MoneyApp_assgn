import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input } from 'react-native-elements';

const GridInput = () => {
  const [gridData, setGridData] = useState(Array(10).fill(Array(5).fill('')));

  const handleInputChange = (rowIndex, colIndex, value) => {
    const newData = [...gridData];
    newData[rowIndex][colIndex] = value;
    setGridData(newData);
  };

  return (
    <View style={styles.container}>
      {gridData.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((col, colIndex) => (
            <Input
              key={colIndex}
              value={col}
              onChangeText={(value) => handleInputChange(rowIndex, colIndex, value)}
              containerStyle={styles.inputContainer}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
});

export default GridInput;
