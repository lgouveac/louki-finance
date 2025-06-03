
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileUpIcon, CoinsIcon, TrendingUpIcon } from "lucide-react";

export function ImportacaoView() {
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const webhookUrl = "https://n8n.sof.to/webhook-test/0f7663d6-f5a2-4471-9136-18f2c6303fc8";

  const handleFileUpload = async (file: File, type: string) => {
    if (!file) return;

    setIsUploading(prev => ({ ...prev, [type]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: `Arquivo de ${type} enviado com sucesso.`,
        });
      } else {
        throw new Error('Erro no upload');
      }
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      toast({
        title: "Erro",
        description: `Erro ao enviar arquivo de ${type}. Tente novamente.`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const ImportCard = ({ 
    title, 
    description, 
    icon: Icon, 
    type 
  }: { 
    title: string; 
    description: string; 
    icon: any; 
    type: string; 
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="space-y-2">
          <Label htmlFor={`file-${type}`}>Selecionar arquivo (CSV ou XLS)</Label>
          <Input
            id={`file-${type}`}
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileUpload(file, type);
              }
            }}
            disabled={isUploading[type]}
          />
        </div>
        <Button 
          className="w-full" 
          disabled={isUploading[type]}
          onClick={() => {
            const input = document.getElementById(`file-${type}`) as HTMLInputElement;
            input?.click();
          }}
        >
          {isUploading[type] ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Enviando...
            </>
          ) : (
            <>
              <FileUpIcon className="h-4 w-4 mr-2" />
              Selecionar e Enviar
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ImportCard
          title="Proventos"
          description="Importe dados de dividendos e outros proventos recebidos"
          icon={CoinsIcon}
          type="proventos"
        />
        
        <ImportCard
          title="Posição Atualizada"
          description="Importe dados atualizados da sua carteira de investimentos"
          icon={TrendingUpIcon}
          type="posicao-atualizada"
        />
        
        <ImportCard
          title="Outros Dados"
          description="Importe outros tipos de dados financeiros"
          icon={FileUpIcon}
          type="outros"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instruções</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Formatos aceitos:</strong> CSV, XLS, XLSX</p>
            <p><strong>Tamanho máximo:</strong> 10MB por arquivo</p>
            <p><strong>Processamento:</strong> Os arquivos serão processados automaticamente após o upload</p>
            <p><strong>Notificações:</strong> Você receberá uma notificação quando o processamento for concluído</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
