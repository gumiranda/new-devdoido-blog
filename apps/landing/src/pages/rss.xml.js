import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
  return rss({
    title: 'Data Center Uberlândia',
    description: 'Monitoramento independente dos impactos ambientais e socioeconômicos de data centers em Uberlândia (MG).',
    site: context.site ?? 'https://datacenteruberlandia.com.br',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.slug}`,
    })),
  });
}
