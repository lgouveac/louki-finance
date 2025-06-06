export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      aliases: {
        Row: {
          codigo_negociacao: string
          codigo_posicao: string
        }
        Insert: {
          codigo_negociacao: string
          codigo_posicao: string
        }
        Update: {
          codigo_negociacao?: string
          codigo_posicao?: string
        }
        Relationships: []
      }
      ativos_manuais: {
        Row: {
          ativo: boolean | null
          codigo: string
          data_atualizacao: string | null
          id: number
          preco_medio: number
          proventos: number | null
          quantidade: number
          tipo: string
          valor_atual: number | null
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          data_atualizacao?: string | null
          id?: number
          preco_medio: number
          proventos?: number | null
          quantidade: number
          tipo: string
          valor_atual?: number | null
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          data_atualizacao?: string | null
          id?: number
          preco_medio?: number
          proventos?: number | null
          quantidade?: number
          tipo?: string
          valor_atual?: number | null
        }
        Relationships: []
      }
      cotacao_atual: {
        Row: {
          codigo: string | null
          cotacao_atual: number | null
          created_at: string
          id: number
          valorizacao: string | null
        }
        Insert: {
          codigo?: string | null
          cotacao_atual?: number | null
          created_at?: string
          id?: number
          valorizacao?: string | null
        }
        Update: {
          codigo?: string | null
          cotacao_atual?: number | null
          created_at?: string
          id?: number
          valorizacao?: string | null
        }
        Relationships: []
      }
      negociacoes: {
        Row: {
          Codigo: string | null
          criado_em: string | null
          "Data do Negócio": string | null
          id: string
          Instituição: string | null
          Mercado: string | null
          "Prazo/Vencimento": string | null
          Preço: number | null
          Quantidade: number | null
          "Tipo de Movimentação": string | null
          Valor: number | null
        }
        Insert: {
          Codigo?: string | null
          criado_em?: string | null
          "Data do Negócio"?: string | null
          id?: string
          Instituição?: string | null
          Mercado?: string | null
          "Prazo/Vencimento"?: string | null
          Preço?: number | null
          Quantidade?: number | null
          "Tipo de Movimentação"?: string | null
          Valor?: number | null
        }
        Update: {
          Codigo?: string | null
          criado_em?: string | null
          "Data do Negócio"?: string | null
          id?: string
          Instituição?: string | null
          Mercado?: string | null
          "Prazo/Vencimento"?: string | null
          Preço?: number | null
          Quantidade?: number | null
          "Tipo de Movimentação"?: string | null
          Valor?: number | null
        }
        Relationships: []
      }
      posicao_atualizada: {
        Row: {
          codigo: string | null
          criado_em: string | null
          id: string
          Produto: string | null
          Quantidade: number | null
          "Quantidade Disponível": number | null
          Tipo: string | null
          "Valor Atualizado": number | null
        }
        Insert: {
          codigo?: string | null
          criado_em?: string | null
          id?: string
          Produto?: string | null
          Quantidade?: number | null
          "Quantidade Disponível"?: number | null
          Tipo?: string | null
          "Valor Atualizado"?: number | null
        }
        Update: {
          codigo?: string | null
          criado_em?: string | null
          id?: string
          Produto?: string | null
          Quantidade?: number | null
          "Quantidade Disponível"?: number | null
          Tipo?: string | null
          "Valor Atualizado"?: number | null
        }
        Relationships: []
      }
      proventos: {
        Row: {
          criado_em: string | null
          Data: string | null
          "Entrada/Saída": string | null
          id: string
          Instituição: string | null
          Movimentação: string | null
          "Preço unitário": number | null
          Produto: string | null
          Quantidade: number | null
          "Valor da Operação": number | null
        }
        Insert: {
          criado_em?: string | null
          Data?: string | null
          "Entrada/Saída"?: string | null
          id?: string
          Instituição?: string | null
          Movimentação?: string | null
          "Preço unitário"?: number | null
          Produto?: string | null
          Quantidade?: number | null
          "Valor da Operação"?: number | null
        }
        Update: {
          criado_em?: string | null
          Data?: string | null
          "Entrada/Saída"?: string | null
          id?: string
          Instituição?: string | null
          Movimentação?: string | null
          "Preço unitário"?: number | null
          Produto?: string | null
          Quantidade?: number | null
          "Valor da Operação"?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      anomalias_corrigidas_preco_medio: {
        Row: {
          codigo: string | null
          delta_qtd: number | null
          preco_medio_corrigido: number | null
          preco_medio_original: number | null
          qtd_atual: number | null
          qtd_comprada: number | null
          sem_evento_registrado: boolean | null
          valor_investido: number | null
        }
        Relationships: []
      }
      ativos_vendidos: {
        Row: {
          codigo: string | null
          lucro_prejuizo: number | null
          preco_medio_compra: number | null
          preco_venda: number | null
          proventos_recebidos: number | null
          rentabilidade_com_proventos: number | null
          rentabilidade_sem_proventos: number | null
        }
        Relationships: []
      }
      carteira_consolidada: {
        Row: {
          codigo: string | null
          preco_atual: number | null
          preco_medio: number | null
          proventos_recebidos: number | null
          quantidade_total: number | null
          rentabilidade_com_proventos_perc: number | null
          rentabilidade_perc: number | null
          Tipo: string | null
          valor_atual: number | null
          valor_investido: number | null
        }
        Relationships: []
      }
      carteira_consolidada_2: {
        Row: {
          codigo: string | null
          preco_atual: number | null
          preco_medio: number | null
          proventos_recebidos: number | null
          quantidade_total: number | null
          rentabilidade_com_proventos_perc: number | null
          rentabilidade_perc: number | null
          Tipo: string | null
          valor_atual: number | null
          valor_investido: number | null
        }
        Relationships: []
      }
      dashboard: {
        Row: {
          percentual: number | null
          Tipo: string | null
          valor_total: number | null
        }
        Relationships: []
      }
      proventos_recebidos: {
        Row: {
          codigo: string | null
          Data: string | null
          Quantidade: number | null
          tipo: string | null
          valor: number | null
        }
        Insert: {
          codigo?: string | null
          Data?: string | null
          Quantidade?: number | null
          tipo?: string | null
          valor?: number | null
        }
        Update: {
          codigo?: string | null
          Data?: string | null
          Quantidade?: number | null
          tipo?: string | null
          valor?: number | null
        }
        Relationships: []
      }
      proventos_recebidos_mes: {
        Row: {
          mes_ano: string | null
          valor_total_mensal: number | null
        }
        Relationships: []
      }
      rentabilidade: {
        Row: {
          rentabilidade_com_proventos: number | null
          rentabilidade_sem_proventos: number | null
          total_atual: number | null
          total_investido: number | null
          total_proventos: number | null
        }
        Relationships: []
      }
      view_dy_anual: {
        Row: {
          ano: number | null
          codigo: string | null
          dy: number | null
          total_proventos: number | null
          valor_investido_acumulado: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      adicionar_ativo_manual: {
        Args: {
          p_codigo: string
          p_tipo: string
          p_quantidade: number
          p_preco_medio: number
          p_valor_atual: number
          p_proventos?: number
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
