import { StatusBar } from "expo-status-bar";
import { verifyInstallation } from "nativewind";
import { StyleSheet, Text, View } from "react-native";
import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";

export default function App() {
  verifyInstallation();

  return (
    <GluestackUIProvider>
      <View className="w-screen flex-1 bg-red-400 items-center content-center">
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    </GluestackUIProvider>
  );
}
