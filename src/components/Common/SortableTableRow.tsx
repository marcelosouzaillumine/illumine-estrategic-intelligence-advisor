import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SortableTableRowProps {
  id: string;
  isDraggable?: boolean;
  className?: string;
  as?: 'tr' | 'div';
  children: React.ReactNode;
}

export function SortableTableRow({ id, isDraggable = true, className, as: Component = 'tr', children }: SortableTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isDraggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? 'var(--color-slate-50)' : undefined,
    zIndex: isDragging ? 50 : 'auto',
    position: isDragging ? ('relative' as const) : undefined,
  };

  const expectedChildType = Component === 'tr' ? 'td' : 'div';

  return (
    <Component
      ref={setNodeRef}
      style={style}
      className={cn(className, isDragging ? 'shadow-lg border-y border-primary/20' : '')}
    >
      {React.Children.map(children, (child, index) => {
        if (index === 0 && React.isValidElement(child) && child.type === expectedChildType && isDraggable) {
          return React.cloneElement(child as React.ReactElement<any>, {
            children: (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  {...attributes}
                  {...listeners}
                  className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-primary transition-colors touch-none"
                >
                  <GripVertical size={14} />
                </button>
                {(child as React.ReactElement<any>).props.children}
              </div>
            )
          });
        }
        return child;
      })}
    </Component>
  );
}
