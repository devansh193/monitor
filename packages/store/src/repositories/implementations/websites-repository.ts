import type {
  CreateWebsiteInput,
  IWebsiteRepository,
  UpdateWebsiteInput,
} from '../interfaces/IWebsiteRepository';
import { websites, type Website as WebsiteSchema } from '../../schema/website';
import { db } from '../../client';
import { eq } from 'drizzle-orm';

export class WebsitesRepository implements IWebsiteRepository {
  async findById(id: string): Promise<WebsiteSchema | null> {
    if (!id) throw new Error('Website ID is required');
    const [website] = await db.select().from(websites).where(eq(websites.id, id)).limit(1);
    if (!website) {
      console.warn(`Website with ID: ${id} not found`);
    }
    return website ?? null;
  }

  async findAllWebsitesByUserId(userId: string): Promise<WebsiteSchema[]> {
    if (!userId) throw new Error('User ID is required');
    const allWebsites = await db.select().from(websites).where(eq(websites.userId, userId));
    if (allWebsites.length === 0) {
      console.warn(`No websites found for user ID: ${userId}`);
    }
    return allWebsites;
  }

  async create(data: CreateWebsiteInput): Promise<WebsiteSchema> {
    if (!data.userId || !data.name || !data.url)
      throw new Error('Invalid input: userId, name, and url are required');
    const [createdWebsite] = await db.insert(websites).values(data).returning();
    if (!createdWebsite) {
      throw new Error('Website creation failed');
    }
    return createdWebsite;
  }

  async update(websiteId: string, data: UpdateWebsiteInput): Promise<WebsiteSchema | null> {
    if (!websiteId) throw new Error('Website ID is required');
    if (Object.keys(data).length === 0) {
      throw new Error('No data provided for update');
    }
    const [updatedWebsite] = await db
      .update(websites)
      .set(data)
      .where(eq(websites.id, websiteId))
      .returning();
    if (!updatedWebsite) {
      console.warn(`Website with ID: ${websiteId} not found for update`);
    }
    return updatedWebsite ?? null;
  }

  async delete(websiteId: string): Promise<void> {
    if (!websiteId) throw new Error('Website ID is required');
    const result = await db.delete(websites).where(eq(websites.id, websiteId));
    if (result.rowCount === 0) {
      throw new Error(`Website with ID: ${websiteId} not found`);
    }
  }
}
