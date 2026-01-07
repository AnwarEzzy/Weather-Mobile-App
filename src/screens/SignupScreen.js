import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { AuthContext } from '../context/AuthContext';
import { EnvelopeIcon, LockClosedIcon, UserIcon } from 'react-native-heroicons/outline';

export default function SignupScreen() {
    const navigation = useNavigation();
    const { register } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        if (username === '' || email === '' || password === '') {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        const success = await register(username, email, password);
        if (success) {
            Alert.alert('Success', 'Account created successfully', [
                { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]);
        } else {
            Alert.alert('Error', 'Could not create account (Email might be taken)');
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
                <Text className="text-4xl font-bold text-center mb-10 text-white">Sign Up</Text>

                <View className="space-y-4">
                    <View
                        className="p-4 rounded-2xl"
                        style={{ backgroundColor: theme.bgWhite(0.2) }}
                    >
                        <TextInput
                            placeholder="Username"
                            placeholderTextColor={'lightgray'}
                            value={username}
                            onChangeText={setUsername}
                            className="text-white text-lg pl-2"
                        />
                    </View>
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
                        onPress={handleSignup}
                        className="py-4 rounded-2xl mb-4"
                        style={{ backgroundColor: theme.bgWhite(0.3) }}
                    >
                        <Text className="text-white font-bold text-center text-xl">Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-center mt-6">
                    <Text className="text-white">Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text className="font-bold text-yellow-400">Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
