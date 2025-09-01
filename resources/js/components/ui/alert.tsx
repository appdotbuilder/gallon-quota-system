import React from 'react';
import { cn } from '@/lib/utils';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'destructive';
}

export function Alert({ className, ...props }: AlertProps) {
    return (
        <div
            role="alert"
            className={cn(
                'relative w-full rounded-lg border border-gray-200 p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-gray-950',
                className
            )}
            {...props}
        />
    );
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    variant?: 'default';
}

export function AlertDescription({ className, ...props }: AlertDescriptionProps) {
    return (
        <div
            className={cn('text-sm [&_p]:leading-relaxed', className)}
            {...props}
        />
    );
}