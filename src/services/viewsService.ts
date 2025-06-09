import { supabase } from "@/integrations/supabase/client";
import { CarteiraAtual, ProventosRecebidos, DashboardData, Rentabilidade, AnomaliaCorrigida, ProventosMensais } from "@/types/stock";

export interface DividendYieldAnual {
  ano: number;
  total_dividendos: number;
  capital_acumulado: number;
  dividend_yield_percent: number;
}

export const getCarteiraAtual = async (): Promise<CarteiraAtual[]> => {
  try {
    const { data, error } = await supabase
      .from('carteira_consolidada')
      .select('*');
    
    if (error) {
      console.error('Error fetching carteira_consolidada view:', error);
      throw error;
    }
    
    return data as CarteiraAtual[] || [];
  } catch (err) {
    console.error('Unexpected error in getCarteiraAtual:', err);
    return [];
  }
};

export const getProventosRecebidos = async (): Promise<ProventosRecebidos[]> => {
  try {
    const { data, error } = await supabase
      .from('proventos_recebidos')
      .select('*');
    
    if (error) {
      console.error('Error fetching proventos_recebidos view:', error);
      throw error;
    }
    
    return data as ProventosRecebidos[] || [];
  } catch (err) {
    console.error('Unexpected error in getProventosRecebidos:', err);
    return [];
  }
};

export const getProventosMensais = async (): Promise<ProventosMensais[]> => {
  try {
    const { data, error } = await supabase
      .from('proventos_recebidos_mes')
      .select('*');
    
    if (error) {
      console.error('Error fetching proventos_recebidos_mes view:', error);
      throw error;
    }
    
    return data as ProventosMensais[] || [];
  } catch (err) {
    console.error('Unexpected error in getProventosMensais:', err);
    return [];
  }
};

export const getDashboardData = async (): Promise<DashboardData[]> => {
  try {
    const { data, error } = await supabase
      .from('dashboard')
      .select('*');
    
    if (error) {
      console.error('Error fetching dashboard view:', error);
      throw error;
    }
    
    return data as DashboardData[] || [];
  } catch (err) {
    console.error('Unexpected error in getDashboardData:', err);
    return [];
  }
};

export const getRentabilidade = async (): Promise<Rentabilidade[]> => {
  try {
    const { data, error } = await supabase
      .from('rentabilidade')
      .select('*');
    
    if (error) {
      console.error('Error fetching rentabilidade view:', error);
      throw error;
    }
    
    return data as Rentabilidade[] || [];
  }
  catch (err) {
    console.error('Unexpected error in getRentabilidade:', err);
    return [];
  }
};

export const getAnomaliasCorrigidas = async (): Promise<AnomaliaCorrigida[]> => {
  try {
    const { data, error } = await supabase
      .from('anomalias_corrigidas_preco_medio')
      .select('*');
    
    if (error) {
      console.error('Error fetching anomalias_corrigidas_preco_medio view:', error);
      throw error;
    }
    
    return data as AnomaliaCorrigida[] || [];
  } catch (err) {
    console.error('Unexpected error in getAnomaliasCorrigidas:', err);
    return [];
  }
};

export const getDividendYieldAnual = async (): Promise<DividendYieldAnual[]> => {
  try {
    const { data, error } = await supabase
      .from('dividend_yield_anual_net_invested')
      .select('*')
      .order('ano', { ascending: false });
    
    if (error) {
      console.error('Error fetching dividend_yield_anual_net_invested view:', error);
      throw error;
    }
    
    return data as DividendYieldAnual[] || [];
  } catch (err) {
    console.error('Unexpected error in getDividendYieldAnual:', err);
    return [];
  }
};
