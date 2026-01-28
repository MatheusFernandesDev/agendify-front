import { X, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "danger" | "success" | "info";
    loading?: boolean;
}

export function ConfirmationModal({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "default",
    loading = false,
}: ConfirmationModalProps) {
    if (!open) return null;

    const variants = {
        default: {
            icon: Info,
            iconColor: "text-blue-600",
            iconBg: "bg-blue-100",
            buttonClass: "bg-blue-600 hover:bg-blue-700",
        },
        danger: {
            icon: AlertTriangle,
            iconColor: "text-red-600",
            iconBg: "bg-red-100",
            buttonClass: "bg-red-600 hover:bg-red-700",
        },
        success: {
            icon: CheckCircle,
            iconColor: "text-green-600",
            iconBg: "bg-green-100",
            buttonClass: "bg-green-600 hover:bg-green-700",
        },
        info: {
            icon: Info,
            iconColor: "text-gray-600",
            iconBg: "bg-gray-100",
            buttonClass: "bg-gray-900 hover:bg-gray-800",
        },
    };

    const config = variants[variant];
    const Icon = config.icon;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-start justify-between p-6 pb-4">
                    <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${config.iconBg} shrink-0`}>
                            <Icon className={`h-6 w-6 ${config.iconColor}`} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                            <p className="mt-2 text-sm text-gray-600">{description}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={loading}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        disabled={loading}
                        className="min-w-24"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`min-w-24 text-white ${config.buttonClass}`}
                    >
                        {loading ? "Processando..." : confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}