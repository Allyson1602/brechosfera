import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import LogoBaazarImage from "../../assets/app/logoBazar.png";
import BaazarModal from "../../components/BaazarModal";
import { Box } from "../../components/ui/box";
import { Button } from "../../components/ui/button";
import { HStack } from "../../components/ui/hstack";
import { Image } from "../../components/ui/image";
import { Text } from "../../components/ui/text";
import { VStack } from "../../components/ui/vstack";
import { baazarItemType } from "../../enums/baazarItemType";
import { IBasicBaazarModel } from "../../models/IUser.model";

const baazars: IBasicBaazarModel[] = [
  {
    id: 1,
    name: "Bazar da tiazinha",
    averagePrice: 222,
    evaluation: 5,
    openingHours: [
      "Sábado, domingo e feriados - 9h às 12h",
      "Segunda a sexta - 8h às 18h",
    ],
    logoImage: "https://picsum.photos/100/100",
    itemsType: [
      baazarItemType.MENSWEAR,
      baazarItemType.WOMENSWEAR,
      baazarItemType.CHILDRENSWEAR,
    ],
    images: [
      "https://picsum.photos/200/300",
      "https://picsum.photos/200/400",
      "https://picsum.photos/300/300",
    ],
    location: {
      latitude: -15.712943,
      longitude: -47.880659,
    },
  },
  {
    id: 2,
    name: "Brechó da lú",
    averagePrice: 222,
    evaluation: 3,
    openingHours: [
      "Sábado, domingo e feriados - 9h às 12h",
      "Segunda a sexta - 8h às 18h",
    ],
    itemsType: [
      baazarItemType.SHOES,
      baazarItemType.JEWELRY,
      baazarItemType.COSTUME_JEWELRY,
    ],
    logoImage: "https://picsum.photos/500/500",
    images: [
      "https://picsum.photos/200/300",
      "https://picsum.photos/200/400",
      "https://picsum.photos/300/300",
    ],
    location: {
      latitude: -15.709555,
      longitude: -47.872891,
    },
  },
  {
    id: 3,
    name: "Bazararte",
    averagePrice: 222,
    evaluation: 4,
    openingHours: [
      "Sábado, domingo e feriados - 9h às 12h",
      "Segunda a sexta - 8h às 18h",
    ],
    itemsType: [
      baazarItemType.TOYS,
      baazarItemType.BAGS,
      baazarItemType.ACCESSORIES,
    ],
    logoImage: "https://picsum.photos/600/600",
    images: [
      "https://picsum.photos/200/300",
      "https://picsum.photos/200/400",
      "https://picsum.photos/300/300",
    ],
    location: {
      latitude: -15.709473,
      longitude: -47.87774,
    },
  },
];

export default function BaazarMap() {
  const [showModal, setShowModal] = useState(true);
  const [baazarSelected, setBaazarSelected] =
    useState<IBasicBaazarModel | null>(null);

  const handlePressBaazar = (baazarItem: IBasicBaazarModel) => {
    setBaazarSelected(baazarItem);
    setShowModal(true);
  };

  return (
    <>
      <VStack className="flex-1">
        <LinearGradient
          colors={["#15C3D6", "transparent"]}
          locations={[0.7, 1]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 250,
            zIndex: 20,
          }}
        />

        <HStack className="h-1/5 justify-evenly items-center z-30">
          <Button variant="link">
            <Text className="text-3xl text-white font-normal">mapa</Text>
          </Button>

          <Button variant="link" disabled isDisabled>
            <Text className="text-3xl text-white font-normal">lista</Text>
          </Button>
        </HStack>

        <Box className="h-4/5 z-10">
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
                style={{
                  width: 36,
                  height: 36,
                }}
                onPress={() => handlePressBaazar(baazarItem)}
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

      <BaazarModal
        baazar={baazarSelected}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
