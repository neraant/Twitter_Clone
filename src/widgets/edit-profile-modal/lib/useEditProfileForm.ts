'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';

import { User } from '@/entities/user';
import { useAuthStore } from '@/features/auth';
import { uploadProfile } from '@/features/image-uploader';
import { useToast } from '@/shared/lib/toast';

import { editProfileAction } from '../api';
import { EditFormData, editModalSchema } from '../lib';

export const useEditProfileForm = (onSuccess?: () => void) => {
  const user = useAuthStore((state) => state.user);
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar_url || null,
  );
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    user?.banner_url || null,
  );

  const form = useForm<EditFormData>({
    resolver: yupResolver(editModalSchema) as Resolver<EditFormData>,
    defaultValues: {
      name: user?.name ?? '',
      telegram: user?.user_telegram ?? '',
      bio: user?.bio ?? '',
      gender: user?.gender ?? '',
    },
  });

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleBannerChange = (file: File | null) => {
    setBannerFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setBannerPreview(previewUrl);
    }
  };

  const onSubmit = async (data: EditFormData) => {
    try {
      if (!user?.id) {
        console.error('No user id available!');
        return;
      }

      setIsLoading(true);

      let avatarUrl = user.avatar_url;
      let bannerUrl = user.banner_url;

      if (avatarFile) {
        try {
          avatarUrl = await uploadProfile(avatarFile, 'avatars', user.id);
        } catch (error) {
          console.error('Avatar upload failed:', error);
          showToast('Error', 'Failed to upload avatar!', 'error');
          return;
        }
      }

      if (bannerFile) {
        try {
          bannerUrl = await uploadProfile(bannerFile, 'banners', user.id);
        } catch (error) {
          console.error('Banner upload failed:', error);
          showToast('Error', 'Failed to upload banner!', 'error');
          return;
        }
      }

      const updatedProfile = await editProfileAction(
        user.id,
        data,
        avatarUrl,
        bannerUrl,
      );

      if (!updatedProfile) {
        throw new Error('Failed to update profile');
      }

      const updatedUser: User = {
        ...user,
        name: updatedProfile.name ?? user.name,
        avatar_url: updatedProfile.avatar_url ?? user.avatar_url,
        banner_url: updatedProfile.banner_url ?? user.banner_url,
        phone_number: updatedProfile.phone_number ?? user.phone_number,
        date_of_birth: updatedProfile.date_of_birth ?? user.date_of_birth,
        updated_at: updatedProfile.updated_at ?? user.updated_at,
        followers_count: updatedProfile.followers_count ?? user.followers_count,
        following_count: updatedProfile.following_count ?? user.following_count,
        user_telegram: updatedProfile.user_telegram ?? user.user_telegram,
        bio: updatedProfile.bio ?? user.bio,
        gender: updatedProfile.gender ?? user.gender,
      };

      useAuthStore.getState().updateCurrentUser(updatedUser);

      showToast('Success', 'Profile updated!', 'success');
      onSuccess?.();
    } catch (error) {
      console.error(error);
      showToast('Error', 'Edit failure!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
    user,
    avatarPreview,
    bannerPreview,
    handleAvatarChange,
    handleBannerChange,
  };
};
