"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

import toast, { Toaster } from "react-hot-toast";
//import "react-toastify/dist/ReactToastify.css";
import { useBookingEngineContext } from "../cin_context/BookingEngineContext";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

import { X } from "lucide-react";

const RoomManager = () => {
  const { selectedRooms, setSelectedRooms, setSelectedRoom } =
    useBookingEngineContext();
  const [isToggled, setIsToggled] = useState(false);
  const containerRef = useRef(null);

  const rooms = useMemo(() => selectedRooms || [], [selectedRooms]);

  // Ensure default room with 1 adult

  useEffect(() => {
    if (rooms.length === 0) {
      const id = uuidv4();
      setSelectedRooms([{ id: id, adults: 1, children: 0 }]);
      setSelectedRoom([
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
    }
  }, [rooms, setSelectedRooms]);

  const addRoom = () => {
    if (rooms.length < 4) {
      const id = uuidv4();
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
      toast.error("Maximum of 4 rooms can be added.");
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
  };

  const removeRoom = (roomId) => {
    setSelectedRooms((prev) => prev.filter((rooms) => rooms.id !== roomId));
    setSelectedRoom((prev) => prev.filter((room) => room.id !== roomId));
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
    setIsToggled(false);
  };
  return (
    <div className="mb-3 mb-md-0">
      <div className="book-room my-0">
        <button
          type="button"
          className="form-control"
          aria-expanded={isToggled}
          onClick={(e) => {
            e.stopPropagation();
            const buttonRect = e.currentTarget.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            const shouldOpenUp = viewportHeight - buttonRect.bottom < 300; // adjust threshold
            setIsToggled((prev) => !prev);

            setTimeout(() => {
              const dropdown = document.getElementById("roomsDropdown");
              if (dropdown) {
                if (shouldOpenUp) {
                  dropdown.classList.add("open-up");
                } else {
                  dropdown.classList.remove("open-up");
                }
              }
            }, 0);
          }}

          // onClick={(e) => {
          //   e.stopPropagation();
          //   setIsToggled(!isToggled);
          // }}
        >
          {`${totalAdults} Adult, ${totalChildren} Children - ${rooms.length} Room`}
        </button>

        {isToggled && (
          <div className="roomsDropdown" id="roomsDropdown">
            
            <div className="card card-body" ref={containerRef}>
              <div className="position-relative child-room-cross-btn">
                <div
                  className="room-manager-close-icon fw-bold text-center rounded shadow-sm"
                  onClick={closeRoomChange}
                >
                  <X size={20} strokeWidth={2} className="pointer-events-none" />{" "}
                </div>
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
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className="form-control text-center mx-0 adult-count">{`Adults: ${room.adults}`}</span>
                        <button
                          className="btn btn-outline-secondary btn-plus"
                          onClick={() =>
                            updateRoom(room.id, "adults", room.adults + 1)
                          }
                          disabled={room.adults >= 3}
                        >
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
                            updateRoom(room.id, "children", room.children - 1)
                          }
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <div className="flex-column">
                          <span className="form-control d-inline-block text-center mx-0 child-count">{`Children: ${room.children}`}</span>
                          <span className="age-count">(0 - 12 yrs)</span>
                        </div>
                        <button
                          className="btn btn-outline-secondary btn-plus"
                          onClick={() =>
                            updateRoom(room.id, "children", room.children + 1)
                          }
                          disabled={room.children >= 2}
                        >
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
                disabled={rooms.length >= 4}
              >
                + Add Another Room
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default RoomManager;
