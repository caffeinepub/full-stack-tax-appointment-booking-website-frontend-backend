import { useNavigate } from '@tanstack/react-router';
import { useGetUserBookings } from '../../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, ChevronRight, MapPin, Car, Bike } from 'lucide-react';
import { format } from 'date-fns';
import { RideType } from '../../../backend';

export default function BookingList() {
  const navigate = useNavigate();
  const { data: bookings, isLoading, error } = useGetUserBookings();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Error Loading Rides</CardTitle>
          <CardDescription>
            Failed to load your rides. Please try again later.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Card>
        <CardHeader className="text-center py-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Car className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>No Rides Yet</CardTitle>
          <CardDescription>
            You haven't booked any rides yet. Book your first ride today!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-12">
          <Button onClick={() => navigate({ to: '/book' })}>
            <Car className="mr-2 h-4 w-4" />
            Book a Ride
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const pickupDate = new Date(booking.pickupDateTime);
        const RideIcon = booking.rideType === RideType.car ? Car : Bike;
        
        return (
          <Card
            key={booking.bookingId.toString()}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate({ to: '/bookings/$bookingId', params: { bookingId: booking.bookingId.toString() } })}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <RideIcon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg capitalize">{booking.rideType} Ride</CardTitle>
                    <Badge variant="default" className="bg-primary hover:bg-primary/90">
                      Confirmed
                    </Badge>
                  </div>
                  <CardDescription className="flex items-start gap-4 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(pickupDate, 'MMM d, yyyy')} at {format(pickupDate, 'h:mm a')}
                    </span>
                  </CardDescription>
                  <div className="text-sm text-muted-foreground space-y-1 pt-2">
                    <p className="flex items-start gap-1">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span><span className="font-medium">From:</span> {booking.pickupLocation}</span>
                    </p>
                    <p className="flex items-start gap-1">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span><span className="font-medium">To:</span> {booking.dropoffLocation}</span>
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
