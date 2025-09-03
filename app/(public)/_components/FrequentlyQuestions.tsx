import { PlusIcon } from 'lucide-react';
import { Accordion as AccordionPrimitive } from 'radix-ui';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';

const items = [
  {
    id: '1',
    title: 'What is AlmotazLMS?',
    content:
      'AlmotazLMS is a medical learning platform that provides high-quality online courses in various medical fields. You can access lectures, materials, and resources anytime, anywhere.',
  },
  {
    id: '2',
    title: 'How much does it cost to enroll?',
    content:
      'Our courses are offered at affordable prices depending on the specialization. Some free resources are also available. You only pay for the courses you choose—no hidden fees or contracts.',
  },
  {
    id: '3',
    title: 'Where can I access the courses?',
    content:
      'You can access AlmotazLMS on any internet-connected device: laptops, tablets, or smartphones. You can also download resources to study offline when needed.',
  },
  {
    id: '4',
    title: 'How do I cancel my enrollment?',
    content:
      "You can cancel your enrollment at any time directly from your dashboard. There are no cancellation fees—you're free to join and leave as you wish.",
  },
  {
    id: '5',
    title: 'What kind of courses are available?',
    content:
      'AlmotazLMS offers a wide range of medical courses, from general medicine and nursing to specialized fields such as cardiology, radiology, and surgery.',
  },
  {
    id: '6',
    title: 'Is AlmotazLMS suitable for medical students?',
    content:
      'Yes, the platform is designed for both students and professionals. Medical students can find structured learning materials, while practitioners can enhance their skills with advanced courses.',
  },
];

export default function FAQ() {
  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-center'>
        Frequently Asked Questions
      </h2>
      <Accordion type='single' collapsible className='w-full' defaultValue='1'>
        {items.map((item) => (
          <AccordionItem
            value={item.id}
            key={item.id}
            className='border rounded-lg px-4 py-2 shadow-sm my-2 hover:text-accent-foreground'
          >
            <AccordionPrimitive.Header className='flex'>
              <AccordionPrimitive.Trigger className='focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-xl font-bold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0'>
                {item.title}
                <PlusIcon
                  size={26}
                  className='pointer-events-none shrink-0 opacity-70 transition-transform duration-200'
                  aria-hidden='true'
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className='text-muted-foreground pb-2 pt-2 text-lg'>
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
