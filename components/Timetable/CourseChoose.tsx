import Link from 'next/link';
import { omit, map } from 'lodash';
import { CourseItem } from 'lib/types/CourseItem';
import { getWeekStr } from 'lib/getGridCells';
import { Props } from './CourseDetailModal';

export const CourseChoose = ({ courses, router, num }: Props) => {
  return (
    <>
      {map(courses, (course: CourseItem) => {
        const params = {
          pathname: router.asPath.split('?')[0],
          query: { ...omit(router.query, 'all'), modal: num, seq: course.seq },
        };
        const weekStr = getWeekStr(course);

        return (
          <div key={course.seq}>
            <Link href={params} shallow>
              <a className="text-blue-500">
                {course.name}{' '}
                <span className="text-sm font-light text-gray-500">
                  {weekStr}
                </span>
              </a>
            </Link>
          </div>
        );
      })}
    </>
  );
};
