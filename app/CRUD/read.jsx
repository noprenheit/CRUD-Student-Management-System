import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from './firebaseConfig';

export default function Read() {
    const [studentData, setStudentData] = useState([]);

    useEffect(() => {
        // Reference to the "Students" collection in Firestore
        const studentsCollection = collection(FIREBASE_DB, 'Students');

        // Fetch data from Firestore
        const fetchData = async () => {
            try {
                const snapshot = await getDocs(studentsCollection);

                const students = [];
                snapshot.forEach((doc) => {
                    const student = doc.data();
                    // Convert Classes object into an array of classes
                    const classes = Object.entries(student.Classes || {}).map(([classId, classData]) => ({
                        id: classId,
                        ...classData,
                    }));
                    // Create a row for each class
                    classes.forEach((classInfo) => {
                        students.push({
                            id: doc.id,
                            FirstName: student.FirstName,
                            LastName: student.LastName,
                            DOB: student.DOB,
                            ...classInfo,
                        });
                    });
                });

                setStudentData(students);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        // Clean up function
        return () => {
            // Unsubscribe from any Firebase listeners or cleanup tasks if necessary
        };
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={studentData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text>{`${item.FirstName} ${item.LastName}`}</Text>
                        <Text>{`DOB: ${item.DOB}`}</Text>
                        <Text>{`Class: ${item.className}`}</Text>
                        <Text>{`Grade: ${item.grade}`}</Text>
                        <Text>{`Score: ${item.score}`}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    row: {
        marginBottom: 12,
    },
});
