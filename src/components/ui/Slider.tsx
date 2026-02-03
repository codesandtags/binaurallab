import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  valueDisplay?: React.ReactNode;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, valueDisplay, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {(label || valueDisplay) && (
            <div className="flex justify-between items-center text-sm">
                {label && <label className="font-medium text-muted-foreground">{label}</label>}
                {valueDisplay && <span className="font-mono text-xs">{valueDisplay}</span>}
            </div>
        )}
        <input
          type="range"
          className={cn(
            "w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
