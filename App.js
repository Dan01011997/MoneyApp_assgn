import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DocumentDirectoryPath } from 'react-native-fs';
import XLSX from 'xlsx';
import DocumentPicker from 'react-native-document-picker';
import Share from 'react-native-share';
import GridInput from './GridInput';
import NavBar from './NavBar';
import RNFS from 'react-native-fs';

const App = () => {
  const [gridData, setGridData] = useState(Array(10).fill(Array(5).fill('')));

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('gridData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setGridData(parsedData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('gridData', JSON.stringify(gridData));
      Alert.alert('Success', 'Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDownload = () => {
    const worksheetData = gridData.map((row) => row.map((col) => col));
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Grid Data');

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const fileName = 'grid_data.xlsx';
    const filePath = `${DocumentDirectoryPath}/${fileName}`;

    const workbookOutput = XLSX.write(workbook, { type: 'binary', bookType: 'xlsx' });

    RNFS.writeFile(filePath, workbookOutput, 'ascii')
      .then(() => {
        Alert.alert('Success', `File downloaded successfully to: ${filePath}`);
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  };

  const handleOpenPicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.xlsx],
      });

      const workbookData = await RNFS.readFile(res.uri, 'ascii');
      const workbook = XLSX.read(workbookData, { type: 'binary' });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Update gridData state with the sheet data
      setGridData(sheetData);
    } catch (error) {
      console.error('Error picking file:', error);
    }
  };

  const handleShare = () => {
    const filePath = `${DocumentDirectoryPath}/grid_data.xlsx`;

    const shareOptions = {
      title: 'Share Excel File',
      message: 'Here is the generated Excel file',
      url: `file://${filePath}`,
      failOnCancel: false,
    };

    Share.open(shareOptions)
      .then(() => {
        console.log('File shared successfully');
      })
      .catch((error) => {
        console.error('Error sharing file:', error);
      });
  };

  return (
    <View style={styles.container}>
      <GridInput gridData={gridData} setGridData={setGridData} />
      <NavBar>
        <Button title="Save" onPress={saveData} />
        <Button title="Download" onPress={handleDownload} />
        <Button title="Open Picker" onPress={handleOpenPicker} />
        <Button title="Share" onPress={handleShare} />
      </NavBar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
});

export default App;
