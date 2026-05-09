import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  {
    title: "Uso da plataforma",
    content:
      "A Brechosfera conecta pessoas a brechós, bazares e eventos. Ao criar uma conta, você se compromete a informar dados verdadeiros e usar a plataforma de forma lícita, respeitosa e compatível com a finalidade do serviço.",
  },
  {
    title: "Conta e segurança",
    content:
      "Você é responsável por manter sua senha em sigilo e por avisar caso perceba uso indevido da conta. Alterações sensíveis, como e-mail e senha, podem exigir confirmação por código enviado por e-mail.",
  },
  {
    title: "Conteúdo e informações",
    content:
      "Informações de lojas, contatos, imagens, avaliações e eventos devem ser corretas e não podem violar direitos de terceiros. Conteúdos falsos, ofensivos, fraudulentos ou ilegais podem ser removidos.",
  },
  {
    title: "Privacidade",
    content:
      "Usamos seus dados para autenticação, funcionamento da conta, comunicação de segurança e melhoria da experiência. Não publique dados pessoais de terceiros sem autorização.",
  },
  {
    title: "Exclusão de conta",
    content:
      "Você pode solicitar a exclusão da conta pela área do usuário. A exclusão encerra sua sessão e remove seu cadastro de acesso, sem impedir a retenção temporária de registros técnicos quando necessária para segurança, auditoria ou cumprimento legal.",
  },
  {
    title: "Atualizações dos termos",
    content:
      "Estes termos podem ser atualizados para refletir mudanças no produto, em requisitos legais ou em práticas de segurança. O uso contínuo da plataforma após uma atualização representa aceite da versão vigente.",
  },
];

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Termos de uso</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Última atualização: 9 de maio de 2026
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brechosfera</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {section.content}
              </p>
            </section>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
