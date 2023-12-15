import React, { useContext, useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Searchbar,
  List,
  Dialog,
  Portal,
  Button,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

//For Reseting the Navigation
import { useResetNavigation } from "../../../utilities/utils";

//For Importing Application Context
import Application from "../../../context/ApplicationContext";

//For Fonts
import { useFonts } from "expo-font";
import { themes } from "../../../theme/theme";

const CredLists = ({ navigation }) => {
  const context = useContext(Application); //For getting the context from App.js
  const { credentials, handleDeleteCredentials, mainKey, theme } = context; // Destructuring
  let ID_CRED_TO_ACCESS;

  const [searchText, setSearchText] = useState("");
  const [filteredCredential, setFilteredCredential] = useState(credentials);

  const [credIdFocus, setCredIdFocus] = useState("");
  //For Deleting
  const [credToDelete, setCredToDelete] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [contDelete, setContDelete] = useState(false);
  const [isShowPass, setIsShowPass] = useState(false);
  const [isSuccessDelete, setIsSuccessDelete] = useState(false);

  useEffect(() => {
    // Update filtered credentials when credentials change
    const filtered = Array.isArray(credentials)
      ? credentials.filter((credential) => {
          const label = credential.label;
          return label.toLowerCase().includes(searchText.toLowerCase());
        })
      : [];

    setFilteredCredential(filtered);
  }, [credentials, searchText]);

  const handleAfterSuccessDelete = () => {
    setIsSuccessDelete(false);
  };

  const [enteredPass, setEnteredPass] = useState("");

  const [isWrongPass, setIsWrongPass] = useState(false);

  const handleShowPass = () => {
    setIsShowPass(!isShowPass);
  };

  const handleListPress = (pathName, id) => {
    ID_CRED_TO_ACCESS = id;
    navigation.navigate(`${pathName}`, { ID_CRED_TO_ACCESS });
  };

  const handleSearch = (searchText) => {
    setSearchText(searchText);
  };

  const handleDeleteCred = (credID) => {
    credentials.forEach((credential) => {
      if (credential.id == credID) {
        const credDel = credential.label;
        setCredToDelete(credDel);
      }
    });
    const focusedCredId = credID;
    setCredIdFocus(focusedCredId);

    setIsDeleting(true);
    setContDelete(false);
  };

  const handleProceedDelete = () => {
    setIsDeleting(false);
    setContDelete(true);
  };

  const handleContinueDelete = (credID) => {
    if (enteredPass == mainKey) {
      const tempCredentials = credentials.filter((credential) => {
        return credential.id != credID;
      });
      handleDeleteCredentials(tempCredentials);
      setIsDeleting(false);
      setContDelete(false);
      setIsShowPass(false);
      setIsSuccessDelete(true);
    } else {
      if (!isWrongPass) {
        setTimeout(() => {
          setIsWrongPass(false);
        }, 1500);
        setIsWrongPass(true);
      }
    }
  };
  const handleCancelDelete = (text) => {
    if (text == "diawithwarn") {
      setIsDeleting(false);
    } else if (text == "diawithpass") {
      setContDelete(false);
    }
    setIsShowPass(false);
  };

  const getTimeDifference = (date, action) => {
    const currentDate = new Date();
    const entryDate = new Date(date);
    const timeDifference = currentDate - entryDate;

    // Calculate days, months, and years
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (action == "adding") {
      if (years > 0) {
        return `Added ${years} ${years === 1 ? "year" : "years"} ago`;
      } else if (months > 0) {
        return `Added ${months} ${months === 1 ? "month" : "months"} ago`;
      } else if (days > 0) {
        return `Added ${days} ${days === 1 ? "day" : "days"} ago`;
      } else {
        return `Added recently`;
      }
    } else {
      if (years > 0) {
        return `Modified ${years} ${years === 1 ? "year" : "years"} ago`;
      } else if (months > 0) {
        return `Modified ${months} ${months === 1 ? "month" : "months"} ago`;
      } else if (days > 0) {
        return `Modified ${days} ${days === 1 ? "day" : "days"} ago`;
      } else {
        return `Modified recently`;
      }
    }
  };
  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor:
            theme == "light" ? themes.light.primary : themes.dark.neutral,
        }}
      >
        <View
          style={{
            marginHorizontal: 10,
            marginTop: 20,
          }}
        >
          <Searchbar
            placeholder="Search Credentials"
            inputStyle={{ fontFamily: "nunito-sans" }}
            onChangeText={handleSearch}
          />

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: themes.light.action,
              borderRadius: 10,
              marginTop: 10,
              marginHorizontal: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  fontFamily: "nunito-sans-bold",
                  color: themes.light.text,
                }}
              >{`${filteredCredential.length} `}</Text>
              <Text
                style={{
                  fontFamily: "nunito-sans",
                  color: themes.light.text,
                }}
              >{`${
                credentials.length > 1 ? "credentials" : "credential"
              } stored`}</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor:
              theme == "light" ? themes.light.neutral : themes.dark.neutral,
            marginTop: 10,
            paddingHorizontal: 10,
            paddingTop: 20,
            flex: 1,

            borderTopLeftRadius: 40,

            borderTopRightRadius: 40,
          }}
        >
          {filteredCredential.length ? (
            <FlatList
              data={filteredCredential}
              renderItem={({ item }) => (
                <View
                  style={{
                    borderWidth: 0.2,
                    borderRadius: 18,
                    marginBottom: 10,
                  }}
                >
                  <Pressable
                    onPress={() => {
                      handleListPress("Password", item.id);
                    }}
                    android_ripple={{
                      color:
                        theme == "light"
                          ? themes.light.action
                          : themes.dark.neutral,
                      borderless: true,
                    }}
                    style={styles.credList}
                  >
                    <List.Item
                      title={item.label}
                      titleStyle={{
                        fontFamily: "nunito-sans-bold",
                        fontSize: 17,
                      }}
                      descriptionStyle={{
                        fontFamily: "nunito-sans",
                        marginTop: 3,
                        fontSize: 13,
                      }}
                      description={
                        item.isModified ? (
                          <Text>
                            {getTimeDifference(item.dateModified, "modifying")}
                          </Text>
                        ) : (
                          <Text>
                            {getTimeDifference(item.dateAdded, "adding")}
                          </Text>
                        )
                      }
                      left={(props) => (
                        <List.Icon {...props} icon="account-lock" />
                      )}
                    />
                    <TouchableRipple
                      rippleColor={themes.light.action}
                      style={{ padding: 5 }}
                      onPress={() => handleDeleteCred(item.id)}
                    >
                      <MaterialCommunityIcons name="trash-can" size={26} />
                    </TouchableRipple>
                  </Pressable>
                </View>
              )}
            />
          ) : (
            <View>
              <Text
                style={{
                  fontFamily: "nunito-sans-bold",
                  textAlign: "center",
                  fontSize: 20,
                }}
              >
                {searchText.length
                  ? `No matches found for "${searchText}"`
                  : `No credentials`}
              </Text>
            </View>
          )}
        </View>
      </View>

      <Portal>
        <Dialog
          visible={isDeleting}
          onDismiss={() => handleCancelDelete("diawithwarn")}
        >
          <Dialog.Title>Delete {credToDelete}</Dialog.Title>
          <Dialog.Content>
            <Text style={{ marginBottom: 10 }}>
              Are you sure you want to delete this credential?
            </Text>
            <Text style={{ color: "red", fontStyle: "italic" }}>
              *Password will be required if you wish to continue.*
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleProceedDelete}>Proceed</Button>
            <Button onPress={() => handleCancelDelete("diawithwarn")}>
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={contDelete}>
          <Dialog.Title>Enter Main Key</Dialog.Title>
          <Dialog.Content>
            <Text
              style={{ marginBottom: 10, color: "red", fontStyle: "italic" }}
            >
              *Once a credential is deleted, it cannot be retrieved anymore.*
            </Text>
            <TextInput
              mode="outlined"
              label="Key"
              secureTextEntry={!isShowPass}
              onChangeText={setEnteredPass}
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
                  padding: 5,
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
            <Button onPress={() => handleContinueDelete(credIdFocus)}>
              Delete Credential
            </Button>
            <Button onPress={() => handleCancelDelete("diawithpass")}>
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={isSuccessDelete} onDismiss={handleAfterSuccessDelete}>
          <Dialog.Icon icon="check-circle" size={50} />
          <Dialog.Title style={{ textAlign: "center" }}>
            Deleted Successfully!
          </Dialog.Title>

          <Dialog.Actions>
            <Button onPress={handleAfterSuccessDelete}>Go to Lists</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default CredLists;

const styles = StyleSheet.create({
  credList: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
  },
});
