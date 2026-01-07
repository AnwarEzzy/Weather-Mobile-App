import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, Image } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { theme } from '../theme';
import { AuthContext } from '../context/AuthContext';
import { updateUser } from '../db/database';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { StatusBar } from 'expo-status-bar';

export default function ProfileScreen() {
    console.log("Rendering ProfileScreen");
    const { user, login } = useContext(AuthContext); // Re-login to update context if needed, or just manual update
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState(''); // Keep empty, only update if changed
    const navigation = useNavigation();

    const handleUpdate = async () => {
        if (!username) {
            Alert.alert("Error", "Username cannot be empty");
            return;
        }
        try {
            await updateUser(user.id, username, password);
            Alert.alert("Success", "Profile Updated! Please re-login to see changes.");
            navigation.goBack();
        } catch (e) {
            Alert.alert("Error", "Could not update profile");
        }
    };

    return (
        <View className="flex-1 relative">
            <StatusBar style="light" />
            <Image
                blurRadius={70}
                source={{
                    uri: "https://i.pinimg.com/736x/cf/37/59/cf3759d8676ccb5f629c45e7d204fb05.jpg",
                }}
                className="h-full w-full absolute"
            />
            <SafeAreaView className="flex">
                <View className="flex-row justify-start p-4 mt-6">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 rounded-full" style={{ backgroundColor: theme.bgWhite(0.3) }}>
                        <ArrowLeftIcon size="20" color="white" />
                    </TouchableOpacity>
                </View>
                <View className="flex-row justify-center mb-8">
                    <Text className="text-white text-3xl font-bold">Edit Profile</Text>
                </View>

                <View className="mx-4 p-4 rounded-3xl" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                    <View className="form space-y-4">
                        <Text className="text-white ml-2 text-lg">Username</Text>
                        <TextInput
                            className="p-4 rounded-2xl text-white"
                            style={{ backgroundColor: theme.bgWhite(0.2) }}
                            value={username}
                            onChangeText={setUsername}
                            placeholderTextColor={'lightgray'}
                        />
                        <Text className="text-white ml-2 text-lg">New Password</Text>
                        <TextInput
                            className="p-4 rounded-2xl mb-4 text-white"
                            style={{ backgroundColor: theme.bgWhite(0.2) }}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            placeholder="********"
                            placeholderTextColor={'lightgray'}
                        />
                        <TouchableOpacity
                            className="py-4 rounded-xl"
                            style={{ backgroundColor: theme.bgWhite(0.3) }}
                            onPress={handleUpdate}
                        >
                            <Text className="text-xl font-bold text-center text-white">
                                Update Profile
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}
