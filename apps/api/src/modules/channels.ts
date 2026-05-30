import { Elysia } from 'elysia';
import { db } from '../db/client';
import { authGuard } from '../auth/guard';
import * as schema from '../db/schema';
import { and, eq } from 'drizzle-orm';

export const channelsModule = new Elysia({ prefix: '/channels' })
  .use(authGuard)
  .get('/', async ({ workspaceId }) => {
    const channels = await db.query.channel.findMany({
      where: (ch, { eq: e }) => e(ch.workspaceId, workspaceId),
    });

    return channels.map((ch) => ({
      id: ch.id,
      name: ch.name,
      handle: ch.handle,
      youtubeChannelId: ch.youtubeChannelId,
      color: ch.color,
      letter: ch.letter,
      subscribers: ch.subscribers,
      lastVideoLabel: ch.lastVideoLabel,
      active: ch.active,
    }));
  })
  .post('/', async ({ workspaceId, body }: any) => {
    const [conn] = await db.query.googleConnection.findMany({
      where: (gc, { eq: e }) => e(gc.workspaceId, workspaceId),
    });
    if (!conn) throw new Error('No Google connection found');

    const [channel] = await db
      .insert(schema.channel)
      .values({
        workspaceId,
        googleConnectionId: conn.id,
        name: body.name,
        handle: body.handle,
        youtubeChannelId: body.youtubeChannelId ?? '',
        color: body.color ?? 'linear-gradient(135deg,#8257e6,#6420aa)',
        letter: body.name[0].toUpperCase(),
        subscribers: body.subscribers ?? 0,
        active: true,
      })
      .returning();

    return channel;
  })
  .patch('/:id', async ({ workspaceId, params, body }: any) => {
    const [channel] = await db
      .update(schema.channel)
      .set({ active: body.active, updatedAt: new Date() })
      .where(
        and(eq(schema.channel.id, params.id), eq(schema.channel.workspaceId, workspaceId))
      )
      .returning();

    return channel;
  });
