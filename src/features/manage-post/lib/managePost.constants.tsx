import { DeleteIcon } from '@/shared/ui/icon';

import styles from '../ui/ManagePost.module.scss';

export const DELETE_ACTION = 'delete';

export const MANAGE_ACTIONS = [
  {
    label: 'Delete',
    className: styles.deleteAction,
    icon: <DeleteIcon width={18} height={18} />,
    action: DELETE_ACTION,
  },
];
