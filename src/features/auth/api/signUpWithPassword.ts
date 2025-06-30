import { createClient } from '@/shared/api/supabase/client';
import { routes } from '@/shared/config/routes';

import { RegisterCredentials } from '../model/';

const checkEmailExists = async (email: string) => {
  const res = await fetch(routes.auth.checkEmail, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  return data.exists === true;
};

export const signUpWithPassword = async (credentials: RegisterCredentials) => {
  const emailExists = await checkEmailExists(credentials.email);

  if (emailExists) {
    throw new Error('Email is already registered');
  }

  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        name: credentials.name,
        phone_number: credentials.phoneNumber,
        date_of_birth: credentials.dateOfBirth,
      },
    },
  });

  if (error) throw error;

  return { data };
};
