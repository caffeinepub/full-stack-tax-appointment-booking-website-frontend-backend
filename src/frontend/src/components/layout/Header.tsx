import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import LoginButton from '../auth/LoginButton';
import { Button } from '@/components/ui/button';
import { Car, User } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src="/assets/generated/taxi-logo.dim_512x512.png"
              alt="RideBook Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold">RideBook</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Button
              variant="ghost"
              onClick={() => navigate({ to: '/' })}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate({ to: '/book' })}
            >
              <Car className="mr-2 h-4 w-4" />
              Book a Ride
            </Button>
            {isAuthenticated && (
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/my-bookings' })}
              >
                <User className="mr-2 h-4 w-4" />
                My Rides
              </Button>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated && userProfile && (
              <span className="hidden sm:inline text-sm text-muted-foreground">
                {userProfile.name}
              </span>
            )}
            <LoginButton />
          </div>
        </div>

        {/* Mobile navigation */}
        <nav className="md:hidden flex items-center gap-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/' })}
          >
            Home
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/book' })}
          >
            Book Ride
          </Button>
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/my-bookings' })}
            >
              My Rides
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
