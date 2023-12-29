import React, { useContext, useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Dialog,
  TextInput,
  Button,
  TouchableRipple,
  Portal,
} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { HelperText } from "react-native-paper";
import * as Clipboard from "expo-clipboard";

//For Importing Application Context
import Application from "../../../context/ApplicationContext";

//For Fonts
import { useFonts } from "expo-font";
import { themes } from "../../../theme/theme";

const EditCredential = ({ route, navigation }) => {
  const context = useContext(Application);
  const { credentials, handleEditCredentials, logSession, mainKey, theme } =
    context;
  const { ID_CRED_TO_ACCESS } = route.params;
  const credenToAccess = credentials.find(
    (cred) => cred.id == ID_CRED_TO_ACCESS
  );
  const { label, email, pass, description } = credenToAccess;

  const [labelToEdit, setLabelToEdit] = useState(label);
  const [emailToEdit, setEmailToEdit] = useState(email);
  const [passToEdit, setPassToEdit] = useState(pass);
  const [descToEdit, setDescToEdit] = useState(description);

  const [isChanged, setIsChanged] = useState(false);
  const [isSure, setIsSure] = useState(false);

  const [modDetails, setModDetails] = useState({
    label: undefined,
    email: undefined,
    pass: undefined,
    desc: undefined,
  });

  useEffect(() => {
    const labelHasChanged = labelToEdit !== label;
    const emailHasChanged = emailToEdit !== email;
    const passHasChanged = passToEdit !== pass;
    const descHasChanged = descToEdit !== description;

    const checkChange =
      labelHasChanged || emailHasChanged || passHasChanged || descHasChanged;

    if (labelHasChanged) {
      setModDetails({
        ...modDetails,
        label: { oldLabel: label, newLabel: labelToEdit },
      });
    }

    if (emailHasChanged) {
      setModDetails({
        ...modDetails,
        email: { oldLabel: label },
      });
    }

    if (passHasChanged) {
      setModDetails({
        ...modDetails,
        pass: { oldLabel: label },
      });
    }

    if (descHasChanged) {
      setModDetails({
        ...modDetails,
        desc: { oldLabel: label },
      });
    }

    setIsChanged(checkChange);
  }, [labelToEdit, emailToEdit, passToEdit, descToEdit]);

  //For Dialog
  const [isWrongPass, setIsWrongPass] = useState(false);
  const [isShowPass, setIsShowPass] = useState(false);
  const [enteredPass, setEnteredPass] = useState("");
  const [showDialog, setIsShowDialog] = useState(false);
  const [isShowSuccessDialog, setIsShowSuccessDialog] = useState(false);

  const handleShowPass = () => {
    setIsShowPass(!isShowPass);
  };

  const handleOpenDialog = () => {
    if (handleVerifyCredentials()) {
      setIsShowDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setIsShowDialog(false);
    setIsShowPass(false);
  };

  const [errors, setErrors] = useState({});
  const handleVerifyCredentials = () => {
    const newErrors = {};

    if (!labelToEdit.trim()) {
      newErrors.label = "Label is required.";
    }

    if (!emailToEdit.trim()) {
      newErrors.email = "Email/Username is required.";
    }
    if (!passToEdit.trim()) {
      newErrors.pass = "Password is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAfterSuccessEdit = () => {
    setIsShowSuccessDialog(false);
    navigation.navigate("Credential Lists");
  };
  const getCurrentDateFormatted = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleSubmitForm = () => {
    if (handleVerifyCredentials() && enteredPass == mainKey) {
      const dateModified = getCurrentDateFormatted();

      handleEditCredentials(
        ID_CRED_TO_ACCESS,
        {
          labelToEdit,
          emailToEdit,
          passToEdit,
          descToEdit,
          dateModified,
        },
        modDetails
      );
      setIsShowDialog(false);
      setIsShowSuccessDialog(true);
      return;
    } else if (enteredPass !== mainKey) {
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
          backgroundColor:
            theme == "light" ? themes.light.neutral : themes.dark.neutral,
          flex: 1,
        }}
      >
        <View
          style={{
            backgroundColor:
              theme == "light" ? themes.light.neutral : themes.dark.neutral,
            marginHorizontal: 20,
            marginTop: 20,

            rowGap: 8,
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
              Edit Label*
            </Text>
            <TextInput
              mode="outlined"
              value={labelToEdit}
              onChangeText={setLabelToEdit}
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
              Edit Email/Username*
            </Text>
            <TextInput
              mode="outlined"
              value={emailToEdit}
              onChangeText={setEmailToEdit}
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
              Edit Password*
            </Text>
            <TextInput
              mode="outlined"
              value={passToEdit}
              onChangeText={setPassToEdit}
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
              {` Edit Description`}
            </Text>
            <TextInput value={descToEdit} onChangeText={setDescToEdit} />
          </View>

          <Button
            disabled={!isChanged}
            mode="elevated"
            onPress={handleOpenDialog}
            textColor="white"
            rippleColor={
              theme == "light" ? themes.light.neutral : themes.dark.action
            }
            buttonColor={
              theme == "light" ? themes.light.action : themes.dark.action
            }
            style={{
              marginHorizontal: 60,
            }}
          >
            <Text style={{ fontFamily: "nunito-sans" }}>Save changes</Text>
          </Button>

          <Portal>
            <Dialog
              visible={showDialog}
              onDismiss={() => setIsShowDialog(false)}
            >
              <Dialog.Title>Enter Main Key to continue</Dialog.Title>
              <Dialog.Content>
                <Text
                  style={{
                    marginBottom: 10,
                    color: "red",
                    fontStyle: "italic",
                  }}
                >
                  *Once a credential is edited, it cannot be redone anymore.*
                </Text>
                <TextInput
                  onChangeText={setEnteredPass}
                  value={enteredPass}
                  mode="outlined"
                  label="Key"
                  secureTextEntry={!isShowPass}
                  right={
                    <TextInput.Icon
                      onPress={handleShowPass}
                      icon={isShowPass ? "eye" : "eye-off"}
                    />
                  }
                ></TextInput>

                {isWrongPass && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      columnGap: 2,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="alert-circle"
                      color={"#FF0000"}
                      size={20}
                    />
                    <Text style={{ color: "#FF0000" }}>
                      Wrong Password. Try again!{" "}
                    </Text>
                  </View>
                )}
              </Dialog.Content>

              <Dialog.Actions>
                <Button onPress={handleSubmitForm}>Save Changes</Button>
                <Button onPress={handleCloseDialog}>Cancel</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>

          <Portal>
            <Dialog
              visible={isShowSuccessDialog}
              onDismiss={handleAfterSuccessEdit}
            >
              <Dialog.Icon icon="check-circle" size={50} />
              <Dialog.Title style={{ textAlign: "center" }}>
                Edited Successfully!
              </Dialog.Title>
              <Dialog.Content>
                <Text
                  style={{
                    fontStyle: "italic",
                    textAlign: "center",
                    color: "#7f1d1d",
                  }}
                >
                  *CredenLock will redirect you to the Lists page.*
                </Text>
              </Dialog.Content>

              <Dialog.Actions>
                <Button onPress={handleAfterSuccessEdit}>Proceed</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </View>
    </>
  );
};

export default EditCredential;
