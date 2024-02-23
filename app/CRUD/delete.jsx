import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import React from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB } from './firebaseConfig'; //import firebase

const Delete = () => {
    const deleteStudent = async () => {
        try {
            await deleteDoc(doc(FIREBASE_DB, 'Students', '1'));
            console.log('Document deleted successfully');
        } catch (e) {
            console.error('ERROR ', e);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>delete here</Text>
                </View>
                <Button title="Delete Field" onPress={deleteStudent} />
            </View>
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
    form: {
        marginVertical: 20,
        flexDirection: 'column',
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        marginRight: 10,
        fontSize: 16,
        color: '#006400',
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff',
    },
});

export default Delete;
