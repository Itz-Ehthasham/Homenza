import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { login } from "@/lib/appwrite";
import { Redirect } from "expo-router";
import { useGlobalContext } from "@/lib/global-provider";
import icons from "@/constants/icons";
import images from "@/constants/images";

const Auth = () => {
  const { refetch, loading, isLogged, loginAsGuest } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/" />;

  const handleLogin = async () => {
    const result = await login();
    if (result) {
      refetch();
    } else {
      Alert.alert("Error", "Failed to login");
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <Image
          source={images.onboarding}
          className="w-full h-4/6"
          resizeMode="contain"
        />

        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Welcome To Homenza
          </Text>

          <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            Let's Get You Closer To {"\n"}
            <Text className="text-primary-300">Your Ideal Home</Text>
          </Text>

          <Text className="text-base font-rubik text-black-200 text-center mt-8">
            Login to Homenza with Google
          </Text>

          <TouchableOpacity
            onPress={handleLogin}
            className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-3 mt-4"
          >
            <View className="flex flex-row items-center justify-center">
              <Image
                source={icons.google}
                className="w-4 h-4"
                resizeMode="contain"
              />
              <Text className="text-base font-rubik-medium text-black-300 ml-2">
                Continue with Google
              </Text>
            </View>
          </TouchableOpacity>

          <View className="flex flex-row items-center my-3">
            <View className="flex-1 h-px bg-black-100" />
            <Text className="mx-3 text-xs font-rubik text-black-200">OR</Text>
            <View className="flex-1 h-px bg-black-100" />
          </View>

          <TouchableOpacity
            onPress={handleGuestLogin}
            className="border border-primary-300 rounded-full w-full py-3"
          >
            <Text className="text-base font-rubik-medium text-primary-300 text-center">
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Auth;
