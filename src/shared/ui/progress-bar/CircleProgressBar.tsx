import clsx from 'clsx';
import React from 'react';

import styles from './CircleProgressBar.module.scss';

const DEDAULT_SIZE = 120;
const DEDAULT_WIDTH = 10;
const DEDAULT_COLOR = '#1da1f2';
const DEFAULT_SHOW_PROGRESS = false;

export const CircleProgressBar = ({
  progress = 0,
  size = DEDAULT_SIZE,
  strokeWidth = DEDAULT_WIDTH,
  circleColor = DEDAULT_COLOR,
  showProgress = DEFAULT_SHOW_PROGRESS,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={clsx(className, styles.wrapper)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size}>
        <circle
          className={styles.bg}
          stroke='#cacaca'
          fill='transparent'
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={styles.progress}
          stroke={circleColor}
          fill='transparent'
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {showProgress && (
          <text
            className={styles.text}
            x='50%'
            y='50%'
            dominantBaseline='middle'
            textAnchor='middle'
          >
            {Math.round(progress)}%
          </text>
        )}
      </svg>
    </div>
  );
};
