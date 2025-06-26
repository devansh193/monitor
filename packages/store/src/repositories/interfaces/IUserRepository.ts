import type { user } from '../../schema/auth-schema';

export type CreateUserInput = typeof user.$inferInsert;
export type UpdateUserInput = Partial<typeof user.$inferSelect>;

export interface IUserRepository {
  findById(id: string): Promise<typeof user.$inferSelect | null>;
  findByEmail(email: string): Promise<typeof user.$inferSelect | null>;
  create(data: CreateUserInput): Promise<typeof user.$inferSelect>;
  update(id: string, data: UpdateUserInput): Promise<typeof user.$inferSelect | null>;
  delete(id: string): Promise<void>;
}
