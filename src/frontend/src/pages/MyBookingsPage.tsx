import RequireAuth from '../components/auth/RequireAuth';
import BookingList from '../features/bookings/components/BookingList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MyBookingsPage() {
  return (
    <RequireAuth>
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">My Rides</CardTitle>
            <CardDescription>
              View and manage all your ride bookings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingList />
          </CardContent>
        </Card>
      </div>
    </RequireAuth>
  );
}
