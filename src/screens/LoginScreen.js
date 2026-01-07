import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { AuthContext } from '../context/AuthContext';
import { EnvelopeIcon, LockClosedIcon } from 'react-native-heroicons/outline';

export default function LoginScreen() {
    const navigation = useNavigation();
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (email === '' || password === '') {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        const success = await login(email, password);
        if (success) {
            // Navigation handled by AppNavigation
        } else {
            Alert.alert('Login Failed', 'Invalid email or password');
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
            <View className="flex-1 justify-center mx-4">
                <Text className="text-4xl font-bold text-center mb-10 text-white">Login</Text>

                <View className="space-y-4">
                    <View
                        className="p-4 rounded-2xl"
                        style={{ backgroundColor: theme.bgWhite(0.2) }}
                    >
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor={'lightgray'}
                            value={email}
                            onChangeText={setEmail}
                            className="text-white text-lg pl-2"
                        />
                    </View>
                    <View
                        className="p-4 rounded-2xl mb-4"
                        style={{ backgroundColor: theme.bgWhite(0.2) }}
                    >
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor={'lightgray'}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            className="text-white text-lg pl-2"
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        className="py-4 rounded-2xl mb-4"
                        style={{ backgroundColor: theme.bgWhite(0.3) }}
                    >
                        <Text className="text-white font-bold text-center text-xl">Login</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-center mt-6">
                    <Text className="text-white">Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text className="font-bold text-yellow-400">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
