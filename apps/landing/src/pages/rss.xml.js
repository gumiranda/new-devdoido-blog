import rss from '@astrojs/rss';
import { posts, SITE } from '../data/devdoido';

export async function GET(context) {
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.title,
      description: post.description,
      pubDate: new Date(`${post.pubDate}T12:00:00-03:00`),
      link: `/blog/${post.slug}`,
    })),
  });
}
