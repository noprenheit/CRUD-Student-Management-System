import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from './firebaseConfig';
import { Table, Row } from 'react-native-table-component';
import { BarChart } from 'react-native-chart-kit';
import { BarChartData } from "../../chart/chartdata";

export default function Read() {
    const [studentData, setStudentData] = useState([]);
    const [showChart, setShowChart] = useState(false);
    const [selectedClass, setSelectedClass] = useState('');

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

    const uniqueClassNames = [...new Set(studentData.map(item => item.className))];

    const uniqueClassNamesData = [...uniqueClassNames].map((className, index) => ({
        label: className,
        value: className,
    }));

    const screenWidth = 300;
    const chartConfig = {
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
        decimalPlaces: 0,
        propsForLabels: {
            fontSize: 10,
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
        },
    };

    const graphStyle = {
        marginVertical: 8,
        borderRadius: 16,
    };

    return (
        <View style={styles.container}>
            <ScrollView horizontal={true}>
                <View>
                    <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                        <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text} />
                    </Table>
                    <ScrollView style={styles.dataWrapper}>
                        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                            {tableData.map((rowData, index) => (
                                <Row
                                    key={index}
                                    data={rowData}
                                    widthArr={widthArr}
                                    style={[styles.row, index % 2 && { backgroundColor: '#F7F6E7' }]}
                                    textStyle={styles.text}
                                />
                            ))}
                        </Table>
                    </ScrollView>

                    {/* Toggle button to show/hide chart */}
                    <TouchableOpacity onPress={() => setShowChart(!showChart)} style={styles.button}>
                        <Text style={styles.buttonText}>{showChart ? 'Hide Chart' : 'Show Chart'}</Text>
                    </TouchableOpacity>

                    {/* BarChart */}
                    {showChart && (
                        <>
                            {/* Dropdown to select class */}

                                {Platform.OS === 'android' ? ( // Use DropDownPicker for Android
                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        data={uniqueClassNamesData}
                                        search
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Class"
                                        searchPlaceholder="Search..."
                                        onChange={item => {
                                            setSelectedClass(item.value);
                                        }}
                                    />
                                ) : ( // Use Picker for iOS and web
                                    <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={selectedClass}
                                        onValueChange={(itemValue) => setSelectedClass(itemValue)}
                                        style={styles.picker}
                                        itemStyle={styles.pickerItem}
                                    >
                                        <Picker.Item label="Select a class" value="" />
                                        {uniqueClassNames.map((className, index) => (
                                            <Picker.Item key={index} label={className} value={className} />
                                        ))}
                                    </Picker>
                                    </View>
                                )}


                            {/* BarChart */}
                            {selectedClass && (
                                <BarChart
                                    style={graphStyle}
                                    data={BarChartData(studentData, selectedClass)}
                                    fromZero
                                    width={screenWidth}
                                    height={220}
                                    chartConfig={chartConfig}
                                    verticalLabelRotation={30}
                                />
                            )}
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 30,
        backgroundColor: '#fff'
    },
    header: {
        height: 40,
        backgroundColor: '#808B97',
        justifyContent: 'center'
    },
    text: {
        fontSize: 8,
        margin: 6,
        textAlign: 'center'
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#FFF1C1'
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    pickerContainer: {
        height: '20%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 2,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 2,
        marginBottom: 2,
        fontSize: 12,
        color: "#000000"
    },
    picker: {
        flex: 1,
    },
    pickerItem: {
        fontSize: 12,
        color: Platform.OS === 'ios' ? '#000000' : '#000000',
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


