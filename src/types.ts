export type Alert = {
  id: string;
  user_id: string;
  side: 'buy' | 'sell';
  rsi_threshold: number;
  direction: 'crosses_below' | 'crosses_above';
  is_active: boolean;
  cooldown_minutes: number;
  last_fired_at: string | null;
  last_rsi: number | null;
  created_at: string;
  updated_at: string;
};
