import React, { useState, useEffect, useRef } from "react";
import { AppState } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";

import { Text, View } from "react-native";
import MainNavigation from "./navigation/MainNavigation";

//For Context
import Application from "./context/ApplicationContext";

//For ID
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainKey from "./MainKeySetUp/MainKey";
import { themes } from "./theme/theme";
import { useFonts } from "expo-font";

import LoginKey from "./navigation/LoginKey";

export default function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [fontsLoaded] = useFonts({
    "nunito-sans": require("./assets/fonts/NunitoSans_7pt-Regular.ttf"),
    "nunito-sans-italic": require("./assets/fonts/NunitoSans_7pt-Italic.ttf"),
    "nunito-sans-bold": require("./assets/fonts/NunitoSans_10pt-Bold.ttf"),
  });
  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded]);

  // if (!fontsLoaded) {
  //   return null;
  // }
  const [credentials, setCredentials] = useState([]);
  const [sessionLogs, setSessionLogs] = useState([]);
  const [mainKey, setMainKey] = useState("");
  const [theme, setTheme] = useState("light");
  const [loginKey, setLoginKey] = useState("");

  const handleLoginKey = (loginKey) => {
    setLoginKey(loginKey);
    setShowLogin(false);
  };

  const handleAfterMainKeyChange = () => {
    setLoginKey("");
    setShowLogin(true);
  };

  const handleChangeTheme = (theme) => {
    setTheme(theme);
  };

  const handleMainKey = async (mainKey) => {
    setMainKey(mainKey);
    try {
      await SecureStore.setItemAsync("MainKey", JSON.stringify(mainKey));
    } catch (error) {}
  };

  const retrieveData = async (key) => {
    if (key == "Session") {
      try {
        const fetchedData = await AsyncStorage.getItem(key);
        return JSON.parse(fetchedData) || [];
      } catch (error) {
        console.error(`Error retrieving data for ${key}:`, error);
        return [];
      }
    } else {
      try {
        const fetchedData = await SecureStore.getItemAsync(key);
        return JSON.parse(fetchedData) || [];
      } catch (error) {
        console.error(`Error retrieving data for ${key}:`, error);
        return [];
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedSessionLogs, fetchedCredentials, fetchedMainKey] =
          await Promise.all([
            retrieveData("Session"),
            retrieveData("Credentials"),
            retrieveData("MainKey"),
          ]);
        setSessionLogs(fetchedSessionLogs);
        setCredentials(fetchedCredentials);
        setMainKey(fetchedMainKey);
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []);

  const [newLabel, setNewLabel] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [description, setDescription] = useState("");

  //For Session Log
  const logSession = async (action) => {
    try {
      let updatedSessionLogs;
      const timeStamp = new Date().toLocaleString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const newLog = { timeStamp, action };
      setSessionLogs((prevSession) => {
        updatedSessionLogs = prevSession || [];
        return [newLog, ...prevSession];
      });

      const json = JSON.stringify([newLog, ...updatedSessionLogs]) || []; // Use updated state

      await AsyncStorage.setItem("Session", json);
    } catch (e) {
      console.log(e);
    }
  };

  const handleEditCredentials = async (
    id,
    { labelToEdit, emailToEdit, passToEdit, descToEdit, dateModified }
  ) => {
    const editedCreden = credentials.map((credential) =>
      credential.id === id
        ? {
            ...credential,
            label: labelToEdit,
            email: emailToEdit,
            pass: passToEdit,
            description: descToEdit,
            dateModified,
            isModified: true,
          }
        : credential
    );
    setCredentials(editedCreden);

    try {
      await SecureStore.setItemAsync(
        "Credentials",
        JSON.stringify(editedCreden)
      );
      console.log("Data stored securely.");
    } catch (error) {
      console.error("Error storing data:", error);
    }
    logSession("A credential information was changed.");
  };

  const handleCredentials = async (
    label,
    email,
    pass,
    description,
    dateAdded
  ) => {
    const newCredential = {
      id: uuidv4(),
      label,
      email,
      pass,
      description,
      dateAdded,
      dateModified: undefined,
      isModified: false,
    };

    // Update the state optimistically
    setCredentials((prevCred) => [newCredential, ...prevCred]);

    try {
      await SecureStore.setItemAsync(
        "Credentials",
        JSON.stringify([...credentials, newCredential])
      );
      console.log("Data stored securely.");
    } catch (error) {
      console.error("Error storing data:", error);
    }

    setNewLabel("");
    setNewEmail("");
    setNewPass("");
    setDescription("");
  };

  const handleDeleteCredentials = async (credential) => {
    setCredentials(credential);

    try {
      await SecureStore.setItemAsync("Credentials", JSON.stringify(credential));
      console.log("Data stored securely.");
    } catch (error) {
      console.error("Error storing dataa:", error);
    }
    logSession("A credential was deleted.");
  };

  const handleNewLabel = (newLabel) => {
    setNewLabel(newLabel);
  };

  const handleNewEmail = (newEmailCred) => {
    setNewEmail(newEmailCred);
  };

  const handleNewPass = (newPassCred) => {
    setNewPass(newPassCred);
  };

  const handleDescription = (newDescripCred) => {
    setDescription(newDescripCred);
  };

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // App came to the foreground (user opened the app)

        logSession("App was opened from the background.");
      } else if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        // App went to the background (user closed the app or switched to another app)
        logSession("App was closed.");
      }

      appState.current = nextAppState;
    };
    // Subscribe to app state changes
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Clean up the subscription when the component unmounts
    return () => {
      subscription.remove();
    };
  }, []);

  const [isShowNav, setIsShowNav] = useState(false);

  return (
    <PaperProvider>
      <Application.Provider
        value={{
          credentials,
          newLabel,
          newEmail,
          newPass,
          description,
          sessionLogs,
          handleNewLabel,
          handleNewEmail,
          handleNewPass,
          handleDescription,
          handleEditCredentials,
          handleDeleteCredentials,
          handleCredentials,
          logSession,
          handleMainKey,
          mainKey,
          themes,
          theme,
          handleLoginKey,
          handleAfterMainKeyChange,
        }}
      >
        {mainKey.length === 0 ? (
          <MainKey />
        ) : showLogin ? (
          <LoginKey />
        ) : (
          <NavigationContainer>
            <MainNavigation />
          </NavigationContainer>
        )}
      </Application.Provider>
    </PaperProvider>
  );
}
