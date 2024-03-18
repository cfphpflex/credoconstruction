import React, { useState } from 'react';
import { StyleSheet, View, TouchableHighlight, Text, Image, StatusBar, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

// Import your construction image logo
import constructionLogo from './construction_logo.png';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleChoosePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission denied');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setSelectedImage(result.uri);
      }
    } catch (error) {
      console.error('Choose Photo Error:', error);
      Alert.alert('Error', 'Failed to choose photo. Please try again.');
    }
  };

  const handleUploadPhoto = async () => {
    try {
      if (!selectedImage) {
        Alert.alert('Error', 'Please select an image first');
        return;
      }

      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage,
        type: 'image/jpeg', // Adjust according to your image type
        name: 'photo.jpg',
      });

      // Replace 'https://delaportal.com/credoconstruction/photouload.cfm' with your actual API endpoint
      const response = await axios.post('https://delaportal.com/credoconstruction/photouload.cfm', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Add any additional headers if required
        },
      });

      Alert.alert('Success', 'Image uploaded successfully');
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again later.');
    }
  };

  return (
      <View style={styles.container}>
        <Image source={constructionLogo} style={styles.logo} />
        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
        <TouchableHighlight
            style={[styles.button, styles.chooseButton]}
            underlayColor="#0056b3" // Change color when pressed
            onPress={handleChoosePhoto}
        >
          <Text style={styles.buttonText}>Choose Photo</Text>
        </TouchableHighlight>
        <TouchableHighlight
            style={[styles.button, selectedImage ? styles.uploadButton : styles.disabledUploadButton]}
            underlayColor={selectedImage ? '#218838' : '#6c757d'} // Change color when pressed
            onPress={handleUploadPhoto}
            disabled={!selectedImage}
        >
          <Text style={styles.buttonText}>Upload Photo</Text>
        </TouchableHighlight>
        <StatusBar style="auto" />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  button: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chooseButton: {
    backgroundColor: '#007bff',
  },
  uploadButton: {
    backgroundColor: '#28a745',
  },
  disabledUploadButton: {
    backgroundColor: '#6c757d',
  },
});
