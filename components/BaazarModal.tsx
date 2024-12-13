import * as Linking from "expo-linking";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ScrollView } from "react-native";
import { IBasicBaazarModel } from "../models/IUser.model";
import { BaazarItemTypeChip } from "./BaazarItemTypeChip";
import { Button, ButtonText } from "./ui/button";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { CloseIcon, Icon, StarIcon } from "./ui/icon";
import { Image } from "./ui/image";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "./ui/modal";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";

interface IBaazarModal {
  baazar: IBasicBaazarModel | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BaazarModal(props: IBaazarModal) {
  const { isOpen, onClose, baazar } = props;

  const openGoogleMaps = () => {
    const latitude = baazar?.location.latitude;
    const longitude = baazar?.location.longitude;
    const label = baazar?.name;

    const mapAppUrl = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`;
    const mapWebUrl = `https://www.google.com/maps?q=${latitude},${longitude}(${label})`;

    Linking.canOpenURL(mapAppUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(mapAppUrl);
        } else {
          Linking.openURL(mapWebUrl);
        }
      })
      .catch((err) => console.error("Erro ao abrir o Google Maps:", err));
  };

  const handleOpenMap = () => {
    void openGoogleMaps();
  };

  useFocusEffect(
    useCallback(() => {
      if (!baazar) {
        onClose();
      }
    }, [])
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      className="z-40 flex gap-2 justify-end pb-32"
      useRNModal
    >
      <ModalCloseButton
        className="bg-rose-400 rounded-full p-2 shadow"
        style={{ elevation: 5 }}
      >
        <Icon as={CloseIcon} className="w-9 h-9 text-white rounded-full" />
      </ModalCloseButton>

      <ModalContent className={"rounded-3xl bg-[#EFFDFF] w-11/12"}>
        <ModalHeader className="flex flex-col mb-4">
          <HStack className="gap-2 mb-4">
            {baazar?.images.map((imageItem, index) => (
              <Image
                key={index}
                alt="bazar imagem"
                className="rounded-md w-[90] h-[60]"
                source={{ uri: imageItem }}
              />
            ))}
          </HStack>

          <Heading size="xl" className="text-[#15C3D6] font-normal">
            {baazar?.name}
          </Heading>

          <HStack className="gap-2">
            {baazar?.evaluation &&
              Array.from({ length: baazar.evaluation }, (_, index) => {
                return (
                  <Icon
                    key={index}
                    as={StarIcon}
                    className="text-yellow-400 w-7 h-7"
                  />
                );
              })}
          </HStack>
        </ModalHeader>

        <ModalBody>
          <VStack className="flex gap-4">
            <VStack className="flex">
              <Text>Tipos de itens</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingVertical: 4,
                }}
              >
                <HStack className="gap-2">
                  {baazar?.itemsType.map((ItemTypeItem, index) => (
                    <BaazarItemTypeChip key={index} type={ItemTypeItem} />
                  ))}
                </HStack>
              </ScrollView>
            </VStack>

            <VStack className="flex gap-1">
              <Text>Horários de funcionamento</Text>

              <VStack>
                {baazar?.openingHours.map((openingHourItem, index) => (
                  <Text
                    key={index}
                    style={{
                      color: "#ccc",
                    }}
                  >
                    {openingHourItem}
                  </Text>
                ))}
              </VStack>
            </VStack>

            <VStack className="flex gap-1">
              <Text>Preço médio</Text>
              <HStack className="items-start justify-start">
                <Text className="pr-1">R$</Text>

                <Text size="4xl">{baazar?.averagePrice}</Text>
              </HStack>
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter className="justify-evenly">
          <Button
            variant="outline"
            className="border-[#15C3D6] rounded-lg"
            disabled
            isDisabled
          >
            <ButtonText className="text-[#15C3D6]">Mais informações</ButtonText>
          </Button>

          <Button className="bg-[#15C3D6] rounded-lg">
            <ButtonText className="text-white" onPress={handleOpenMap}>
              Abrir no mapa
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
