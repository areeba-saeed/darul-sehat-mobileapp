import { StyleSheet, Linking } from "react-native";
import StackNavigation from "./src/navigation/StackNavigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { Provider } from "react-redux";
import store from "./store";

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer
          linking={{
            config: {
              // Configuration for linking
            },
            async getInitialURL() {
              // First, you may want to do the default deep link handling
              // Check if app was opened from a deep link
              const url = await Linking.getInitialURL();

              if (url != null) {
                return url;
              }

              // Handle URL from expo push notifications
              const response =
                await Notifications.getLastNotificationResponseAsync();

              return response?.notification.request.content.data.url;
            },
            subscribe(listener) {
              const onReceiveURL = (event) => listener(event.url);
              // Listen to incoming links from deep linking
              Linking.addEventListener("url", onReceiveURL);

              // Listen to expo push notifications
              const subscription =
                Notifications.addNotificationResponseReceivedListener(
                  (response) => {
                    const url = response.notification.request.content.data.url;

                    // Any custom logic to see whether the URL needs to be handled
                    //...

                    // Let React Navigation handle the URL
                    listener(url);
                  }
                );

              return () => {
                // Clean up the event listeners
                if (Linking.removeSubscription) {
                  Linking.removeSubscription("url", onReceiveURL);
                }
                // Linking.removeEventListener('url', onReceiveURL);
                subscription.remove();
              };
            },
          }}>
          <StackNavigation />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
