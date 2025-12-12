/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useState, type JSX} from "react";
import "./calendar.css"
import ExportButton from "../exportButton/ExportButton";
import ModalCreate from "../modal/ModalCreate";

interface CalendarProps{
    title? : string,
    description? : string,
    activitiesTest : any[]
}

const Calendar : React.FC<CalendarProps> = ({
    title = "",
    description = "",
    activitiesTest = []
}) => {
    const [currentDate,setCurrentDate] = useState(new Date());
    const [showDayMenu,setShowDayMenu] = useState(false)
    const [selectedDay, setSelectedDay] = useState<number | null>(null)
    const [showAddModal, setShowAddModal] = useState(false)
    // const [selectedDates, setSelectedDates] = useState<string[]>([])
    // const [isSelectingMultipleDates, setIsSelectingMultipleDates] = useState(false)
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "festival":
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
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        )
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
      case "tv-show":
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
            <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
            <polyline points="17 2 12 7 7 2" />
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
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        )
    }
  }
    const transformDate = (dateStr : string) => {
      const date = new Date(dateStr)
      
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    }

    const transformActivityType = (type : string) => {
      const translations: Record<string, string> = {
      'Concierto': 'concert',
      'Festival': 'festival',
      'Show de TV': 'tv-show',
      'Entrevista': 'interview',
      'Sesión fotográfica': 'photoshoot',
      //Ensayos
        };
        return translations[type]
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
        return activitiesTest.filter((activity) => transformDate(activity.date) === dateStr);
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
            
            days.push(
                <div 
                    key={day} 
                    onClick = {() => handleDayClick(day)}
                    className={`calendar-day ${isToday ? "calendar-day-today" : ""} ${
                        dayEvents.length > 0 ? "calendar-day-has-activity" : ""
                    }`}
                >
                        <span className="calendar-day-number">{day}</span>
                        {dayEvents.length > 0 && (
                                <div className="calendar-day-dots">
                                {dayEvents.slice(0, 3).map((event) => (
                                <span key={event.id} className={`activity-dot activity-dot-${transformActivityType(event.activityType)}`} />
                            ))}
                                </div>
                        )}
                </div>    
            )
        }
        return days
    }

    const upcomingActivities = activitiesTest
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

    const handleDayClick = (day: number) => {
    setSelectedDay(day)
    setShowDayMenu(true)
  }

    const handleCloseDayMenu = () => {
    setShowDayMenu(false)
    setSelectedDay(null)
  }

    const handleAddFromDayMenu = () => {
    if (selectedDay) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
    }
    setShowDayMenu(false)
    setShowAddModal(true)
  }
    const selectedDayActivities = selectedDay ? getEventsForDate(selectedDay) : []

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
                            <span className="legend-dot activity-dot-photoshoot" />
                            <span>Sesión fotográfica</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot activity-dot-interview" />
                            <span>Entrevista</span>
                        </div>
                        <div className="legend-item">
                              <span className="legend-dot activity-dot-festival" />
                              <span>Festival</span>
                        </div>
                        <div className="legend-item">
                              <span className="legend-dot activity-dot-tv-show" />
                              <span>Show de TV</span>
                        </div>
                    </div>

                    
            </div>
                        <div className="activities-card">
                    <h3 className="activities-title">Próximas Actividades</h3>
                        <div className="activities-list">
                            {upcomingActivities.map((activity) => (
                            <div key={activity.id} className={`activity-item activity-item-${activity.type}`}>
                                    <div className="activity-icon">{getActivityIcon(activity.type ?? "")}</div>
                                <div className="activity-details">
                                    <h4 className="activity-name">{activity.eventType}</h4>
                                    <p className="activity-artist">{activity.responsible}</p>
                                    <p className="activity-datetime">
                                    {new Date(transformDate(activity.date)).toLocaleDateString("es-ES", {
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
            {showDayMenu && selectedDay && (
        <div className="day-menu-overlay" onClick={handleCloseDayMenu}>
          <div className="day-menu" onClick={(e) => e.stopPropagation()}>
            <div className="day-menu-header">
              <h3 className="day-menu-title">
                {selectedDay} de {monthNames[currentDate.getMonth()]}
              </h3>
              <button className="day-menu-close" onClick={handleCloseDayMenu}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="day-menu-content">
              {selectedDayActivities.length > 0 ? (
                <>
                  <div className="day-menu-activities">
                    {selectedDayActivities.map((activity) => (
                      <div key={activity.id} className={`day-menu-activity activity-item-${transformActivityType(activity.activityType)}`}>
                        <div className="activity-icon">{getActivityIcon(transformActivityType(activity.activityType))}</div>
                        <div className="activity-details">
                          <h4 className="activity-name">{activity.eventType}</h4>
                          <p className="activity-artist">
                            {activity.responsible}
                            {activity.place && ` · ${activity.place}`}
                          </p>
                          <p className="activity-datetime">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="day-menu-add-button" onClick={handleAddFromDayMenu}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Agregar actividad
                  </button>
                </>
              ) : (
                <div className="day-menu-empty">
                  <p>No hay actividades programadas para este día</p>
                  <button className="day-menu-add-button" onClick={handleAddFromDayMenu}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Agregar actividad
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
        {showAddModal && (
        <ModalCreate
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false)
          }}
          title="Agregar Actividad"
          createEntity="activity"
        >
        </ModalCreate>
      )}
      </div>
    )
}

export default Calendar