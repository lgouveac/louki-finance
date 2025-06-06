
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileUpIcon, AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ImportacaoView() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const { toast } = useToast();

  // URL do webhook para importação
  const webhookUrl = "https://n8n.sof.to/webhook/0f7663d6-f5a2-4471-9136-18f2c6303fc8";

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

  const handleFileUpload = async (file: File) => {
    if (!file) {
      console.log("❌ Nenhum arquivo selecionado");
      return;
    }

    console.log("📁 Iniciando upload do arquivo:", {
      name: file.name,
      size: file.size,
      type: file.type
    });

    setIsUploading(true);
    setUploadStatus("Preparando upload...");

    try {
      // Validar URL do webhook primeiro
      const isUrlValid = await validateWebhookUrl(webhookUrl);
      if (!isUrlValid) {
        throw new Error("URL do webhook não está respondendo");
      }

      setUploadStatus("Enviando arquivo...");

      // Criar FormData corretamente para envio do arquivo binário
      const formData = new FormData();
      // O n8n espera o arquivo no campo 'data' para processar como binário
      formData.append('data', file, file.name);
      formData.append('filename', file.name);
      formData.append('timestamp', new Date().toISOString());

      console.log("📤 Enviando FormData com arquivo binário:", {
        webhookUrl,
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

      setUploadStatus("Upload concluído!");
      
      toast({
        title: "Sucesso!",
        description: "Arquivo enviado com sucesso.",
      });

      // Limpar o input após sucesso
      const input = document.getElementById('file-upload') as HTMLInputElement;
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

      setUploadStatus(`Erro: ${errorMessage}`);
      
      toast({
        title: "Erro",
        description: `Erro ao enviar arquivo: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      
      // Limpar status após 10 segundos
      setTimeout(() => {
        setUploadStatus("");
      }, 10000);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Debug ativo:</strong> Verifique o console do navegador (F12) para logs detalhados do processo de upload.
        </AlertDescription>
      </Alert>

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUpIcon className="h-5 w-5" />
              Importar Dados de Investimentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Importe seus dados de investimentos
            </p>
            
            {uploadStatus && (
              <Alert className={uploadStatus.includes("Erro") ? "border-destructive" : ""}>
                <AlertCircleIcon className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {uploadStatus}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="file-upload">Selecionar arquivo (CSV ou XLS)</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.xls,.xlsx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file);
                  }
                }}
                disabled={isUploading}
              />
            </div>
            <Button 
              className="w-full" 
              disabled={isUploading}
              onClick={() => {
                const input = document.getElementById('file-upload') as HTMLInputElement;
                input?.click();
              }}
            >
              {isUploading ? (
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuração do Webhook</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p><strong>URL:</strong> {webhookUrl}</p>
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
              <li>Arquivo enviado no campo 'data' como binário</li>
              <li>FormData configurado corretamente para multipart/form-data</li>
              <li>Content-Type removido para permitir boundary automático</li>
            </ul>
            <p><strong>Problemas comuns:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Erro 404: Verifique se o webhook está ativo</li>
              <li>Erro CORS: O servidor precisa permitir requisições do seu domínio</li>
              <li>Erro de rede: Verifique sua conexão com a internet</li>
              <li>"No binary field 'data'": Arquivo enviado como binário</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
