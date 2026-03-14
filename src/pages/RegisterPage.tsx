import { useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@apollo/client/react";
import {
  Store,
  MapPin,
  Globe,
  Phone,
  Instagram,
  Facebook,
  ExternalLink,
  CheckCircle2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { appConfig } from "@/config/app.config";
import {
  registerConfig,
  type RegisterItemTypeValue,
} from "@/config/register.config";
import type {
  Baazar,
  BaazarItemType,
  CreateBaazarInput,
} from "@/lib/graphql/generated";
import { CREATE_BAAZAR } from "@/lib/graphql/mutations/business";
import {
  ACCEPTED_IMAGE_INPUT,
  INVALID_IMAGE_SIZE_MESSAGE,
  INVALID_IMAGE_TYPE_MESSAGE,
  isAllowedImageFile,
  isAllowedImageSize,
  uploadImageToBackend,
} from "@/lib/upload/uploadImage";

const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z
    .string()
    .min(20, "Descricao deve ter pelo menos 20 caracteres"),
  category: z.enum(["bazar", "brecho"]),
  isOnline: z.boolean(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Email invalido").optional().or(z.literal("")),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  website: z.string().url("URL invalida").optional().or(z.literal("")),
  street: z.string().optional(),
  number: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

type CreateBaazarMutationResponse = {
  createBaazar: Baazar;
};

function normalizeWhatsapp(value?: string) {
  if (!value) return "";
  return value.replace(/[^0-9]/g, "");
}

export default function RegisterPage() {
  const [isOnline, setIsOnline] = useState(false);
  const [selectedItemTypes, setSelectedItemTypes] = useState<
    RegisterItemTypeValue[]
  >([]);
  const [logoImageFile, setLogoImageFile] = useState<File | null>(null);
  const [storeImageFiles, setStoreImageFiles] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const [createBaazar, { loading: isCreating }] = useMutation<
    CreateBaazarMutationResponse,
    { createBaazarInput: CreateBaazarInput }
  >(CREATE_BAAZAR);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      isOnline: false,
      category: "brecho",
    },
  });

  const toggleItemType = (item: RegisterItemTypeValue) => {
    setSelectedItemTypes((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const handleLogoImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file && !isAllowedImageFile(file)) {
      toast({
        title: "Formato de imagem invalido",
        description: INVALID_IMAGE_TYPE_MESSAGE,
        variant: "destructive",
      });
      event.target.value = "";
      setLogoImageFile(null);
      return;
    }

    setLogoImageFile(file);
  };

const handleStoreImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.some((file) => !isAllowedImageFile(file))) {
      toast({
        title: "Formato de imagem invalido",
        description: INVALID_IMAGE_TYPE_MESSAGE,
        variant: "destructive",
      });
      event.target.value = "";
      setStoreImageFiles([]);
      return;
    }

    if (files.some((file) => !isAllowedImageSize(file))) {
      toast({
        title: "Imagem muito grande",
        description: INVALID_IMAGE_SIZE_MESSAGE,
        variant: "destructive",
      });
      event.target.value = "";
      setStoreImageFiles([]);
      return;
    }

    setStoreImageFiles(files);
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (selectedItemTypes.length === 0) {
      toast({
        title: "Selecione ao menos um tipo de item",
        description:
          "Escolha ao menos um item vendido para concluir o cadastro.",
        variant: "destructive",
      });
      return;
    }

    const whatsapp = normalizeWhatsapp(data.whatsapp);
    const phone = normalizeWhatsapp(data.phone);

    const linkWhatsapp = [whatsapp, phone].filter(
      (value): value is string => !!value,
    );
    const linkInstagram = data.instagram?.trim()
      ? [data.instagram.trim().replace(/^@/, "")]
      : undefined;

    const addressParts = [
      data.street,
      data.number,
      data.neighborhood,
      data.city,
      data.state,
      data.zipCode,
    ]
      .map((value) => value?.trim())
      .filter((value): value is string => !!value);

    const address = data.isOnline
      ? "Online"
      : addressParts.join(", ") || "Nao informado";

    try {
      const logoImage = logoImageFile
        ? await uploadImageToBackend(logoImageFile)
        : registerConfig.defaultLogoImage;
      const images = storeImageFiles.length > 0
        ? await Promise.all(storeImageFiles.map((file) => uploadImageToBackend(file)))
        : [];

      const createBaazarInput: CreateBaazarInput = {
        name: data.name.trim(),
        description: data.description.trim(),
        logoImage,
        images,
        itemsType: selectedItemTypes as BaazarItemType[],
        averagePrice: registerConfig.defaultAveragePrice,
        evaluations: [],
        openingHours: registerConfig.defaultOpeningHours,
        isOnline: data.isOnline,
        isAcceptExchange: registerConfig.defaultIsAcceptExchange,
        averageQuantity: registerConfig.defaultAverageQuantity,
        storeSize:
          registerConfig.defaultStoreSize as CreateBaazarInput["storeSize"],
        itemRenewal:
          registerConfig.defaultItemRenewal as CreateBaazarInput["itemRenewal"],
        responsiblePerson: data.name.trim(),
        address,
        linkInstagram,
        linkWhatsapp,
        locationMap: data.isOnline
          ? undefined
          : {
              latitude: appConfig.defaultLocation.latitude,
              longitude: appConfig.defaultLocation.longitude,
            },
      };

      await createBaazar({ variables: { createBaazarInput } });

      toast({
        title: "Cadastro recebido!",
        description: "Seu bazar foi enviado para analise com sucesso.",
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Erro ao cadastrar bazar", error);
      const message = error instanceof Error ? error.message : "Nao foi possivel enviar seu cadastro agora.";
      toast({
        title: "Falha ao cadastrar",
        description: message,
        variant: "destructive",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Cadastro enviado!</h2>
            <p className="text-muted-foreground mb-6">
              Recebemos seu cadastro e nossa equipe vai analisar as informacoes.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>
              Cadastrar outra loja
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="bg-gradient-to-b from-primary/10 via-accent to-background py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Store className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Cadastre sua <span className="text-primary">loja</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Faca parte da comunidade e alcance mais pessoas em busca de achados.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" />
                Informacoes basicas
              </CardTitle>
              <CardDescription>
                Conte-nos sobre seu bazar ou brecho
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da loja *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Brecho das Amigas"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  defaultValue="brecho"
                  onValueChange={(value) =>
                    setValue("category", value as "bazar" | "brecho")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brecho">Brecho</SelectItem>
                    <SelectItem value="bazar">Bazar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descricao *</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva sua loja e o que vende"
                  rows={4}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoImage" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Imagem da loja
                </Label>
                <Input
                  id="logoImage"
                  type="file"
                  accept={ACCEPTED_IMAGE_INPUT}
                  onChange={handleLogoImageChange}
                />
                <p className="text-xs text-muted-foreground">
                  Se nao enviar, o sistema usa a imagem padrao da plataforma. Apenas JPG e PNG.
                </p>
              </div>

<div className="space-y-2">
                <Label htmlFor="storeImages" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Fotos da loja
                </Label>
                <Input
                  id="storeImages"
                  type="file"
                  multiple
                  accept={ACCEPTED_IMAGE_INPUT}
                  onChange={handleStoreImagesChange}
                />
                <p className="text-xs text-muted-foreground">
                  Adicione fotos do espaco, produtos ou vitrine. Apenas JPG e PNG.
                </p>
                {storeImageFiles.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {storeImageFiles.length} imagem(ns) selecionada(s)
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Vendas online</p>
                    <p className="text-sm text-muted-foreground">
                      Marque se voce vende pela internet
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isOnline}
                  onCheckedChange={(checked) => {
                    setIsOnline(checked);
                    setValue("isOnline", checked);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tipos de itens</CardTitle>
              <CardDescription>
                Selecione os produtos que voce vende
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {registerConfig.itemTypes.map((item) => (
                  <Badge
                    key={item.value}
                    variant={
                      selectedItemTypes.includes(item.value)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer text-sm py-1.5 px-3"
                    onClick={() => toggleItemType(item.value)}
                  >
                    {item.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Contato
              </CardTitle>
              <CardDescription>
                Como os clientes podem entrar em contato?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    {...register("phone")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    placeholder="5511999999999"
                    {...register("whatsapp")}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="instagram"
                    className="flex items-center gap-2"
                  >
                    <Instagram className="w-4 h-4" /> Instagram
                  </Label>
                  <Input
                    id="instagram"
                    placeholder="@seubrecho"
                    {...register("instagram")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook" className="flex items-center gap-2">
                    <Facebook className="w-4 h-4" /> Facebook
                  </Label>
                  <Input
                    id="facebook"
                    placeholder="facebook.com/seubrecho"
                    {...register("facebook")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Site
                </Label>
                <Input
                  id="website"
                  placeholder="https://seusite.com.br"
                  {...register("website")}
                />
                {errors.website && (
                  <p className="text-sm text-destructive">
                    {errors.website.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {!isOnline && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Endereco
                </CardTitle>
                <CardDescription>Onde fica sua loja?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="street">Rua</Label>
                    <Input
                      id="street"
                      placeholder="Rua Augusta"
                      {...register("street")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number">Numero</Label>
                    <Input
                      id="number"
                      placeholder="1234"
                      {...register("number")}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      placeholder="Centro"
                      {...register("neighborhood")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      placeholder="Sao Paulo"
                      {...register("city")}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Select onValueChange={(value) => setValue("state", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {appConfig.states.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      placeholder="00000-000"
                      {...register("zipCode")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting || isCreating}
          >
            {isSubmitting || isCreating ? "Enviando..." : "Enviar cadastro"}
          </Button>
        </form>
      </div>
    </div>
  );
}










