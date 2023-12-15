import React, { useContext, useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  List,
  Dialog,
  TextInput,
  Button,
  TouchableRipple,
  Portal,
} from "react-native-paper";
import Application from "../../context/ApplicationContext";
import { createStackNavigator } from "@react-navigation/stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { HelperText } from "react-native-paper";
import * as Clipboard from "expo-clipboard";

//Sub Screens
import CredLists from "./listsSubScreen/CredLists";
import EditCredential from "./listsSubScreen/EditCredential";
import CredentialInfo from "./listsSubScreen/CredentialInfo";
import PasswordStack from "./listsSubScreen/PasswordStack";

//For Fonts
import { useFonts } from "expo-font";
import { themes } from "../../theme/theme";

const Stack = createStackNavigator();

const CredentialLists = ({ navigation }) => {
  const [inputPass, setInputPass] = useState(""); //Password entered by the user in the dialog

  const context = useContext(Application);
  const { theme } = context;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          theme == "light" ? themes.light.neutral : themes.dark.neutral,
      }}
    >
      <Stack.Navigator initialRouteName="Credential Lists">
        <Stack.Screen
          name="Credential Lists"
          component={CredLists}
          options={{ headerShown: false, tabBarVisible: false }}
        />
        <Stack.Screen
          name="Password"
          options={{
            tabBarStyle: {
              display: "none",
            },

            title: "Enter Main Key / Primary Key",
            headerStyle: {
              backgroundColor:
                theme == "light" ? themes.light.neutral : themes.dark.neutral,
              borderBottomWidth: 0.5,
            },
            headerTitleStyle: {
              color: theme == "light" ? "black" : themes.dark.neutral,
              fontFamily: "nunito-sans",
            },
            headerStatusBarHeight: 0,
          }}
          component={PasswordStack}
        />

        <Stack.Screen
          name="Credential"
          options={{
            title: "Credential Information",
            headerBackImage: () => (
              <Pressable
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Lists" }],
                  });
                }}
              >
                <MaterialCommunityIcons name="arrow-left" size={26} />
              </Pressable>
            ),
            headerStyle: {
              backgroundColor:
                theme == "light" ? themes.light.neutral : themes.dark.neutral,
              borderBottomWidth: 0.5,
            },
            headerTitleStyle: {
              color: theme == "light" ? "black" : themes.dark.neutral,
              fontFamily: "nunito-sans",
            },
            headerStatusBarHeight: 0,
          }}
          component={CredentialInfo}
        />
        <Stack.Screen
          name="Edit Credential"
          options={{
            headerStatusBarHeight: 0,
            headerStyle: {
              backgroundColor:
                theme == "light" ? themes.light.neutral : themes.dark.neutral,
              borderBottomWidth: 0.5,
            },
            headerTitleStyle: {
              color: theme == "light" ? "black" : themes.dark.neutral,
              fontFamily: "nunito-sans",
            },
          }}
          component={EditCredential}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default CredentialLists;
