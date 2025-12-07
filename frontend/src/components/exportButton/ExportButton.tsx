import { useEffect,useRef,useState } from "react";
import './exportButton.css'

interface ExportButtonProps{
    onExport: (format:string) => void
    formats?: {value:string,label:string,icon?:string}[]
}

const ExportButton : React.FC<ExportButtonProps> = ({onExport,formats}) => {
    const [isOpen,setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const defaultFormats = [
        {value:"pdf",label:"PDF",icon:"📄"}
    ]
    const exportFormats = formats || defaultFormats
      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
     if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleExport = (format: string) => {
    onExport(format)
    setIsOpen(false)
  }
  return (
    <div className="export-button-wrapper" ref={dropdownRef}>
      <button className="export-button" onClick={() => setIsOpen(!isOpen)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Exportar
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`export-chevron ${isOpen ? "export-chevron-open" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="export-dropdown">
          {exportFormats.map((format) => (
            <button key={format.value} className="export-dropdown-item" onClick={() => handleExport(format.value)}>
              {format.icon && <span className="export-item-icon">{format.icon}</span>}
              <span>{format.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExportButton