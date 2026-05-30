export function setupAutomationView() {
  const ruleSwitch = document.getElementById('rule-switch');
  const ruleHead = document.getElementById('rule-head');
  const promptArea = document.getElementById('prompt-area') as HTMLTextAreaElement;
  const promptEditor = document.getElementById('prompt-editor');

  ruleSwitch?.addEventListener('click', () => {
    ruleSwitch.classList.toggle('on');
    const on = ruleSwitch.classList.contains('on');
    ruleHead?.classList.toggle('on', on);
    const label = ruleHead?.querySelector('.rh-t b');
    if (label) label.textContent = on ? 'Automação ativa' : 'Automação pausada';
  });

  function updatePromptChars() {
    if (!promptArea) return;
    document.getElementById('prompt-chars')!.textContent =
      promptArea.value.length.toLocaleString('pt-BR') + ' caracteres';
  }

  if (promptArea) {
    promptArea.addEventListener('input', updatePromptChars);
    promptArea.addEventListener('focus', () => promptEditor?.classList.add('focus'));
    promptArea.addEventListener('blur', () => promptEditor?.classList.remove('focus'));
    updatePromptChars();
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

  document.getElementById('save-automation')?.addEventListener('click', () => {
    window.showToast('Automação salva', '// gerar artigo quando transcrição ficar pronta');
  });

  const testBtn = document.getElementById('test-prompt-btn');
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
      window.showToast('Artigo de teste gerado', '// rascunho pronto para revisão');
    }, 2900);
  });
}
