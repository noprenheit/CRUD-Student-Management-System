import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { DataTable, Searchbar } from 'react-native-paper';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from './firebaseConfig';

export default function Read() {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const studentsRef = collection(FIREBASE_DB, 'Students');
                const querySnapshot = await getDocs(studentsRef);
                const studentData = querySnapshot.docs.flatMap((doc) => {
                    const data = doc.data();
                    const classes = data.Classes || {};

                    return Object.keys(classes).map((className) => ({
                        id: doc.id,
                        firstName: data.FirstName,
                        lastName: data.LastName,
                        dob: data.DOB,
                        className: className,
                        score: classes[className].score,
                        grade: classes[className].grade,
                    }));
                });

                setStudents(studentData);
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };

        fetchStudents();
    }, []);

    const filteredStudents = students.filter((item) =>
        item.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderTableHeader = () => (
        <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Class</DataTable.Title>
            <DataTable.Title>Score</DataTable.Title>
            <DataTable.Title>Grade</DataTable.Title>
            <DataTable.Title>DOB</DataTable.Title>
        </DataTable.Header>
    );

    const renderTableRows = () =>
        filteredStudents.map((item) => (
            <DataTable.Row key={`${item.id}-${item.className}`}>
                <DataTable.Cell>{`${item.firstName}\n${item.lastName}`}</DataTable.Cell>
                <DataTable.Cell>{item.className}</DataTable.Cell>
                <DataTable.Cell>{item.score}</DataTable.Cell>
                <DataTable.Cell>{item.grade}</DataTable.Cell>
                <DataTable.Cell>{item.dob}</DataTable.Cell>
            </DataTable.Row>
        ));

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search Students"
                onChangeText={(text) => setSearchQuery(text)}
                value={searchQuery}
                style={styles.searchBar}
            />
            <DataTable>{renderTableHeader()}{renderTableRows()}</DataTable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        flex: 1,
    },
    searchBar: {
        marginTop: 10,
        marginBottom: 20,
    },
});

