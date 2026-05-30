export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

export function formatNumber(n: number): string {
  return n.toLocaleString('pt-BR');
}

export function formatBRL(n: number): string {
  return 'R$ ' + n.toFixed(2).replace('.', ',');
}

export function formatViews(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  if (n === 0) return '—';
  return String(n);
}

export function formatDate(dateStr: string): string {
  return dateStr;
}
