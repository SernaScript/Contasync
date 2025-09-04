"use client"

import * as React from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Selecciona una fecha",
  disabled = false
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState(date || new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  })

  const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

  const handleDateSelect = (selectedDate: Date) => {
    onDateChange?.(selectedDate)
    setIsOpen(false)
  }

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    handleDateSelect(today)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        className={cn(
          "w-full h-10 justify-start text-left font-normal bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 transition-colors",
          !date && "text-gray-500",
          date && "text-gray-900",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <CalendarIcon className="mr-3 h-4 w-4 text-gray-400" />
        <span className="truncate">
          {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: es }) : placeholder}
        </span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
                     {/* Calendar */}
           <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-72">
             {/* Header */}
             <div className="flex items-center justify-between mb-3">
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={handlePrevMonth}
                 className="h-6 w-6 p-0 hover:bg-gray-100"
               >
                 <ChevronLeft className="h-3 w-3" />
               </Button>
               
               <h3 className="font-semibold text-gray-900 text-sm">
                 {format(currentMonth, "MMMM yyyy", { locale: es })}
               </h3>
               
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={handleNextMonth}
                 className="h-6 w-6 p-0 hover:bg-gray-100"
               >
                 <ChevronRight className="h-3 w-3" />
               </Button>
             </div>

             {/* Week days */}
             <div className="grid grid-cols-7 gap-0.5 mb-1">
               {weekDays.map((day) => (
                 <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                   {day}
                 </div>
               ))}
             </div>

             {/* Calendar days */}
             <div className="grid grid-cols-7 gap-0.5">
               {calendarDays.map((day) => {
                 const isCurrentMonth = isSameMonth(day, currentMonth)
                 const isSelected = date ? isSameDay(day, date) : false
                 const isToday = isSameDay(day, new Date())

                 return (
                   <button
                     key={day.toISOString()}
                     onClick={() => handleDateSelect(day)}
                     className={cn(
                       "h-6 w-6 text-xs rounded transition-colors",
                       "hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500",
                       !isCurrentMonth && "text-gray-300",
                       isCurrentMonth && "text-gray-700",
                       isToday && "bg-blue-100 text-blue-700 font-semibold",
                       isSelected && "bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                     )}
                   >
                     {format(day, "d")}
                   </button>
                 )
               })}
             </div>

             {/* Footer */}
             <div className="flex justify-between mt-3 pt-2 border-t border-gray-200">
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={handleToday}
                 className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs h-6 px-2"
               >
                 Hoy
               </Button>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => setIsOpen(false)}
                 className="text-gray-600 hover:text-gray-700 text-xs h-6 px-2"
               >
                 Cerrar
               </Button>
             </div>
           </div>
        </>
      )}
    </div>
  )
}