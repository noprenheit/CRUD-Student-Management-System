import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from './firebaseConfig';

const Read = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const studentsRef = collection(FIREBASE_DB, 'Student');
                const querySnapshot = await getDocs(studentsRef);
                const studentData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setStudents(studentData);
            } catch (error) {
                console.error('Öğrenci verilerini çekerken hata oluştu:', error);
            }
        };

        fetchStudents();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Öğrenci Listesi</Text>
            <FlatList
                data={students}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text>Class ID: {item.classID}</Text>
                        <Text>First Name: {item.fName}</Text>
                        <Text>Last Name: {item.lName}</Text>
                        <Text>Birth Date: {item.DOB}</Text>
                        <Text>Class Name: {item.className}</Text>
                        <Text>Score: {item.score}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        backgroundColor: '#E6FFE6',
        flex: 1,
        justifyContent: 'center',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#006400',
    },
    itemContainer: {
        borderWidth: 1,
        borderColor: '#006400',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
});



export const Read = () => {
    // code for Reading
    // doc: https://firebase.google.com/docs/firestore/query-data/get-data?hl=en&authuser=0

}