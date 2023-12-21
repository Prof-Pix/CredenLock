import React, { useContext, useEffect, useState, useRef } from "react";
import {
  TextInput,
  Button,
  HelperText,
  Portal,
  Dialog,
} from "react-native-paper";
import { View, Text, StyleSheet, StatusBar, AppState } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Application from "../../context/ApplicationContext";
import { useFonts } from "expo-font";
import { themes } from "../../theme/theme";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const CreateAccount = ({ navigation }) => {
  const context = useContext(Application);
  const { theme, logSession } = context;
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [isSuccessAdd, setIsSuccessAdd] = useState(false);
  const [isAddingMore, setIsAddingMore] = useState(false);

  const {
    newLabel,
    newEmail,
    newPass,
    description,
    credentials,
    handleNewLabel,
    handleNewEmail,
    handleNewPass,
    handleDescription,
    handleCredentials,
  } = context;

  const handleVerifyCredentials = () => {
    const newErrors = {};

    if (!newLabel.trim()) {
      newErrors.label = "Label is required.";
    }

    if (!newEmail.trim()) {
      newErrors.email = "Email/Username is required.";
    }
    if (!newPass.trim()) {
      newErrors.pass = "Password is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const getCurrentDateFormatted = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleSubmitForm = () => {
    if (handleVerifyCredentials()) {
      const dateAdded = getCurrentDateFormatted();
      handleCredentials(newLabel, newEmail, newPass, description, dateAdded);
      setIsSuccessAdd(true);
      logSession("A credential was added.");
    }
  };

  const goToLists = () => {
    setIsSuccessAdd(false);
    navigation.navigate("Lists");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          theme == "light" ? themes.light.neutral : themes.dark.neutral,
      }}
    >
      <View
        style={{
          rowGap: 10,
          justifyContent: "center",
          marginHorizontal: 20,
          marginTop: 9,
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: "nunito-sans-bold",
              fontSize: 17,
              marginBottom: 2,
            }}
          >
            Label*
          </Text>
          <TextInput
            mode="outlined"
            value={newLabel}
            onChangeText={handleNewLabel}
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
              color={errors.label ? "#FF0000" : themes.light.neutral}
              size={16}
            />
            <Text
              style={{
                color: errors.label ? "#FF0000" : themes.light.neutral,
                fontSize: 12,
                fontFamily: "nunito-sans",
              }}
            >
              Label is required.
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
            Email/Username*
          </Text>
          <TextInput
            mode="outlined"
            value={newEmail}
            onChangeText={handleNewEmail}
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
              color={errors.email ? "#FF0000" : themes.light.neutral}
              size={16}
            />
            <Text
              style={{
                color: errors.email ? "#FF0000" : themes.light.neutral,
                fontSize: 12,
                fontFamily: "nunito-sans",
              }}
            >
              Email/Username is required.
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
            Password*
          </Text>
          <TextInput
            mode="outlined"
            secureTextEntry={!showPassword}
            value={newPass}
            onChangeText={handleNewPass}
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
              color={errors.pass ? "#FF0000" : themes.light.neutral}
              size={16}
            />
            <Text
              style={{
                color: errors.pass ? "#FF0000" : themes.light.neutral,
                fontSize: 12,
                fontFamily: "nunito-sans",
              }}
            >
              Password is required.
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
            {`Description (optional)`}
          </Text>
          <TextInput value={description} onChangeText={handleDescription} />
        </View>

        <View
          style={{
            marginTop: 10,
            justifyContent: "center",
            marginHorizontal: 40,
          }}
        >
          <Button
            icon="account-multiple-plus-outline"
            mode="elevated"
            onPress={handleSubmitForm}
            rippleColor="#EBF2FA"
            buttonColor={
              theme == "light" ? themes.light.action : themes.dark.action
            }
            style={{ borderRadius: 5 }}
            labelStyle={{ color: theme == "light" ? "white" : "black" }}
          >
            <Text style={{ fontFamily: "nunito-sans" }}>Add Credential</Text>
          </Button>
        </View>
      </View>

      <Portal>
        <Dialog visible={isSuccessAdd} onDismiss={() => setIsSuccessAdd(false)}>
          <Dialog.Icon icon="check-circle" size={50} />
          <Dialog.Title
            style={{ textAlign: "center", fontFamily: "nunito-sans-bold" }}
          >
            Added Successfully!
          </Dialog.Title>
          <Dialog.Content>
            <Text>{"\n"}</Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={() => setIsSuccessAdd(false)}>
              <Text>Add more</Text>
            </Button>
            <Button
              onPress={goToLists}
              style={{
                backgroundColor:
                  theme == "light" ? themes.light.action : themes.dark.action,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: theme == "light" ? themes.light.text : "black",
                }}
              >
                To Lists
              </Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default CreateAccount;

const styles = StyleSheet.create({
  mainWrapper: {},
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
