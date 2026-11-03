'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/mylinks/supabase/client';
import { GOOGLE_GSI_SCRIPT_SRC, generateNonce, googleClientId, sha256Hex } from '@/lib/mylinks/google-identity';

/**
 * "Continue with Google", drawn by Google Identity Services on our page.
 * Google hands back an ID token; Supabase verifies it and makes the session.
 * See lib/mylinks/google-identity.ts for why this and not signInWithOAuth.
 *
 * Renders nothing without NEXT_PUBLIC_GOOGLE_CLIENT_ID, so a build without the
 * id falls back to magic link only, never to a button that opens an error.
 */

type GsiCredentialResponse = { credential?: string };
type GoogleAccountsId = {
  initialize: (config: {
    client_id: string;
    callback: (response: GsiCredentialResponse) => void;
    nonce?: string;
    ux_mode?: 'popup' | 'redirect';
    itp_support?: boolean;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      type?: 'standard' | 'icon';
      theme?: 'outline' | 'filled_blue' | 'filled_black';
      size?: 'large' | 'medium' | 'small';
      text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
      shape?: 'rectangular' | 'pill' | 'circle' | 'square';
      width?: number;
    }
  ) => void;
};
declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleAccountsId } };
  }
}

export function GoogleSignInButton({ nextPath }: { nextPath: string }) {
  const clientId = googleClientId();
  const host = useRef<HTMLDivElement>(null);
  const rawNonce = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [state, setState] = useState<'idle' | 'exchanging' | 'failed'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!scriptReady || !clientId || !host.current) return;
    const gsi = window.google?.accounts?.id;
    if (!gsi) return;
    const parent = host.current;
    let cancelled = false;

    (async () => {
      // One nonce per rendered button: the HASH goes to Google, the RAW value stays here for Supabase.
      const raw = generateNonce();
      rawNonce.current = raw;
      const hashed = await sha256Hex(raw);
      if (cancelled) return;

      gsi.initialize({
        client_id: clientId,
        nonce: hashed,
        ux_mode: 'popup',
        itp_support: true,
        callback: async (response) => {
          if (!response.credential || !rawNonce.current) {
            setState('failed');
            setMessage('Google did not return a sign-in. Try again.');
            return;
          }
          setState('exchanging');
          setMessage(null);
          const { error } = await createClient().auth.signInWithIdToken({
            provider: 'google',
            token: response.credential,
            nonce: rawNonce.current,
          });
          if (error) {
            setState('failed');
            setMessage(error.message);
            return;
          }
          // Full page load so the server sees the fresh session cookies on first paint.
          window.location.assign(nextPath);
        },
      });
      parent.replaceChildren();
      gsi.renderButton(parent, { type: 'standard', theme: 'outline', size: 'large', text: 'continue_with', shape: 'pill', width: 320 });
    })();

    return () => {
      cancelled = true;
    };
  }, [scriptReady, clientId, nextPath]);

  if (!clientId) return null;

  return (
    <div className="space-y-2">
      <Script src={GOOGLE_GSI_SCRIPT_SRC} strategy="afterInteractive" onLoad={() => setScriptReady(true)} />
      <div ref={host} className="min-h-[44px]" aria-busy={state === 'exchanging'} />
      {state === 'exchanging' ? <p className="text-sm text-muted-foreground">Signing you in...</p> : null}
      {message ? <p className="text-sm text-red-600">{message}</p> : null}
    </div>
  );
}
