import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { themes } from "../theme/theme";
import Application from "../context/ApplicationContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Image, View, Text, StatusBar } from "react-native";
import { TextInput, Button } from "react-native-paper";
const logoImage = require("../assets/credenlock_logo.png");
const LoginKey = () => {
  const context = useContext(Application);
  const { theme, mainKey, handleLoginKey, logSession } = context;
  const [showPassword, setShowPassword] = useState(false);
  const [inputPass, setInputPass] = useState("");
  const [isWrongPass, setIsWrongPass] = useState(false);

  const handleVerify = (password) => {
    if (inputPass == mainKey) {
      logSession("New user login.");
      handleLoginKey(inputPass);
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          theme == "light" ? themes.light.neutral : themes.dark.neutral,
        marginTop: StatusBar.currentHeight,
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: 300,
          marginHorizontal: 10,
          marginBottom: 20,
        }}
      >
        <Image
          source={logoImage}
          style={{ height: 250, resizeMode: "contain" }}
        />
      </View>

      <View style={{ marginHorizontal: 20 }}>
        <Text
          style={{
            fontFamily: "nunito-sans-bold",
            fontSize: 20,
            marginBottom: 2,
          }}
        >
          LOGIN
        </Text>
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

        <View style={{ justifyContent: "center", alignItems: "center" }}>
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
            <Text style={{ fontFamily: "nunito-sans" }}>Login</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginKey;
