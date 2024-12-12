import { Redirect, router, useFocusEffect } from "expo-router";
import { Box } from "../components/ui/box";
import { Text } from "../components/ui/text";

export default function App() {
  return <Redirect href="/baazar-map" />;

  return (
    <Box>
      <Text>Baazar app</Text>
    </Box>
  );
}
