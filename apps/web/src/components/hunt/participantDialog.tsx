// components/hunt/ParticipantDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AlertCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Participant {
  id: string
  name: string
  email: string
}

interface ParticipantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  participants: Participant[]
  isLoading: boolean
  onDeleteParticipant?: (id: string) => void
}

export function ParticipantDialog({
  open,
  onOpenChange,
  participants,
  isLoading,
  onDeleteParticipant,
}: ParticipantDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Participants</DialogTitle>
          <DialogDescription>
            Liste des participants à cette chasse au trésor.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : participants.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>{participant.name}</TableCell>
                  <TableCell>{participant.email}</TableCell>
                  <TableCell>
                    {onDeleteParticipant && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onDeleteParticipant(participant.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun participant</h3>
            <p className="text-muted-foreground">Cette chasse n'a pas encore de participants.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
