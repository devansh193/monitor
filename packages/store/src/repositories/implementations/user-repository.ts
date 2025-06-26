import type {
  IUserRepository,
  CreateUserInput,
  UpdateUserInput,
} from '../interfaces/IUserRepository';

import { user } from '../../schema/auth-schema';
import { eq } from 'drizzle-orm';
import db from '../../client';

export class UserRepository implements IUserRepository {
  async findById(userId: string): Promise<typeof user.$inferSelect | null> {
    if (!userId) throw new Error('UserId is required');
    const [user_detail] = await db.select().from(user).where(eq(user.id, userId));
    return user_detail ?? null;
  }

  async findByEmail(email: string): Promise<typeof user.$inferSelect | null> {
    if (!email) throw new Error('Email is required.');
    const [user_detail] = await db.select().from(user).where(eq(user.email, email));
    return user_detail ?? null;
  }

  async create(input: CreateUserInput): Promise<typeof user.$inferSelect> {
    if (!input.name || !input.email) throw new Error('Invalid input: email and name required');
    const [createdUser] = await db.insert(user).values(input).returning();
    if (!createdUser) {
      throw new Error('User creation failed');
    }
    return createdUser;
  }

  async update(userId: string, input: UpdateUserInput): Promise<typeof user.$inferSelect | null> {
    if (!userId) throw new Error('UserId is required');
    const [updatedUser] = await db.update(user).set(input).where(eq(user.id, userId)).returning();
    return updatedUser ?? null;
  }

  async delete(userId: string): Promise<void> {
    await db.delete(user).where(eq(user.id, userId));
  }
}
