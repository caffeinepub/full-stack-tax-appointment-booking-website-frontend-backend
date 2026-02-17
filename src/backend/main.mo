import Map "mo:core/Map";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  public type RideType = {
    #car;
    #bike;
  };

  public type TaxiBooking = {
    bookingId : Nat;
    user : Principal;
    rideType : RideType;
    pickupDateTime : Text;
    pickupLocation : Text;
    dropoffLocation : Text;
    riderName : Text;
    riderEmail : Text;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  // Initialize the authentication system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let taxiBookings = Map.empty<Nat, TaxiBooking>();
  let bookedTaxiSlots = Set.empty<Text>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var taxiBookingCounter = 0;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createTaxiBooking(
    rideType : RideType,
    pickupDateTime : Text,
    pickupLocation : Text,
    dropoffLocation : Text,
    riderName : Text,
    riderEmail : Text
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create taxi bookings");
    };

    if (bookedTaxiSlots.contains(pickupDateTime)) {
      Runtime.trap("This time slot is already booked");
    };

    let bookingId = taxiBookingCounter;
    let newBooking : TaxiBooking = {
      bookingId;
      user = caller;
      rideType;
      pickupDateTime;
      pickupLocation;
      dropoffLocation;
      riderName;
      riderEmail;
    };

    taxiBookings.add(bookingId, newBooking);
    bookedTaxiSlots.add(pickupDateTime);
    taxiBookingCounter += 1;

    bookingId;
  };

  public query ({ caller }) func getTaxiBooking(bookingId : Nat) : async ?TaxiBooking {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view taxi bookings");
    };

    switch (taxiBookings.get(bookingId)) {
      case (null) { null };
      case (?booking) {
        if (booking.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own bookings");
        };
        ?booking;
      };
    };
  };

  public query ({ caller }) func getUserTaxiBookings() : async [TaxiBooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their taxi bookings");
    };

    let userBookings = taxiBookings.values().toArray().filter(
      func(booking) {
        booking.user == caller;
      }
    );
    userBookings;
  };

  public shared ({ caller }) func cancelTaxiBooking(bookingId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can cancel taxi bookings");
    };

    switch (taxiBookings.get(bookingId)) {
      case (null) { Runtime.trap("Taxi booking not found") };
      case (?booking) {
        if (booking.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only cancel your own taxi bookings");
        };

        taxiBookings.remove(bookingId);
        bookedTaxiSlots.remove(booking.pickupDateTime);
      };
    };
  };

  public query ({ caller }) func isTransportSlotAvailable(pickupDateTime : Text) : async Bool {
    not bookedTaxiSlots.contains(pickupDateTime);
  };

  public query ({ caller }) func getAllTaxiBookings() : async [TaxiBooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all taxi bookings");
    };

    taxiBookings.values().toArray();
  };
};
