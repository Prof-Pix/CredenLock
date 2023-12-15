import { useEffect } from "react";
export const useResetNavigation = (navigation, screenName) => {
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      navigation.reset({
        index: 0,
        routes: [{ name: screenName }],
      });
    });

    return unsubscribe;
  }, [navigation, screenName]);
};
