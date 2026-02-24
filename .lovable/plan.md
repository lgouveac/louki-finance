

## Nova Aba "Scrapping B3" na Importacao

Adicionar uma terceira aba na pagina de Importacao chamada "Scrapping B3" com um botao que chama o endpoint `http://localhost:3000/webhook/extract-final`.

### Alteracoes

**Arquivo: `src/components/ImportacaoView.tsx`**

1. Alterar o `TabsList` de `grid-cols-2` para `grid-cols-3`
2. Adicionar novo `TabsTrigger` com value "scrapping" e label "Scrapping B3"
3. Adicionar novo `TabsContent` com value "scrapping" contendo:
   - Card com titulo e descricao explicando a funcionalidade
   - Botao "Executar Scrapping" que faz um POST para `http://localhost:3000/webhook/extract-final`
   - Estado de loading enquanto a requisicao esta em andamento
   - Toast de sucesso ou erro conforme o resultado
   - Icone adequado (ex: `Globe` ou `SearchIcon` do lucide-react)

### Detalhes Tecnicos

- A chamada sera feita com `fetch` direto (nao via Supabase), pois o endpoint e externo
- O botao tera estado de loading com spinner durante a execucao
- Tratamento de erro com try/catch e feedback via toast
- Nao requer autenticacao adicional alem da que ja existe na pagina

