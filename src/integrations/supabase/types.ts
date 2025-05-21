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
      carteira_consolidada: {
        Row: {
          codigo: string | null
          preco_atual: number | null
          preco_medio: number | null
          proventos_recebidos: number | null
          quantidade_total: number | null
          rentabilidade_com_proventos_perc: number | null
          rentabilidade_perc: number | null
          valor_atual: number | null
          valor_investido: number | null
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
    }
    Functions: {
      [_ in never]: never
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
