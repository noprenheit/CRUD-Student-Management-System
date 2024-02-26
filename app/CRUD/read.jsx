import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from './firebaseConfig';
import { BarChartData } from "../../chart/chartdata";
import { BarChart } from "react-native-chart-kit";

export default function Read() {
    const [studentData, setStudentData] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false);

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
                setIsDataFetched(true);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

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

            {isDataFetched && (
                <BarChart
                    data={BarChartData(studentData, "Mikrokontroller")}
                    width={300} // Adjust the width as needed
                    height={200} // Adjust the height as needed
                    fromZero
                    chartConfig={{
                        backgroundGradientFrom: '#fff',
                        backgroundGradientTo: '#fff',
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        decimalPlaces: 0,
                    }}
                    style={{ marginVertical: 8, borderRadius: 16 }}
                />
            )}
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
