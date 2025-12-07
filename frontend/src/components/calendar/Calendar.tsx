/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useState, type JSX} from "react";
import "./calendar.css"
import ExportButton from "../exportButton/ExportButton";
interface EventItem{
    id : string | number,
    date : string,
    title : string,
    artist: string
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
    const activities: EventItem[] = [
    {
      id: 1,
      title: "Concierto en Seúl",
      artist: "BTS",
      date: "2025-12-05",
      time: "19:00",
      type: "concert",
    },
    {
      id: 2,
      title: "Sesión de grabación",
      artist: "BLACKPINK",
      date: "2025-12-08",
      time: "14:00",
      type: "recording",
    },
    {
      id: 3,
      title: "Sesión fotográfica",
      artist: "Stray Kids",
      date: "2025-12-12",
      time: "10:00",
      type: "photoshoot",
    },
    {
      id: 4,
      title: "Entrevista TV",
      artist: "TWICE",
      date: "2025-12-15",
      time: "16:00",
      type: "interview",
    },
    {
      id: 5,
      title: "Fan Meeting",
      artist: "NewJeans",
      date: "2025-12-20",
      time: "18:00",
      type: "concert",
    },
  ]

    const getActivityIcon = (type: string) => {
    switch (type) {
      case "concert":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        )
      case "recording":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )
      case "photoshoot":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        )
      case "interview":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
            <line x1="6" y1="6" x2="6.01" y2="6" />
            <line x1="6" y1="18" x2="6.01" y2="18" />
          </svg>
        )
    }
  }
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
        return activities.filter((activity) => activity.date === dateStr);
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

     const upcomingActivities = activities
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

    return(
        <div className="calendar-container">
             <ExportButton onExport={() => console.log("Exportando...")} />
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

                    <div className="calendar-legend">
                        <div className="legend-item">
                            <span className="legend-dot activity-dot-concert" />
                            <span>Concierto</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot activity-dot-recording" />
                            <span>Grabación</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot activity-dot-photoshoot" />
                            <span>Sesión fotográfica</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot activity-dot-interview" />
                            <span>Entrevista</span>
                        </div>
                    </div>

                    
            </div>
                        <div className="activities-card">
                    <h3 className="activities-title">Próximas Actividades</h3>
                        <div className="activities-list">
                            {upcomingActivities.map((activity) => (
                            <div key={activity.id} className={`activity-item activity-item-${activity.type}`}>
                                    <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                                <div className="activity-details">
                                    <h4 className="activity-name">{activity.title}</h4>
                                    <p className="activity-artist">{activity.artist}</p>
                                    <p className="activity-datetime">
                                    {new Date(activity.date).toLocaleDateString("es-ES", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    })}{" "}
                                    · {activity.time}
                                    </p>
                                </div>
                            </div>
            ))}
                        </div>
                    </div>
            
            </div>
        </div>
    )
}