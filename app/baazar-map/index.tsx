import MapView, { Marker } from "react-native-maps";
import LogoBaazarImage from "../../assets/app/logoBazar.png";
import { Box } from "../../components/ui/box";
import { Image } from "../../components/ui/image";
import { HStack } from "../../components/ui/hstack";
import { Text } from "../../components/ui/text";
import { VStack } from "../../components/ui/vstack";
import { LinearGradient } from "expo-linear-gradient";
import { IBasicBaazarModel } from "../../models/IUser.model";
import { Button, ButtonText } from "../../components/ui/button";

const baazars: IBasicBaazarModel[] = [
  {
    id: 1,
    name: "Bazar da tiazinha",
    averagePrice: 222,
    evaluation: "5",
    image: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    location: {
      latitude: -15.712943,
      longitude: -47.880659,
    },
  },
  {
    id: 2,
    name: "Brechó da lú",
    averagePrice: 222,
    evaluation: "3.0",
    image: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    location: {
      latitude: -15.709555,
      longitude: -47.872891,
    },
  },
  {
    id: 3,
    name: "Bazararte",
    averagePrice: 222,
    evaluation: "4",
    image: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    location: {
      latitude: -15.709473,
      longitude: -47.87774,
    },
  },
];

export default function BaazarMap() {
  return (
    <VStack className="flex-1">
      <LinearGradient
        colors={["#15C3D6", "transparent"]}
        locations={[0.7, 1]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 300,
          zIndex: 20,
        }}
      />

      <HStack className="h-1/4 justify-evenly items-center z-30">
        <Button>
          <Text className="text-3xl text-white font-normal">mapa</Text>
        </Button>

        <Button disabled isDisabled>
          <Text className="text-3xl text-white font-normal">lista</Text>
        </Button>
      </HStack>

      <Box className="h-3/4 z-10">
        <MapView
          toolbarEnabled={false}
          style={{
            flex: 1,
          }}
          region={{
            latitude: -15.709473,
            longitude: -47.87774,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {baazars.map((baazarItem) => (
            <Marker
              key={baazarItem.id}
              coordinate={baazarItem.location}
              title={baazarItem.name}
              style={{
                width: 36,
                height: 36,
              }}
            >
              <Box className="flex justify-center items-center shadow-md">
                <Image
                  source={LogoBaazarImage}
                  alt="bazar logo"
                  className="w-full h-full rounded-full border-blue-600 border-2"
                />
              </Box>
            </Marker>
          ))}
        </MapView>
      </Box>
    </VStack>
  );
}
