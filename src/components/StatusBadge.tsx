import { cn } from '@/lib/utils';
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_COLORS } from '@/utils/constants';

interface StatusBadgeProps {
    status: 'analise' | 'agendado' | 'cancelado';
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    return (
        <div
            className={cn(
                'inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-medium border',
                APPOINTMENT_STATUS_COLORS[status],
                className
            )}
        >
            {APPOINTMENT_STATUS_LABELS[status]}
        </div>
    );
}

