import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { FIREBASE_DB } from './firebaseConfig';

const Create = () => {
    const [classID, setClassID] = useState('');
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [DOB, setDOB] = useState('');
    const [className, setClassName] = useState('');
    const [score, setScore] = useState('');

    const addStudent = async () => {
        try {
            const docRef = await addDoc(collection(FIREBASE_DB, 'Students'), { //Change here for different collection
                classID: classID,
                fName: fName,
                lName: lName,
                DOB: DOB,
                className: className,
                score: score,
            });
            console.log('Document written successfully with ID: ', docRef.id);
        } catch (e) {
            console.error('ERROR ', e);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Class ID:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setClassID(text)}
                        value={classID}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>First Name:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setFName(text)}
                        value={fName}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Last Name:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setLName(text)}
                        value={lName}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Birth Date:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setDOB(text)}
                        value={DOB}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Class Name:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setClassName(text)}
                        value={className}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Score:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setScore(text)}
                        value={score}
                    />
                </View>
                <Button onPress={addStudent} title="Add Student" disabled={classID === '' || fName === '' || lName === '' || DOB === '' || className === '' || score === ''} />
            </View>
        </View>
    );
};
//LINE 81: Add student button does not active until all the boxes filled.

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        backgroundColor: '#E6FFE6',
        flex: 1,
    },
    form: {
        marginVertical: 20,
        flexDirection: 'column',
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        marginRight: 10,
        fontSize: 16,
        color: '#006400',
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff',
    },
});

export default Create; //export for possible future imports


