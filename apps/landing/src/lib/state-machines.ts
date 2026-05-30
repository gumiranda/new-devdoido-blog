import { api } from './eden';
import { loginUrl } from './auth-client';

declare global {
  interface Window {
    showToast: (msg: string, sub?: string) => void;
    openOauth: () => void;
    closeOauth: () => void;
    openAddChannel: () => void;
    closeAddChannel: () => void;
    openCheckout: (state: CheckoutState) => void;
    closeCheckout: () => void;
    openDrawer: (video: any) => void;
    closeDrawer: () => void;
    setConnected: (connected: boolean) => void;
  }
}

export interface CheckoutState {
  kind: 'topup' | 'sub';
  credits: number;
  price: number;
  label: string;
  sub: string;
  method: 'pix' | 'card';
  planName?: string;
}

export function getConnected(): boolean {
  return typeof localStorage !== 'undefined' && localStorage.getItem('pipeline-connected') === 'true';
}

export function setConnected(value: boolean): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('pipeline-connected', String(value));
  }
  window.dispatchEvent(new CustomEvent('pipeline-connection-changed', { detail: { connected: value } }));
}

export function setupOAuthFlow() {
  const overlay = document.getElementById('oauth-overlay')!;

  function showStep(n: number) {
    overlay.querySelectorAll('.step').forEach((s) => {
      s.classList.toggle('active', s.getAttribute('data-step') === String(n));
    });
  }

  window.openOauth = () => {
    showStep(1);
    const accountPick = document.getElementById('gc-account-pick');
    const consent = document.getElementById('gc-consent');
    const allowBtn = document.getElementById('gc-allow');
    if (accountPick) accountPick.style.display = 'block';
    if (consent) consent.style.display = 'none';
    if (allowBtn) allowBtn.style.display = 'none';
    overlay.classList.add('open');
  };

  window.closeOauth = () => {
    const onSuccess = overlay.querySelector('.step[data-step="3"]')?.classList.contains('active');
    if (onSuccess) {
      setConnected(true);
    }
    overlay.classList.remove('open');
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) window.closeOauth();
  });

  overlay.querySelectorAll('[data-close-oauth]').forEach((b) => {
    b.addEventListener('click', () => window.closeOauth());
  });

  document.getElementById('to-step-2')?.addEventListener('click', () => showStep(2));

  document.getElementById('pick-acct')?.addEventListener('click', () => {
    const accountPick = document.getElementById('gc-account-pick');
    const consent = document.getElementById('gc-consent');
    const allowBtn = document.getElementById('gc-allow');
    if (accountPick) accountPick.style.display = 'none';
    if (consent) consent.style.display = 'block';
    if (allowBtn) allowBtn.style.display = 'inline-block';
  });

  document.getElementById('gc-allow')?.addEventListener('click', () => showStep(3));

  document.getElementById('go-channels')?.addEventListener('click', () => {
    setConnected(true);
    window.closeOauth();
    window.location.href = '/admin/pipeline/channels';
  });
}

export function setupAddChannelFlow() {
  const overlay = document.getElementById('addchan-overlay')!;

  function doSearch() {
    const input = document.getElementById('chan-input') as HTMLInputElement;
    if (!input.value.trim()) return;
    document.getElementById('chan-result')!.classList.add('show');
    document.getElementById('chan-search-btn')!.style.display = 'none';
    document.getElementById('chan-add-btn')!.style.display = 'inline-flex';
  }

  window.openAddChannel = () => {
    (document.getElementById('chan-input') as HTMLInputElement).value = '';
    document.getElementById('chan-result')!.classList.remove('show');
    document.getElementById('chan-search-btn')!.style.display = 'inline-flex';
    document.getElementById('chan-add-btn')!.style.display = 'none';
    overlay.classList.add('open');
    setTimeout(() => document.getElementById('chan-input')!.focus(), 50);
  };

  window.closeAddChannel = () => overlay.classList.remove('open');

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) window.closeAddChannel();
  });

  overlay.querySelectorAll('[data-close-addchan]').forEach((b) => {
    b.addEventListener('click', () => window.closeAddChannel());
  });

  document.getElementById('chan-search-btn')?.addEventListener('click', doSearch);

  document.getElementById('chan-input')?.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter') doSearch();
  });

  document.getElementById('chan-add-btn')?.addEventListener('click', () => {
    window.closeAddChannel();
    window.showToast('Canal adicionado', '// entrará na próxima execução');
  });
}

// UI selection → API body. Amounts are NEVER sent — the server prices the
// chosen pack/plan (see apps/api lib/plans.ts). null = unmappable selection.
const PACK_INDEX_BY_CREDITS: Record<number, number> = { 1000: 0, 5000: 1, 15000: 2 };
const API_PLAN_BY_LABEL: Record<string, 'pro' | 'scale'> = { Pro: 'pro', Scale: 'scale' };
const PAY_LABEL = { pix: 'Pagar com Pix', card: 'Pagar com cartão' } as const;

type CheckoutBody = {
  kind: 'topup' | 'subscription';
  method: 'pix' | 'card';
  packIndex?: number;
  planName?: 'pro' | 'scale';
};

function checkoutBody(s: CheckoutState): CheckoutBody | null {
  if (s.kind === 'sub') {
    const planName = API_PLAN_BY_LABEL[s.planName ?? ''];
    if (!planName) return null;
    return { kind: 'subscription', method: s.method, planName };
  }
  const packIndex = PACK_INDEX_BY_CREDITS[s.credits];
  if (packIndex === undefined) return null;
  return { kind: 'topup', method: s.method, packIndex };
}

function describeError(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'error' in value) {
    return String((value as { error: unknown }).error);
  }
  return 'erro inesperado';
}

export function setupCheckoutFlow() {
  const overlay = document.getElementById('checkout-overlay')!;
  let state: CheckoutState = { kind: 'topup', credits: 5000, price: 79, label: 'Pacote 5.000 créditos', sub: 'recarga avulsa', method: 'pix' };

  function coStep(s: string) {
    overlay.querySelectorAll('.step').forEach((st) => {
      st.classList.toggle('active', st.getAttribute('data-co-step') === s);
    });
  }

  function renderCheckout() {
    const disc = state.method === 'pix' ? +(state.price * 0.05).toFixed(2) : 0;
    const total = state.price - disc;

    document.getElementById('co-credits')!.textContent = formatBr(state.credits) + ' cr';
    document.getElementById('co-credits-sub')!.textContent = state.sub;
    document.getElementById('co-item-label')!.textContent = state.label;
    document.getElementById('co-item-price')!.textContent = formatBrCurrency(state.price);
    document.getElementById('co-discount')!.textContent = '−' + formatBrCurrency(disc);
    document.getElementById('co-total')!.textContent = formatBrCurrency(total);
    document.getElementById('co-pay-btn')!.textContent = state.method === 'pix' ? 'Pagar com Pix' : 'Pagar com cartão';
    document.getElementById('co-title')!.textContent = state.kind === 'sub' ? 'Assinar plano ' + (state.planName ?? '') : 'Comprar créditos';

    overlay.querySelectorAll('.pay-panel').forEach((p) => {
      p.classList.toggle('active', p.getAttribute('data-panel') === state.method);
    });

    overlay.querySelectorAll('#pay-methods .pay-method').forEach((m) => {
      m.classList.toggle('on', m.getAttribute('data-method') === state.method);
    });

    if (state.method === 'pix') genPixQR();
  }

  function formatBr(n: number): string {
    return n.toLocaleString('pt-BR');
  }

  function formatBrCurrency(n: number): string {
    return 'R$ ' + n.toFixed(2).replace('.', ',');
  }

  function genPixQR() {
    const svg = document.getElementById('pix-qr-svg');
    if (!svg) return;
    const cells = 25;
    let html = '<rect width="100" height="100" fill="#fff"/>';
    for (let y = 0; y < cells; y++) {
      for (let x = 0; x < cells; x++) {
        if ((x * 7 + y * 13 + x * y) % 3 === 0) {
          html += `<rect x="${x * 4}" y="${y * 4}" width="4" height="4" fill="#0a0a0a"/>`;
        }
      }
    }
    [[0, 0], [0, 84], [84, 0]].forEach(([px, py]) => {
      html += `<rect x="${px}" y="${py}" width="16" height="16" fill="#fff"/>`;
      html += `<rect x="${px + 2}" y="${py + 2}" width="12" height="12" fill="#0a0a0a"/>`;
      html += `<rect x="${px + 5}" y="${py + 5}" width="6" height="6" fill="#fff"/>`;
    });
    svg.innerHTML = html;
  }

  function reflectBalance(balance: number) {
    const el = document.getElementById('cb-balance');
    if (el) el.textContent = formatBr(balance);
  }

  function resetPayButton() {
    const btn = document.getElementById('co-pay-btn') as HTMLButtonElement;
    btn.disabled = false;
    btn.textContent = PAY_LABEL[state.method];
    if (state.method === 'pix') {
      const st = document.getElementById('pix-status');
      if (st) {
        st.className = 'pix-status';
        st.innerHTML = '<span class="dot"></span> aguardando pagamento...';
      }
    }
  }

  // Real credits/balance come from the API response, not the UI selection.
  function finishCheckout(credits: number, balance: number) {
    const btn = document.getElementById('co-pay-btn') as HTMLButtonElement;
    btn.disabled = false;
    btn.textContent = PAY_LABEL[state.method];

    if (state.method === 'pix') {
      const st = document.getElementById('pix-status');
      if (st) {
        st.className = 'pix-status paid';
        st.innerHTML = '<span class="dot"></span> pagamento recebido!';
      }
    }

    document.getElementById('co-success-credits')!.textContent = '+' + formatBr(credits) + ' créditos';
    document.getElementById('co-success-msg')!.textContent = state.kind === 'sub'
      ? 'Plano ' + (state.planName ?? '') + ' ativado! Sua franquia mensal já está no saldo.'
      : 'Seus créditos avulsos já estão disponíveis.';

    reflectBalance(balance);
    coStep('success');
    window.showToast(
      state.kind === 'sub' ? 'Plano ativado' : 'Créditos adicionados',
      '// +' + formatBr(credits) + ' cr · saldo ' + formatBr(balance) + ' via ' + (state.method === 'pix' ? 'Abacate Pay' : 'Stripe')
    );
  }

  // POST the chosen pack/plan; the server prices it and credits the wallet.
  async function submitCheckout() {
    const body = checkoutBody(state);
    if (!body) {
      window.showToast('Seleção inválida', '// pacote ou plano não reconhecido');
      resetPayButton();
      return;
    }

    const { data, error } = await api.billing.checkout.post(body);
    if (error) {
      if (error.status === 401) {
        window.location.href = loginUrl();
        return;
      }
      window.showToast('Falha no pagamento', '// ' + describeError(error.value));
      resetPayButton();
      return;
    }

    finishCheckout(data.payment.credits, data.balance);
  }

  window.openCheckout = (s: CheckoutState) => {
    state = { ...s };
    coStep('pay');
    renderCheckout();
    overlay.classList.add('open');
  };

  window.closeCheckout = () => overlay.classList.remove('open');

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) window.closeCheckout();
  });

  overlay.querySelectorAll('[data-close-checkout]').forEach((b) => {
    b.addEventListener('click', () => window.closeCheckout());
  });

  document.getElementById('pay-methods')?.addEventListener('click', (e) => {
    const m = (e.target as HTMLElement).closest('.pay-method');
    if (!m) return;
    state.method = m.getAttribute('data-method') as 'pix' | 'card';
    renderCheckout();
  });

  document.getElementById('pix-copy-btn')?.addEventListener('click', () => {
    const inp = document.getElementById('pix-code') as HTMLInputElement;
    inp.select();
    const btn = document.getElementById('pix-copy-btn')!;
    btn.textContent = 'copiado!';
    setTimeout(() => { btn.textContent = 'copiar'; }, 1500);
    window.showToast('Código Pix copiado', '// cole no app do seu banco');
  });

  document.getElementById('co-pay-btn')?.addEventListener('click', () => {
    const btn = document.getElementById('co-pay-btn') as HTMLButtonElement;
    btn.disabled = true;
    if (state.method === 'pix') {
      const st = document.getElementById('pix-status')!;
      st.className = 'pix-status';
      st.innerHTML = '<span class="dot"></span> aguardando pagamento...';
      btn.textContent = 'aguardando Pix...';
    } else {
      btn.textContent = 'processando...';
    }
    void submitCheckout();
  });

  document.getElementById('buy-credits-btn')?.addEventListener('click', () => {
    window.openCheckout({ kind: 'topup', credits: 5000, price: 79, label: 'Pacote 5.000 créditos', sub: 'recarga avulsa', method: 'pix' });
  });

  document.querySelectorAll('.pack').forEach((pk) => {
    pk.addEventListener('click', () => {
      const cr = parseInt(pk.getAttribute('data-pack')!, 10);
      const pr = parseInt(pk.getAttribute('data-price')!, 10);
      window.openCheckout({ kind: 'topup', credits: cr, price: pr, label: 'Pacote ' + formatBr(cr) + ' créditos', sub: 'recarga avulsa', method: 'pix' });
    });
  });

  document.querySelectorAll('.plan-tier [data-plan]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const plan = btn.getAttribute('data-plan')!;
      const amt = parseInt(btn.getAttribute('data-amount')!, 10);
      if (btn.textContent?.trim() === 'Plano atual') {
        window.showToast('Já é seu plano', '// plano ' + plan + ' ativo');
        return;
      }
      const planCredits = plan === 'Scale' ? 12000 : 3000;
      window.openCheckout({ kind: 'sub', planName: plan, credits: planCredits, price: amt, label: 'Assinatura ' + plan + ' · mensal', sub: 'franquia mensal', method: 'pix' });
    });
  });
}

export function setupDrawer() {
  const drawer = document.getElementById('drawer')!;
  const drawerOverlay = document.getElementById('drawer-overlay')!;

  window.openDrawer = (video) => {
    if (video.status !== 'done') {
      window.showToast('Transcrição ainda não disponível', '// status: ' + (video.status === 'proc' ? 'transcrevendo' : 'na fila'));
      return;
    }
    document.getElementById('dv-title')!.textContent = video.title;
    document.getElementById('dv-chan')!.textContent = video.chName;
    document.getElementById('dv-words')!.textContent = video.words + ' palavras';
    document.getElementById('dv-thumb')!.style.background = video.thumbGrad;
    const durEl = document.querySelector('#dv-thumb .dur');
    if (durEl) durEl.textContent = video.dur;
    drawer.classList.add('open');
    drawerOverlay.classList.add('open');
  };

  window.closeDrawer = () => {
    drawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
  };

  document.getElementById('drawer-close')?.addEventListener('click', window.closeDrawer);
  drawerOverlay.addEventListener('click', window.closeDrawer);

  document.getElementById('copy-transcript')?.addEventListener('click', () => {
    window.showToast('Transcrição copiada', '// texto na área de transferência');
  });
}

export function setupToast() {
  window.showToast = (msg, sub) => {
    const toast = document.getElementById('toast')!;
    document.getElementById('toast-msg')!.textContent = msg;
    document.getElementById('toast-sub')!.textContent = sub || '';
    toast.classList.add('show');
    clearTimeout((toast as any)._timer);
    (toast as any)._timer = setTimeout(() => toast.classList.remove('show'), 2600);
  };
}

export function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeDrawer();
      window.closeOauth();
      window.closeAddChannel();
    }
  });
}
