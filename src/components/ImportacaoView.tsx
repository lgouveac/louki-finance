
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileUpIcon, UploadIcon } from "lucide-react";

export function ImportacaoView() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const { toast } = useToast();

  // URL do webhook para importação
  const webhookUrl = "https://n8n.sof.to/webhook/0f7663d6-f5a2-4471-9136-18f2c6303fc8";

  const validateWebhookUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors'
      });
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) {
      return;
    }

    setIsUploading(true);
    setUploadStatus("Enviando arquivo...");

    try {
      // Validar URL do webhook primeiro
      const isUrlValid = await validateWebhookUrl(webhookUrl);
      if (!isUrlValid) {
        throw new Error("URL do webhook não está respondendo");
      }

      // Criar FormData corretamente para envio do arquivo binário
      const formData = new FormData();
      formData.append('data', file, file.name);
      formData.append('filename', file.name);
      formData.append('timestamp', new Date().toISOString());

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'X-Requested-With': 'XMLHttpRequest',
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Resposta não disponível');
        throw new Error(`Erro ${response.status}: ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
      }

      const responseData = await response.text();
      setUploadStatus("Upload concluído!");
      
      toast({
        title: "Sucesso!",
        description: "Arquivo enviado com sucesso.",
      });

      // Limpar o input após sucesso
      const input = document.getElementById('file-upload') as HTMLInputElement;
      if (input) input.value = '';

    } catch (error) {
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
      
      // Limpar status após 5 segundos
      setTimeout(() => {
        setUploadStatus("");
      }, 5000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Importar Dados</h2>
        <p className="text-muted-foreground">
          Envie seus arquivos de investimentos para processamento automático
        </p>
      </div>

      <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="p-6 bg-primary/10 rounded-full">
              <UploadIcon className="h-12 w-12 text-primary" />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Selecione um arquivo</h3>
              <p className="text-sm text-muted-foreground">
                Aceita arquivos CSV, XLS, XLSX, PNG e JPEG
              </p>
              <p className="text-xs text-muted-foreground">
                Tamanho máximo: 10MB
              </p>
            </div>

            {uploadStatus && (
              <div className={`p-3 rounded-md text-sm ${
                uploadStatus.includes("Erro") 
                  ? "bg-destructive/10 text-destructive" 
                  : "bg-primary/10 text-primary"
              }`}>
                {uploadStatus}
              </div>
            )}
            
            <div className="w-full max-w-sm space-y-4">
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.xls,.xlsx,.png,.jpeg,.jpg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file);
                  }
                }}
                disabled={isUploading}
                className="hidden"
              />
              
              <Button 
                className="w-full" 
                size="lg"
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
                    Escolher Arquivo
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Formatos Suportados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Planilhas</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• CSV (.csv)</li>
                <li>• Excel (.xls, .xlsx)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Imagens</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• PNG (.png)</li>
                <li>• JPEG (.jpg, .jpeg)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
