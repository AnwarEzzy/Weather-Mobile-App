import * as Location from 'expo-location';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { theme } from "../theme";
import { MagnifyingGlassIcon as SearchIcon, UserIcon, ListBulletIcon, CalendarDaysIcon } from "react-native-heroicons/outline";
import { MapPinIcon as MapIcon } from "react-native-heroicons/solid";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForecast } from "../api/weather";
import { weatherImages } from "../constants";
import * as Progress from "react-native-progress";
import { AuthContext } from "../context/AuthContext";
import { addSearchHistory, getMostSearchedCity, addFavorite, removeFavorite, getFavorites } from "../db/database";
import { StarIcon } from "react-native-heroicons/solid";
import { ArrowRightOnRectangleIcon as LogoutIcon } from "react-native-heroicons/outline"; // Logout Icon

export default function HomeScreen() {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [nearbyWeather, setNearbyWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Get User Location for "Nearby Weather"
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      if (location && location.coords) {
        const { latitude, longitude } = location.coords;
        fetchWeatherForecast({
          cityName: `${latitude},${longitude}`,
          days: '1'
        }).then(data => {
          setNearbyWeather(data);
        });
      }
    })();
  }, []);

  // Load Recommendation and Favorites on mount (or user change)
  useEffect(() => {
    if (user) {
      getMostSearchedCity(user.id).then(rec => {
        if (rec) {
          // Initial toast/alert
          console.log("Recommended City:", rec.city_name);
        }
      });
    }
  }, [user]);

  const toggleFavorite = async () => {
    if (!user) return;
    if (isFavorite) {
      await removeFavorite(user.id, location?.name);
      setIsFavorite(false);
    } else {
      await addFavorite(user.id, location?.name);
      setIsFavorite(true);
    }
  };

  const checkIfFavorite = async (cityName) => {
    if (!user) return;
    const favs = await getFavorites(user.id);
    const exists = favs.find(f => f.city_name === cityName);
    setIsFavorite(!!exists);
  };

  const handelLocation = (loc) => {
    console.log(locations);
    setLocations([]);
    setShowSearchBar(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
      console.log(data);
      if (user) {
        addSearchHistory(user.id, loc.name);
        checkIfFavorite(loc.name);
      }
    });
  };

  const handleSearch = (value) => {
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => setLocations(data));
    }
  };

  useEffect(() => {
    // If passed a specific city via navigation (e.g. from Favorites), load it
    if (route.params?.city) {
      fetchWeatherForecast({ cityName: route.params.city, days: "7" }).then(data => {
        setWeather(data);
        setLoading(false);
        if (user) checkIfFavorite(route.params.city);
      });
    } else {
      fetchMyWeatherData();
    }
  }, [user, route.params]); // Depend on route.params to trigger when coming back

  const fetchMyWeatherData = async () => {
    // ... existing logic ...
    let cityName = "Casablanca";
    if (user) {
      const rec = await getMostSearchedCity(user.id);
      if (rec) {
        cityName = rec.city_name;
        // Alert (optional, maybe annoying on every mount)
        // Alert.alert("Welcome Back", `Loading your favorite city: ${cityName}`);
      }
    }

    fetchWeatherForecast({ cityName, days: "7" }).then((data) => {
      setWeather(data);
      setLoading(false);
      if (user) {
        checkIfFavorite(cityName);
      }
    });
  };
  const handleDebounce = useCallback(debounce(handleSearch, 1000), []);
  const { current, location } = weather;

  return (
    <View className="h-[7] flex-1 relative">
      <StatusBar style="light" />
      <Image
        blurRadius={13}
        source={{
          uri: "https://i.pinimg.com/736x/cf/37/59/cf3759d8676ccb5f629c45e7d204fb05.jpg",
        }}
        className="h-full w-full absolute"
      />

      {loading ? (
        <View className="flex-1 flex-row justify-center items-center">
          <Progress.CircleSnail thickness={10} size={140} color="white" />
        </View>
      ) : (
        <SafeAreaView className="flex flex-1">
          {/* SEARCH BAR SECTION */}

          <View className=" mx-4 relative z-50 mt-12">
            <View
              className={"flex-row justify-end items-center rounded-full " + (showSearchBar ? "mb-12" : "")}
              style={{
                backgroundColor: showSearchBar
                  ? theme.bgWhite(0.2)
                  : "transparent",
              }}
            >
              {showSearchBar ? (
                <TextInput
                  onChangeText={handleDebounce}
                  placeholder="Search City"
                  placeholderTextColor={"white"}
                  className="h-12 pl-4 text-xl pb-1 flex-1 text-white"
                />
              ) : null}


            </View>
            {locations.length > 0 && showSearchBar ? (
              <View
                className=" absolute w-full top-16 rounded-3xl "
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                  borderBottomColor: "#f0f0f0",
                  backdropFilter: "blur(6px)",
                }}
              >
                {locations.map((loc, index) => {
                  let showBorder = index + 1 != locations.length;
                  let borderClass = showBorder
                    ? "border-b-2 border-b-gray-400"
                    : "";
                  return (
                    <TouchableOpacity
                      onPress={() => handelLocation(loc)}
                      key={index}
                      className={
                        "flex-row items-center m-1 p-3  px-4 " + borderClass
                      }
                    >
                      <MapIcon size={20} color={"black"} />
                      <Text className="text-black font-bold text-lg ml-2">
                        {loc?.name}, {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>

          {/* FORCAST SECTION */}

          <View className="flex-1 flex justify-around mx-4 mb-2">

            {/* Header Row: Icons Left, Location Center */}
            <View className="flex-row items-center justify-between mb-4">
              {/* Left Side: Buttons */}
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => setShowSearchBar(!showSearchBar)}
                  style={{ backgroundColor: theme.bgWhite(0.3) }}
                  className="p-3 rounded-full mr-2"
                >
                  <SearchIcon size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Favorites')}
                  style={{ backgroundColor: theme.bgWhite(0.3) }}
                  className="p-3 rounded-full mr-2"
                >
                  <ListBulletIcon size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={async () => {
                    setLoading(true);
                    try {
                      let { status } = await Location.requestForegroundPermissionsAsync();
                      if (status !== 'granted') {
                        setLoading(false);
                        Alert.alert("Permission denied", "We need location permission to find your city.");
                        return;
                      }

                      let location = await Location.getCurrentPositionAsync({});
                      if (location?.coords) {
                        const { latitude, longitude } = location.coords;
                        const data = await fetchWeatherForecast({
                          cityName: `${latitude},${longitude}`,
                          days: '7'
                        });
                        setWeather(data);
                        setNearbyWeather(data);
                      }
                    } catch (error) {
                      console.log("GPS Error: ", error);
                      Alert.alert("Error", "Could not fetch location. Please ensure location services are enabled.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  style={{ backgroundColor: theme.bgWhite(0.3) }}
                  className="p-3 rounded-full mr-2"
                >
                  <MapIcon size={20} color="white" />
                </TouchableOpacity>
              </View>

              {/* Center: Location Name */}
              <View className="flex-1 justify-center items-center">
                <Text className="text-white text-2xl font-bold text-center">
                  {location?.name}
                </Text>
                <Text className="text-sm text-gray-200 font-semibold text-center">
                  {location?.country}
                </Text>
              </View>

              {/* Right Side: Buttons */}
              <View className="flex-row">
                <TouchableOpacity
                  onPress={toggleFavorite}
                  className="mr-2 p-3"
                >
                  <StarIcon size={25} color={isFavorite ? "yellow" : "white"} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')}
                  style={{ backgroundColor: theme.bgWhite(0.3) }}
                  className="p-3 rounded-full mr-2"
                >
                  <UserIcon size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={logout}
                  style={{ backgroundColor: theme.bgWhite(0.3) }}
                  className="p-3 rounded-full"
                >
                  <LogoutIcon size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            {/* IMAGE VIEW */}
            <View className="justify-center flex-row">
              <Image
                source={weatherImages[current?.condition?.text] || weatherImages['other']}
                className="w-52 h-52"
              />
            </View>
            {/* TEMPERATURE CELCUS */}
            <View className="">
              <Text className="text-center text-6xl text-white font-bold">
                {current?.temp_c}&#176;
              </Text>
              <Text className="text-center text-xl text-white tracking-widest">
                {current?.condition?.text}
              </Text>
            </View>
            {/* WEATHER CONDITIONS */}
            <View>
              <View className="flex-row space-x-6 items-center ">
                <View className="ml-8 flex-row space-x-1 items-center">
                  <Feather name="wind" size={30} color="white" />
                  <Text className="items-center text-white text-lg font-semibold">
                    {current?.wind_kph} km
                  </Text>
                </View>
                <View className="ml-2 flex-row space-x-1 items-center">
                  <Entypo name="drop" size={30} color="white" />
                  <Text className="items-center text-white text-lg font-semibold">
                    {current?.humidity}%
                  </Text>
                </View>
                <View className="ml-2 flex-row space-x-1 items-center">
                  <Feather name="sun" size={30} color="white" />
                  <Text className="items-center text-white text-lg font-semibold">
                    14km
                  </Text>
                </View>
              </View>
            </View>
            {/* NEXT DAYS FORCAST */}
            <View className="flex-row items-center ml-2 ">
              <FontAwesome name="calendar" size={30} color="white" />
              <Text className="text-white font-semibold ml-3 text-lg">
                Daily Forcast
              </Text>
            </View>
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {weather?.forecast?.forecastday?.map((days, index) => {
                  let date = new Date(days.date);
                  let options = { weekday: "long" };
                  let dayName = date.toLocaleDateString("en-US", options);
                  return (
                    <View
                      key={index}
                      className=" w-32 rounded-3xl py-4 px-5 ml-3"
                      style={{ backgroundColor: theme.bgWhite(0.3) }}
                    >
                      <Image
                        source={weatherImages[days?.day?.condition?.text] || weatherImages['other']}
                        className="w-12 h-12 ml-5"
                      />
                      <Text className="text-slate-300 font-semibold text-center py-1">
                        {dayName}
                      </Text>
                      <Text className="text-white font-semibold text-lg text-center">
                        {days?.day?.avgtemp_c}&#176;
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>

            {/* Nearby/GPS Location Section */}
            {nearbyWeather && (
              <View className="mb-8 space-y-3">
                <View className="flex-row items-center mx-5 space-x-2">
                  <MapIcon size={22} color="white" />
                  <Text className="text-white text-base">Weather Near You</Text>
                </View>
                <TouchableOpacity
                  className="mx-5 rounded-3xl p-4 flex-row justify-between items-center"
                  style={{ backgroundColor: theme.bgWhite(0.15) }}
                  onPress={() => setWeather(nearbyWeather)}
                >
                  <View className="flex-row items-center space-x-4">
                    <Image
                      source={weatherImages[nearbyWeather?.current?.condition?.text] || weatherImages['other']}
                      className="h-16 w-16"
                    />
                    <View>
                      <Text className="text-white text-xl font-bold">{nearbyWeather?.location?.name}</Text>
                      <Text className="text-gray-200">{nearbyWeather?.current?.condition?.text}</Text>
                    </View>
                  </View>
                  <Text className="text-white text-3xl font-semibold">
                    {nearbyWeather?.current?.temp_c}&#176;
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}
