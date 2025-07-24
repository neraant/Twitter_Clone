import clsx from 'clsx';

import { TAB_LABELS } from '../lib';
import styles from './ExploreTabs.module.scss';

type ExploreTabsProps = {
  activeTab: number;
  onTabSelect: (index: number) => void;
};

export const ExploreTabs = ({ activeTab, onTabSelect }: ExploreTabsProps) => {
  return (
    <div className={styles.tabsList}>
      {TAB_LABELS.map((label, index) => (
        <button
          key={index}
          className={clsx(
            styles.tubButton,
            activeTab === index && styles.active,
          )}
          onClick={() => onTabSelect(index)}
        >
          {label}
        </button>
      ))}

      <span
        data-testid='indicator-line'
        className={styles.currentLine}
        style={{
          transform: `translateX(${activeTab * 100}%)`,
        }}
      />
    </div>
  );
};
