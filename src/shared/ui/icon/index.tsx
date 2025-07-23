import NotFound404IconSvg from '@assets/icons/404.svg';
import CurveBackIconSvg from '@assets/icons/back_curve_icon.svg';
import BackIconSvg from '@assets/icons/back_icon.svg';
import BookmarkSolidIconSvg from '@assets/icons/bookmark-solid_icon.svg';
import BookmarksIconSvg from '@assets/icons/bookmarks_icon.svg';
import CheckIconSvg from '@assets/icons/check_icon.svg';
import CheckDoubleIconSvg from '@assets/icons/check-double_icon.svg';
import CrossIconSvg from '@assets/icons/cross_icon.svg';
import DeleteIconSvg from '@assets/icons/delete_icon.svg';
import DotsIconSvg from '@assets/icons/dots_icon.svg';
import DropdownIconSvg from '@assets/icons/dropdown_icon.svg';
import ErrorIconSvg from '@assets/icons/error_icon.svg';
import ExploreIconSvg from '@assets/icons/explore_icon.svg';
import EyeCrossedIconSvg from '@assets/icons/eye-crossed_icon.svg';
import GoogleLogoIconSvg from '@assets/icons/google-logo_icon.svg';
import HomeOutlineIconSvg from '@assets/icons/home-outline_icon.svg';
import ImageIconSvg from '@assets/icons/image_icon.svg';
import LikeActiveIconSvg from '@assets/icons/like-active_icon.svg';
import LikeNonActiveIconSvg from '@assets/icons/like-nonactive_icon.svg';
import ListsIconSvg from '@assets/icons/lists_icon.svg';
import LoaderIconSvg from '@assets/icons/loader_icon.svg';
import LogoutIconSvg from '@assets/icons/logout_icon.svg';
import MessagesIconSvg from '@assets/icons/messages_icon.svg';
import ThemeIconSvg from '@assets/icons/moon_icon.svg';
import MoreIconSvg from '@assets/icons/more_icon.svg';
import NotificationIconSvg from '@assets/icons/notification_icon.svg';
import PlusIconSvg from '@assets/icons/plus_icon.svg';
import ProfileOutlineIconSvg from '@assets/icons/profile-outline_icon.svg';
import SearchIconSvg from '@assets/icons/search_icon.svg';
import SendIconSvg from '@assets/icons/send_icon.svg';
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
export const LikeNonActiveIcon = createIcon(LikeNonActiveIconSvg);
export const LikeActiveIcon = createIcon(LikeActiveIconSvg);
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
export const NotFound404Icon = createIcon(NotFound404IconSvg);
export const CurveBackIcon = createIcon(CurveBackIconSvg);
export const PlusIcon = createIcon(PlusIconSvg);
export const LogoutIcon = createIcon(LogoutIconSvg);
export const ThemeIcon = createIcon(ThemeIconSvg);
export const DeleteIcon = createIcon(DeleteIconSvg);
export const SendIcon = createIcon(SendIconSvg);
export const CheckIcon = createIcon(CheckIconSvg);
export const CheckDoubleIcon = createIcon(CheckDoubleIconSvg);
export const BookmarkSolidIcon = createIcon(BookmarkSolidIconSvg);
