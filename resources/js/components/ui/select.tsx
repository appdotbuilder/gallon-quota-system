import React from 'react';
import { cn } from '@/lib/utils';

interface SelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
}

export function Select({ value, onValueChange, children }: SelectProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value || '');
    
    const handleSelect = (newValue: string) => {
        setSelectedValue(newValue);
        onValueChange?.(newValue);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<SelectContextProps>, {
                        isOpen,
                        setIsOpen,
                        selectedValue,
                        onSelectValue: handleSelect,
                    });
                }
                return child;
            })}
        </div>
    );
}

interface SelectContextProps {
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
    selectedValue?: string;
    onSelectValue?: (value: string) => void;
}

interface SelectTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
    selectedValue?: string;
    children: React.ReactNode;
}

export function SelectTrigger({ 
    className, 
    children, 
    isOpen, 
    setIsOpen, 
    ...props 
}: SelectTriggerProps) {
    return (
        <button
            type="button"
            className={cn(
                'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            onClick={() => setIsOpen?.(!isOpen)}
            {...props}
        >
            {children}
            <svg
                className={cn('h-4 w-4 opacity-50 transition-transform', isOpen && 'rotate-180')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>
    );
}

interface SelectValueProps {
    placeholder?: string;
    selectedValue?: string;
}

export function SelectValue({ placeholder, selectedValue }: SelectValueProps) {
    return (
        <span className={cn(!selectedValue && 'text-gray-500')}>
            {selectedValue || placeholder}
        </span>
    );
}

interface SelectContentProps {
    children: React.ReactNode;
    isOpen?: boolean;
    onSelectValue?: (value: string) => void;
}

export function SelectContent({ children, isOpen, onSelectValue }: SelectContentProps) {
    if (!isOpen) return null;
    
    return (
        <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<SelectContextProps>, {
                        onSelectValue,
                    });
                }
                return child;
            })}
        </div>
    );
}

interface SelectItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
    value: string;
    onSelectValue?: (value: string) => void;
    children: React.ReactNode;
}

export function SelectItem({ 
    className, 
    value, 
    onSelectValue, 
    children, 
    ...props 
}: SelectItemProps) {
    return (
        <div
            className={cn(
                'relative flex cursor-pointer items-center px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100',
                className
            )}
            onClick={() => onSelectValue?.(value)}
            {...props}
        >
            {children}
        </div>
    );
}