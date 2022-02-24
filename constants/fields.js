import STUDENTS from '../_data/students.json'
import LOCATIONS from '../_data/locations.json'
import TEACHERS from '../_data/teachers.json'

const FIELDS = {
  student: 'student',
  teacher: 'teacher',
  location: 'location',
}

export const FIELDS_CONFIG = {
  [FIELDS.student]: {
    data: STUDENTS,
    getFiledName: 'xs0101id',
    searchFieldName: 'xm',
  },
  [FIELDS.teacher]: {
    data: TEACHERS,
    getFiledName: 'jg0101id',
    searchFieldName: 'jgxm',
  },
  [FIELDS.location]: {
    data: LOCATIONS,
    getFiledName: 'jsid',
    searchFieldName: 'jsmc',
  },
}

export default {
  FIELDS_CONFIG,
}
