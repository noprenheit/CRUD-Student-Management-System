import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Create from './CRUD/create';
import Delete from './CRUD/delete';
import Read from './CRUD/read';
import Update from './CRUD/update';

export default function App() {
    const [currentScreen, setCurrentScreen] = useState(null);

    const renderScreen = () => {
        switch (currentScreen) {
            case 'CreateStudent':
                return <Create />;
            case 'DeleteStudent':
                return <Delete />;
            case 'ReadStudent':
                return <Read />;
            case 'UpdateStudent':
                return <Update />;
            default:
                return (
                    <View style={styles.container}>
                        <Button title="Create a Student" onPress={() => setCurrentScreen('CreateStudent')} />
                        <Button title="Delete a Student" onPress={() => setCurrentScreen('DeleteStudent')} />
                        <Button title="Read a Student" onPress={() => setCurrentScreen('ReadStudent')} />
                        <Button title="Update a Student" onPress={() => setCurrentScreen('UpdateStudent')} />
                    </View>
                );
        }
    };

    return (
        <View style={styles.container}>
            {renderScreen()}
            {currentScreen !== null && (
                <Button title="Back" onPress={() => setCurrentScreen(null)} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 30,
    },
});
