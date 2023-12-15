import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CreateAccount from "./screens/CreateAccount";
import SettingsScreen from "./screens/SettingsScreen";
import CredentialLists from "./screens/CredentialLists";
import SessionLogsStack from "./screens/SessionLogsStack";
import { Button, TouchableRipple } from "react-native-paper";
import Application from "../context/ApplicationContext";
import { useContext } from "react";
import { themes } from "../theme/theme";
import {
  useIsFocused,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import SettingStack from "./screens/SettingsScreen";

const Tab = createBottomTabNavigator();

const MainNavigation = () => {
  const isFocused = useIsFocused();

  const context = useContext(Application);
  const { theme } = context;
  return (
    <Tab.Navigator
      initialRouteName="Create"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          backgroundColor: themes.light.primary,
          height: 70,
        },
      }}
    >
      <Tab.Screen
        name="Settings"
        component={SettingStack}
        options={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            display: getTabBarVisibility(route),
            position: "absolute",
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: themes.light.primary,
            height: 70,
          },
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.iconLabelContainer}>
              <MaterialCommunityIcons
                name="cog"
                color={focused ? themes.light.action : themes.light.text}
                size={size}
              />
              <Text
                style={{
                  fontFamily: "nunito-sans",
                  color: focused ? "white" : themes.light.text,
                  borderWidth: 1,
                  paddingVertical: 2,
                  paddingHorizontal: 4.5,
                  borderRadius: 20,
                  textAlign: "center",
                  backgroundColor: focused
                    ? themes.light.action
                    : themes.light.primary,
                  borderColor: "transparent",
                }}
              >
                Settings
              </Text>
            </View>
          ),
        })}
      />
      <Tab.Screen
        name="Session Logs"
        component={SessionLogsStack}
        options={({ route }) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route),
            position: "absolute",
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: themes.light.primary,
            height: 70,
          },
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.iconLabelContainer}>
              <MaterialCommunityIcons
                name="clipboard-text"
                color={focused ? themes.light.action : themes.light.text}
                size={size}
              />
              <Text
                style={{
                  fontFamily: "nunito-sans",
                  color: focused ? "white" : themes.light.text,
                  borderWidth: 1,
                  paddingVertical: 2,
                  paddingHorizontal: 4.5,
                  borderRadius: 20,
                  textAlign: "center",
                  backgroundColor: focused
                    ? themes.light.action
                    : themes.light.primary,
                  borderColor: "transparent",
                }}
              >
                Session Logs
              </Text>
            </View>
          ),
        })}
      />
      <Tab.Screen
        name="Lists"
        component={CredentialLists}
        options={({ route }) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route),
            position: "absolute",
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: themes.light.primary,
            height: 70,
          },
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.iconLabelContainer}>
              <MaterialCommunityIcons
                name="account-details"
                color={focused ? themes.light.action : themes.light.text}
                size={size}
              />
              <Text
                style={{
                  fontFamily: "nunito-sans",
                  color: focused ? "white" : themes.light.text,
                  borderWidth: 1,
                  paddingVertical: 2,
                  paddingHorizontal: 9,
                  borderRadius: 20,
                  textAlign: "center",
                  backgroundColor: focused
                    ? themes.light.action
                    : themes.light.primary,
                  borderColor: "transparent",
                }}
              >
                List
              </Text>
            </View>
          ),
        })}
      />
      <Tab.Screen
        name="Create"
        component={CreateAccount}
        options={{
          title: "Add New Credential",
          headerStyle: {
            backgroundColor: theme == "light" ? themes.light.neutral : "dark",
            borderBottomWidth: 0.5,
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "nunito-sans-bold",
          },
          tabBarIcon: ({ focused, color, size }) => (
            <View
              style={{
                position: "absolute",
                top: -15,
                padding: 15,
                backgroundColor: focused
                  ? themes.light.action
                  : themes.light.text,
                borderWidth: 3,
                borderColor: themes.light.primary,
                borderRadius: 40,
                shadowColor: "#7F5DF0",
                shadowOffset: {
                  width: 0,
                  height: 10,
                },
                shadowOpacity: 0.5,
                shadowRadius: 3.5,
                elevation: 6,
              }}
            >
              <View>
                <MaterialCommunityIcons
                  name="plus"
                  color={focused ? themes.light.text : themes.light.action}
                  size={40}
                />
              </View>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const getTabBarVisibility = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Feed";
  if (
    routeName === "Password" ||
    routeName === "Credential" ||
    routeName === "Edit Credential" ||
    routeName === "Filtered Logs" ||
    routeName === "Reset Main Key"
  ) {
    return "none";
  }
  return "flex";
};

const styles = StyleSheet.create({
  iconLabelContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});

export default MainNavigation;
