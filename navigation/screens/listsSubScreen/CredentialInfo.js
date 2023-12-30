import React, { useContext, useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dialog, Button, TouchableRipple, Portal } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Clipboard from "expo-clipboard";

//For Importing Application Context
import Application from "../../../context/ApplicationContext";
import { useFonts } from "expo-font";
import { themes } from "../../../theme/theme";
const CredentialInfo = ({ route, navigation }) => {
  const context = useContext(Application); //For getting the context from App.js
  const { credentials, theme } = context; // Destructuring
  const { ID_CRED_TO_ACCESS } = route.params;

  const credenToAccess = credentials.find(
    (cred) => cred.id == ID_CRED_TO_ACCESS
  );

  const copyToClipboard = async (textToCopy) => {
    await Clipboard.setStringAsync(textToCopy);
  };

  useEffect(() => {
    const backAction = () => {
      // Do whatever you want before going back
      // For example, navigate to CredentialLabel
      console.log("clicked");
      navigation.navigate("Credential Lists");
      return true; // Prevent default behavior (exit the app)
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Remove the event listener on component unmount
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          theme == "light" ? themes.light.neutral : themes.dark.neutral,
      }}
    >
      <View style={{ marginTop: 15 }}>
        <View style={{ alignItems: "flex-end", marginBottom: 25 }}>
          <Button
            rippleColor={themes.light.neutral}
            mode="elevated"
            icon={({ size, color }) => (
              <MaterialCommunityIcons name="pencil" size={20} color="white" />
            )}
            style={{
              borderBottomRightRadius: 1,
              borderTopRightRadius: 0,
              backgroundColor:
                theme == "light" ? themes.light.action : themes.dark.action,
              width: 100,

              padding: 0,
            }}
            onPress={() =>
              navigation.navigate("Edit Credential", { ID_CRED_TO_ACCESS })
            }
          >
            <Text style={{ color: "white", fontFamily: "nunito-sans-bold" }}>
              EDIT
            </Text>
          </Button>
        </View>
        <View
          style={{
            marginHorizontal: 10,
            borderRadius: 5,
            rowGap: 20,
          }}
        >
          <View>
            <Text
              style={{
                backgroundColor:
                  theme == "light" ? themes.light.primary : themes.dark.neutral,
                borderWidth: 0.3,
                borderColor: theme == "light" ? "black" : themes.dark.action,
                width: 125,
                textAlign: "center",
                fontSize: 20,
                padding: 5,
                color: theme == "light" ? themes.light.text : "white",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                fontFamily: "nunito-sans",
              }}
            >
              Email
            </Text>
            <TouchableRipple
              onPress={() => copyToClipboard(credenToAccess.email)}
              rippleColor={themes.light.action}
              style={{
                borderWidth: 1,
                borderColor: theme == "light" ? themes.light.primary : "white",
                borderBottomLeftRadius: 5,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                padding: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={styles.infoWrapper}>
                  <MaterialCommunityIcons name="email" size={22} />
                  <Text style={styles.info}>{credenToAccess.email}</Text>
                </View>
                <View style={{ marginRight: 10 }}>
                  <MaterialCommunityIcons name="content-copy" size={20} />
                </View>
              </View>
            </TouchableRipple>
          </View>

          <View>
            <Text
              style={{
                backgroundColor:
                  theme == "light" ? themes.light.primary : themes.dark.neutral,
                borderWidth: 0.3,
                borderColor: theme == "light" ? "black" : themes.dark.action,
                width: 125,
                textAlign: "center",
                fontSize: 20,
                padding: 5,
                color: theme == "light" ? themes.light.text : "white",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                fontFamily: "nunito-sans",
              }}
            >
              Password
            </Text>
            <TouchableRipple
              onPress={() => copyToClipboard(credenToAccess.pass)}
              rippleColor={themes.light.action}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",

                  borderWidth: 1,
                  borderColor:
                    theme == "light" ? themes.light.primary : "white",
                  borderBottomLeftRadius: 5,
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                  padding: 10,
                }}
              >
                <View style={styles.infoWrapper}>
                  <MaterialCommunityIcons name="lock" size={22} />
                  <Text style={styles.info}>{credenToAccess.pass}</Text>
                </View>
                <View style={{ marginRight: 10 }}>
                  <MaterialCommunityIcons name="content-copy" size={23} />
                </View>
              </View>
            </TouchableRipple>
          </View>

          <View
            style={{
              minHeight: 150,
              borderRadius: 5,
              borderWidth: 0.5,
              borderColor:
                theme == "light" ? themes.light.action : themes.dark.action,
            }}
          >
            <Text
              style={{
                backgroundColor:
                  theme == "light" ? themes.light.primary : themes.dark.neutral,
                fontSize: 20,
                padding: 5,
                color: theme == "light" ? themes.light.text : "white",
                paddingLeft: 10,
                fontFamily: "nunito-sans",
              }}
            >
              Description
            </Text>
            <TouchableRipple
              onPress={() => console.log("Pressed")}
              rippleColor="rgba(0, 0, 0, .32)"
            >
              <View style={styles.infoWrapper}>
                <Text
                  style={{
                    fontSize: 15,
                    marginLeft: 15,
                    marginRight: 10,
                    fontFamily: credenToAccess.description
                      ? "nunito-sans"
                      : "nunito-sans-italic",
                  }}
                >
                  {credenToAccess.description
                    ? credenToAccess.description
                    : "The user did not provide a description."}
                </Text>
              </View>
            </TouchableRipple>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CredentialInfo;

const styles = StyleSheet.create({
  infoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  info: {
    fontSize: 18,
    marginLeft: 10,
    color: "black",
    fontFamily: "nunito-sans",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
