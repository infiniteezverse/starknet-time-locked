export interface FormattedTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function formatTime(totalSeconds: number): FormattedTime {
  const days = Math.floor(totalSeconds / 86400);
  let remaining = totalSeconds % 86400;

  const hours = Math.floor(remaining / 3600);
  remaining = remaining % 3600;

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return { days, hours, minutes, seconds };
}

export function formatTimeString(totalSeconds: number): string {
  const { days, hours, minutes, seconds } = formatTime(totalSeconds);
  const parts = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(' ');
}

export function getStatusInfo(remainingSeconds: number, isExpired: boolean) {
  if (isExpired) {
    return {
      label: 'Expired',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      icon: '🔴',
      status: 'expired' as const,
    };
  }

  if (remainingSeconds < 3600) {
    return {
      label: 'Expiring Soon',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      icon: '🟡',
      status: 'expiring' as const,
    };
  }

  return {
    label: 'Active',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    icon: '🟢',
    status: 'active' as const,
  };
}

export function formatDeadlineDate(unixTimestamp: number | bigint): string {
  if (!unixTimestamp) return 'Not set';
  const timestamp = typeof unixTimestamp === 'bigint' ? Number(unixTimestamp) : unixTimestamp;
  if (timestamp === 0) return 'Not set';
  return new Date(timestamp * 1000).toLocaleString();
}

export function getProgressPercentage(remainingSeconds: number, totalSeconds: number): number {
  if (totalSeconds === 0) return 0;
  return Math.max(0, Math.min(100, ((totalSeconds - remainingSeconds) / totalSeconds) * 100));
}
