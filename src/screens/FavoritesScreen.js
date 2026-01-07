import { View, Text, TouchableOpacity, FlatList, Image, SafeAreaView } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { theme } from '../theme';
import { AuthContext } from '../context/AuthContext';
import { getFavorites } from '../db/database';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { StatusBar } from 'expo-status-bar';

export default function FavoritesScreen() {
    console.log("Rendering FavoritesScreen");
    const { user } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        if (user) {
            loadFavorites();
        }
    }, [user]);

    const loadFavorites = async () => {
        const favs = await getFavorites(user.id);
        setFavorites(favs);
    };

    const handleCityPress = (city) => {
        // Navigate Home with city param
        navigation.navigate('Home', { city: city.city_name });
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
            <SafeAreaView className="flex flex-1">
                <View className="flex-row justify-start p-4 mt-6">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 rounded-full" style={{ backgroundColor: theme.bgWhite(0.3) }}>
                        <ArrowLeftIcon size="20" color="white" />
                    </TouchableOpacity>
                </View>
                <View className="flex-row justify-center mb-6">
                    <Text className="text-white text-3xl font-bold">My Favorite Cities</Text>
                </View>

                <View className="flex-1 px-4">
                    <FlatList
                        data={favorites}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleCityPress(item)}
                                className="p-4 mb-4 rounded-2xl flex-row justify-between items-center"
                                style={{ backgroundColor: theme.bgWhite(0.2) }}
                            >
                                <Text className="text-lg font-semibold text-white">{item.city_name}</Text>
                                <Text className="text-gray-300">View Weather {'>'}</Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View className="items-center justify-center mt-20">
                                <Text className="text-center text-white text-lg font-semibold">No favorites yet.</Text>
                                <Text className="text-center text-gray-300 mt-2">Search for a city and star it!</Text>
                            </View>
                        }
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}
