import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useMutation, useLazyQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, Clock3, MapPin, Search, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { eventsConfig } from "@/config/events.config";
import { useToast } from "@/hooks/use-toast";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import {
  ACCEPTED_IMAGE_INPUT,
  INVALID_IMAGE_SIZE_MESSAGE,
  INVALID_IMAGE_TYPE_MESSAGE,
  isAllowedImageFile,
  isAllowedImageSize,
  uploadImageToBackend,
} from "@/lib/upload/uploadImage";

const CREATE_EVENT = gql`
  mutation CreateEvent($createEventInput: CreateEventInput!) {
    createEvent(createEventInput: $createEventInput) {
      id
      title
    }
  }
`;

const FIND_BAAZARS_BY_NAME = gql`
  query FindBaazarsByName($search: String!) {
    findBaazarsByName(search: $search) {
      id
      name
      logoImage
    }
  }
`;

const createEventSchema = z
  .object({
    title: z.string().min(3, "Titulo deve ter pelo menos 3 caracteres"),
    description: z
      .string()
      .min(20, "Descricao deve ter pelo menos 20 caracteres"),
    startDate: z.string().min(1, "Informe a data de inicio"),
    startTime: z.string().min(1, "Informe o horario de inicio"),
    endDate: z.string().min(1, "Informe a data de fim"),
    endTime: z.string().min(1, "Informe o horario de fim"),
    tags: z.string().optional(),
    street: z.string().min(2, "Informe a rua"),
    number: z.string().min(1, "Informe o numero"),
    neighborhood: z.string().min(2, "Informe o bairro"),
    city: z.string().min(2, "Informe a cidade"),
    state: z.string().min(2, "Informe o estado"),
    zipCode: z.string().min(8, "Informe o CEP"),
  })
  .refine(
    (values) => {
      const startDateTime = new Date(`${values.startDate}T${values.startTime}`);
      const endDateTime = new Date(`${values.endDate}T${values.endTime}`);

      return endDateTime >= startDateTime;
    },
    {
      path: ["endTime"],
      message: "Data e horario de fim devem ser maiores ou iguais ao inicio",
    },
  );

type CreateEventFormData = z.infer<typeof createEventSchema>;

type BaazarSearchData = {
  findBaazarsByName: Array<{
    id: string;
    name: string;
    logoImage?: string | null;
  }>;
};

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createEvent, { loading }] = useMutation(CREATE_EVENT);
  const [businessSearch, setBusinessSearch] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [selectedBaazar, setSelectedBaazar] = useState<
    BaazarSearchData["findBaazarsByName"][number] | null
  >(null);

  const [searchBaazars, { data: baazarData, loading: baazarLoading }] =
    useLazyQuery<BaazarSearchData>(FIND_BAAZARS_BY_NAME);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      tags: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    if (selectedBaazar) return;
    const term = businessSearch.trim();
    if (term.length < 2) return;

    const timeoutId = setTimeout(() => {
      searchBaazars({ variables: { search: term } });
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [businessSearch, searchBaazars, selectedBaazar]);

  const baazarOptions = useMemo(
    () => baazarData?.findBaazarsByName || [],
    [baazarData],
  );

  const handleCoverImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file && !isAllowedImageFile(file)) {
      toast({
        title: "Formato de imagem invalido",
        description: INVALID_IMAGE_TYPE_MESSAGE,
        variant: "destructive",
      });
      event.target.value = "";
      setCoverImageFile(null);
      return;
    }

    if (file && !isAllowedImageSize(file)) {
      toast({
        title: "Imagem muito grande",
        description: INVALID_IMAGE_SIZE_MESSAGE,
        variant: "destructive",
      });
      event.target.value = "";
      setCoverImageFile(null);
      return;
    }

    setCoverImageFile(file);
  };

  const onSubmit = async (data: CreateEventFormData) => {
    try {
      const tags =
        data.tags
          ?.split(",")
          .map((value) => value.trim().toLowerCase())
          .filter(Boolean) ?? [];

      const coverImage = coverImageFile
        ? await uploadImageToBackend(coverImageFile)
        : eventsConfig.defaultCoverImage;

      const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
      const endDateTime = new Date(`${data.endDate}T${data.endTime}`);

      await createEvent({
        variables: {
          createEventInput: {
            title: data.title.trim(),
            description: data.description.trim(),
            businessId: selectedBaazar ? Number(selectedBaazar.id) : null,
            coverImage,
            startDate: startDateTime.toISOString(),
            endDate: endDateTime.toISOString(),
            isPublished: eventsConfig.autoPublishNewEvents,
            tags,
            address: {
              street: data.street.trim(),
              number: data.number.trim(),
              neighborhood: data.neighborhood.trim(),
              city: data.city.trim(),
              state: data.state.trim().toUpperCase(),
              zipCode: data.zipCode.trim(),
              latitude: 0,
              longitude: 0,
            },
          },
        },
      });

      toast({
        title: "Evento criado",
        description: "O evento presencial foi cadastrado com sucesso.",
      });

      navigate("/eventos");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nao foi possivel salvar o evento agora.";
      toast({
        title: "Erro ao criar evento",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <section className="bg-transparent py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <CalendarPlus className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Criar <span className="text-primary">evento presencial</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Cadastre os dados do seu evento para aparecer na vitrine de eventos.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Dados do evento</CardTitle>
            <CardDescription>
              Vincular com um bazar e opcional. O evento continua valido sem
              vinculo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Titulo *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Feira vintage de outono"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Descricao *</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Descreva o evento"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="coverImage"
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" /> Imagem de capa
                  </Label>
                  <Input
                    id="coverImage"
                    type="file"
                    accept={ACCEPTED_IMAGE_INPUT}
                    onChange={handleCoverImageChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Se nao enviar, o sistema usa a imagem padrao da plataforma.
                    Apenas JPG e PNG.
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="baazar-search">
                    Bazar vinculado (opcional)
                  </Label>
                  {selectedBaazar ? (
                    <div className="flex items-center justify-between rounded-md border border-border p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveImageSrc(
                            selectedBaazar.logoImage,
                            "http://localhost:3000/uploads/defaults/bazar-1.svg",
                          )}
                          alt={selectedBaazar.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium">
                          {selectedBaazar.name}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setSelectedBaazar(null);
                          setBusinessSearch("");
                        }}
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="baazar-search"
                          value={businessSearch}
                          onChange={(e) => setBusinessSearch(e.target.value)}
                          placeholder="Digite o nome do bazar"
                          className="pl-9"
                        />
                      </div>
                      {baazarLoading && (
                        <p className="text-xs text-muted-foreground">
                          Buscando bazares...
                        </p>
                      )}
                      {!baazarLoading &&
                        businessSearch.trim().length >= 2 &&
                        baazarOptions.length > 0 && (
                          <div className="rounded-md border border-border divide-y divide-border max-h-56 overflow-y-auto">
                            {baazarOptions.map((baazar) => (
                              <button
                                key={baazar.id}
                                type="button"
                                className="w-full px-3 py-2 text-left hover:bg-accent/50 flex items-center gap-3"
                                onClick={() => {
                                  setSelectedBaazar(baazar);
                                  setBusinessSearch(baazar.name);
                                }}
                              >
                                <img
                                  src={resolveImageSrc(
                                    baazar.logoImage,
                                    "http://localhost:3000/uploads/defaults/bazar-1.svg",
                                  )}
                                  alt={baazar.name}
                                  className="w-7 h-7 rounded-full object-cover"
                                />
                                <span className="text-sm">{baazar.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de inicio *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate")}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-destructive">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="startTime"
                    className="flex items-center gap-2"
                  >
                    <Clock3 className="w-4 h-4" /> Horario de inicio *
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    {...register("startTime")}
                  />
                  {errors.startTime && (
                    <p className="text-sm text-destructive">
                      {errors.startTime.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de fim *</Label>
                  <Input id="endDate" type="date" {...register("endDate")} />
                  {errors.endDate && (
                    <p className="text-sm text-destructive">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime" className="flex items-center gap-2">
                    <Clock3 className="w-4 h-4" /> Horario de fim *
                  </Label>
                  <Input id="endTime" type="time" {...register("endTime")} />
                  {errors.endTime && (
                    <p className="text-sm text-destructive">
                      {errors.endTime.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tags">Tags (separadas por virgula)</Label>
                  <Input
                    id="tags"
                    placeholder="vintage, promocao, outlet"
                    {...register("tags")}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border p-4 space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-primary" />
                  Local do evento
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Rua *</Label>
                    <Input
                      id="street"
                      placeholder="Rua Augusta"
                      {...register("street")}
                    />
                    {errors.street && (
                      <p className="text-sm text-destructive">
                        {errors.street.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number">Numero *</Label>
                    <Input
                      id="number"
                      placeholder="123"
                      {...register("number")}
                    />
                    {errors.number && (
                      <p className="text-sm text-destructive">
                        {errors.number.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro *</Label>
                    <Input
                      id="neighborhood"
                      placeholder="Centro"
                      {...register("neighborhood")}
                    />
                    {errors.neighborhood && (
                      <p className="text-sm text-destructive">
                        {errors.neighborhood.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      placeholder="Sao Paulo"
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado *</Label>
                    <Input id="state" placeholder="SP" {...register("state")} />
                    {errors.state && (
                      <p className="text-sm text-destructive">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP *</Label>
                    <Input
                      id="zipCode"
                      placeholder="00000-000"
                      {...register("zipCode")}
                    />
                    {errors.zipCode && (
                      <p className="text-sm text-destructive">
                        {errors.zipCode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/eventos")}
                >
                  Voltar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : "Criar evento"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

