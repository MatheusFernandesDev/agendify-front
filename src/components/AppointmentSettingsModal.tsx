import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Room {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    blockDuration: number;
}

interface AppointmentSettingsModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (rooms: Room[]) => Promise<void>;
}

export function AppointmentSettingsModal({
    open,
    onClose,
    onSave,
}: AppointmentSettingsModalProps) {
    const [rooms, setRooms] = useState<Room[]>([
        {
            id: "1",
            name: "Sala 012",
            startTime: "08:00",
            endTime: "18:00",
            blockDuration: 30,
        },
    ]);
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleAddRoom = () => {
        const newRoom: Room = {
            id: Date.now().toString(),
            name: "",
            startTime: "08:00",
            endTime: "18:00",
            blockDuration: 30,
        };
        setRooms([...rooms, newRoom]);
    };

    const handleRemoveRoom = (id: string) => {
        setRooms(rooms.filter((room) => room.id !== id));
    };

    const handleUpdateRoom = (id: string, field: keyof Room, value: any) => {
        setRooms(
            rooms.map((room) =>
                room.id === id ? { ...room, [field]: value } : room
            )
        );
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await onSave(rooms);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold">Ajustes de agendamento</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {rooms.map((room, index) => (
                        <div
                            key={room.id}
                            className="border border-gray-200 rounded-lg p-4 space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold">
                                    Sala {index + 1}
                                    {rooms.length > 1 && (
                                        <button
                                            onClick={() => handleRemoveRoom(room.id)}
                                            className="ml-3 text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4 inline" />
                                        </button>
                                    )}
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor={`room-name-${room.id}`}>Nome da sala</Label>
                                    <Input
                                        id={`room-name-${room.id}`}
                                        value={room.name}
                                        onChange={(e) =>
                                            handleUpdateRoom(room.id, "name", e.target.value)
                                        }
                                        placeholder="Ex: Sala 012"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor={`room-time-${room.id}`}>
                                        Horário Inicial & Final da sala
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id={`room-time-${room.id}`}
                                            type="time"
                                            value={room.startTime}
                                            onChange={(e) =>
                                                handleUpdateRoom(room.id, "startTime", e.target.value)
                                            }
                                        />
                                        <span>-</span>
                                        <Input
                                            type="time"
                                            value={room.endTime}
                                            onChange={(e) =>
                                                handleUpdateRoom(room.id, "endTime", e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor={`room-block-${room.id}`}>
                                        Bloco de Horários de agendamento
                                    </Label>
                                    <Select
                                        value={room.blockDuration.toString()}
                                        onValueChange={(value) =>
                                            handleUpdateRoom(room.id, "blockDuration", parseInt(value))
                                        }
                                    >
                                        <SelectTrigger id={`room-block-${room.id}`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="15">15 minutos</SelectItem>
                                            <SelectItem value="30">30 minutos</SelectItem>
                                            <SelectItem value="45">45 minutos</SelectItem>
                                            <SelectItem value="60">60 minutos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    ))}

                    <Button
                        onClick={handleAddRoom}
                        variant="outline"
                        className="w-full"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar nova sala
                    </Button>
                </div>

                {/* Footer */}
                <div className="p-6 border-t">
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-black hover:bg-gray-800"
                    >
                        {loading ? "Salvando..." : "Salvar"}
                    </Button>
                </div>
            </div>
        </div>
    );
}