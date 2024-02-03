import { View, TextInput, Button, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';

const Create = () => {
    const [name, setname] = useState('');

    const addStudent = async () => {

        try {
            // Replace FIRESTORE_DB with your actual Firestore database reference
            const docRef = await addDoc(collection(addStudent(), 'Student'), {
                name: name,
                done: false
            });
            setname('');
            console.log('Document written with ID: ', docRef.id);
        } catch (e) {
            console.error('Error adding document: ', e);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a name"
                    onChangeText={(text) => setname(text)}
                    value={name}
                />
                <Button onPress={addStudent} title="Add Student" disabled={name === ''} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20
    },
    form: {
        marginVertical: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    }
});

export default Create;
