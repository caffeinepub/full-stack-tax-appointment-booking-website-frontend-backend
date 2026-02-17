import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, TaxiBooking, RideType } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      rideType: RideType;
      pickupDateTime: string;
      pickupLocation: string;
      dropoffLocation: string;
      riderName: string;
      riderEmail: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTaxiBooking(
        params.rideType,
        params.pickupDateTime,
        params.pickupLocation,
        params.dropoffLocation,
        params.riderName,
        params.riderEmail
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
  });
}

export function useGetUserBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<TaxiBooking[]>({
    queryKey: ['userBookings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserTaxiBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBooking(bookingId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<TaxiBooking | null>({
    queryKey: ['booking', bookingId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTaxiBooking(bookingId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCancelBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.cancelTaxiBooking(bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
  });
}

export function useCheckAvailability(pickupDateTime: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['availability', pickupDateTime],
    queryFn: async () => {
      if (!actor || !pickupDateTime) return true;
      return actor.isTransportSlotAvailable(pickupDateTime);
    },
    enabled: !!actor && !isFetching && !!pickupDateTime,
  });
}
