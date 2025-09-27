"use client"

import * as React from "react"
import { cn } from "@/utils/utils"

// Main Select component that handles the Radix UI pattern
interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  disabled?: boolean
}

const Select = ({ value, onValueChange, children, disabled }: SelectProps) => {
  const [selectedValue, setSelectedValue] = React.useState(value || "")
  
  React.useEffect(() => {
    setSelectedValue(value || "")
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value
    setSelectedValue(newValue)
    onValueChange?.(newValue)
  }

  // Extract options from children
  const options: React.ReactElement[] = []
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === SelectContent) {
      React.Children.forEach(child.props.children, (item) => {
        if (React.isValidElement(item) && item.type === SelectItem) {
          options.push(item)
        }
      })
    }
  })

  return (
    <div className="relative">
      <select
        value={selectedValue}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer"
        )}
      >
        {options.map((option, index) => (
          <option 
            key={index}
            value={option.props.value}
            disabled={option.props.disabled}
          >
            {option.props.children}
          </option>
        ))}
      </select>
      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

// SelectTrigger - just renders children (the select element is in Select)
const SelectTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props}>
      {children}
    </div>
  )
)
SelectTrigger.displayName = "SelectTrigger"

// SelectValue - displays the selected value or placeholder
interface SelectValueProps {
  placeholder?: string
  children?: React.ReactNode
}

const SelectValue = ({ placeholder, children }: SelectValueProps) => {
  return <span>{children || placeholder}</span>
}

// SelectContent - container for options (not rendered in native select)
const SelectContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <>{children}</>
}

// SelectItem - individual option
interface SelectItemProps {
  value: string
  children: React.ReactNode
  disabled?: boolean
}

const SelectItem = ({ value, children, disabled }: SelectItemProps) => {
  return <option value={value} disabled={disabled}>{children}</option>
}

// Legacy compatibility components
const SelectGroup = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
)

const SelectLabel = ({ children, ...props }: React.HTMLAttributes<HTMLLabelElement>) => (
  <label {...props}>{children}</label>
)

const SelectSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
)

const SelectScrollUpButton = ({ ...props }: React.HTMLAttributes<HTMLButtonElement>) => null
const SelectScrollDownButton = ({ ...props }: React.HTMLAttributes<HTMLButtonElement>) => null

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}