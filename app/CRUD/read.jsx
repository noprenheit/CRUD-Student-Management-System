import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from './firebaseConfig';
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';

export default function Read() {
    const [studentData, setStudentData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentsCollection = collection(FIREBASE_DB, 'Students');
                const snapshot = await getDocs(studentsCollection);

                const students = [];
                snapshot.forEach((doc) => {
                    const student = doc.data();
                    const classes = Object.entries(student.Classes || {}).map(([classId, classData]) => ({
                        id: classId,
                        ...classData,
                    }));
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
        console.log(studentData);
    }, []);
    const widthArr = [40, 50, 50, 60, 80, 40, 40];
    const tableHead = ['ID', 'First\nName', 'Last\nName', 'DOB', 'Class', 'Grade', 'Score'];
    const tableData = studentData.map((item) => [
        item.id,
        item.FirstName,
        item.LastName,
        item.DOB,
        item.className,
        item.grade,
        item.score,
    ]);

    return (
        <View style={styles.container}>
            <ScrollView horizontal={true}>
                <View>
                    <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                        <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text}/>
                    </Table>
                    <ScrollView style={styles.dataWrapper}>
                        <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                            {
                                tableData.map((rowData, index) => (
                                    <Row
                                        key={index}
                                        data={rowData}
                                        widthArr={widthArr}
                                        style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                                        textStyle={styles.text}
                                    />
                                ))
                            }
                        </Table>
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    header: { height: 40, backgroundColor: '#808B97', justifyContent: 'center' },
    text: {fontSize: 8, margin: 6, textAlign: 'center' },
    row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
});