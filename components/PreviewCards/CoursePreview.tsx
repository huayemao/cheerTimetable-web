import { Fragment, useEffect } from 'react'
import { useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { ArrowNarrowRightIcon, ChevronDownIcon } from '@heroicons/react/solid'
import { EyeIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Course, Subject } from '@prisma/client'
import List from '../common/List'

export function CoursePreview({ course }: { course: Course }) {
  const router = useRouter()
  return <>todo</>
}
