
-- Criar tabela carteira_ideal
CREATE TABLE public.carteira_ideal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tipo TEXT NOT NULL,
  percentual_ideal NUMERIC(5,2) NOT NULL CHECK (percentual_ideal >= 0 AND percentual_ideal <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tipo)
);

-- Configurar RLS para carteira_ideal
ALTER TABLE public.carteira_ideal ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para carteira_ideal
CREATE POLICY "Users can view their own ideal portfolio" 
  ON public.carteira_ideal 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ideal portfolio" 
  ON public.carteira_ideal 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ideal portfolio" 
  ON public.carteira_ideal 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideal portfolio" 
  ON public.carteira_ideal 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_carteira_ideal_updated_at 
  BEFORE UPDATE ON public.carteira_ideal 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Criar view comparativa entre carteira atual e ideal (corrigindo o nome da coluna)
CREATE OR REPLACE VIEW public.carteira_comparativa AS
SELECT 
  COALESCE(d."Tipo", ci.tipo) as tipo,
  COALESCE(d.valor_total, 0) as valor_atual,
  COALESCE(d.percentual, 0) as percentual_atual,
  COALESCE(ci.percentual_ideal, 0) as percentual_ideal,
  COALESCE(ci.percentual_ideal, 0) - COALESCE(d.percentual, 0) as diferenca_percentual,
  CASE 
    WHEN COALESCE(ci.percentual_ideal, 0) > COALESCE(d.percentual, 0) THEN 'COMPRAR'
    WHEN COALESCE(ci.percentual_ideal, 0) < COALESCE(d.percentual, 0) THEN 'VENDER'
    ELSE 'EQUILIBRADO'
  END as acao_sugerida,
  ci.user_id
FROM public.dashboard d
FULL OUTER JOIN public.carteira_ideal ci ON d."Tipo" = ci.tipo
WHERE ci.user_id = auth.uid() OR d."Tipo" IS NOT NULL;

-- Função para inicializar carteira ideal com percentuais atuais
CREATE OR REPLACE FUNCTION public.inicializar_carteira_ideal()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id UUID := auth.uid();
BEGIN
  -- Inserir percentuais atuais como base para carteira ideal
  INSERT INTO public.carteira_ideal (user_id, tipo, percentual_ideal)
  SELECT 
    current_user_id,
    d."Tipo",
    COALESCE(d.percentual, 0)
  FROM public.dashboard d
  ON CONFLICT (user_id, tipo) DO NOTHING;
  
  RETURN 'Carteira ideal inicializada com percentuais atuais';
END;
$$;
