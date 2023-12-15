import React, { useCallback, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as SplashScreen from "expo-splash-screen";
import Application from "../../context/ApplicationContext";
import { Button, TextInput, Portal, Dialog } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import { themes } from "../../theme/theme";

const settingImage = require("../../assets/settings.png");

const Stack = createStackNavigator();

const SettingStack = () => {
  const context = useContext(Application);
  const { theme, handleAfterMainKeyChange } = context;

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Stack.Navigator initialRouteName="Settings Screen">
        <Stack.Screen
          name="Settings Screen"
          component={SettingsScreen}
          options={{ headerShown: false, headerStatusBarHeight: 0 }}
        />

        <Stack.Screen
          name="Reset Main Key"
          component={ResetKey}
          options={{
            headerTitleStyle: {
              fontFamily: "nunito-sans",
            },
            headerStyle: {
              backgroundColor:
                theme == "light" ? themes.light.neutral : "black",
              borderBottomWidth: 0.5,
            },
          }}
        />
      </Stack.Navigator>
    </View>
  );
};

const ResetKey = ({ navigation }) => {
  const context = useContext(Application);
  const {
    theme,
    mainKey,
    handleMainKey,
    handleAfterMainKeyChange,
    logSession,
  } = context;

  const [oldKey, setOldKey] = useState("");
  const [changePass, setChangePass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [errors, setErrors] = useState({});

  const [isSuccessChange, setIsSuccessChange] = useState(false);

  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [showPass3, setShowPass3] = useState(false);

  const [invalidPass, setInvalidPass] = useState(false);

  //For Checking Key Entered
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasDigit, setHasDigit] = useState(false);
  const [hasSymbol, setHasSymbol] = useState(false);
  const [hasMinLength, setHasMinLength] = useState(false);

  const handleChangeKeyEntered = (key) => {
    setChangePass(key);
    setHasLowerCase(/[a-z]/.test(key));
    setHasUpperCase(/[A-Z]/.test(key));
    setHasDigit(/\d/.test(key));
    setHasSymbol(/[!@#$%^&*()_+]/.test(key));
    setHasMinLength(key.length >= 8);
  };

  const handleSubmit = () => {
    if (handleVerifyCredentials()) {
      if (
        oldKey == mainKey &&
        changePass == confirmPass &&
        oldKey &&
        changePass
      ) {
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

        const isValid = passwordRegex.test(changePass) && hasMinLength;
        if (!isValid) {
          setInvalidPass(true);
          setTimeout(() => setInvalidPass(false), 1500);
        } else {
          setInvalidPass(false);
          handleMainKey(changePass);
          logSession("Someone changed the main key.");
          setIsSuccessChange(true);
        }
      }
    }
  };

  const handleVerifyCredentials = () => {
    const newErrors = {};

    if (!oldKey.trim()) {
      newErrors.old = "Old main key is required.";
    }

    if (!changePass.trim()) {
      newErrors.change = "New main key is required.";
    }
    if (!confirmPass.trim()) {
      newErrors.confirm = "Confirming main key is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAfterSuccessChange = () => {
    setIsSuccessChange(false);
    handleAfterMainKeyChange();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme == "light" ? themes.light.neutral : "black",
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: theme == "light" ? themes.light.neutral : "black",
        }}
      >
        <View style={{ marginHorizontal: 20, marginTop: 10 }}>
          <View>
            <Text
              style={{
                fontFamily: "nunito-sans-bold",
                fontSize: 17,
                marginBottom: 2,
              }}
            >
              Old Main Key*
            </Text>
            <TextInput
              mode="outlined"
              value={oldKey}
              onChangeText={setOldKey}
              secureTextEntry={!showPass1}
              right={
                <TextInput.Icon
                  icon={showPass1 ? "eye" : "eye-off"}
                  onPress={() => setShowPass1(!showPass1)}
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
                color={
                  errors.old || (oldKey !== mainKey && oldKey)
                    ? "#FF0000"
                    : themes.light.neutral
                }
                name="alert-circle"
                size={16}
              />
              <Text
                style={{
                  color:
                    errors.old || (oldKey !== mainKey && oldKey)
                      ? "#FF0000"
                      : themes.light.neutral,
                  fontSize: 12,
                  fontFamily: "nunito-sans",
                }}
              >
                {errors.old ? errors.old : "Old key entered is incorrect"}
              </Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                fontFamily: "nunito-sans-bold",
                fontSize: 17,
                marginBottom: 2,
              }}
            >
              New Main Key*
            </Text>
            <TextInput
              mode="outlined"
              value={changePass}
              onChangeText={handleChangeKeyEntered}
              secureTextEntry={!showPass2}
              right={
                <TextInput.Icon
                  icon={showPass2 ? "eye" : "eye-off"}
                  onPress={() => setShowPass2(!showPass2)}
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
                color={errors.change ? "#FF0000" : themes.light.neutral}
                name="alert-circle"
                size={16}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: errors.change ? "#FF0000" : themes.light.neutral,
                  fontFamily: "nunito-sans",
                }}
              >
                {errors.change}
              </Text>
            </View>
          </View>

          <View>
            <Text
              style={{
                fontFamily: "nunito-sans-bold",
                fontSize: 17,
                marginBottom: 2,
              }}
            >
              Confirm New Main Key*
            </Text>
            <TextInput
              mode="outlined"
              value={confirmPass}
              onChangeText={setConfirmPass}
              secureTextEntry={!showPass3}
              right={
                <TextInput.Icon
                  icon={showPass3 ? "eye" : "eye-off"}
                  onPress={() => setShowPass3(!showPass3)}
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
                color={
                  errors.confirm || (changePass !== confirmPass && confirmPass)
                    ? "#FF0000"
                    : themes.light.neutral
                }
                name="alert-circle"
                size={16}
              />
              <Text
                style={{
                  color:
                    errors.confirm ||
                    (changePass !== confirmPass && confirmPass)
                      ? "#FF0000"
                      : themes.light.neutral,
                  fontSize: 12,
                  fontFamily: "nunito-sans",
                }}
              >
                {errors.confirm
                  ? errors.confirm
                  : "Invalid action to confirm new main key."}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            columnGap: 2,
            padding: 3,
            marginLeft: 20,
          }}
        >
          <MaterialCommunityIcons
            color={invalidPass ? "#FF0000" : themes.light.neutral}
            name="alert-circle"
            size={16}
          />
          <Text
            style={{
              color: invalidPass ? "#FF0000" : themes.light.neutral,
              fontSize: 12,
              fontFamily: "nunito-sans",
            }}
          >
            Invalid new main key.
          </Text>
        </View>

        <View style={{ marginHorizontal: 75, marginTop: 5 }}>
          <Button
            icon="key"
            onPress={handleSubmit}
            mode="elevated"
            rippleColor="#EBF2FA"
            buttonColor={
              theme == "light" ? themes.light.action : themes.dark.action
            }
            style={{ borderRadius: 5 }}
            labelStyle={{ color: theme == "light" ? "white" : "black" }}
          >
            <Text style={{ fontFamily: "nunito-sans" }}>Change Main Key</Text>
          </Button>
        </View>
        <View style={{ marginTop: 40, marginLeft: 20 }}>
          <Text style={{ fontFamily: "nunito-sans-bold", fontSize: 15 }}>
            New Main Key must meet the following criteria:
          </Text>
          <View style={{ paddingLeft: 10, paddingTop: 5, rowGap: 3 }}>
            <View style={styles.criteriaWrapper}>
              {hasLowerCase ? (
                <MaterialCommunityIcons
                  style={{ color: "#7f1d1d" }}
                  name="check-circle"
                  size={18}
                />
              ) : (
                <MaterialCommunityIcons
                  name="window-close"
                  style={{ color: "#166534" }}
                  size={18}
                />
              )}

              <Text
                style={{
                  color: hasLowerCase ? "#166534" : "#7f1d1d",
                  fontFamily: "nunito-sans",
                }}
              >
                Must have atleast one lowercase letter.{" "}
              </Text>
            </View>

            <View style={styles.criteriaWrapper}>
              {hasUpperCase ? (
                <MaterialCommunityIcons
                  style={{ color: "#7f1d1d" }}
                  name="check-circle"
                  size={18}
                />
              ) : (
                <MaterialCommunityIcons
                  style={{ color: "#166534" }}
                  name="window-close"
                  size={18}
                />
              )}

              <Text
                style={{
                  color: hasLowerCase ? "#166534" : "#7f1d1d",
                  fontFamily: "nunito-sans",
                }}
              >
                Must have atleast one uppercase letter.{" "}
              </Text>
            </View>

            <View style={styles.criteriaWrapper}>
              {hasDigit ? (
                <MaterialCommunityIcons
                  style={{ color: "#7f1d1d" }}
                  name="check-circle"
                  size={18}
                />
              ) : (
                <MaterialCommunityIcons
                  style={{ color: "#166534" }}
                  name="window-close"
                  size={18}
                />
              )}

              <Text
                style={{
                  color: hasLowerCase ? "#166534" : "#7f1d1d",
                  fontFamily: "nunito-sans",
                }}
              >
                Must have atleast one digit.{" "}
              </Text>
            </View>

            <View style={styles.criteriaWrapper}>
              {hasSymbol ? (
                <MaterialCommunityIcons
                  style={{ color: "#7f1d1d" }}
                  name="check-circle"
                  size={18}
                />
              ) : (
                <MaterialCommunityIcons
                  style={{ color: "#166534" }}
                  name="window-close"
                  size={18}
                />
              )}

              <Text
                style={{
                  color: hasLowerCase ? "#166534" : "#7f1d1d",
                  fontFamily: "nunito-sans",
                }}
              >{`Must have atleast one symbol. (!@#$%^&*()_+)`}</Text>
            </View>

            <View style={styles.criteriaWrapper}>
              {hasMinLength ? (
                <MaterialCommunityIcons
                  style={{ color: "#7f1d1d" }}
                  name="check-circle"
                  size={18}
                />
              ) : (
                <MaterialCommunityIcons
                  style={{ color: "#166534" }}
                  name="window-close"
                  size={18}
                />
              )}

              <Text
                style={{
                  color: hasLowerCase ? "#166534" : "#7f1d1d",
                  fontFamily: "nunito-sans",
                }}
              >
                Must be a minimum length of 8 characters.
              </Text>
            </View>
          </View>
        </View>
        <Portal>
          <Dialog
            visible={isSuccessChange}
            onDismiss={handleAfterSuccessChange}
          >
            <Dialog.Icon icon="key" size={50} />
            <Dialog.Title style={{ textAlign: "center" }}>
              Main Key Change!
            </Dialog.Title>
            <Dialog.Content style={{ textAlign: "center" }}>
              <Text
                style={{
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                *You will be redirected to the Login Page again!*
              </Text>
            </Dialog.Content>

            <Dialog.Actions>
              <Button onPress={handleAfterMainKeyChange}>
                Go to the Login Page
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </View>
  );
};

const SettingsScreen = ({ navigation }) => {
  const context = useContext(Application);
  const { themes, theme } = context;

  return (
    <SafeAreaView
      style={{
        marginTop: StatusBar.currentHeight,
        flex: 1,
        backgroundColor:
          theme == "light" ? themes.light.neutral : themes.dark.neutral,
      }}
    >
      <View style={{ marginHorizontal: 20 }}>
        <Text
          style={{
            fontFamily: "nunito-sans-bold",
            color: themes.light.action,
            fontSize: 40,
          }}
        >
          CredenLock
        </Text>
        <Text style={{ fontStyle: "italic", marginBottom: 8 }}>
          by rhem giou salvador
        </Text>
        <View
          style={{
            backgroundColor:
              theme == "light" ? themes.light.primary : themes.dark.primary,
            padding: 15,

            borderRadius: 10,
          }}
        >
          <Text
            style={{
              color: theme == "light" ? themes.light.text : "black",
              fontWeight: "bold",
              fontFamily: "nunito-sans",
              fontSize: 25,
              marginBottom: 10,
            }}
          >
            About
          </Text>

          <Text
            style={{
              color: theme == "light" ? themes.light.text : "black",
              textAlign: "justify",
              lineHeight: 25,
              fontSize: 13,
              fontFamily: "nunito-sans",
            }}
          >
            Credenlock is a robust and user-friendly account credentials manager
            designed to keep your sensitive information safe and easily
            accessible. With Credenlock, you can securely store and manage your
            passwords, ensuring that you never forget or compromise your login
            credentials again.
          </Text>
        </View>
        <View style={{ marginTop: 30 }}>
          <Button
            icon="key"
            mode="outlined"
            rippleColor={themes.light.neutral}
            buttonColor={themes.light.action}
            textColor={themes.light.text}
            style={{ borderRadius: 5, width: 150 }}
            onPress={() => navigation.navigate("Reset Main Key")}
          >
            <Text style={{ fontFamily: "nunito-sans-bold" }}>
              Reset Main Key
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   title: {
//     fontFamily: "nunito-sans-bold",
//   },
//   creator: {
//     fontFamily: "nunito-sans-italic",
//   },
//   description: {
//     fontFamily: "nunito-sans",
//   },
// });

const styles = StyleSheet.create({
  criteriaWrapper: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 5,
  },
  textFont: {
    fontFamily: "nunito-sans",
  },
  textFontBold: {
    fontFamily: "nunito-sans-bold",
  },
  textFontItalic: {
    fontFamily: "nunito-sans-italic",
  },
});

export default SettingStack;
