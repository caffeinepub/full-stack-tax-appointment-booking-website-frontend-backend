import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateBooking, useCheckAvailability } from '../../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, Calendar as CalendarIcon, CheckCircle, Car, Bike, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { RideType } from '../../../backend';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function BookingForm() {
  const navigate = useNavigate();
  const { mutate: createBooking, isPending } = useCreateBooking();

  const [riderName, setRiderName] = useState('');
  const [riderEmail, setRiderEmail] = useState('');
  const [rideType, setRideType] = useState<string>('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<bigint | null>(null);
  const [createdBookingDetails, setCreatedBookingDetails] = useState<any>(null);

  const pickupDateTime = date && time ? `${format(date, 'yyyy-MM-dd')}T${time}` : undefined;
  const { data: isAvailable, isLoading: checkingAvailability } = useCheckAvailability(pickupDateTime);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!riderName.trim()) {
      newErrors.riderName = 'Full name is required';
    }

    if (!riderEmail.trim()) {
      newErrors.riderEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(riderEmail)) {
      newErrors.riderEmail = 'Please enter a valid email';
    }

    if (!rideType) {
      newErrors.rideType = 'Please select a ride type';
    }

    if (!pickupLocation.trim()) {
      newErrors.pickupLocation = 'Pickup location is required';
    }

    if (!dropoffLocation.trim()) {
      newErrors.dropoffLocation = 'Dropoff location is required';
    }

    if (!date) {
      newErrors.date = 'Please select a date';
    }

    if (!time) {
      newErrors.time = 'Please select a time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !date || !pickupDateTime) return;

    if (isAvailable === false) {
      toast.error('This time slot is already booked. Please select a different time.');
      return;
    }

    const rideTypeEnum = rideType === 'car' ? RideType.car : RideType.bike;

    createBooking(
      {
        rideType: rideTypeEnum,
        pickupDateTime,
        pickupLocation: pickupLocation.trim(),
        dropoffLocation: dropoffLocation.trim(),
        riderName: riderName.trim(),
        riderEmail: riderEmail.trim(),
      },
      {
        onSuccess: (bookingId) => {
          setCreatedBookingDetails({
            rideType,
            pickupDateTime,
            pickupLocation: pickupLocation.trim(),
            dropoffLocation: dropoffLocation.trim(),
            date,
            time,
          });
          setShowSuccess(true);
          setCreatedBookingId(bookingId);
          toast.success('Ride booked successfully!');
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to book ride. Please try again.');
        },
      }
    );
  };

  if (showSuccess && createdBookingId && createdBookingDetails) {
    const RideIcon = createdBookingDetails.rideType === 'car' ? Car : Bike;
    
    return (
      <Card className="border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
          <CardDescription>
            Your ride has been successfully scheduled.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted space-y-2">
            <p className="text-sm text-muted-foreground">Booking ID</p>
            <p className="font-mono font-semibold">#{createdBookingId.toString()}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted space-y-3">
            <p className="text-sm text-muted-foreground">Ride Details</p>
            <div className="flex items-center gap-2">
              <RideIcon className="h-5 w-5 text-primary" />
              <p className="font-medium capitalize">{createdBookingDetails.rideType}</p>
            </div>
            <p className="text-sm">
              {createdBookingDetails.date && format(createdBookingDetails.date, 'EEEE, MMMM d, yyyy')} at {createdBookingDetails.time}
            </p>
            <div className="pt-2 border-t space-y-1">
              <p className="text-sm"><span className="font-medium">Pickup:</span> {createdBookingDetails.pickupLocation}</p>
              <p className="text-sm"><span className="font-medium">Dropoff:</span> {createdBookingDetails.dropoffLocation}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => navigate({ to: '/my-bookings' })}
              className="flex-1"
            >
              View My Rides
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccess(false);
                setCreatedBookingId(null);
                setCreatedBookingDetails(null);
                setRiderName('');
                setRiderEmail('');
                setRideType('');
                setPickupLocation('');
                setDropoffLocation('');
                setDate(undefined);
                setTime('');
              }}
              className="flex-1"
            >
              Book Another
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="riderName">Full Name *</Label>
        <Input
          id="riderName"
          value={riderName}
          onChange={(e) => setRiderName(e.target.value)}
          placeholder="John Doe"
          disabled={isPending}
        />
        {errors.riderName && <p className="text-sm text-destructive">{errors.riderName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="riderEmail">Email *</Label>
        <Input
          id="riderEmail"
          type="email"
          value={riderEmail}
          onChange={(e) => setRiderEmail(e.target.value)}
          placeholder="john@example.com"
          disabled={isPending}
        />
        {errors.riderEmail && <p className="text-sm text-destructive">{errors.riderEmail}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rideType">Ride Type *</Label>
        <Select value={rideType} onValueChange={setRideType} disabled={isPending}>
          <SelectTrigger id="rideType">
            <SelectValue placeholder="Select ride type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="car">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                <span>Car</span>
              </div>
            </SelectItem>
            <SelectItem value="bike">
              <div className="flex items-center gap-2">
                <Bike className="h-4 w-4" />
                <span>Bike</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.rideType && <p className="text-sm text-destructive">{errors.rideType}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="pickupLocation">Pickup Location *</Label>
        <Input
          id="pickupLocation"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          placeholder="123 Main Street, City"
          disabled={isPending}
        />
        {errors.pickupLocation && <p className="text-sm text-destructive">{errors.pickupLocation}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dropoffLocation">Dropoff Location *</Label>
        <Input
          id="dropoffLocation"
          value={dropoffLocation}
          onChange={(e) => setDropoffLocation(e.target.value)}
          placeholder="456 Oak Avenue, City"
          disabled={isPending}
        />
        {errors.dropoffLocation && <p className="text-sm text-destructive">{errors.dropoffLocation}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Pickup Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                disabled={isPending}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Pickup Time *</Label>
          <Select value={time} onValueChange={setTime} disabled={isPending}>
            <SelectTrigger id="time">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.time && <p className="text-sm text-destructive">{errors.time}</p>}
        </div>
      </div>

      {pickupDateTime && isAvailable === false && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This time slot is already booked. Please select a different date or time.
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isPending || checkingAvailability || isAvailable === false}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Booking...
          </>
        ) : (
          'Book Ride'
        )}
      </Button>
    </form>
  );
}
