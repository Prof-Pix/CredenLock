import React, { useContext, useEffect, useState } from "react";
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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

//For Reseting the Navigation
import { useResetNavigation } from "../../../utilities/utils";

//For Importing Application Context
import Application from "../../../context/ApplicationContext";

import { useFonts } from "expo-font";
import { themes } from "../../../theme/theme";

const PasswordStack = ({ route, navigation }) => {
  const context = useContext(Application);
  const { mainKey, theme } = context;
  const [showPassword, setShowPassword] = useState(false); //eye or eye-off in password dialog
  const [inputPass, setInputPass] = useState("");
  const { ID_CRED_TO_ACCESS } = route.params;
  const [isWrongPass, setIsWrongPass] = useState(false);

  const handleVerify = (password) => {
    if (inputPass && password == mainKey) {
      setIsWrongPass(false);
      navigation.navigate("Credential", { ID_CRED_TO_ACCESS });
    } else {
      if (!isWrongPass) {
        setTimeout(() => {
          setIsWrongPass(false);
        }, 1500);
        setIsWrongPass(true);
      }
    }
  };
  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor:
            theme == "light" ? themes.light.neutral : themes.dark.neutral,
        }}
      >
        <View style={{ marginHorizontal: 30 }}>
          <View>
            <MaterialCommunityIcons icon="key" color="black" size={20} />
          </View>
          <Text
            style={{
              fontFamily: "nunito-sans-bold",
              fontSize: 17,
              marginBottom: 2,
            }}
          >
            Main Key*
          </Text>
          <TextInput
            mode="outlined"
            secureTextEntry={!showPassword}
            value={inputPass}
            onChangeText={setInputPass}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye" : "eye-off"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              columnGap: 2,
              padding: 3,
            }}
          >
            <MaterialCommunityIcons
              name="alert-circle"
              color={isWrongPass ? "#FF0000" : themes.light.neutral}
              size={16}
            />
            <Text
              style={{
                color: isWrongPass ? "#FF0000" : themes.light.neutral,
                fontSize: 12,
                fontFamily: "nunito-sans",
              }}
            >
              Wrong Password. Try again.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              icon="lock-open"
              mode="elevated"
              textColor={theme == "light" ? "white" : themes.dark.action}
              rippleColor={
                theme == "light" ? themes.light.neutral : themes.dark.action
              }
              style={{
                backgroundColor:
                  theme == "light" ? themes.light.action : themes.dark.action,
              }}
              onPress={() => handleVerify(inputPass)}
            >
              <Text style={{ fontFamily: "nunito-sans" }}>Authenticate</Text>
            </Button>
          </View>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  label: {
    fontSize: 25,
    padding: 5,
  },
  infoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  info: {
    fontSize: 21,
    marginLeft: 10,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PasswordStack;
