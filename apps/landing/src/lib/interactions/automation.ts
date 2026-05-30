import { fetchAutomation, updateAutomation } from '../api';

export function setupAutomationView() {
  const ruleSwitch = document.getElementById('rule-switch');
  const ruleHead = document.getElementById('rule-head');
  const promptArea = document.getElementById('prompt-area') as HTMLTextAreaElement;
  const promptEditor = document.getElementById('prompt-editor');
  const saveBtn = document.getElementById('save-automation');
  const testBtn = document.getElementById('test-prompt-btn');

  let automationData: any = null;

  async function load() {
    try {
      automationData = (await fetchAutomation()) ?? {};
    } catch {
      automationData = {};
    }
    applyState();
  }

  function applyState() {
    if (!automationData) return;

    if (ruleSwitch) {
      if (automationData.enabled) ruleSwitch.classList.add('on');
      else ruleSwitch.classList.remove('on');
    }
    if (ruleHead) {
      if (automationData.enabled) ruleHead.classList.add('on');
      else ruleHead.classList.remove('on');
      const label = ruleHead.querySelector('.rh-t b');
      if (label) label.textContent = automationData.enabled ? 'Automação ativa' : 'Automação pausada';
    }
    if (promptArea && automationData.promptTemplate) {
      promptArea.value = automationData.promptTemplate;
      updatePromptChars();
    }
  }

  async function save() {
    if (!automationData) return;
    const enabled = ruleSwitch?.classList.contains('on') ?? false;
    const promptTemplate = promptArea?.value;
    try {
      await updateAutomation({ enabled, promptTemplate, generateOnTranscript: true });
      window.showToast?.('Automação salva', '// gerar artigo quando transcrição ficar pronta');
    } catch (err: any) {
      window.showToast?.('Erro', '// ' + (err.message ?? 'falha ao salvar'));
    }
  }

  ruleSwitch?.addEventListener('click', () => {
    ruleSwitch.classList.toggle('on');
  });

  function updatePromptChars() {
    if (!promptArea) return;
    const el = document.getElementById('prompt-chars');
    if (el) el.textContent = promptArea.value.length.toLocaleString('pt-BR') + ' caracteres';
  }

  if (promptArea) {
    promptArea.addEventListener('input', updatePromptChars);
    promptArea.addEventListener('focus', () => promptEditor?.classList.add('focus'));
    promptArea.addEventListener('blur', () => promptEditor?.classList.remove('focus'));
  }

  document.querySelectorAll('.var-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      if (!promptArea) return;
      const v = chip.getAttribute('data-var')!;
      const start = promptArea.selectionStart;
      const end = promptArea.selectionEnd;
      const val = promptArea.value;
      promptArea.value = val.slice(0, start) + v + val.slice(end);
      const pos = start + v.length;
      promptArea.focus();
      promptArea.setSelectionRange(pos, pos);
      updatePromptChars();
    });
  });

  document.querySelectorAll('#model-row .model-opt').forEach((m) => {
    m.addEventListener('click', () => {
      document.querySelectorAll('#model-row .model-opt').forEach((x) => x.classList.remove('on'));
      m.classList.add('on');
    });
  });

  document.querySelectorAll('[data-view="automation"] [data-check]').forEach((c) => {
    c.addEventListener('click', () => c.classList.toggle('on'));
  });

  saveBtn?.addEventListener('click', save);

  testBtn?.addEventListener('click', () => {
    const loading = document.getElementById('gen-loading');
    const output = document.getElementById('gen-output');
    const steps = document.getElementById('gl-steps');
    output?.classList.remove('show');
    loading?.classList.add('show');
    testBtn.setAttribute('disabled', 'true');

    const msgs = [
      'lendo transcrição...',
      'aplicando prompt...',
      'gerando com Claude Sonnet 4.5...',
      'estruturando seções...',
      'criando slug e tags...',
    ];
    let i = 0;
    const iv = setInterval(() => {
      i++;
      if (i < msgs.length && steps) steps.textContent = msgs[i];
    }, 520);

    setTimeout(() => {
      clearInterval(iv);
      loading?.classList.remove('show');
      output?.classList.add('show');
      testBtn.removeAttribute('disabled');
      window.showToast?.('Artigo de teste gerado', '// rascunho pronto para revisão');
    }, 2900);
  });

  load();
}
