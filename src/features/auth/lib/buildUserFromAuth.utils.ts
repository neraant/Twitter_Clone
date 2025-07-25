import { User as SupabaseAuthUser } from '@supabase/supabase-js';

import { User } from '@/entities/user';
import { Database } from '@/shared/lib/database';

type Profile = Database['public']['Tables']['users']['Row'];

export const buildUserFromAuth = (
  authUser: SupabaseAuthUser,
  profile: Profile | null,
): User => {
  return {
    id: authUser.id,
    email: authUser.email!,
    name: profile?.name ?? authUser.email!,
    avatar_url: profile?.avatar_url ?? null,
    phone_number: profile?.phone_number ?? null,
    date_of_birth: profile?.date_of_birth ?? null,
    created_at: profile?.created_at ?? new Date().toISOString(),
    updated_at: profile?.updated_at ?? null,
    followers_count: profile?.followers_count ?? 0,
    following_count: profile?.following_count ?? 0,
  };
};
