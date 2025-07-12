'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';

import { User } from '@/entities/user';
import { useAuthStore } from '@/features/auth';
import { uploadSingleImage } from '@/features/image-uploader';
import { StorageFolders } from '@/shared/lib/database';
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
    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleBannerChange = (file: File | null) => {
    if (bannerPreview && bannerPreview.startsWith('blob:')) {
      URL.revokeObjectURL(bannerPreview);
    }

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
          const uploadResult = await uploadSingleImage(
            avatarFile,
            StorageFolders.avatars,
            user.id,
            true,
          );
          avatarUrl = uploadResult.url;
        } catch (error) {
          console.error('Avatar upload failed:', error);
          showToast('Error', 'Failed to upload avatar!', 'error');
          return;
        }
      }

      if (bannerFile) {
        try {
          const uploadResult = await uploadSingleImage(
            bannerFile,
            StorageFolders.banners,
            user.id,
            true,
          );
          bannerUrl = uploadResult.url;
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

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
      if (bannerPreview && bannerPreview.startsWith('blob:')) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [avatarPreview, bannerPreview]);

  const watchFields = form.watch(['name', 'telegram', 'bio', 'gender']);
  const isFormChanged =
    watchFields[0] !== user?.name ||
    watchFields[1] !== user?.user_telegram ||
    watchFields[2] !== user?.bio ||
    watchFields[3] !== user?.gender;

  const isAvatarChanged = avatarPreview !== user?.avatar_url;
  const isBannerChanged = bannerPreview !== user?.banner_url;

  const isChanged = isFormChanged || isAvatarChanged || isBannerChanged;

  return {
    form,
    isLoading,
    user,
    avatarPreview,
    bannerPreview,
    isChanged,
    onSubmit,
    handleAvatarChange,
    handleBannerChange,
  };
};
