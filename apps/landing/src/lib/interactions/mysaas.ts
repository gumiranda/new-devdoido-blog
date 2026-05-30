export function setupMySaaSView() {
  document.querySelectorAll('#ms-colors [data-color]').forEach((c) => {
    c.addEventListener('click', () => {
      document.querySelectorAll('#ms-colors [data-color]').forEach((x) => x.classList.remove('on'));
      c.classList.add('on');
    });
  });

  function wireUpload(dropId: string, inputId: string) {
    const drop = document.getElementById(dropId);
    if (!drop) return;
    const input = document.getElementById(inputId) as HTMLInputElement;

    function handle(file: File) {
      if (!file?.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        let img = drop?.querySelector('img.preview') as HTMLImageElement | null;
        if (!img) {
          img = document.createElement('img');
          img.className = 'preview';
          drop?.appendChild(img);
        }
        if (e.target?.result) img.src = e.target.result as string;
      };
      reader.readAsDataURL(file);
    }

    input?.addEventListener('change', () => {
      if (input.files?.[0]) handle(input.files[0]);
    });

    drop.addEventListener('dragover', (e) => {
      e.preventDefault();
      drop.style.borderColor = 'var(--lime-500)';
    });

    drop.addEventListener('dragleave', () => {
      drop.style.borderColor = '';
    });

    drop.addEventListener('drop', (e) => {
      e.preventDefault();
      drop.style.borderColor = '';
      if (e.dataTransfer?.files[0]) handle(e.dataTransfer.files[0]);
    });
  }

  wireUpload('ms-cover-drop', 'ms-cover');
  wireUpload('ms-logo-drop', 'ms-logo');

  document.getElementById('save-mysaas')?.addEventListener('click', () => {
    window.showToast('SaaS atualizado', '// alterações publicadas no blog');
  });
}
