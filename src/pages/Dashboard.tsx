import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Alert } from '../types';

function defaults(side: 'buy' | 'sell'): Partial<Alert> {
  return {
    side,
    rsi_threshold: side === 'buy' ? 30 : 70,
    direction: side === 'buy' ? 'crosses_below' : 'crosses_above',
    is_active: true,
    cooldown_minutes: 120,
  } as Partial<Alert>;
}

export default function Dashboard() {
  const qc = useQueryClient();
  const [creating, setCreating] = useState<'buy' | 'sell' | null>(null);
  const [editing, setEditing] = useState<Alert | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Alert[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (payload: Partial<Alert>) => {
      const { data, error } = await supabase.from('alerts').upsert(payload).select().single();
      if (error) throw error;
      return data as Alert;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alerts'] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('alerts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alerts'] }),
  });

  useEffect(() => {
    // Reserved for future prefetch or user-specific logic
    supabase.auth.getUser();
  }, []);

  const form = (initial: Partial<Alert>, onClose: () => void) => (
    <AlertForm
      initial={initial}
      onCancel={onClose}
      onSave={async (vals) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        upsert.mutate({ ...vals, user_id: user.id } as Partial<Alert>);
        onClose();
      }}
    />
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button className="rounded-md border px-3 py-1" onClick={() => setCreating('buy')}>+ Buy alert</button>
        <button className="rounded-md border px-3 py-1" onClick={() => setCreating('sell')}>+ Sell alert</button>
      </div>

      {isLoading ? (
        <p>Loading…</p>
      ) : (
        <ul className="space-y-2">
          {data?.map((a) => (
            <li key={a.id} className="rounded-lg border bg-white p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm rounded bg-slate-100 px-2 py-1">{a.side.toUpperCase()}</span>
                <span className="text-sm">RSI {a.direction.replace('_', ' ')} <b>{a.rsi_threshold}</b></span>
                <span className="ml-auto text-xs text-slate-500">{a.is_active ? 'active' : 'inactive'}</span>
              </div>
              <div className="mt-2 flex gap-2">
                <button className="rounded-md border px-3 py-1" onClick={() => setEditing(a)}>Edit</button>
                <button className="rounded-md border px-3 py-1" onClick={() => del.mutate(a.id)}>Delete</button>
                <button
                  className="rounded-md border px-3 py-1"
                  onClick={async () => {
                    await supabase.from('alerts').update({ is_active: !a.is_active }).eq('id', a.id);
                    qc.invalidateQueries({ queryKey: ['alerts'] });
                  }}
                >
                  {a.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
              {a.last_fired_at && (
                <p className="mt-2 text-xs text-slate-500">
                  Last fired: {new Date(a.last_fired_at).toLocaleString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {creating && form(defaults(creating), () => setCreating(null))}
      {editing && form(editing, () => setEditing(null))}
    </div>
  );
}

function AlertForm({
  initial, onCancel, onSave,
}: {
  initial: Partial<Alert>;
  onCancel: () => void;
  onSave: (vals: Partial<Alert>) => void;
}) {
  const [vals, setVals] = useState<Partial<Alert>>(initial);
  const update = (k: keyof Alert, v: any) => setVals((s) => ({ ...s, [k]: v }));

  const valid = useMemo(() =>
    typeof vals.rsi_threshold === 'number' && vals.rsi_threshold > 0 && vals.rsi_threshold < 100
  , [vals.rsi_threshold]);

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">Side
          <select
            className="mt-1 w-full rounded-md border px-2 py-1"
            value={vals.side}
            onChange={(e) => update('side', e.target.value as Alert['side'])}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </label>
        <label className="text-sm">Direction
          <select
            className="mt-1 w-full rounded-md border px-2 py-1"
            value={vals.direction}
            onChange={(e) => update('direction', e.target.value as Alert['direction'])}
          >
            <option value="crosses_below">crosses below</option>
            <option value="crosses_above">crosses above</option>
          </select>
        </label>
        <label className="text-sm">RSI threshold
          <input
            type="number"
            className="mt-1 w-full rounded-md border px-2 py-1"
            min={1}
            max={99}
            value={vals.rsi_threshold ?? ''}
            onChange={(e) => update('rsi_threshold', Number(e.target.value))}
          />
        </label>
        <label className="text-sm">Cooldown (minutes)
          <input
            type="number"
            className="mt-1 w-full rounded-md border px-2 py-1"
            min={5}
            max={1440}
            value={vals.cooldown_minutes ?? 120}
            onChange={(e) => update('cooldown_minutes', Number(e.target.value))}
          />
        </label>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="rounded-md border px-3 py-1" onClick={onCancel}>Cancel</button>
        <button
          className="rounded-md bg-black text-white px-3 py-1 disabled:opacity-50"
          disabled={!valid}
          onClick={() => onSave(vals)}
        >
          Save
        </button>
      </div>
    </div>
  );
}
