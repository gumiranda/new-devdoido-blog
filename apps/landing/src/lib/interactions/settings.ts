export function setupSettingsView() {
  document.querySelectorAll('#settings-tabs .st-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const t = tab.getAttribute('data-tab');
      document.querySelectorAll('#settings-tabs .st-tab').forEach((x) => x.classList.toggle('active', x === tab));
      document.querySelectorAll('.set-panel').forEach((p) => {
        p.classList.toggle('active', p.getAttribute('data-panel') === t);
      });
    });
  });

  document.querySelectorAll('[data-reveal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const inp = (btn as HTMLElement).parentElement?.querySelector('input');
      if (!inp) return;
      if (inp.type === 'password') {
        inp.type = 'text';
        (btn as HTMLElement).textContent = 'ocultar';
      } else {
        inp.type = 'password';
        (btn as HTMLElement).textContent = 'mostrar';
      }
    });
  });

  document.querySelectorAll('.set-panel [data-switch]').forEach((sw) => {
    sw.addEventListener('click', () => sw.classList.toggle('on'));
  });
}
