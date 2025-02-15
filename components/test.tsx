"use client";
import React, { useState, useEffect } from "react";
import {
  formatDate,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { X, Clock, AlignLeft, FileText } from "lucide-react";

const Calendar: React.FC = () => {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEvents = localStorage.getItem("events");
      if (savedEvents) {
        setCurrentEvents(JSON.parse(savedEvents));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("events", JSON.stringify(currentEvents));
    }
  }, [currentEvents]);

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setIsDialogOpen(true);
  };

  const handleEventClick = (selected: EventClickArg) => {
    setSelectedEvent(selected.event);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewEventTitle("");
    setSelectedEvent(null);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar;
      calendarApi.unselect();
      const newEvent = {
        id: `${selectedDate.start.toISOString()}-${newEventTitle}`,
        title: newEventTitle,
        start: selectedDate.start,
        end: selectedDate.end,
        allDay: selectedDate.allDay,
      };
      calendarApi.addEvent(newEvent);
      setCurrentEvents((prevEvents) => [...prevEvents, newEvent as EventApi]);
      handleCloseDialog();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-gray-100 text-center">
        <h1 className="text-2xl font-bold">Full Field Calendar</h1>
      </div>

      <div className="flex-grow p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          aspectRatio={1.5}
          height="100%"
          events={currentEvents.map((event) => ({
            id: event.id,
            title: event.title,
            start: event.start || undefined,
            end: event.end || undefined,
            allDay: event.allDay,
          }))}
          select={handleDateClick}
          eventClick={handleEventClick}
          eventAdd={(event) =>
            setCurrentEvents((prevEvents) => [...prevEvents, event.event])
          }
          eventRemove={(event) =>
            setCurrentEvents((prevEvents) =>
              prevEvents.filter((e) => e.id !== event.event.id)
            )
          }
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[360px] p-0 rounded-lg">
          {selectedEvent ? (
            <div className="p-5">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold">Event Details</h2>
                <button
                  onClick={handleCloseDialog}
                  className="text-gray-500 hover:text-gray-700"
                >
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full" />
                  <span className="text-base">{selectedEvent.title}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={16} />
                  <span className="text-sm">
                    {formatDate(selectedEvent.start!, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <AlignLeft size={16} />
                  <span className="text-sm">{selectedEvent.title}</span>
                </div>

                <div className="flex gap-2 text-gray-600">
                  <FileText size={16} className="flex-shrink-0 mt-1" />
                  <p className="text-sm">
                    This is a detailed description of the event.
                    You can customize this section to display
                    more information about the event.
                  </p>
                </div>

                <button className="w-full bg-blue-500 text-white py-2.5 rounded-md hover:bg-blue-600 transition-colors">
                  Make Quiz
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold">Add New Event</h2>
                <button
                  onClick={handleCloseDialog}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleAddEvent} className="space-y-4">
                <input
                  type="text"
                  placeholder="Event Title"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  required
                  className="border border-gray-200 p-3 rounded-md w-full"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2.5 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Add Event
                </button>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;