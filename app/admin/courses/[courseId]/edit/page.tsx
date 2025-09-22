import { getCourse } from '@/app/data/admin/admin-get-course';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditCourseForm from './_components/EditCourseForm';
import CourseStructure from './_components/CourseStructure';

type Params = Promise<{ courseId: string }>;

export default async function EditCoursePage({ params }: { params: Params }) {
  const { courseId } = await params;
  const data = await getCourse(courseId);

  return (
    <div>
      <h1 className='text-3xl font-bold mb-8'>
        Edit Course:{' '}
        <span className='text-primary underline'>{data.title}</span>
      </h1>
      <Tabs defaultValue='' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='basic-info'>Basic Info</TabsTrigger>
          <TabsTrigger value='course-structure'>Course Structure</TabsTrigger>
        </TabsList>
        <TabsContent value='basic-info'>
          <Card>
            <CardTitle className='text-2xl ml-5'>Basic Info</CardTitle>
            <CardDescription className='ml-5'>
              Provide basic information about the course.
            </CardDescription>
            <CardContent>
              <EditCourseForm data={data} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='course-structure'>
          <Card>
            <CardTitle className='text-2xl ml-5'>Course Structure</CardTitle>
            <CardDescription className='ml-5'>
              Here you can add and remove chapters and lessons.
            </CardDescription>
            <CardContent>
              <CourseStructure data={data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
