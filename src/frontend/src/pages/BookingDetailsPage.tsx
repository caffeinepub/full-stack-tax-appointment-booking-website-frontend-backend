import { useParams, useNavigate } from '@tanstack/react-router';
import RequireAuth from '../components/auth/RequireAuth';
import { useGetBooking } from '../hooks/useQueries';
import CancelBookingButton from '../features/bookings/components/CancelBookingButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Mail, MapPin, Car, Bike, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { RideType } from '../backend';

export default function BookingDetailsPage() {
  const { bookingId } = useParams({ from: '/bookings/$bookingId' });
  const navigate = useNavigate();
  const { data: booking, isLoading, error } = useGetBooking(BigInt(bookingId));

  if (isLoading) {
    return (
      <RequireAuth>
        <div className="container max-w-3xl mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </RequireAuth>
    );
  }

  if (error || !booking) {
    return (
      <RequireAuth>
        <div className="container max-w-3xl mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <CardTitle>Booking Not Found</CardTitle>
              <CardDescription>
                The booking you're looking for doesn't exist or you don't have permission to view it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate({ to: '/my-bookings' })}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Rides
              </Button>
            </CardContent>
          </Card>
        </div>
      </RequireAuth>
    );
  }

  const pickupDate = new Date(booking.pickupDateTime);
  const RideIcon = booking.rideType === RideType.car ? Car : Bike;

  return (
    <RequireAuth>
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/my-bookings' })}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Rides
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl">Ride Details</CardTitle>
                <CardDescription>Booking ID: #{booking.bookingId.toString()}</CardDescription>
              </div>
              <Badge variant="default" className="bg-primary hover:bg-primary/90">
                Confirmed
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <RideIcon className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Ride Type</p>
                  <p className="text-muted-foreground capitalize">{booking.rideType}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Pickup Date & Time</p>
                  <p className="text-muted-foreground">
                    {format(pickupDate, 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-muted-foreground">
                    {format(pickupDate, 'h:mm a')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium mb-1">Pickup Location</p>
                  <p className="text-muted-foreground">{booking.pickupLocation}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium mb-1">Dropoff Location</p>
                  <p className="text-muted-foreground">{booking.dropoffLocation}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Rider Information</p>
                  <p className="text-muted-foreground">{booking.riderName}</p>
                  <p className="text-muted-foreground">{booking.riderEmail}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <CancelBookingButton bookingId={booking.bookingId} />
            </div>
          </CardContent>
        </Card>
      </div>
    </RequireAuth>
  );
}
