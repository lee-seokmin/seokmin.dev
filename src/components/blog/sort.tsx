"use client"

import * as React from "react"
import { Check, ArrowUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface FilterProps {
  selectedSortOption: string;
  onSortOptionChange: (sortOption: string) => void;
}

const sortOptions: { value: string; label: string }[] = [
  { value: "", label: "최신순" },
  { value: "shortest", label: "짧은순" },
  { value: "longest", label: "긴순" },
]

export function Sort({ selectedSortOption, onSortOptionChange }: FilterProps) {
  const [open, setOpen] = React.useState(false)

  const longestSortOption = sortOptions.reduce((longest, option) => {
    if (option.label.length > longest.length) {
      return option.label
    }
    return longest
  }, "")

  const triggerWidth = longestSortOption.length * 30;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
          style={{ width: `${triggerWidth}px` }}
        >
          <ArrowUpDown className="opacity-50" />
          {sortOptions.find((option) => option.value === selectedSortOption)?.label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: `${triggerWidth}px` }}>
        <Command>
          <CommandList>
            <CommandGroup>
              {sortOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  onSelect={(currentValue) => {
                    onSortOptionChange(currentValue === selectedSortOption ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedSortOption === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
