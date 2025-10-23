import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { z } from 'zod';

const phoneSchema = z.string().regex(/^\+\d{7,15}$/, 'Use E.164 format (e.g., +15551234567)');

type Profile = { id: string; phone_e164: string | null; sms_opt_in: boolean };

export default function Account() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [phone, setPhone] = useState('');
  const [opt, setOpt] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      const { data: { user }, error: uerr } = await supabase.auth.getUser();
      if (uerr) { if (alive) setErr(uerr.message); setLoading(false); return; }
      if (!user) { if (alive) setErr('Not signed in.'); setLoading(false); return; }

      // Try to load the profile. maybeSingle() avoids a hard error on 0 rows.
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error && status !== 406) { // 406 = no rows
        if (alive) setErr(error.message);
        setLoading(false);
        return;
      }

      if (!data) {
        // Attempt to create a row client-side (requires insert policy; see SQL patch below).
        const { data: created, error: ierr } = await supabase
          .from('profiles')
          .insert({ id: user.id, phone_e164: null, sms_opt_in: false })
          .select()
          .single();

        if (ierr) {
          // Not fatal — user can still try saving after policies are added.
          if (alive) setMsg('Heads up: your profile row did not exist. Add the insert policy (below), then Save.');
        } else if (alive && created) {
          setPhone(created.phone_e164 ?? '');
          setOpt(!!created.sms_opt_in);
        }
      } else if (alive) {
        setPhone(data.phone_e164 ?? '');
        setOpt(!!data.sms_opt_in);
      }

      setLoading(false);
    })();

    return () => { alive = false; };
  }, []);

  async function save() {
    setSaving(true);
    setMsg(null);
    setErr(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setErr('Not signed in.'); setSaving(false); return; }

    const value = phone.trim();
    if (value && !phoneSchema.safeParse(value).success) {
      setErr('Phone must be E.164, e.g., +15551234567');
      setSaving(false);
      return;
    }

    // Upsert lets us create-or-update in one call (requires INSERT/UPDATE policies).
    const { error } = await supabase
      .from('profiles')
      .upsert(
        { id: user.id, phone_e164: value || null, sms_opt_in: opt },
        { onConflict: 'id' }
      );

    if (error) setErr(error.message);
    else setMsg('Saved.');
    setSaving(false);
  }

  if (loading) return <p>Loading account…</p>;

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-semibold mb-4">Account</h1>

      {err && <p className="mb-3 rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{err}</p>}
      {msg && <p className="mb-3 rounded bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-800">{msg}</p>}

      <label className="text-sm">SMS phone (+E.164)
        <input
          className="mt-1 w-full rounded-md border px-3 py-2"
          placeholder="+15551234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>

      <label className="mt-3 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={opt}
          onChange={(e) => setOpt(e.target.checked)}
        />
        Opt-in to SMS alerts
      </label>

      <div className="mt-4 flex gap-2">
        <button
          className="rounded-md border px-3 py-1 disabled:opacity-50"
          disabled={saving}
          onClick={save}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}
