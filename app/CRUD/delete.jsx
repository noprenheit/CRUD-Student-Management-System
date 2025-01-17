import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, TouchableOpacity, FlatList, Platform } from 'react-native';
import { collection, query, where, getDocs, doc, updateDoc, deleteField  } from 'firebase/firestore';
import { FIREBASE_DB } from './firebaseConfig';
import { Picker } from '@react-native-picker/picker';
import {Dropdown} from "react-native-element-dropdown";

export default function DeleteClass() {
    const [searchText, setSearchText] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [data, setData] = useState([]);


    const selectStudent = (student) => {
        setSelectedStudentId(student.id);
        setSearchText('')

        const newData = Object.keys(student.Classes || {}).map((classId) => ({
            label: classId,
            value: classId,
        }));
        setData(newData);
        console.log(newData);
    };

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

    const deleteClass = async () => {
        try {
            if (selectedStudentId && selectedClassId !== '') {
                const studentDocRef = doc(FIREBASE_DB, 'Students', selectedStudentId);

                // Update the document to delete the specified class ID field
                await updateDoc(studentDocRef, {
                    [`Classes.${selectedClassId}`]: deleteField(),
                });

                Alert.alert('Success', 'Class deleted successfully!', [
                    { text: 'OK', onPress: () => resetForm() },
                ]);
            } else {
                Alert.alert('Error', 'Please select a valid class to delete.');
            }
        } catch (error) {
            console.error('ERROR ', error);

            Alert.alert('Error', 'Failed to delete class. Please try again.', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
        }
    };

    const resetForm = () => {
        setSelectedStudentId(null);
        setSelectedClassId('');
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
                        <FlatList
                            data={students}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => { selectStudent(item); setSelectedStudentId(item.id); }} style={styles.listItem}>
                                    <Text>{`${item.FirstName} ${item.LastName}`}</Text>
                                </TouchableOpacity>
                            )}
                        />
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

                            {Platform.OS === 'android' ? ( // Use Dropdown for Android
                                <View style={styles.DropdownContainer}>
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
                                    </View>
                            ) : (
                                <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedClassId}
                                onValueChange={(itemValue) => setSelectedClassId(itemValue)}
                                style={styles.picker}
                                itemStyle={styles.pickerItem}
                            >
                                <Picker.Item label="Select Class" value="" />
                                {/* Map over the classes of the selected student */}
                                {students
                                        .find((student) => student.id === selectedStudentId)
                                        ?.Classes &&
                                    Object.keys(
                                        students.find((student) => student.id === selectedStudentId).Classes
                                    ).map((classId) => (
                                        <Picker.Item key={classId} label={classId} value={classId} />
                                    ))}
                            </Picker>
                                </View>
                            )}

                        <View>
                            <Button
                                onPress={deleteClass}
                                title="Delete Class"
                                disabled={selectedClassId === ''}
                            />
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}

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
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    pickerContainer: {
        height: '40%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 2,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 2,
        marginBottom: 2,
        fontSize: 12,
    },
    picker: {
        flex: 1,
    },
    pickerItem: {
        fontSize: 25,
    },
    deleteButtonContainer: {
        justifyContent: 'end',
        padding: 20,
        margin: 20,
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
    DropdownContainer: {
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 2,
    },


});
