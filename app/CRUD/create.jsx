import { View, TextInput, Button, Text, StyleSheet, FlatList, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from './firebaseConfig';
import { BarChartData } from "../../chart/chartdata";
import { BarChart } from "react-native-chart-kit";

const Create = () => {
    const [classID, setClassID] = useState('');
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [DOB, setDOB] = useState('');
    const [className, setClassName] = useState('');
    const [score, setScore] = useState('');
    const [students, setStudents] = useState([]);

    const addStudent = async () => {
        try {
            const docRef = await addDoc(collection(FIREBASE_DB, 'Students'), {
                classID: classID,
                fName: fName,
                lName: lName,
                DOB: DOB,
                className: className,
                score: score,
            });
            console.log('Document written successfully with ID: ', docRef.id);
            setStudents([...students, {id: docRef.id, ...docRef.data()}]); // Add student to state with its ID
            setClassID('');
            setFName('');
            setLName('');
            setDOB('');
            setClassName('');
            setScore('');
        } catch (e) {
            console.error('ERROR ', e);
        }
    };

    const fetchStudents = async () => {
        try {
            const querySnapshot = await getDocs(collection(FIREBASE_DB, 'Students'));
            const studentsData = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
            setStudents(studentsData);
        } catch (e) {
            console.error('ERROR ', e);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []); // Fetch students on component mount

    const deleteStudent = async (id) => {
        Alert.alert(
            'Delete Student',
            'Are you sure you want to delete this student?',
            [
                {
                    text: 'Cancel', onPress: () => {
                    }, style: 'cancel'
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(FIREBASE_DB, 'Students', id));
                            setStudents(students.filter((student) => student.id !== id));
                        } catch (e) {
                            console.error('ERROR ', e);
                        }
                    },
                },
            ],
            {cancelable: false}
        );
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
                <Button onPress={addStudent} title="Add Student"
                        disabled={classID === '' || fName === '' || lName === '' || DOB === '' || className === '' || score === ''}/>
            </View>

            <Text style={styles.title}>Students List</Text>
            <FlatList
                data={students}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <View style={styles.row}>
                        <Text>{`${item.FirstName} ${item.LastName}`}</Text>
                        <Text>{`DOB: ${item.DOB}`}</Text>
                        <Text>{`Class: ${item.className}`}</Text>
                        <Text>{`Grade: ${item.grade}`}</Text>
                        <Text>{`Score: ${item.score}`}</Text>
                        <Button title="Delete" onPress={() => deleteStudent(item.id)} color="red"/>
                    </View>
                )}
            />

            <BarChart
                data={BarChartData(students, "micro")}
                width={300} // Adjust the width as needed
                height={200} // Adjust the height as needed
                fromZero
                chartConfig={{
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    decimalPlaces: 0,
                }}
                style={{marginVertical: 8, borderRadius: 16}}
            />
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
        input: {
            borderWidth: 6,
            borderColor: '#ccc',
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical: 8,
            marginBottom: 8,
        },
        rowFront: {
            backgroundColor: '#FFF',
            borderBottomColor: '#CCC',
            borderBottomWidth: 1,
            justifyContent: 'center',
            height: 50,
            padding: 10,
        },
        rowBack: {
            // alignItems: 'center',
            backgroundColor: '#DDD',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 15,
        },
    });

export default Create; //export for possible future imports


