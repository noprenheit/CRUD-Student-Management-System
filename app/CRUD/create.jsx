import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { FIREBASE_DB } from './firebaseConfig';
import {Link} from "expo-router";

const Create = () => {
    const [classID, setClassID] = useState('');
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [DOB, setDOB] = useState('');
    const [className, setClassName] = useState('');
    const [score, setScore] = useState('');

    const addStudent = async () => {
        try {
            const docRef = await addDoc(collection(FIREBASE_DB, 'Students'), {
                Classes: {
                    [classID]: {
                        className: className,
                        grade: getGrade(score),
                        score: parseInt(score),
                    },
                },
                DOB: DOB,
                FirstName: fName,
                LastName: lName,
            });
            console.log('Document written successfully with ID: ', docRef.id);
            Alert.alert('Success', 'Student added successfully!', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
        } catch (e) {
            console.error('ERROR ', e);

            Alert.alert('Error', 'Failed to add student. Please try again.', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
        }
    };

    const getGrade = (score) => {
        if (score >= 90) {
            return 'A';
        } else if (score >= 80) {
            return 'B';
        } else if (score >= 60) {
            return 'C';
        } else if (score >= 50) {
            return 'D';
        } else if (score >= 40) {
            return 'E';
        } else {
            return 'F';
        }
    };

    const exampleTexts = {
        fName: 'Erik',
        lName: 'Hansen',
        DOB: '01/01/2000',
        classID: 'IKT206',
        className: 'DevOps',
        score: '60',
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>First Name:</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setFName(text)}
                            value={fName}
                        />
                        {fName === '' && <Text style={styles.exampleText}>{exampleTexts.fName}</Text>}
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Last Name:</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setLName(text)}
                            value={lName}
                        />
                        {lName === '' && <Text style={styles.exampleText}>{exampleTexts.lName}</Text>}
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Birth Date:</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setDOB(text)}
                            value={DOB}
                        />
                        {DOB === '' && <Text style={styles.exampleText}>{exampleTexts.DOB}</Text>}
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Class ID:</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setClassID(text)}
                            value={classID}
                        />
                        {classID === '' && <Text style={styles.exampleText}>{exampleTexts.classID}</Text>}
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Class Name:</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setClassName(text)}
                            value={className}
                        />
                        {className === '' && <Text style={styles.exampleText}>{exampleTexts.className}</Text>}
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Score:</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setScore(text)}
                            value={score}
                            keyboardType="numeric"
                        />
                        {score === '' && <Text style={styles.exampleText}>{exampleTexts.score}</Text>}
                    </View>
                </View>
                <Button
                    onPress={addStudent}
                    title="Add Student"
                    disabled={
                        classID === '' || fName === '' || lName === '' || DOB === '' || className === '' || score === ''
                    }
                />
                <Link href="CRUD/AddClass">Add Class to Student</Link>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    form: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        width: '40%', // Set a fixed width for the labels (40% of the screen width)
        marginRight: 10,
        fontSize: 16,
        color: '#006400',
    },
    input: {
        flex: 1, // Take up the remaining space
        width: '60%', // Set the input width to 60% of the screen width
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 8,
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    exampleText: {
        position: 'absolute',
        left: 10, // Adjust the left position as needed
        color: '#aaa', // Adjust the color as needed
    },
});

export default Create;
