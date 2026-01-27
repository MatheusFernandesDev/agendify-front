"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CreateAppointmentData } from '@/types/appointment';
import { ROOMS } from '@/utils/constants';
import { generateTimeOptions, } from '@/utils/helpers';
import { isValidFutureDate, isWeekday } from '@/utils/validators';
import { toast } from 'sonner';

interface AppointmentModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreateAppointmentData) => Promise<void>;
}

export function AppointmentModal({ open, onClose, onSubmit }: AppointmentModalProps) {
    const [date, setDate] = useState<Date>();
    const [time, setTime] = useState('');
    const [room, setRoom] = useState('');
    const [loading, setLoading] = useState(false);

    const times = generateTimeOptions('08:00', '18:00', 30);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!date || !time || !room) {
            toast.error('Preencha todos os campos');
            return;
        }

        const dateStr = format(date, 'yyyy-MM-dd');

        if (!isValidFutureDate(dateStr)) {
            toast.error('A data deve ser futura');
            return;
        }

        if (!isWeekday(dateStr)) {
            toast.error('Agendamentos apenas em dias úteis (segunda a sexta)');
            return;
        }

        try {
            setLoading(true);
            await onSubmit({
                date: dateStr,
                time,
                room,
            });
            handleClose();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setDate(undefined);
        setTime('');
        setRoom('');
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Novo Agendamento</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Data */}
                    <div className="space-y-2">
                        <Label>Selecione uma data (Obrigatório)</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !date && 'text-muted-foreground'
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, 'PPP', { locale: ptBR }) : 'Selecione uma data'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    disabled={(date) => {
                                        const day = date.getDay();
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        return date < today || day === 0 || day === 6; // Desabilita passado e fins de semana
                                    }}
                                    initialFocus
                                    locale={ptBR}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Horário */}
                    <div className="space-y-2">
                        <Label>Selecione uma horário (Obrigatório)</Label>
                        <Select value={time} onValueChange={setTime}>
                            <SelectTrigger className="w-full">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <SelectValue placeholder="Selecione um horário" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {times.map((t) => (
                                    <SelectItem key={t} value={t}>
                                        {t}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sala */}
                    <div className="space-y-2">
                        <Label>Selecione um Sala (Obrigatório)</Label>
                        <Select value={room} onValueChange={setRoom}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione uma sala" />
                            </SelectTrigger>
                            <SelectContent>
                                {ROOMS.map((r) => (
                                    <SelectItem key={r} value={r}>
                                        {r}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Botão */}
                    <Button type="submit" className="w-full bg-black hover:bg-gray-800" disabled={loading}>
                        {loading ? 'Confirmando...' : 'Confirmar Agendamento'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}