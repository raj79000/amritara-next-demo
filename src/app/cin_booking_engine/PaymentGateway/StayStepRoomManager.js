"use client";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
//import "react-toastify/dist/ReactToastify.css";
import { useBookingEngineContext } from "../../cin_context/BookingEngineContext";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { X } from "lucide-react";
const StayStepRoomManager = (
    {onRoomChange,onClose}) => {
  const {
    selectedRooms,
    setSelectedRooms,
    selectedRoom,
    setSelectedRoom,
    setRoomsChange,
    isRoomsChange,
  } = useBookingEngineContext();
  const [isToggled, setIsToggled] = useState(false);
  const [isRoomsClose, setIsRoomsClose] = useState(true);
  const containerRef = useRef(null);

  const rooms = useMemo(() => selectedRooms || [], [selectedRooms]);
  const room = useMemo(() => selectedRoom || [], [selectedRoom]);

  // Ensure default room with 1 adult
  useEffect(() => {
    if (rooms.length === 0) {
      setSelectedRooms([{ id: uuidv4(), adults: 1, children: 0 }]);
    }
  }, [rooms, setSelectedRooms]);

  const addRoom = () => {
    if (rooms.length < 10) {
      onRoomChange();
      const id = uuidv4();
      setRoomsChange(!isRoomsChange);
      setSelectedRooms((prev) => [...prev, { id: id, adults: 1, children: 0 }]);
      setSelectedRoom((prev) => [
        ...prev,
        {
          id: id,
          roomId: "",
          roomName: "",
          roomRate: "",
          roomImage: {},
          adults: 1,
          children: 0,
        },
      ]);
    } else {
      toast.error("Maximum of 10 rooms can be added.");
    }
  };

  const updateRoom = (roomId, type, value) => {
    if (type !== "adults" && type !== "children") {
      console.error("Invalid type:", type);
      return;
    }

    setSelectedRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              [type]:
                type === "adults" ? Math.max(1, value) : Math.max(0, value),
            }
          : room
      )
    );

    setSelectedRoom((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              [type]:
                type === "adults" ? Math.max(1, value) : Math.max(0, value),
            }
          : room
      )
    );

    setRoomsChange(!isRoomsChange);
  };

  const removeRoom = (roomId) => {
    setSelectedRooms((prev) => prev.filter((rooms) => rooms.id !== roomId));
    setSelectedRoom((prev) => prev.filter((room) => room.id !== roomId));
    setRoomsChange(!isRoomsChange);
  };

  const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
  const totalChildren = rooms.reduce((sum, room) => sum + room.children, 0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        !event.target.closest(".form-control")
      ) {
        setIsToggled(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeRoomChange = () => {
    onClose();
    setIsRoomsClose(false);
  };
  return (
    <>
      {isRoomsClose && (
        <div className="mb-3 mb-md-0">
          <div className="book-room my-0">
            <div className="row">
              {/*<div
                className="room-manager-close-icon"
                onClick={closeRoomChange}
              >
                CLOSE{" "}
                 <Image
                  alt="close icon"
                  width="25"
                  height="25"
                  src="../images/white_close_icon.svg"
                  style={{ width: "25px", height: "25px" }}
                />
              </div> */}
              <div className="roomsDropdown" id="roomsDropdown">
                <div className="card card-body" ref={containerRef}>
                   <div
                      className="room-manager-close-icon child-staystep-inner"
                      onClick={closeRoomChange}
                    >
                      <X size={20} strokeWidth={2} className="pointer-events-none" />{" "}
                    </div>
                  {rooms.map((room, index) => (
                    <div key={room.id} className="room mb-3 border-bottom pb-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <p className="fw-bold">{`Room ${index + 1}`}</p>
                        {rooms.length > 1 && (
                          <button
                            onClick={() => removeRoom(room.id)}
                            className="btn-close remove-room"
                          >
                            x
                          </button>
                        )}
                      </div>
                      <div className="row m-0">
                        <div className="col-6 px-2">
                          <div className="d-flex align-items-center justify-content-evenly">
                            <button
                              onClick={() =>
                                updateRoom(room.id, "adults", room.adults - 1)
                              }
                              className="btn btn-outline-secondary btn-minus"
                            >
                              {/* <Image
                                src="/images/minus-icon.svg"
                                alt="minus-icon"
                                className="img-fluid"
                                height={20}
                                width={20}
                              /> */}
                              <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <span className="form-control text-center mx-0 adult-count">{`Adults: ${room.adults}`}</span>
                            <button
                              className="btn btn-outline-secondary btn-plus"
                              onClick={() =>
                                updateRoom(room.id, "adults", room.adults + 1)
                              }
                              disabled={room.adults >= 5}
                            >
                              {/* <Image
                                src="/images/plus-icon.svg"
                                alt="plus-icon"
                                className="img-fluid"
                                height={20}
                                width={20}
                              /> */}

                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                          </div>
                        </div>
                        <hr className="vertical-hr"></hr>
                        <div className="col-6 px-2">
                          <div className="d-flex align-items-center justify-content-evenly">
                            <button
                              className="btn btn-outline-secondary btn-minus"
                              onClick={() =>
                                updateRoom(
                                  room.id,
                                  "children",
                                  room.children - 1
                                )
                              }
                            >
                              {/* <Image
                                src="/images/minus-icon.svg"
                                alt="minus-icon"
                                className="img-fluid"
                                height={20}
                                width={20}
                              /> */}

                              <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <div className="flex-column">
                              <span className="form-control d-inline-block text-center mx-0 child-count">{`Children: ${room.children}`}</span>
                              <span className="age-count">(0 - 12 yrs)</span>
                            </div>
                            <button
                              className="btn btn-outline-secondary btn-plus"
                              onClick={() =>
                                updateRoom(
                                  room.id,
                                  "children",
                                  room.children + 1
                                )
                              }
                              disabled={room.children >= 5}
                            >
                              {/* <Image
                                src="/images/plus-icon.svg"
                                alt="minus-icon"
                                className="img-fluid"
                                height={20}
                                width={20}
                              /> */}

                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    className="btn btn-link add-room"
                    onClick={addRoom}
                    disabled={rooms.length >= 10}
                  >
                    + Add Another Room
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="col-md-12" onClick={closeRoomChange}> 
              Apply Changes
               
              </div> */}
        </div>
      )}
    </>
  );
};
export default StayStepRoomManager;
