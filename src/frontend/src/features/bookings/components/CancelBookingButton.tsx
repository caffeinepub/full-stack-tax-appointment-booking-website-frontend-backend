import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCancelBooking } from '../../../hooks/useQueries';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Loader2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CancelBookingButtonProps {
  bookingId: bigint;
}

export default function CancelBookingButton({ bookingId }: CancelBookingButtonProps) {
  const navigate = useNavigate();
  const { mutate: cancelBooking, isPending } = useCancelBooking();
  const [open, setOpen] = useState(false);

  const handleCancel = () => {
    cancelBooking(bookingId, {
      onSuccess: () => {
        toast.success('Ride cancelled successfully');
        setOpen(false);
        navigate({ to: '/my-bookings' });
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to cancel ride');
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full sm:w-auto">
          <XCircle className="mr-2 h-4 w-4" />
          Cancel Ride
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Ride?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel this ride? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Keep Booking</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              'Yes, Cancel'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
