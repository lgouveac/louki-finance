import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FileUpIcon, UploadIcon, Globe, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { TratamentoPlanilhaB3 } from "./TratamentoPlanilhaB3";
export function ImportacaoView() {
  const [isUploading, setIsUploading] = useState(false);
  const [isScrapping, setIsScrapping] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const {
    toast
  } = useToast();
  const {
    user,
    session
  } = useAuth();
  const handleFileUpload = async (file: File) => {
    if (!file) {
      return;
    }
    if (!user || !session) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para fazer upload de arquivos.",
        variant: "destructive"
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
      const {
        data,
        error
      } = await supabase.functions.invoke('userid', {
        body: formData
      });
      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      console.log('Upload successful:', data);
      setUploadStatus("Upload concluído!");
      toast({
        title: "Sucesso!",
        description: "Arquivo enviado com sucesso."
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
        variant: "destructive"
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
    return <div className="max-w-2xl mx-auto space-y-8">
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
      </div>;
  }
  return <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Importar Dados</h2>
        <p className="text-muted-foreground">
          Gerencie a importação de dados da B3 e outros arquivos
        </p>
      </div>

      <Tabs defaultValue="tratamento" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tratamento">Tratamento B3</TabsTrigger>
          <TabsTrigger value="importacao">Importação Direta</TabsTrigger>
          <TabsTrigger value="scrapping">Scrapping B3</TabsTrigger>
        </TabsList>

        <TabsContent value="tratamento">
          <TratamentoPlanilhaB3 />
        </TabsContent>

        <TabsContent value="importacao" className="space-y-6">
          <div className="text-left space-y-4">
            <p className="text-base text-foreground">
              Envie seus arquivos de investimentos baixados na Área do Investidor da B3 e prints da carteira.
            </p>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Arquivos aceitos da B3:</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Carteiras de proventos</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Posição atualizada</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Negociações</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Requisitos para prints:</h3>
              <div className="space-y-2">
                <div className="pl-4 border-l-4 border-primary bg-primary/5 py-2">
                  <p className="text-sm font-medium text-foreground">Obrigatório:</p>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• Código do ativo</li>
                    <li>• Valor atual</li>
                  </ul>
                </div>
                <div className="pl-4 border-l-4 border-muted bg-muted/20 py-2">
                  <p className="text-sm font-medium text-muted-foreground">Opcional:</p>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• Preço médio</li>
                    <li>• Proventos</li>
                  </ul>
                </div>
              </div>
            </div>
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

                {uploadStatus && <div className={`p-3 rounded-md text-sm ${uploadStatus.includes("Erro") ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                    {uploadStatus}
                  </div>}

                <div className="w-full max-w-sm space-y-4">
                  <Input id="file-upload" type="file" accept=".csv,.xls,.xlsx,.png,.jpeg,.jpg" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file);
                  }
                }} disabled={isUploading} className="hidden" />

                  <Button className="w-full" size="lg" disabled={isUploading} onClick={() => {
                  const input = document.getElementById('file-upload') as HTMLInputElement;
                  input?.click();
                }}>
                    {isUploading ? <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </> : <>
                        <FileUpIcon className="h-4 w-4 mr-2" />
                        Escolher Arquivo
                      </>}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scrapping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Scrapping B3
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Executa a extração automática de dados diretamente da B3. Clique no botão abaixo para iniciar o processo.
              </p>
              <Button
                size="lg"
                disabled={isScrapping}
                onClick={async () => {
                  setIsScrapping(true);
                  try {
                    const res = await fetch("http://localhost:3000/webhook/extract-final", { method: "POST" });
                    if (!res.ok) throw new Error(`Erro ${res.status}`);
                    toast({ title: "Sucesso!", description: "Scrapping executado com sucesso." });
                  } catch (error) {
                    const msg = error instanceof Error ? error.message : "Erro desconhecido";
                    toast({ title: "Erro", description: `Falha no scrapping: ${msg}`, variant: "destructive" });
                  } finally {
                    setIsScrapping(false);
                  }
                }}
              >
                {isScrapping ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Executando...
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4" />
                    Executar Scrapping
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
}