import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Application from "../../context/ApplicationContext";
import { Button, Divider } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { themes } from "../../theme/theme";

const Stack = createStackNavigator();

const SessionLogsStack = ({ navigation }) => {
  const context = useContext(Application);
  const { theme } = context;

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Stack.Navigator initialRouteName="Today Logs">
        <Stack.Screen
          name="Today Logs"
          component={SessionLogs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Filtered Logs"
          component={FilteredSessionLogs}
          options={{
            headerStatusBarHeight: 0,
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
    </SafeAreaView>
  );
};

const DisplaySessionLogs = ({ data }) => {
  const context = useContext(Application);
  const { theme } = context;
  return (
    <View style={{ maxHeight: 565 }}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={{ padding: 5, marginHorizontal: 5 }}>
            <View style={{ padding: 5, marginLeft: 10 }}>
              <Text style={{ fontFamily: "nunito-sans-bold" }}>
                {item.timeStamp}
              </Text>
              <Text
                style={{
                  marginLeft: 15,
                  fontFamily: "nunito-sans-italic",
                  marginBottom: 5,
                }}
              >
                {item.action}
              </Text>
              {item.valueModified && item.keyAction == "Delete" && (
                <View
                  style={{
                    backgroundColor: themes.light.text,
                    paddingVertical: 8,
                    flexDirection: "row",
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 15,
                      fontFamily: "nunito-sans-bold",
                      color: themes.light.action,
                    }}
                  >
                    {`Credential Label: `}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "nunito-sans",
                      color: themes.light.action,
                    }}
                  >
                    {`${item.valueModified}`}
                  </Text>
                </View>
              )}
              {item.valueModified && item.keyAction == "Edit" && (
                <>
                  {item.valueModified.label && (
                    <View
                      style={{
                        marginBottom: 5,
                        backgroundColor: themes.light.text,

                        paddingBottom: 8,

                        borderRadius: 5,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          backgroundColor: themes.light.text,
                          paddingVertical: 8,
                          borderRadius: 5,
                        }}
                      >
                        <Text
                          style={{
                            marginLeft: 20,
                            fontFamily: "nunito-sans-bold",
                            color: themes.light.action,
                          }}
                        >
                          {`Old Label: `}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "nunito-sans",

                            color: themes.light.action,
                          }}
                        >{`${item.valueModified.label.oldLabel}`}</Text>
                      </View>

                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={{
                            marginLeft: 20,
                            fontFamily: "nunito-sans-bold",

                            color: themes.light.action,
                          }}
                        >
                          {`Modified Label: `}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "nunito-sans",

                            color: themes.light.action,
                          }}
                        >{`${item.valueModified.label.newLabel}`}</Text>
                      </View>
                    </View>
                  )}
                  {item.valueModified.label &&
                    (item.valueModified.email ||
                      item.valueModified.pass ||
                      item.valueModified.desc) && (
                      <View
                        style={{
                          marginBottom: 5,
                          backgroundColor: themes.light.text,
                          paddingVertical: 8,

                          borderRadius: 5,
                        }}
                      >
                        {item.valueModified.email && (
                          <View style={{ marginBottom: 5 }}>
                            <View>
                              <Text
                                style={{
                                  marginLeft: 20,
                                  fontFamily: "nunito-sans-italic",
                                  fontSize: 12,
                                  color: themes.light.action,
                                }}
                              >{`The email/username of this credential was also modified.`}</Text>
                            </View>
                          </View>
                        )}
                        {item.valueModified.pass && (
                          <View style={{ marginBottom: 5 }}>
                            <View>
                              <Text
                                style={{
                                  marginLeft: 20,
                                  fontFamily: "nunito-sans-italic",
                                  fontSize: 12,
                                  color: themes.light.action,
                                }}
                              >{`The password of this credential was also modified.`}</Text>
                            </View>
                          </View>
                        )}
                        {item.valueModified.desc && (
                          <View style={{ marginBottom: 5 }}>
                            <View>
                              <Text
                                style={{
                                  marginLeft: 20,
                                  fontFamily: "nunito-sans-italic",
                                  fontSize: 12,
                                  color: themes.light.action,
                                }}
                              >{`The description of this credential was also modified.`}</Text>
                            </View>
                          </View>
                        )}
                      </View>
                    )}

                  {!item.valueModified.label &&
                    (item.valueModified.email ||
                      item.valueModified.pass ||
                      item.valueModified.desc) && (
                      <View
                        style={{
                          marginBottom: 5,
                          backgroundColor: themes.light.text,

                          paddingVertical: 8,

                          borderRadius: 5,
                        }}
                      >
                        <View style={{ marginBottom: 5 }}>
                          <View style={{ flexDirection: "row" }}>
                            <Text
                              style={{
                                marginLeft: 20,
                                fontFamily: "nunito-sans-bold",
                                color: themes.light.action,
                              }}
                            >
                              {`Label: `}
                            </Text>
                            <Text
                              style={{
                                color: themes.light.action,
                                fontFamily: "nunito-sans",
                              }}
                            >
                              {item.valueModified.email
                                ? `${item.valueModified.email.oldLabel}`
                                : item.valueModified.pass
                                ? `${item.valueModified.pass.oldLabel}`
                                : `${item.valueModified.desc.oldLabel}`}
                            </Text>
                          </View>
                        </View>
                        {item.valueModified.email && (
                          <View style={{ marginBottom: 5 }}>
                            <View>
                              <Text
                                style={{
                                  marginLeft: 30,
                                  color: themes.light.action,
                                  fontFamily: "nunito-sans-italic",
                                  fontSize: 12,
                                }}
                              >{`The email/username of this credential was modified.`}</Text>
                            </View>
                          </View>
                        )}
                        {item.valueModified.pass && (
                          <View style={{ marginBottom: 5 }}>
                            <View>
                              <Text
                                style={{
                                  marginLeft: 30,
                                  color: themes.light.action,
                                  fontFamily: "nunito-sans-italic",
                                  fontSize: 12,
                                }}
                              >{`The password of this credential was modified.`}</Text>
                            </View>
                          </View>
                        )}
                        {item.valueModified.desc && (
                          <View style={{ marginBottom: 5 }}>
                            <View>
                              <Text
                                style={{
                                  marginLeft: 40,
                                  color: themes.light.action,
                                  fontFamily: "nunito-sans-italic",
                                  fontSize: 12,
                                }}
                              >{`The description of this credential was modified.`}</Text>
                            </View>
                          </View>
                        )}
                      </View>
                    )}
                </>
              )}
            </View>
            <Divider />
          </View>
        )}
      />
    </View>
  );
};

const FilteredSessionLogs = () => {
  const context = useContext(Application);
  const { sessionLogs, theme } = context;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  const [filteredLogs, setFilteredLogs] = useState([]);

  useEffect(() => {
    if (selectedDate) {
      // Update filtered credentials when credentials change
      const selectedDateFormat = selectedDate.toLocaleString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      });
      const logsFiltered =
        sessionLogs.length !== 0 && Array.isArray(sessionLogs)
          ? sessionLogs.filter((sessionLog) => {
              const logDate = sessionLog?.timeStamp;
              return logDate && logDate.includes(selectedDateFormat);
            })
          : [];

      setFilteredLogs(logsFiltered);
    }
  }, [sessionLogs, selectedDate]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  return (
    <View
      style={{
        backgroundColor: theme == "light" ? themes.light.neutral : "black",
        flex: 1,
      }}
    >
      <View
        style={{
          marginHorizontal: 5,
          marginVertical: 5,
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            borderWidth: 1,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            width: 170,

            justifyContent: "center",
            backgroundColor: theme == "light" ? themes.light.primary : "black",
            borderWidth: 0.3,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              columnGap: 10,
            }}
          >
            <View>
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color={themes.light.text}
                style={{ marginLeft: 10 }}
              />
            </View>
            <View style={{ justifyContent: "center" }}>
              {selectedDate ? (
                <Text
                  style={{
                    color: themes.light.text,
                    fontFamily: "nunito-sans",
                    fontSize: 13,
                  }}
                >
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </Text>
              ) : (
                <Text
                  style={{
                    color: themes.light.text,
                    fontFamily: "nunito-sans",
                    fontSize: 13,
                  }}
                >
                  Select date to filter.
                </Text>
              )}
            </View>
          </View>
        </View>
        <View
          style={{ alignItems: "flex-end", marginTop: 10, marginRight: 10 }}
        >
          <Button
            rippleColor={themes.light.neutral}
            onPress={showDatePicker}
            mode="elevated"
            textColor={theme == "light" ? "white" : themes.dark.neutral}
            style={{
              backgroundColor:
                theme == "light" ? themes.light.action : themes.dark.action,
              width: 120,
              marginRight: -10,
              padding: 0,
            }}
            buttonColor={
              theme == "light" ? themes.light.action : themes.dark.neutral
            }
          >
            <Text>Change Date</Text>
          </Button>
        </View>
      </View>

      {filteredLogs.length !== 0 ? (
        <DisplaySessionLogs data={filteredLogs} />
      ) : (
        <Text
          style={{
            fontFamily: "nunito-sans-italic",
            marginLeft: 20,
            marginTop: 10,
          }}
        >
          No logs for this date.
        </Text>
      )}

      <View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          maximumDate={new Date()}
          // You can customize the buttons here if needed
        />
      </View>
    </View>
  );
};

const SessionLogs = ({ navigation }) => {
  const context = useContext(Application);
  const { sessionLogs, theme } = context;

  const [todayLogs, setTodayLogs] = useState([]);

  const handleGoFilterLogs = () => {
    navigation.navigate("Filtered Logs");
  };

  useEffect(() => {
    // Update filtered credentials when credentials change
    const dateToday = new Date().toLocaleString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
    const logsToday =
      sessionLogs.length !== 0 && Array.isArray(sessionLogs)
        ? sessionLogs.filter((sessionLog) => {
            const logDate = sessionLog?.timeStamp;
            return logDate && logDate.includes(dateToday);
          })
        : [];

    setTodayLogs(logsToday);
  }, [sessionLogs]);

  return (
    <View
      style={{
        backgroundColor:
          theme == "light" ? themes.light.neutral : themes.dark.neutral,
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: theme == "light" ? themes.light.primary : "black",
        }}
      >
        <View
          style={{
            alignItems: "flex-end",
            marginTop: 10,
            marginBottom: 10,
            marginRight: 10,
          }}
        >
          <Button
            rippleColor={themes.light.neutral}
            onPress={handleGoFilterLogs}
            icon="filter"
            mode="elevated"
            textColor={theme == "light" ? "white" : themes.dark.neutral}
            style={{
              backgroundColor:
                theme == "light" ? themes.light.action : themes.dark.action,
              width: 150,

              padding: 0,
            }}
            buttonColor={
              theme == "light" ? themes.light.action : themes.dark.neutral
            }
          >
            <Text style={{ fontFamily: "nunito-sans" }}>Filter Logs</Text>
          </Button>
        </View>

        <Text
          style={{
            fontFamily: "nunito-sans-bold",
            fontSize: 25,
            marginLeft: 10,
            color: "white",
            paddingBottom: 10,
          }}
        >
          Today's Session Logs
        </Text>
      </View>

      <DisplaySessionLogs data={todayLogs} />
    </View>
  );
};

export default SessionLogsStack;
