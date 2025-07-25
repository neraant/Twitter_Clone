import * as yup from 'yup';

import { postSchema } from '@/shared/lib/validations';

export const addTweetSchema = postSchema;

export type AddTweetFormData = yup.InferType<typeof addTweetSchema>;
