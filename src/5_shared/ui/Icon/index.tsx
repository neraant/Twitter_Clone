import BackIconSvg from '@assets/icons/back_icon.svg';
import BookmarksIconSvg from '@assets/icons/bookmarks_icon.svg';
import CrossIconSvg from '@assets/icons/cross_icon.svg';
import DotsIconSvg from '@assets/icons/dots_icon.svg';
import DropdownIconSvg from '@assets/icons/dropdown_icon.svg';
import ErrorIconSvg from '@assets/icons/error_icon.svg';
import ExploreIconSvg from '@assets/icons/explore_icon.svg';
import EyeCrossedIconSvg from '@assets/icons/eye-crossed_icon.svg';
import GoogleLogoIconSvg from '@assets/icons/google-logo_icon.svg';
import HomeOutlineIconSvg from '@assets/icons/home-outline_icon.svg';
import ImageIconSvg from '@assets/icons/image_icon.svg';
import LikeIconSvg from '@assets/icons/like_icon.svg';
import ListsIconSvg from '@assets/icons/lists_icon.svg';
import LoaderIconSvg from '@assets/icons/loader_icon.svg';
import MessagesIconSvg from '@assets/icons/messages_icon.svg';
import MoreIconSvg from '@assets/icons/more_icon.svg';
import NotificationIconSvg from '@assets/icons/notification_icon.svg';
import ProfileOutlineIconSvg from '@assets/icons/profile-outline_icon.svg';
import SearchIconSvg from '@assets/icons/search_icon.svg';
import SettingsIconSvg from '@assets/icons/settings_icon.svg';
import SuccessIconSvg from '@assets/icons/success_icon.svg';
import TwitterLogoIconSvg from '@assets/icons/twitter-logo_icon.svg';
import { FC, SVGProps } from 'react';

export type IconProps = Partial<SVGProps<SVGSVGElement>>;

const DEFAULT_SIZE = 15;

/* eslint-disable react/display-name */
const createIcon =
  (Icon: FC<IconProps>): FC<IconProps> =>
  (props) => <Icon width={DEFAULT_SIZE} height={DEFAULT_SIZE} {...props} />;

export const EyeCrossedIcon = createIcon(EyeCrossedIconSvg);
export const BackIcon = createIcon(BackIconSvg);
export const BookmarksIcon = createIcon(BookmarksIconSvg);
export const CrossIcon = createIcon(CrossIconSvg);
export const DotsIcon = createIcon(DotsIconSvg);
export const ErrorIcon = createIcon(ErrorIconSvg);
export const ExploreIcon = createIcon(ExploreIconSvg);
export const GoogleLogoIcon = createIcon(GoogleLogoIconSvg);
export const HomeOutlineIcon = createIcon(HomeOutlineIconSvg);
export const ImageIcon = createIcon(ImageIconSvg);
export const LikeIcon = createIcon(LikeIconSvg);
export const ListsIcon = createIcon(ListsIconSvg);
export const LoaderIcon = createIcon(LoaderIconSvg);
export const MessagesIcon = createIcon(MessagesIconSvg);
export const MoreIcon = createIcon(MoreIconSvg);
export const NotificationIcon = createIcon(NotificationIconSvg);
export const ProfileOutlineIcon = createIcon(ProfileOutlineIconSvg);
export const SearchIcon = createIcon(SearchIconSvg);
export const SettingsIcon = createIcon(SettingsIconSvg);
export const SuccessIcon = createIcon(SuccessIconSvg);
export const TwitterLogoIcon = createIcon(TwitterLogoIconSvg);
export const DropdownIcon = createIcon(DropdownIconSvg);
