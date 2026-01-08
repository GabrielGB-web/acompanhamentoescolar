import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Bell, Edit, Trash2, Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useEvents, useDeleteEvent, useUpdateEvent, Event } from "@/hooks/useEvents";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EventModal } from "@/components/modals/EventModal";
import { format, parseISO, isToday, isTomorrow, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const colorStyles: Record<string, string> = {
  primary: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary/10 text-secondary-foreground border-secondary/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
};

export function EventsReminders() {
  const { data: events = [], isLoading } = useEvents();
  const deleteEvent = useDeleteEvent();
  const updateEvent = useUpdateEvent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleDelete = (id: string) => {
    setDeletingEventId(id);
  };

  const confirmDelete = () => {
    if (deletingEventId) {
      deleteEvent.mutate(deletingEventId);
      setDeletingEventId(null);
    }
  };

  const handleStatusChange = (event: Event, status: string) => {
    updateEvent.mutate({ id: event.id, title: event.title, date: event.date, status });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "realizado":
        return <Badge className="bg-success/10 text-success">Realizado</Badge>;
      case "cancelado":
        return <Badge className="bg-destructive/10 text-destructive">Cancelado</Badge>;
      default:
        return null;
    }
  };

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Hoje";
    if (isTomorrow(date)) return "Amanhã";
    if (isPast(date)) return "Atrasado";
    return format(date, "dd/MM", { locale: ptBR });
  };

  const getDateBadgeStyle = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isPast(date) && !isToday(date)) return "bg-destructive/10 text-destructive";
    if (isToday(date)) return "bg-primary/10 text-primary";
    if (isTomorrow(date)) return "bg-warning/10 text-warning";
    return "bg-muted text-muted-foreground";
  };

  return (
    <>
      <Card className="shadow-card">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-display">
              <Bell className="h-5 w-5 text-primary" />
              Lembretes & Eventos
            </CardTitle>
            <Button size="sm" onClick={() => setIsModalOpen(true)} className="gap-1">
              <Plus className="h-4 w-4" />
              Novo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px]">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                Carregando...
              </div>
            ) : events.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="mx-auto h-12 w-12 opacity-20" />
                <p className="mt-2">Nenhum evento ou lembrete</p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2"
                >
                  Adicionar primeiro evento
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`flex items-start gap-3 p-4 transition-colors hover:bg-muted/50 ${
                      event.status === "realizado" 
                        ? "bg-success/5 border-success/30" 
                        : event.status === "cancelado"
                        ? "bg-destructive/5 border-destructive/30 opacity-60"
                        : colorStyles[event.color || "primary"]
                    } border-l-4`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className={`font-medium truncate ${event.status === "cancelado" ? "line-through" : ""}`}>
                          {event.title}
                        </h4>
                        {getStatusBadge(event.status)}
                        {event.status === "pendente" && (
                          <Badge className={getDateBadgeStyle(event.date)}>
                            {getDateLabel(event.date)}
                          </Badge>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground truncate">
                          {event.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(parseISO(event.date), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                        {event.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time.slice(0, 5)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {event.status === "pendente" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStatusChange(event, "realizado")}>
                              <CheckCircle2 className="h-4 w-4 mr-2 text-success" />
                              Marcar como Realizado
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(event, "cancelado")}>
                              <XCircle className="h-4 w-4 mr-2 text-destructive" />
                              Marcar como Cancelado
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <EventModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        event={editingEvent}
      />

      <AlertDialog open={!!deletingEventId} onOpenChange={() => setDeletingEventId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir evento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O evento será permanentemente excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
