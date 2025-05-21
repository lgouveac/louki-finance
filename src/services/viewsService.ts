
import { supabase } from "@/integrations/supabase/client";
import { CarteiraAtual, ProventosRecebidos, DashboardData } from "@/types/stock";

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
