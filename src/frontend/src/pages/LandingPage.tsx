import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Clock, Shield, CheckCircle, Bike } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/10">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your Ride,{' '}
                <span className="text-primary">On Demand</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Book a car or bike taxi in minutes. Fast, reliable, and convenient transportation whenever you need it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate({ to: '/book' })}
                  className="text-lg px-8"
                >
                  <Car className="mr-2 h-5 w-5" />
                  Book a Ride
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate({ to: '/my-bookings' })}
                  className="text-lg px-8"
                >
                  View My Rides
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/taxi-hero.dim_1600x600.png"
                alt="Taxi booking services"
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose RideBook?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our admins carefully review and approve all registered users before they can access RideBook, ensuring a safe and trusted community for everyone.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Easy Booking</CardTitle>
                <CardDescription>
                  Book your ride online 24/7 at your convenience. No phone calls needed.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Flexible Scheduling</CardTitle>
                <CardDescription>
                  Choose from available time slots that fit your schedule perfectly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your information is protected with enterprise-grade security and encryption.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the ride that fits your needs.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Car, text: 'Car Rides - Comfortable and spacious' },
              { icon: Bike, text: 'Bike Rides - Fast and economical' },
              { icon: Clock, text: 'Scheduled Pickups' },
              { icon: Shield, text: 'Safe and Verified Drivers' },
              { icon: Car, text: 'Airport Transfers' },
              { icon: Bike, text: 'Quick City Commutes' },
            ].map((service) => (
              <div key={service.text} className="flex items-center gap-3 p-4 rounded-lg bg-card border">
                <service.icon className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium">{service.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Book your ride today and experience hassle-free transportation at your fingertips.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate({ to: '/book' })}
            className="text-lg px-8"
          >
            <Car className="mr-2 h-5 w-5" />
            Book Your Ride Now
          </Button>
        </div>
      </section>
    </div>
  );
}
