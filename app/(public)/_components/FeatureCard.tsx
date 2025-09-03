import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';

interface featureProps {
  title: string;
  description: string;
  icon: string;
}
const features: featureProps[] = [
  {
    title: 'Comperhensive Course Library',
    description: 'Access a wide range of courses on various topics.',
    icon: '📗',
  },
  {
    title: 'Interactive Learning',
    description: 'Engage with interactive content and quizzes.',
    icon: '💻',
  },
  {
    title: 'Progress Tracking',
    description: 'Monitor your progress and achievements.',
    icon: '📈',
  },
  {
    title: 'Certification',
    description: 'Earn certificates for completed courses.',
    icon: '📜',
  },
  {
    title: 'Community',
    description: 'Connect with other learners and instructors.',
    icon: '👥',
  },
];

export function FeatureCard() {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnMouseEnter: true,
        }),
      ]}
      opts={{
        loop: true,
        align: 'start',
        duration: 3000,
      }}
    >
      <CarouselContent>
        {features.map((feature, index) => (
          <CarouselItem key={index} className='basis-1/4'>
            <Card className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <div className='text-4xl mb-4'>{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>{feature.description}</p>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export default FeatureCard;
