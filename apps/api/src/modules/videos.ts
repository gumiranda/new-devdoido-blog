import { Elysia } from 'elysia';
import { db } from '../db/client';
import { authGuard } from '../auth/guard';


export const videosModule = new Elysia({ prefix: '/videos' })
  .use(authGuard)
  .get('/', async () => {
    const videos = await db.query.video.findMany({
      with: { channel: true },
      orderBy: (v, { desc: d }) => [d(v.createdAt)],
    });

    return videos.map((v) => ({
      id: v.id,
      title: v.title,
      durationSeconds: v.durationSeconds,
      publishedAt: v.publishedAt,
      wordCount: v.wordCount,
      status: v.status,
      thumbGrad: v.thumbGrad,
      channel: v.channel ? {
        name: v.channel.name,
        color: v.channel.color,
        letter: v.channel.letter,
      } : null,
    }));
  })
  .get('/:id/transcript', async ({ params }: any) => {
    const video = await db.query.video.findFirst({
      where: (v, { eq: e }) => e(v.id, params.id),
    });
    if (!video) throw new Error('Video not found');
    return { id: video.id, title: video.title, transcript: video.transcript };
  });
