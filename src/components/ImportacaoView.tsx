
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { FileUpIcon, UploadIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export function ImportacaoView() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const { toast } = useToast();
  const { user, session } = useAuth();

  const handleFileUpload = async (file: File) => {
    if (!file) {
      return;
    }

    if (!user || !session) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para fazer upload de arquivos.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus("Enviando arquivo...");

    try {
      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);

      // Preparar FormData para o arquivo
      const formData = new FormData();
      formData.append('file', file, file.name);

      // Chamar a edge function do Supabase
      const { data, error } = await supabase.functions.invoke('userid', {
        body: formData,
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Upload successful:', data);
      setUploadStatus("Upload concluído!");
      
      toast({
        title: "Sucesso!",
        description: "Arquivo enviado com sucesso.",
      });

      // Limpar o input após sucesso
      const input = document.getElementById('file-upload') as HTMLInputElement;
      if (input) input.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      
      let errorMessage = "Erro desconhecido ao enviar arquivo";
      
      if (error instanceof Error) {
        errorMessage = error.message;
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

  // Verificar se o usuário está logado
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Importar Dados</h2>
          <p className="text-muted-foreground">
            Você precisa estar logado para importar arquivos
          </p>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              Faça login para acessar a funcionalidade de importação de dados.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Edge Function - Upload de Arquivos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              Os arquivos são enviados para a edge function "userid" do Supabase que processa automaticamente os dados enviados.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium">Funcionalidades:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Autenticação automática via JWT</li>
                <li>Associação do arquivo ao usuário logado</li>
                <li>Processamento seguro dos dados</li>
                <li>Validação de tipos de arquivo</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
