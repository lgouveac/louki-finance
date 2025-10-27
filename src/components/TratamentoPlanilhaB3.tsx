import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

interface PosicaoProcessada {
  Produto: string;
  "Quantidade ": number;
  "Valor Atualizado": number;
  Tipo: string;
}

export function TratamentoPlanilhaB3() {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [dadosProcessados, setDadosProcessados] = useState<PosicaoProcessada[]>([]);
  const [processando, setProcessando] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArquivo(file);
      setDadosProcessados([]);
    }
  };

  const processarPlanilha = async () => {
    if (!arquivo) {
      toast.error("Selecione um arquivo primeiro");
      return;
    }

    setProcessando(true);

    try {
      // Usar a biblioteca SheetJS para processar Excel no frontend
      const XLSX = await import('xlsx');

      const arrayBuffer = await arquivo.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);

      const resultado: PosicaoProcessada[] = [];

      // Processar cada aba conforme as regras
      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const dados = XLSX.utils.sheet_to_json(sheet);

        dados.forEach((linha: any) => {
          let produto = '';
          let quantidade = 0;
          let valorAtualizado = 0;
          let tipo = '';

          // Determinar tipo baseado na aba
          switch (sheetName.toLowerCase()) {
            case 'acoes':
              tipo = 'Ação';
              produto = linha['Produto'] || '';
              quantidade = parseFloat(linha['Quantidade']) || 0;
              valorAtualizado = parseFloat(linha['Valor Atualizado']) || 0;
              break;

            case 'empréstimos':
            case 'emprestimos':
              tipo = 'Ação'; // Empréstimo de ações
              produto = linha['Produto'] || '';
              quantidade = parseFloat(linha['Quantidade']) || 0;
              valorAtualizado = parseFloat(linha['Valor Atualizado']) || 0;
              break;

            case 'fundo de investimento':
            case 'fundos':
              tipo = 'FII';
              produto = linha['Produto'] || '';
              quantidade = parseFloat(linha['Quantidade']) || 0;
              valorAtualizado = parseFloat(linha['Valor Atualizado']) || 0;
              break;

            case 'renda fixa':
              tipo = 'Renda Fixa';
              produto = linha['Produto'] || '';
              quantidade = parseFloat(linha['Quantidade']) || 0;
              // Priorizar CURVA, depois FECHAMENTO
              valorAtualizado = parseFloat(linha['Valor Atualizado CURVA']) ||
                               parseFloat(linha['Valor Atualizado FECHAMENTO']) || 0;
              break;

            case 'tesouro direto':
              tipo = 'Renda Fixa';
              produto = linha['Produto'] || '';
              quantidade = parseFloat(linha['Quantidade']) || 0;
              valorAtualizado = parseFloat(linha['Valor Atualizado']) || 0;
              break;

            default:
              return; // Pular abas não reconhecidas
          }

          // Só adicionar se tem dados válidos
          if (produto && quantidade > 0) {
            resultado.push({
              Produto: produto,
              "Quantidade ": quantidade,
              "Valor Atualizado": valorAtualizado,
              Tipo: tipo
            });
          }
        });
      });

      setDadosProcessados(resultado);
      toast.success(`Planilha processada com sucesso! ${resultado.length} itens encontrados.`);

    } catch (error) {
      toast.error("Erro ao processar planilha: " + (error as Error).message);
    } finally {
      setProcessando(false);
    }
  };

  const baixarPlanilhaProcessada = () => {
    if (dadosProcessados.length === 0) {
      toast.error("Nenhum dado para baixar");
      return;
    }

    import('xlsx').then((XLSX) => {
      const ws = XLSX.utils.json_to_sheet(dadosProcessados);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Acoes");

      const nomeArquivo = `posicao-processada-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, nomeArquivo);

      toast.success("Planilha baixada com sucesso!");
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Tratamento de Planilha B3
          </CardTitle>
          <CardDescription>
            Converte a planilha de posição da B3 (5 abas) em formato único para importação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="arquivo">Planilha B3 (Original)</Label>
            <Input
              id="arquivo"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={processarPlanilha}
              disabled={!arquivo || processando}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {processando ? "Processando..." : "Processar Planilha"}
            </Button>

            {dadosProcessados.length > 0 && (
              <Button
                onClick={baixarPlanilhaProcessada}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Baixar Processada
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {dadosProcessados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview dos Dados Processados</CardTitle>
            <CardDescription>
              {dadosProcessados.length} itens encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Valor Atualizado</TableHead>
                    <TableHead>Tipo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosProcessados.slice(0, 50).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.Produto}</TableCell>
                      <TableCell>{item["Quantidade "].toLocaleString('pt-BR')}</TableCell>
                      <TableCell>
                        {item["Valor Atualizado"].toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.Tipo === 'Ação' ? 'bg-blue-100 text-blue-800' :
                          item.Tipo === 'FII' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {item.Tipo}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {dadosProcessados.length > 50 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Mostrando primeiros 50 de {dadosProcessados.length} itens
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}