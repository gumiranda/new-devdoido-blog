import { fetchWorkspace, updateWorkspace } from '../api';

export function setupMySaaSView() {
  let workspaceData: any = null;

  async function load() {
    try {
      const data = await fetchWorkspace();
      workspaceData = data;
      applyState();
    } catch {
      console.error('Failed to load workspace');
    }
  }

  function applyState() {
    if (!workspaceData) return;
    const org = workspaceData.organization;
    const settings = workspaceData.settings;

    if (org) {
      const nameInput = document.getElementById('ms-name') as HTMLInputElement;
      if (nameInput) nameInput.value = org.name ?? '';

      const slugInput = document.getElementById('ms-slug') as HTMLInputElement;
      if (slugInput) slugInput.value = org.slug ?? '';
    }

    if (settings) {
      const descInput = document.getElementById('ms-desc') as HTMLInputElement;
      if (descInput) descInput.value = settings.description ?? '';

      const webInput = document.getElementById('ms-website') as HTMLInputElement;
      if (webInput) webInput.value = settings.website ?? '';

      const instagramInput = document.getElementById('ms-instagram') as HTMLInputElement;
      if (instagramInput) instagramInput.value = settings.instagram ?? '';
    }
  }

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

  document.getElementById('save-mysaas')?.addEventListener('click', async () => {
    const nameEl = document.getElementById('ms-name') as HTMLInputElement;
    const descEl = document.getElementById('ms-desc') as HTMLInputElement;
    const webEl = document.getElementById('ms-website') as HTMLInputElement;
    const instagramEl = document.getElementById('ms-instagram') as HTMLInputElement;

    try {
      await updateWorkspace({
        name: nameEl?.value?.trim() || undefined,
        description: descEl?.value?.trim() || undefined,
        website: webEl?.value?.trim() || undefined,
        instagram: instagramEl?.value?.trim() || undefined,
      });
      window.showToast?.('SaaS atualizado', '// alterações publicadas no blog');
    } catch (err: any) {
      window.showToast?.('Erro', '// ' + (err.message ?? 'falha ao salvar'));
    }
  });

  load();
}
