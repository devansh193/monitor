import type { Website } from '../../schema/website';

export type CreateWebsiteInput = Omit<Website, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateWebsiteInput = Partial<Omit<Website, 'id' | 'createdAt' | 'updatedAt'>>;

export interface IWebsiteRepository {
  findById(id: string): Promise<Website | null>;
  findAllWebsitesByUserId(userId: string): Promise<Website[]>;
  create(data: CreateWebsiteInput): Promise<Website>;
  update(websiteId: string, data: UpdateWebsiteInput): Promise<Website | null>;
  delete(websiteId: string): Promise<void>;
}
