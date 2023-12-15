import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Application from "../../context/ApplicationContext";
import { Button, Divider } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useResetNavigation } from "../../utilities/utils";
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
        <View
          style={{
            maxHeight: 625,
          }}
        >
          <FlatList
            data={filteredLogs}
            renderItem={({ item }) => (
              <View style={{ padding: 5, marginHorizontal: 5 }}>
                <View style={{ padding: 5, marginLeft: 10 }}>
                  <Text style={{ fontFamily: "nunito-sans-bold" }}>
                    {item.timeStamp}
                  </Text>
                  <Text
                    style={{ marginLeft: 15, fontFamily: "nunito-sans-italic" }}
                  >
                    {item.action}
                  </Text>
                </View>
                <Divider />
              </View>
            )}
          />
        </View>
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

      <View style={{ maxHeight: 565 }}>
        <FlatList
          data={todayLogs}
          renderItem={({ item }) => (
            <View style={{ padding: 5, marginHorizontal: 5 }}>
              <View style={{ padding: 5, marginLeft: 10 }}>
                <Text style={{ fontFamily: "nunito-sans-bold" }}>
                  {item.timeStamp}
                </Text>
                <Text
                  style={{ marginLeft: 15, fontFamily: "nunito-sans-italic" }}
                >
                  {item.action}
                </Text>
              </View>
              <Divider />
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default SessionLogsStack;
