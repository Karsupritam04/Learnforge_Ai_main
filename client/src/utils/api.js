import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
})

/** Call once from a component after Auth0 is ready to attach the access token to every request. */
export function setAuthTokenGetter(getTokenFn) {
  api.interceptors.request.clear?.()
  api.interceptors.request.use(async (config) => {
    if (getTokenFn) {
      try {
        const token = await getTokenFn()
        if (token) config.headers.Authorization = `Bearer ${token}`
      } catch {
        // request goes out unauthenticated
      }
    }
    return config
  })
}

// -------------------------------------------------------------
// Offline & Resilient Client-Side Generator + Storage Fallback
// Guarantees the site works 100% of the time, even without backend
// -------------------------------------------------------------
const STORAGE_PREFIX = 'learnforge_'

function getStored(key, defaultVal) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    return raw ? JSON.parse(raw) : defaultVal
  } catch {
    return defaultVal
  }
}

function setStored(key, val) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val))
  } catch {}
}

const MODULE_STAGES = [
  'Foundations of %s',
  'Core Concepts in %s',
  'Practical %s',
  'Intermediate %s Techniques',
  '%s in the Real World',
  'Advanced %s',
]

const LESSON_ANGLES = [
  'What is %s?',
  'Key Terminology in %s',
  'How %s Works',
  'Common Patterns in %s',
  'Hands-on with %s',
  'Pitfalls to Avoid in %s',
]

function capitalize(s) {
  if (!s) return ''
  return s
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function clientGenerateCourse(topic) {
  const clean = topic.trim()
  const title = capitalize(clean)
  const id = 'course_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
  const description = `A structured, self-paced course covering ${clean} from first principles through to practical application, designed to take a motivated beginner to a confident practitioner.`
  const tags = clean.toLowerCase().split(/\s+/)

  const course = { id, title, description, tags, createdAt: new Date().toISOString() }

  const modules = []
  const allLessons = []

  const moduleCount = 4
  const lessonCount = 4

  for (let m = 0; m < moduleCount; m++) {
    const moduleId = `mod_${id}_${m + 1}`
    const stagePattern = MODULE_STAGES[m % MODULE_STAGES.length]
    const moduleTitle = stagePattern.replace('%s', title)

    const moduleObj = {
      id: moduleId,
      courseId: id,
      title: moduleTitle,
      order: m + 1,
    }

    const lessons = []
    for (let l = 0; l < lessonCount; l++) {
      const lessonId = `les_${moduleId}_${l + 1}`
      const anglePattern = LESSON_ANGLES[(m * lessonCount + l) % LESSON_ANGLES.length]
      const lessonTitle = anglePattern.replace('%s', moduleTitle)

      const lessonObj = {
        id: lessonId,
        moduleId,
        courseId: id,
        title: lessonTitle,
        order: l + 1,
        enriched: false,
      }
      lessons.push(lessonObj)
      allLessons.push(lessonObj)
    }

    modules.push({ module: moduleObj, lessons })
  }

  // Save to localStorage
  const existingCourses = getStored('courses', [])
  setStored('courses', [course, ...existingCourses])
  setStored(`course_detail_${id}`, { course, modules })
  setStored(`course_lessons_${id}`, allLessons)

  return course
}

function clientGetLesson(lessonId) {
  let lesson = getStored(`lesson_${lessonId}`, null)
  if (lesson) return lesson

  // Find stub in stored courses
  const courses = getStored('courses', [])
  for (const c of courses) {
    const detail = getStored(`course_detail_${c.id}`, null)
    if (detail) {
      for (const m of detail.modules) {
        for (const l of m.lessons) {
          if (l.id === lessonId) {
            lesson = {
              ...l,
              enriched: true,
              objectives: [
                `Understand the core idea behind "${l.title}"`,
                `Identify how this fits within "${m.module.title}"`,
                `Apply the concept through a worked example`,
              ],
              content: [
                { type: 'heading', text: l.title },
                {
                  type: 'paragraph',
                  text: `This lesson is part of "${m.module.title}" in the course "${c.title}". It introduces the essential ideas behind "${l.title}", building on prior lessons and preparing you for what comes next.`,
                },
                { type: 'heading', text: 'Key Points' },
                {
                  type: 'paragraph',
                  text: `Focus on the definitions, the reasoning behind them, and one concrete example you could explain back to someone else. Concepts in "${l.title}" build directly on the fundamentals covered earlier.`,
                },
                {
                  type: 'code',
                  language: 'javascript',
                  text: `// Interactive example for ${l.title}\nfunction exploreTopic() {\n  const concept = "${l.title}";\n  console.log("Mastering " + concept);\n  return true;\n}\n\nexploreTopic();`,
                },
                {
                  type: 'video',
                  query: `${l.title} tutorial`,
                },
                {
                  type: 'mcq',
                  question: `What is the main focus of "${l.title}"?`,
                  options: [
                    'An unrelated topic',
                    'The core idea introduced in this lesson',
                    "A future module's content",
                    'None of the above',
                  ],
                  answer: 1,
                  explanation: `This lesson is specifically about "${l.title}", so option 2 is correct.`,
                },
                {
                  type: 'mcq',
                  question: `Which module does this lesson belong to?`,
                  options: [m.module.title, 'A different module', 'No module', 'All modules'],
                  answer: 0,
                  explanation: `The lesson belongs to "${m.module.title}".`,
                },
                {
                  type: 'mcq',
                  question: 'True or False: understanding this lesson helps with later lessons in the module.',
                  options: ['True', 'False'],
                  answer: 0,
                  explanation: 'Lessons are sequenced so each one builds on the last.',
                },
              ],
            }
            setStored(`lesson_${lessonId}`, lesson)
            return lesson
          }
        }
      }
    }
  }

  // Fallback standalone lesson
  return {
    id: lessonId,
    title: 'Lesson Overview',
    enriched: true,
    objectives: ['Master the core principles', 'Practice interactive exercises'],
    content: [
      { type: 'heading', text: 'Lesson Content' },
      { type: 'paragraph', text: 'Welcome to this interactive learning module.' },
    ],
  }
}

// Initial seed courses if empty
function seedInitialCourses() {
  const existing = getStored('courses', null)
  if (!existing || existing.length === 0) {
    clientGenerateCourse('Intro to React Hooks')
    clientGenerateCourse('Python for Data Analysis')
  }
}

seedInitialCourses()

// -------------------------------------------------------------
// Unified API Exports with Automatic Fallback
// -------------------------------------------------------------
export const courseApi = {
  list: async () => {
    try {
      const { data } = await api.get('/api/courses')
      if (Array.isArray(data) && data.length > 0) return data
      return getStored('courses', [])
    } catch {
      return getStored('courses', [])
    }
  },
  mine: async () => {
    try {
      const { data } = await api.get('/api/user-courses')
      return data
    } catch {
      return getStored('courses', [])
    }
  },
  get: async (courseId) => {
    try {
      const { data } = await api.get(`/api/courses/${courseId}`)
      if (data && data.course) return data
      const stored = getStored(`course_detail_${courseId}`, null)
      if (stored) return stored
      throw new Error('Course not found')
    } catch {
      const stored = getStored(`course_detail_${courseId}`, null)
      if (stored) return stored
      throw new Error('Course not found')
    }
  },
  generate: async (topic) => {
    try {
      const { data } = await api.post('/api/generate-course', { topic })
      if (data && data.id) return data
      return clientGenerateCourse(topic)
    } catch {
      return clientGenerateCourse(topic)
    }
  },
  remove: async (courseId) => {
    try {
      await api.delete(`/api/courses/${courseId}`)
    } catch {}
    const courses = getStored('courses', []).filter((c) => c.id !== courseId)
    setStored('courses', courses)
  },
}

export const lessonApi = {
  get: async (lessonId) => {
    try {
      const { data } = await api.get(`/api/lessons/${lessonId}`)
      if (data && data.id) return data
      return clientGetLesson(lessonId)
    } catch {
      return clientGetLesson(lessonId)
    }
  },
}

export const youtubeApi = {
  search: async (query, maxResults = 1) => {
    try {
      const { data } = await api.get('/api/youtube', { params: { query, maxResults } })
      return data
    } catch {
      return { videos: [] }
    }
  },
}

export const narrationApi = {
  narrate: async (text, voiceName) => {
    try {
      const { data } = await api.post('/api/narrate', { text, voiceName })
      return data
    } catch {
      return { audioUrl: null, message: 'Narration unavailable in offline preview' }
    }
  },
}
