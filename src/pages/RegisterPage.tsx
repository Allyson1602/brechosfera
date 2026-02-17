import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Store,
  MapPin,
  Globe,
  Phone,
  Mail,
  Instagram,
  Facebook,
  ExternalLink,
  Clock,
  ImagePlus,
  CheckCircle2,
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

const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z
    .string()
    .min(20, "Descrição deve ter pelo menos 20 caracteres"),
  category: z.enum(["bazar", "brecho"]),
  isOnline: z.boolean(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  street: z.string().optional(),
  number: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isOnline, setIsOnline] = useState(false);
  const [selectedItemTypes, setSelectedItemTypes] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      isOnline: false,
      category: "brecho",
    },
  });

  const toggleItemType = (item: string) => {
    setSelectedItemTypes((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const onSubmit = async (data: RegisterFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Form data:", { ...data, itemTypes: selectedItemTypes });

    toast({
      title: "Cadastro recebido!",
      description:
        "Analisaremos seu cadastro e entraremos em contato em breve.",
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Cadastro Enviado!</h2>
            <p className="text-muted-foreground mb-6">
              Recebemos seu cadastro e nossa equipe irá analisar as informações.
              Entraremos em contato em até 48 horas úteis.
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
      {/* Hero Section */}
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
            Faça parte da nossa comunidade e alcance milhares de pessoas em
            busca de achados incríveis!
          </p>
        </div>
      </section>

      {/* Form */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" />
                Informações Básicas
              </CardTitle>
              <CardDescription>
                Conte-nos sobre seu bazar ou brechó
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da loja *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Brechó das Amigas"
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
                    <SelectItem value="brecho">Brechó</SelectItem>
                    <SelectItem value="bazar">Bazar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva sua loja, o que vende, diferenciais..."
                  rows={4}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Vendas Online</p>
                    <p className="text-sm text-muted-foreground">
                      Marque se você vende pela internet
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

          {/* Item Types */}
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Itens</CardTitle>
              <CardDescription>
                Selecione os tipos de produtos que você vende
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {appConfig.itemTypes.map((item) => (
                  <Badge
                    key={item}
                    variant={
                      selectedItemTypes.includes(item) ? "default" : "outline"
                    }
                    className="cursor-pointer text-sm py-1.5 px-3"
                    onClick={() => toggleItemType(item)}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
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

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contato@exemplo.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
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

          {/* Address - Only show if not online only */}
          {!isOnline && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Endereço
                </CardTitle>
                <CardDescription>
                  Onde está localizado sua loja?
                </CardDescription>
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
                    <Label htmlFor="number">Número</Label>
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
                      placeholder="São Paulo"
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

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar Cadastro"}
          </Button>
        </form>
      </div>
    </div>
  );
}
