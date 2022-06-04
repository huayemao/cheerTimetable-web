import { LOCATIONS, TEACHERS, COURSES } from '../../_data/metas'

export const getLocationName = async (id) =>
  (await LOCATIONS).find((t) => t.jsid === id)?.jsmc || 'unknown'

export const getTeacherIdbyjg0101id = async (id) =>
  (await TEACHERS)
    .find((t) => t.jg0101id === id)
    ?.jgxm.match(/\[(.+)\]/)?.[1] || 'unknown'

export const getSubjectMeta = async (subjectId: string) =>
  (await COURSES).find((e) => e.kch?.trim() === subjectId.trim())
