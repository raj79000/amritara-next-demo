//import { createContext, useContext, useState } from "react";

import { createContext, useContext, useState } from "react";

const BookingEngineContext = createContext();

export const BookingEngineProvider = ({ children }) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [selectedPropertyName, setSelectedPropertyName] = useState(null);
  const [selectedPropertyPhone, setSelectedPropertyPhone] = useState(null);

  const [propertyId, setPropertyId] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedRackRate, setselectedRackRate] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoomRate, setSelectedRoomRate] = useState(null);
  const [selectedRoomRackRate, setSelectedRoomRackRate] = useState(null);
  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);
  const [cancellationPolicyState, setCancellationPolicyState] = useState(null);
  const [selectedAddOns, setAddOns] = useState([]);
  const [addonAmountTotal, setAddonAmountTotal] = useState(0);
  const [currentStep, setCurrentStep] = useState(null);
  const [addonList, setAddonList] = useState([]);
  const [selectedRateDataList, selectedSetRateDataList] = useState([]);
  const [selectedAddonList, selectedSetAddonList] = useState([]);
  const [selectedTaxList, setSelectedTaxList] = useState([]);
  const [isRoomsChange, setRoomsChange] = useState(false);

  const [rateResponse, setRateResponse] = useState(null);
  const [addOnsresponse, setAddOnsResponse] = useState();

  const [totalRoomPrice, setTotalRoomPrice] = useState(0);

  const [baseRoomPrice, setBaseRoomPrice] = useState(0);
  const [roomTaxes, setRoomTaxes] = useState([]);

  const [promoCodeContext, setPromoCodeContext] = useState(null);
  const [addonTaxTotal, setAddonTaxTotal] = useState(0);

  const [termsAndConditions, setTermsAndConditions] = useState(null);
  const [property, setProperty] = useState(null);
  const [isAddOnns, setIsAddOnns] = useState(false);
 // const [keyData, setkeyData] = useState("dbKey=Dbconn");
 // const [keyData, setkeyData] = useState("dbKey=cinbe_pg");
  const [keyData, setkeyData] = useState(`dbKey=${process.env.NEXT_PUBLIC_TOKEN_DB_KEY}`);
  const [isMemberRate, setIsMemberRate] = useState(false);
  
    const [defaultOffer, setDefaultOffer] = useState(null);
    const [isTokenKey, setTokenKey] = useState(false);
  const [cancellationPolicyPackage, setCancellationPolicyPackage] = useState([]);
    const [isDateChanged, setIsDateChanged] = useState(false);
    const [isInventoryAvailable, setInventoryAvailable] = useState(true);
    
      const [totalTax, setTotalTax] = useState(0);
      const [offerTagIndex, setOfferTagIndex] = useState(null);
      const [storedIndex, setStoredIndex] = useState(null);
  const [userDetails, setUserDetails] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gstNumber: "",
    specialRequests: "",
    agreeToTerms: false,
  });

  const [loggedUserDetails, setLoggedUserDetails] = useState({
    customerId: "",
    membershipId: "",
    memberTitle: "",
    firstName: "",
    lastName: "",
    mobilePrefix: "",
    mobileNumber: "",
    email: "",
    isLogged: false,
  });
  const updateUserDetails = (newDetails) => {
    setUserDetails((prev) => ({ ...prev, ...newDetails }));
  };

  const getRoomNameById = (roomId) => {
    if (!filteredRooms || filteredRooms.length === 0) return "Unknown Room";
    const room = filteredRooms.find((room) => room.roomCategoryId === roomId);
    return room ? room.roomName : "Unknown Room";
  };

  const setSelectedDates = (startDate, endDate, price) => {
    if (startDate > endDate) {
      console.error("Start date cannot be after end date");
      return;
    }
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
    setTotalPrice(price);
  };

  return (
    <BookingEngineContext.Provider
      value={{
        selectedPropertyPhone,
        setSelectedPropertyPhone,
        selectedPropertyName,
        setSelectedPropertyName,
        selectedPropertyId,
        setSelectedPropertyId,
        propertyId,
        setPropertyId,
        cancellationPolicyState,
        setCancellationPolicyState,
        selectedStartDate,
        selectedEndDate,
        totalPrice,
        setTotalPrice,
        searchResults,
        userDetails,
        selectedRoom,
        setSelectedRoom,
        selectedRooms,
        setSelectedRooms,
        filteredRooms,
        setFilteredRooms,
        getRoomNameById,
        setSearchResults,
        setUserDetails,
        setSelectedDates,
        selectedRoomRate,
        setSelectedRoomRate,
        selectedRackRate,
        setselectedRackRate,
        selectedRoomRackRate,
        setSelectedRoomRackRate,
        selectedRoomDetails,
        setSelectedRoomDetails,
        updateUserDetails,
        selectedAddOns,
        setAddOns,
        addonAmountTotal,
        setAddonAmountTotal,
        currentStep,
        setCurrentStep,
        addonList,
        setAddonList,
        selectedAddonList,
        selectedSetAddonList,
        selectedRateDataList,
        selectedSetRateDataList,
        isRoomsChange,
        setRoomsChange,
        selectedTaxList,
        setSelectedTaxList,
        rateResponse,
        setRateResponse,
        addOnsresponse,
        setAddOnsResponse,
        totalRoomPrice,
        setTotalRoomPrice,
        baseRoomPrice,
        setBaseRoomPrice,
        roomTaxes,
        setRoomTaxes,
        promoCodeContext,
        setPromoCodeContext,
        addonTaxTotal,
        setAddonTaxTotal,
        setSelectedStartDate,
        setSelectedEndDate,
        isAddOnns,
        setIsAddOnns,
        termsAndConditions,
        setTermsAndConditions,
        property,
        setProperty,
        loggedUserDetails,
        setLoggedUserDetails,
        keyData,
        setkeyData,
        isMemberRate,
        setIsMemberRate,defaultOffer, setDefaultOffer,
        isTokenKey, setTokenKey,
        cancellationPolicyPackage,
        setCancellationPolicyPackage,
        isDateChanged, setIsDateChanged,
        isInventoryAvailable, setInventoryAvailable,
        totalTax, setTotalTax,
        offerTagIndex, setOfferTagIndex,
      storedIndex, setStoredIndex
      }}
    >
      {children}
    </BookingEngineContext.Provider>
  );
};

const useBookingEngineContext = () => {
  //const context = useContext(BookingEngineContext);
  const context = useContext(BookingEngineContext);
  if (!context) {
    throw new Error(
      "useBookingEngineContext must be used within a BookingEngineProvider"
    );
  }
  return context;
};

export { useBookingEngineContext };
