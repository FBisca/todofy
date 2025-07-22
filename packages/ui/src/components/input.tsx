import * as React from 'react'

import { cn } from '@repo/ui/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'

const variants = cva(
  'file:text-foreground placeholder:text-muted-foreground flex w-full min-w-0 rounded-md border bg-transparent text-base outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        default:
          'shadow-xs selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ',
        ghost: 'bg-transparent border-none hover:bg-transparent hover:text-accent-foreground',
      },
      size: {
        default: 'h-9 px-3 py-1',
        sm: 'h-8 px-2 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Input({
  className,
  type,
  variant,
  size,
  ...props
}: Omit<React.ComponentProps<'input'>, 'size'> & VariantProps<typeof variants>) {
  return <input type={type} data-slot="input" className={cn(variants({ variant, size, className }))} {...props} />
}

export { Input }
