export const parseAddress = (fullAddress: string) => {
  if (!fullAddress) return { neighborhood: "", city: "" };

  // Ex: "Rua X - Bairro, Cidade, UF"
  const parts = fullAddress.split(" - ");
  const locationPart = parts.length > 1 ? parts[1] : parts[0];
  const details = locationPart.split(",");

  return {
    neighborhood: details[0]?.trim() || "",
    city: details[1]?.trim() || "",
    state: details[2]?.trim() || "",
  };
};
