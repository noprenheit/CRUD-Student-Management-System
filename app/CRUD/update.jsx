import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Button,KeyboardAvoidingView, Platform, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from './firebaseConfig';


export default function SearchAndUpdate() {
    const [searchText, setSearchText] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [score, setScore] = useState('');
    const [data, setData] = useState([]);

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
        setSelectedStudent(student);
        setSelectedClassId('');

        const newData  = Object.entries(student.Classes || {}).map(([classId, classInfo]) => ({
            label: classId,
            value: classId,
        }));
        setData(newData);
        console.log(data);
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

    const handleUpdate = async () => {
        if (selectedStudentId && selectedClassId) {
            const studentDocRef = doc(FIREBASE_DB, 'Students', selectedStudentId);
            try {
                await updateDoc(studentDocRef, {
                    [`Classes.${selectedClassId}.grade`]: getGrade(score),
                    [`Classes.${selectedClassId}.score`]: parseInt(score, 10)
                });
                Alert.alert("Success", "Class successfully updated!", [
                    { text: "OK", onPress: () => resetForm() }
                ]);
            } catch (error) {
                console.error('Error updating class:', error);
                Alert.alert("Error", "An error occurred during the update.");
            }

        }
    };
    const resetForm = () => {
        setSelectedStudent(null);
        setSelectedStudentId(null);
        setSelectedClassId('');
        setScore('');
        setSearchText('');
        setStudents([]);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <View style={styles.container}>
                <TextInput
                    style={styles.searchInput}
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Search for a student..."
                />
                {!selectedStudent && (
                    <FlatList
                        data={students}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => selectStudent(item)} style={styles.listItem}>
                                <Text>{`${item.FirstName} ${item.LastName}`}</Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
                {selectedStudent && (
                    <View>
                        <Text>Select a class to update:</Text>
                        {Platform.OS === 'android' ? ( // Use Dropdown for Android
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                data={data}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Class"
                                searchPlaceholder="Search..."
                                onChange={item => {
                                    setSelectedClassId(item.value);
                                }}
                            />
                        ) : (
                        <Picker
                            selectedValue={selectedClassId}
                            onValueChange={(itemValue, itemIndex) => setSelectedClassId(itemValue)}
                            style={{ width: '100%', backgroundColor: '#FFF' }}
                        >

                        <Picker.Item label="Please select a class" value="" />
                            {Object.entries(selectedStudent.Classes || {}).map(([classId, classInfo]) => (
                                <Picker.Item key={classId} label={classInfo.className} value={classId} />
                            ))}
                        </Picker>
                        )}
                        {selectedClassId && (
                            <View>
                                <TextInput
                                    style={styles.input}
                                    value={score}
                                    onChangeText={setScore}
                                    placeholder="Score"
                                    keyboardType="numeric"
                                />
                                <Button title="Update" onPress={handleUpdate} />
                            </View>
                        )}
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        marginBottom: 16,
    },
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    input: {
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
    },
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});
