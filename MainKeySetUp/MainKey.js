import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import {
  TextInput,
  Button,
  HelperText,
  Portal,
  Dialog,
} from "react-native-paper";
import Application from "../context/ApplicationContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

//For Fonts
import { useFonts } from "expo-font";
import { themes } from "../theme/theme";
import globalStyle from "../global styles/globalStyles";

const MainKey = () => {
  const context = useContext(Application);
  const { handleMainKey, theme } = context;
  const [mainKeyEntered, setMainKeyEntered] = useState("");
  const [isEmptyKey, setIsEmptyKey] = useState(false);
  const [isInvalidPass, setIsInvalidPass] = useState(false);
  const [isSuccessRegister, setIsSuccessRegister] = useState(false);

  //For Checking Key Entered
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasDigit, setHasDigit] = useState(false);
  const [hasSymbol, setHasSymbol] = useState(false);
  const [hasMinLength, setHasMinLength] = useState(false);

  const handleChangeKeyEntered = (key) => {
    setMainKeyEntered(key);
    setHasLowerCase(/[a-z]/.test(key));
    setHasUpperCase(/[A-Z]/.test(key));
    setHasDigit(/\d/.test(key));
    setHasSymbol(/[!@#$%^&*()_+]/.test(key));
    setHasMinLength(key.length >= 8);
  };

  const handleRegisterKey = () => {
    if (!mainKeyEntered.trim()) {
      if (!isEmptyKey) {
        setIsEmptyKey(true);
        setTimeout(() => setIsEmptyKey(false), 1500);
      }
    } else {
      setIsEmptyKey(false);

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

      const isValid = passwordRegex.test(mainKeyEntered) && hasMinLength;

      if (!isValid) {
        console.log("Invalid Password");
        if (!isInvalidPass) {
          setIsInvalidPass(true);
          setTimeout(() => setIsInvalidPass(false), 1500);
        }
      } else {
        setIsSuccessRegister(true);
      }
    }
  };

  const handleAfterSuccessReg = () => {
    setIsSuccessRegister(false);
    handleMainKey(mainKeyEntered);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          theme == "light" ? themes.light.neutral : themes.dark.neutral,
      }}
    >
      <View style={{ marginHorizontal: 10, marginTop: 10 }}>
        <Text
          style={{
            fontFamily: "nunito-sans-bold",
            color: themes.light.action,
            fontSize: 40,
          }}
        >
          CredenLock
        </Text>
        <View
          style={{
            backgroundColor:
              theme == "light" ? themes.light.primary : themes.dark.neutral,
            borderRadius: 5,
            padding: 10,
            marginTop: StatusBar.currentHeight * 0.5,
            marginBottom: StatusBar.currentHeight,
          }}
        >
          <Text
            style={{
              fontFamily: "nunito-sans-bold",
              fontSize: 20,
              marginBottom: 7.5,
              color: theme == "light" ? themes.light.text : "black",
            }}
          >
            Getting Started
          </Text>
          <Text
            style={{
              fontFamily: "nunito-sans-italic",
              marginBottom: 7.5,
              color: theme == "light" ? themes.light.text : "black",
            }}
          >
            To start please register a main key
          </Text>
          <View>
            <Text
              style={{
                fontFamily: "nunito-sans-bold",
                color: theme == "light" ? themes.light.text : "black",
                fontSize: 13,
                marginBottom: 3,
              }}
            >
              Note:
            </Text>
            <View style={{ paddingLeft: 10, paddingRight: 7 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 5,
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: "nunito-sans",
                    color: theme == "light" ? "black" : "black",
                    height: 22,
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 11,
                    padding: 4,
                    borderRadius: 5,
                    backgroundColor:
                      theme == "light" ? themes.light.text : "black",
                  }}
                >
                  1
                </Text>

                <Text
                  style={{
                    fontFamily: "nunito-sans",
                    color: theme == "light" ? themes.light.text : "black",
                    marginBottom: 2,
                    fontSize: 12.5,
                  }}
                >
                  This key will serve as your main authentication key to login
                  to the application.
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 5,
                }}
              >
                <Text
                  style={{
                    fontFamily: "nunito-sans",
                    color: theme == "light" ? "black" : "black",
                    marginBottom: 2,
                    height: 22,
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 11,
                    padding: 4,
                    borderRadius: 5,
                    backgroundColor:
                      theme == "light" ? themes.light.text : "black",
                  }}
                >
                  2
                </Text>
                <Text
                  style={{
                    fontFamily: "nunito-sans",
                    color: theme == "light" ? themes.light.text : "black",
                    fontSize: 12.5,
                  }}
                >
                  This key will also serve as your authentication key to perform
                  actions inside the application, such as adding, editing, and
                  deleting credentials.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View>
          <View
            style={{
              marginTop: StatusBar.currentHeight * 0.5,
            }}
          >
            <TextInput
              onChangeText={handleChangeKeyEntered}
              label="Main Key*"
              mode="outlined"
            />
          </View>

          {isInvalidPass ? (
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
                color={isInvalidPass ? "#FF0000" : themes.light.neutral}
                size={16}
              />
              <Text
                style={{
                  color: isInvalidPass ? "#FF0000" : themes.light.neutral,
                  fontSize: 12,
                }}
              >
                Invalid Key. Please check the criteria below.
              </Text>
            </View>
          ) : (
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
                color={isEmptyKey ? "#FF0000" : themes.light.neutral}
                size={16}
              />
              <Text
                style={{
                  color: isEmptyKey ? "#FF0000" : themes.light.neutral,
                  fontSize: 12,
                }}
              >
                This field is required.
              </Text>
            </View>
          )}

          <Button
            onPress={handleRegisterKey}
            icon="key"
            mode="elevated"
            textColor="white"
            style={{
              borderRadius: 10,
              marginHorizontal: 80,
              backgroundColor:
                theme == "light" ? themes.light.action : themes.dark.action,
            }}
          >
            <Text style={{ fontFamily: "nunito-sans-bold" }}>
              Register Main Key
            </Text>
          </Button>
        </View>
        <View style={{ marginTop: 40, marginLeft: 10 }}>
          <Text style={{ fontFamily: "nunito-sans-bold", fontSize: 15 }}>
            Key must meet the following criteria:
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
          <Dialog visible={isSuccessRegister} onDismiss={handleAfterSuccessReg}>
            <Dialog.Icon icon="key" size={50} />
            <Dialog.Title style={{ textAlign: "center" }}>
              Main Key Registered!
            </Dialog.Title>

            <Dialog.Actions>
              <Button onPress={handleAfterSuccessReg}>
                Go to the Login Page
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </SafeAreaView>
  );
};

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

export default MainKey;
