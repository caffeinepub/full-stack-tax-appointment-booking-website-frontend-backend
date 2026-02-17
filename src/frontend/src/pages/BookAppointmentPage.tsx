import RequireAuth from '../components/auth/RequireAuth';
import BookingForm from '../features/bookings/components/BookingForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BookAppointmentPage() {
  return (
    <RequireAuth>
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Book Your Ride</CardTitle>
            <CardDescription>
              Fill out the form below to schedule your ride. We'll confirm your booking shortly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingForm />
          </CardContent>
        </Card>
      </div>
    </RequireAuth>
  );
}
