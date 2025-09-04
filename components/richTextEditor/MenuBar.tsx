import React, { useEffect, useState } from 'react';
import { type Editor } from '@tiptap/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Toggle } from '../ui/toggle';
import {
  Bold,
  Code,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Underline,
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface iAppProps {
  editor: Editor | null;
}

const MenuBar = ({ editor }: iAppProps) => {
  const [_, setRender] = useState(0);

  useEffect(() => {
    if (!editor) return;
    const rerender = () => setRender((x) => x + 1);
    editor.on('update', rerender);
    editor.on('selectionUpdate', rerender);
    return () => {
      editor.off('update', rerender);
      editor.off('selectionUpdate', rerender);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div className='border border-input border-t-0 border-x-0 rounded-t-lg bg-card flex flex-wrap gap-1 items-center p-2'>
      <TooltipProvider>
        <div className='flex flex-wrap gap-1'>
          {/* bold */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size='sm'
                pressed={editor.isActive('bold')}
                onPressedChange={() =>
                  editor.chain().focus().toggleBold().run()
                }
                className={cn(
                  'h-8 w-8',
                  editor.isActive('bold') &&
                    'bg-primary text-primary-foreground'
                )}
              >
                <Bold />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bold</p>
            </TooltipContent>
          </Tooltip>

          {/* italic */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size='sm'
                pressed={editor.isActive('italic')}
                onPressedChange={() =>
                  editor.chain().focus().toggleItalic().run()
                }
                className={cn(
                  'h-8 w-8',
                  editor.isActive('italic') &&
                    'bg-primary text-primary-foreground'
                )}
              >
                <Italic />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Italic</p>
            </TooltipContent>
          </Tooltip>

          {/* underline */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size='sm'
                pressed={editor.isActive('underline')}
                onPressedChange={() =>
                  editor.chain().focus().toggleUnderline().run()
                }
                className={cn(
                  'h-8 w-8',
                  editor.isActive('underline') &&
                    'bg-primary text-primary-foreground'
                )}
              >
                <Underline />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Underline</p>
            </TooltipContent>
          </Tooltip>

          {/* strikethrough */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size='sm'
                pressed={editor.isActive('strike')}
                onPressedChange={() =>
                  editor.chain().focus().toggleStrike().run()
                }
                className={cn(
                  'h-8 w-8',
                  editor.isActive('strike') &&
                    'bg-primary text-primary-foreground'
                )}
              >
                <Strikethrough />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Strikethrough</p>
            </TooltipContent>
          </Tooltip>

          {/* code */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size='sm'
                pressed={editor.isActive('code')}
                onPressedChange={() =>
                  editor.chain().focus().toggleCode().run()
                }
                className={cn(
                  'h-8 w-8',
                  editor.isActive('code') &&
                    'bg-primary text-primary-foreground'
                )}
              >
                <Code />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Code</p>
            </TooltipContent>
          </Tooltip>

          {/* heading 1 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size='sm'
                pressed={editor.isActive('heading', { level: 1 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={cn(
                  'h-8 w-8',
                  editor.isActive('heading', { level: 1 }) &&
                    'bg-primary text-primary-foreground'
                )}
              >
                <Heading1Icon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Heading 1</p>
            </TooltipContent>
          </Tooltip>

          {/* heading 2 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size='sm'
                pressed={editor.isActive('heading', { level: 2 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={cn(
                  'h-8 w-8',
                  editor.isActive('heading', { level: 2 }) &&
                    'bg-primary text-primary-foreground'
                )}
              >
                <Heading2Icon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Heading 2</p>
            </TooltipContent>
          </Tooltip>

          {/* heading 3 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size='sm'
                pressed={editor.isActive('heading', { level: 3 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={cn(
                  'h-8 w-8',
                  editor.isActive('heading', { level: 3 }) &&
                    'bg-primary text-primary-foreground'
                )}
              >
                <Heading3Icon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Heading 3</p>
            </TooltipContent>
          </Tooltip>

          {/* bullet list */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size='sm'
                pressed={editor.isActive('bulletList')}
                onPressedChange={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                className={cn(
                  'h-8 w-8',
                  editor.isActive('bulletList') &&
                    'bg-primary text-primary-foreground'
                )}
              >
                <List />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bullet List</p>
            </TooltipContent>
          </Tooltip>

          {/* ordered list */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size='sm'
                pressed={editor.isActive('orderedList')}
                onPressedChange={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                className={cn(
                  'h-8 w-8',
                  editor.isActive('orderedList') &&
                    'bg-primary text-primary-foreground'
                )}
              >
                <ListOrdered />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ordered List</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className='w-px h-8 bg-border mx-2'></div>

        {/* text alignment */}
        <div className='flex flex-wrap gap-1'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size='sm'
                pressed={editor.isActive({ textAlign: 'left' })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign('left').run()
                }
                className={cn(
                  'h-8 w-8',
                  editor.isActive({ textAlign: 'left' }) &&
                    'bg-primary text-primary-foreground'
                )}
              >
                <AlignLeft />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Align Left</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size='sm'
                pressed={editor.isActive({ textAlign: 'center' })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign('center').run()
                }
                className={cn(
                  'h-8 w-8',
                  editor.isActive({ textAlign: 'center' }) &&
                    'bg-primary text-primary-foreground'
                )}
              >
                <AlignCenter />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Align Center</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size='sm'
                pressed={editor.isActive({ textAlign: 'right' })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign('right').run()
                }
                className={cn(
                  'h-8 w-8',
                  editor.isActive({ textAlign: 'right' }) &&
                    'bg-primary text-primary-foreground'
                )}
              >
                <AlignRight />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Align Right</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size='sm'
                pressed={editor.isActive({ textAlign: 'justify' })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign('justify').run()
                }
                className={cn(
                  'h-8 w-8',
                  editor.isActive({ textAlign: 'justify' }) &&
                    'bg-primary text-primary-foreground'
                )}
              >
                <AlignJustify />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Align Justify</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className='w-px h-8 bg-border mx-2'></div>

        {/* undo / redo */}
        <div className='flex flex-wrap gap-1'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size='sm'
                onClick={() => editor.chain().focus().undo().run()}
                type='button'
                variant='ghost'
                disabled={!editor.can().undo()}
              >
                <Undo />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size='sm'
                onClick={() => editor.chain().focus().redo().run()}
                type='button'
                variant='ghost'
                disabled={!editor.can().redo()}
              >
                <Redo />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default MenuBar;
