import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TaxiBooking {
    bookingId: bigint;
    dropoffLocation: string;
    user: Principal;
    riderEmail: string;
    riderName: string;
    rideType: RideType;
    pickupDateTime: string;
    pickupLocation: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum RideType {
    car = "car",
    bike = "bike"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelTaxiBooking(bookingId: bigint): Promise<void>;
    createTaxiBooking(rideType: RideType, pickupDateTime: string, pickupLocation: string, dropoffLocation: string, riderName: string, riderEmail: string): Promise<bigint>;
    getAllTaxiBookings(): Promise<Array<TaxiBooking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getTaxiBooking(bookingId: bigint): Promise<TaxiBooking | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserTaxiBookings(): Promise<Array<TaxiBooking>>;
    isCallerAdmin(): Promise<boolean>;
    isTransportSlotAvailable(pickupDateTime: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
