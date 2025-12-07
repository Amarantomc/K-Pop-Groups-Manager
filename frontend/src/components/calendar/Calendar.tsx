/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useState, type JSX} from "react";
import "./calendar.css"

interface EventItem{
    id : string | number,
    date : string,
    title : string,
    subtitle? : string,
    color? : string,
    time? : string,
    type? : string,
    // extra?:any
}

interface CalendarProps{
    title? : string,
    description? : string,
    events? : EventItem[],
    renderEventItem? : (event : EventItem) => JSX.Element,
    renderEventIcon? : (type : string) => JSX.Element,
    addButtonText? : string
    onAddClick? : (date : Date) => void
    onDateClick? : (date : string) => void
}

export default function Calendar({
    title = "",
    description = "",
    events = [],
    renderEventItem,
    renderEventIcon,
    addButtonText,
    onAddClick,
    onDateClick
}: CalendarProps) {
    const [currentDate,setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date : Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year,month,1)
        const lastDay = new Date(year,month+1,0)
        return {
            daysInMonth : lastDay.getDate(),
            startingDayOfWeek : firstDay.getDay()
        }
    }

    const {daysInMonth,startingDayOfWeek} = getDaysInMonth(currentDate);

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(),currentDate.getMonth()-1))
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(),currentDate.getMonth()+1))
    }

    const getEventsForDate = (day : number) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1 ).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        return events.filter((event) => event.date === dateStr);
    }

    const monthNames = [
        "Enero","Febrero","Marzo","Abril","Mayo","Junio",
        "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
    ]

    const dayNames = [
        "Dom","Lun","Mar","Mié","Jue","Vie","Sáb"
    ]

    const renderCalendarDays = () => {
        const days = []

         for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day calendar-day-empty" />)
        }

        for (let day = 1;day <= daysInMonth;day++){
            const dayEvents = getEventsForDate(day)

            const isToday = 
            day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear()

            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            
            days.push(
                <div 
                    key={day} 
                    className={`calendar-day ${isToday ? "calendar-day-today" : ""} ${
                        dayEvents.length > 0 ? "calendar-day-has-activity" : ""
                    }`}
                    onClick={() => dayEvents.length > 0 && onDateClick && onDateClick(dateStr)}
                    style={{ cursor: dayEvents.length > 0 ? 'pointer' : 'default' }}
                >
                        <span className="calendar-day-number">{day}</span>

                         {dayEvents.length > 0 && (
                                <div className="calendar-day-dots">
                                {dayEvents.slice(0, 3).map((event) => (
                                <span key={event.id} className={`activity-dot activity-dot-${event.type}`} />
                             ))}
                                </div>
                         )}
                </div>    
            )
        }
        return days
    }

     const upcoming = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

    return(
        <div className="calendar-container">
            <div className="calendar-header-section">
                <h2 className="calendar-main-title">{title}</h2>
                <p className="calendar-main-description">{description}</p>
            </div>

            <div className="calendar-grid">
                <div className="calendar-card">
                    <div className="calendar-header">
                        <button onClick={previousMonth} className="calendar-nav-button">
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>

                        <h3 className="calendar-title">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h3>

                        <button onClick={nextMonth} className="calendar-nav-button">
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>

                    <div className="calendar-weekdays">
                        {dayNames.map((day) => (
                            <div key={day} className="calendar-weekday">{day}</div>
                        ))}
                    </div>

                    <div className="calendar-days">{renderCalendarDays()}</div>
                </div>
            </div>
        </div>
    )
}