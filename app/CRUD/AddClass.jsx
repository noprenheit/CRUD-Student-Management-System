import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Button, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from './firebaseConfig';
import {Link} from "expo-router";

export default function AddClass() {
    const [searchText, setSearchText] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [newClassId, setNewClassId] = useState('');
    const [newClassName, setNewClassName] = useState('');
    const [score, setScore] = useState('');

    useEffect(() => {
        if (!searchText.trim()) {
            setStudents([]);
            return;
        }

        const fetchStudents = async () => {
            const q = query(collection(FIREBASE_DB, 'Students'), where('FirstName', '>=', searchText));
            try {
                const querySnapshot = await getDocs(q);
                const fetchedStudents = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setStudents(fetchedStudents);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchStudents();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchText]);

    const selectStudent = (student) => {
        setSelectedStudentId(student.id);
        setStudents([]);
        setSearchText('');
    };

    const addClass = async () => {
        try {
            if (selectedStudentId && newClassId !== '' && newClassName !== '' && score !== '') {
                const studentDocRef = doc(FIREBASE_DB, 'Students', selectedStudentId);

                await updateDoc(studentDocRef, {
                    [`Classes.${newClassId}`]: {
                        className: newClassName.trim(),
                        grade: getGrade(parseInt(score, 10)),
                        score: parseInt(score, 10),
                    },
                });

                Alert.alert('Success', 'Class added successfully!', [
                    { text: 'OK', onPress: () => resetForm() },
                ]);
            } else {
                Alert.alert('Error', 'Please enter a valid class ID, class name, and score.');
            }
        } catch (error) {
            console.error('ERROR ', error);

            Alert.alert('Error', 'Failed to add class. Please try again.', [
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

    const resetForm = () => {
        setSelectedStudentId(null);
        setNewClassId('');
        setNewClassName('');
        setScore('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Search for a student:</Text>
                    <TextInput
                        style={styles.input}
                        value={searchText}
                        onChangeText={setSearchText}
                        placeholder="Enter student's first name"
                    />
                </View>
                {students.length > 0 && (
                    <View>
                        <Text>Select a student:</Text>
                        {students.map((student) => (
                            <View key={student.id}>
                                <Text>{`${student.FirstName} ${student.LastName}`}</Text>
                                <Button title="Select" onPress={() => selectStudent(student)} />
                            </View>
                        ))}
                    </View>
                )}
                {selectedStudentId && (
                    <View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Selected Student ID:</Text>
                            <TextInput
                                style={styles.input}
                                value={selectedStudentId}
                                editable={false}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Class ID:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => setNewClassId(text)}
                                value={newClassId}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Class Name:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => setNewClassName(text)}
                                value={newClassName}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Score:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => setScore(text)}
                                value={score}
                                keyboardType="numeric"
                            />
                        </View>
                        <Button
                            onPress={addClass}
                            title="Add Class"
                            disabled={newClassId === '' || newClassName === '' || score === ''}
                        />
                    </View>
                )}
                <Link href="/">Back</Link>
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
    exampleText: {
        position: 'absolute',
        left: 10, // Adjust the left position as needed
        color: '#aaa', // Adjust the color as needed
    },
});
