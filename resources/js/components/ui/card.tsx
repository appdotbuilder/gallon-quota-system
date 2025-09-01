import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated';
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-lg border border-gray-200 bg-white shadow-sm',
                variant === 'elevated' && 'shadow-lg',
                className
            )}
            {...props}
        />
    );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default';
}

export function CardHeader({ className, ...props }: CardHeaderProps) {
    return (
        <div
            className={cn('flex flex-col space-y-1.5 p-6', className)}
            {...props}
        />
    );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function CardTitle({ className, as: Component = 'h3', ...props }: CardTitleProps) {
    return (
        <Component
            className={cn('text-lg font-semibold leading-none tracking-tight', className)}
            {...props}
        />
    );
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    variant?: 'default' | 'muted';
}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
    return (
        <p
            className={cn('text-sm text-gray-500', className)}
            {...props}
        />
    );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'padded';
}

export function CardContent({ className, variant = 'default', ...props }: CardContentProps) {
    return <div className={cn('p-6 pt-0', variant === 'padded' && 'p-8', className)} {...props} />;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'actions';
}

export function CardFooter({ className, ...props }: CardFooterProps) {
    return (
        <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
    );
}