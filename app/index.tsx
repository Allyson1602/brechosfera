import { router, useFocusEffect } from "expo-router";
import { Box } from "../components/ui/box";
import { Text } from "../components/ui/text";

export default function App() {
  useFocusEffect(() => {
    router.replace("baazar-map");
  });

  return (
    <Box className="bg-red-600">
      <Text className="text-amber-400">Baazar app</Text>
    </Box>
  );
}
