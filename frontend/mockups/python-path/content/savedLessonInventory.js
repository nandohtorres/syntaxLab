import { leetCodePracticeLessons } from './blind75Practice.js'
import { lessons } from './index.js'
import { slidingWindowSample } from './slidingWindowSample.js'

// Preserve original and current guided IDs so existing drafts survive curriculum updates.
export const savedLessonInventory = [...new Map([...lessons, ...slidingWindowSample, ...leetCodePracticeLessons].map(item => [item.id, item])).values()]
