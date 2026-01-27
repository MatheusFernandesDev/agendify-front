import Image from 'next/image';

interface EmptyStateProps {
    title?: string;
    description?: string;
}

export function EmptyState({
    title = 'Nada por aqui ainda...',
    description,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="w-48 h-48 mb-6 opacity-50">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    <circle cx="100" cy="100" r="80" fill="#f3f4f6" />
                    <rect x="60" y="80" width="80" height="60" rx="4" fill="#e5e7eb" />
                    <rect x="70" y="90" width="20" height="30" rx="2" fill="#d1d5db" />
                    <rect x="110" y="90" width="20" height="30" rx="2" fill="#d1d5db" />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            {description && <p className="text-gray-600">{description}</p>}
        </div>
    );
}