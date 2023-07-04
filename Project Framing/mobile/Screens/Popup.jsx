import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Modal, TextInput } from 'react-native';

const Popup = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleFormSubmit = () => {
    // Perform form submission logic
    console.log('Name:', name);
    console.log('Email:', email);

    // Close the modal
    toggleModal();
  };

  return (
    <View style={styles.container}>
      <Button title="Open Form" onPress={toggleModal} />

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Fill the Form</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />

            <Button title="Submit" onPress={handleFormSubmit} />

            <Button title="Close" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default Popup;
