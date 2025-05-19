
import { supabase } from "@/integrations/supabase/client";
import { CarteiraAtual, ProventosRecebidos } from "@/types/stock";

export const getCarteiraAtual = async (): Promise<CarteiraAtual[]> => {
  try {
    const { data, error } = await supabase
      .from('carteira_atual')
      .select('*');
    
    if (error) {
      console.error('Error fetching carteira_atual view:', error);
      return [];
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
      return [];
    }
    
    return data as ProventosRecebidos[] || [];
  } catch (err) {
    console.error('Unexpected error in getProventosRecebidos:', err);
    return [];
  }
};
