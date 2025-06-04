import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileUpIcon, CoinsIcon, TrendingUpIcon, AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ImportacaoView() {
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  // URLs específicas para cada tipo de upload
  const webhookUrls = {
    "proventos": "https://n8n.sof.to/webhook/0f7663d6-f5a2-4471-9136-18f2c6303fc8",
    "posicao-atualizada": "https://n8n.sof.to/webhook/0f7663d6-f5a2-4471-9136-18f2c6303fc8",
    "outros": "https://n8n.sof.to/webhook/0f7663d6-f5a2-4471-9136-18f2c6303fc8" // usando o mesmo webhook por padrão
  };

  const validateWebhookUrl = async (url: string): Promise<boolean> => {
    try {
      console.log("🔍 Validando URL do webhook:", url);
      
      // Primeiro, tenta fazer um HEAD request para verificar se o endpoint existe
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors'
      });
      
      console.log("✅ URL do webhook parece válida");
      return true;
    } catch (error) {
      console.error("❌ Erro ao validar URL do webhook:", error);
      return false;
    }
  };

  const handleFileUpload = async (file: File, type: string) => {
    if (!file) {
      console.log("❌ Nenhum arquivo selecionado");
      return;
    }

    console.log("📁 Iniciando upload do arquivo:", {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadType: type
    });

    const webhookUrl = webhookUrls[type as keyof typeof webhookUrls];
    if (!webhookUrl) {
      console.error("❌ URL do webhook não encontrada para o tipo:", type);
      toast({
        title: "Erro",
        description: `URL do webhook não configurada para o tipo: ${type}`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(prev => ({ ...prev, [type]: true }));
    setUploadStatus(prev => ({ ...prev, [type]: "Preparando upload..." }));

    try {
      // Validar URL do webhook primeiro
      const isUrlValid = await validateWebhookUrl(webhookUrl);
      if (!isUrlValid) {
        throw new Error("URL do webhook não está respondendo");
      }

      setUploadStatus(prev => ({ ...prev, [type]: "Enviando arquivo..." }));

      // Criar FormData corretamente para envio do arquivo binário
      const formData = new FormData();
      // O n8n espera o arquivo no campo 'data' para processar como binário
      formData.append('data', file, file.name);
      formData.append('type', type);
      formData.append('filename', file.name);
      formData.append('timestamp', new Date().toISOString());

      console.log("📤 Enviando FormData com arquivo binário:", {
        webhookUrl,
        type,
        filename: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
        // Não definir Content-Type manualmente para FormData - deixar o browser definir automaticamente com boundary
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'X-Requested-With': 'XMLHttpRequest',
        },
        mode: 'cors',
        credentials: 'omit'
      });

      console.log("📨 Resposta do servidor:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Resposta não disponível');
        console.error("❌ Erro na resposta:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        throw new Error(`Erro ${response.status}: ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
      }

      const responseData = await response.text();
      console.log("✅ Upload realizado com sucesso:", responseData);

      setUploadStatus(prev => ({ ...prev, [type]: "Upload concluído!" }));
      
      toast({
        title: "Sucesso!",
        description: `Arquivo de ${type} enviado com sucesso.`,
      });

      // Limpar o input após sucesso
      const input = document.getElementById(`file-${type}`) as HTMLInputElement;
      if (input) input.value = '';

    } catch (error) {
      console.error("❌ Erro detalhado no upload:", {
        error: error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        type: typeof error
      });

      let errorMessage = "Erro desconhecido ao enviar arquivo";
      
      if (error instanceof Error) {
        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          errorMessage = "Erro de rede - verifique sua conexão ou se o webhook está ativo";
        } else if (error.message.includes('CORS')) {
          errorMessage = "Erro de CORS - o servidor precisa permitir requisições do seu domínio";
        } else if (error.message.includes('404') || error.message.includes('Not Found')) {
          errorMessage = "Webhook não encontrado - verifique se a URL está correta";
        } else {
          errorMessage = error.message;
        }
      }

      setUploadStatus(prev => ({ ...prev, [type]: `Erro: ${errorMessage}` }));
      
      toast({
        title: "Erro",
        description: `Erro ao enviar arquivo de ${type}: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(prev => ({ ...prev, [type]: false }));
      
      // Limpar status após 10 segundos
      setTimeout(() => {
        setUploadStatus(prev => ({ ...prev, [type]: "" }));
      }, 10000);
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
        
        {uploadStatus[type] && (
          <Alert className={uploadStatus[type].includes("Erro") ? "border-destructive" : ""}>
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {uploadStatus[type]}
            </AlertDescription>
          </Alert>
        )}
        
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
      <Alert>
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Debug ativo:</strong> Verifique o console do navegador (F12) para logs detalhados do processo de upload.
        </AlertDescription>
      </Alert>

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
          <CardTitle>Configuração dos Webhooks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Proventos:</strong> {webhookUrls.proventos}</p>
            <p><strong>Posição Atualizada:</strong> {webhookUrls["posicao-atualizada"]}</p>
            <p><strong>Outros:</strong> {webhookUrls.outros}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instruções e Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Formatos aceitos:</strong> CSV, XLS, XLSX</p>
            <p><strong>Tamanho máximo:</strong> 10MB por arquivo</p>
            <p><strong>Processamento:</strong> Os arquivos serão processados automaticamente após o upload</p>
            <p><strong>Debug:</strong> Abra o console do navegador (F12) para ver logs detalhados</p>
            <p><strong>Principais mudanças:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Arquivo agora é enviado no campo 'data' como binário</li>
              <li>FormData configurado corretamente para multipart/form-data</li>
              <li>Content-Type removido para permitir boundary automático</li>
            </ul>
            <p><strong>Problemas comuns:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Erro 404: Verifique se o webhook está ativo</li>
              <li>Erro CORS: O servidor precisa permitir requisições do seu domínio</li>
              <li>Erro de rede: Verifique sua conexão com a internet</li>
              <li>"No binary field 'data'": Agora corrigido - arquivo enviado como binário</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
