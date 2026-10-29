import { lesson, check } from './lesson.js'

const questions = [
  [1, 'Best fixed-size window', 'a', 'A slice excludes its stop index k, so values[:k] contains indexes 0 through k - 1: exactly k items.'],
  [1, 'Best fixed-size window', 'b', 'The current last index is left + k - 1. The next item is one position farther, at left + k; subtract values[left] and add that incoming item.'],
  [1, 'Best fixed-size window', 'c', 'Starting best at zero incorrectly beats every negative sum. Start with the first real window. On each slide, remove the outgoing value, add the incoming value, then compare total with best.'],
  [2, 'Longest unique substring', 'a', 'After adding the second b, removing a leaves bb, which is still invalid. Remove the first b too. A while loop keeps shrinking until the duplicate is gone.'],
  [2, 'Longest unique substring', 'b', 'Before shrinking, the window may be invalid, so its length cannot count toward best. Counting distinct characters across the whole string also ignores contiguity; pwwkew has four distinct characters but a longest unique substring of length three.'],
  [3, 'At most k distinct characters', 'a', 'Keep the expand, shrink, and best-length structure. Change the shrinking condition from a repeated character to len(counts) > k, deleting zero-count keys. This tracks contiguous substrings, not subsequences that skip positions.'],
]

const make = options => lesson({ track: 'patterns', unit: 'P06', sample: true, ...options })
export const slidingWindowSample = [
  make({
    id: 'sw-first-window', title: '1. Build the first window', stage: 'Fixed-size window',
    prompt: 'Given values and k, store the first k items in window and their sum in total. Leave values unchanged. This is the starting state, before anything slides.',
    starter: 'values = [2, 1, 5, 1, 3, 2]\nk = 3\n\n# Create window and total\n',
    solution: 'values = [2, 1, 5, 1, 3, 2]\nk = 3\nwindow = values[:k]\ntotal = sum(window)',
    tests: [check('First three values', 'assert window == [2, 1, 5]'), check('Starting sum', 'assert total == 8'), check('Input preserved', 'assert values == [2, 1, 5, 1, 3, 2]')],
    hints: ['A slice ending at k includes indexes 0 through k - 1.', 'Create window with values[:k], then use sum(window).'],
    note: 'A window is a contiguous range: neighboring items, without skipping positions. A fixed-size window keeps the same length as it moves.',
    takeaway: 'You have the initial state: a window of size 3 and a total of 8. Next, update that state when the window moves.',
    checkpoint: 'Which index is excluded by values[:k]? Why does that give exactly k items?',
  }),
  make({
    id: 'sw-slide-once', title: '2. Slide without starting over', stage: 'Fixed-size window',
    prompt: 'Write slide_once(values, left, k, total). The current window starts at left and has k items. Return (next_left, next_total) after moving one position right. Reuse total: subtract the outgoing item and add the incoming item. Assume the next full window exists.',
    starter: 'def slide_once(values, left, k, total):\n    # Return the new left index and updated total\n    pass\n',
    solution: 'def slide_once(values, left, k, total):\n    incoming = left + k\n    total = total - values[left] + values[incoming]\n    return left + 1, total',
    tests: [check('Remove 2, add 1', 'assert slide_once([2, 1, 5, 1, 3, 2], 0, 3, 8) == (1, 7)'), check('Next move', 'assert slide_once([2, 1, 5, 1, 3, 2], 1, 3, 7) == (2, 9)'), check('Negative values and size one', 'assert slide_once([-2, 4, -1, 3], 0, 2, 2) == (1, 3)\nassert slide_once([5, 1, 9], 0, 1, 5) == (1, 1)')],
    hints: ['The outgoing index is left. The incoming index is left + k.', 'Return left + 1 together with total - values[left] + values[left + k].'],
    note: 'The two windows overlap. Only one item leaves and one arrives, so a running sum can be updated without summing the overlapping items again.',
    takeaway: 'The update is old total - outgoing + incoming. The grader checks results; explain why your update does constant work.',
    checkpoint: 'Why is the incoming index left + k, rather than left + k - 1?',
  }),
  make({
    id: 'sw-best-fixed', title: '3. Find the best fixed window', stage: 'Fixed-size window',
    prompt: 'Write max_window_sum(values, k), returning the largest sum among contiguous windows of exactly k items. Assume 1 <= k <= len(values). Values may be negative. Combine the first-window setup and slide update; aim for one scan.',
    starter: 'def max_window_sum(values, k):\n    # Initialize total and best, then move the window\n    pass\n',
    solution: 'def max_window_sum(values, k):\n    total = sum(values[:k])\n    best = total\n    for right in range(k, len(values)):\n        total += values[right] - values[right - k]\n        best = max(best, total)\n    return best',
    tests: [check('Example: best total is 9', 'assert max_window_sum([2, 1, 5, 1, 3, 2], 3) == 9'), check('All-negative input', 'assert max_window_sum([-5, -2, -8], 2) == -7'), check('Boundary window sizes', 'assert max_window_sum([4], 1) == 4\nassert max_window_sum([2, 8, 1], 1) == 8\nassert max_window_sum([2, 8, 1], 3) == 11')],
    hints: ['Initialize best from the first actual window, not from zero.', 'For each incoming right index, the outgoing index is right - k. Update best after updating total.'],
    note: 'Invariant: total is the sum of the current k-item window; best is the largest window sum seen so far. Negative values are fine for this fixed-size update.',
    takeaway: 'You assembled the complete fixed-window pattern. Correct outputs do not prove complexity; explain how each slide reuses work.',
    checkpoint: 'Why does best = 0 break an all-negative input? What changes once per slide?',
  }),
  make({
    id: 'sw-shrink', title: '4. Shrink until the window is valid', stage: 'Variable-size window',
    prompt: 'Write shrink_window(text, left, right, counts). The character at right has already been added to counts. Earlier characters were unique, so only this newly added character may now repeat. Move left until that character occurs once. Update counts in place, deleting zero-count keys, and return the new left index.',
    starter: 'def shrink_window(text, left, right, counts):\n    # Keep removing from the left while the new character repeats\n    pass\n',
    solution: 'def shrink_window(text, left, right, counts):\n    while counts[text[right]] > 1:\n        outgoing = text[left]\n        counts[outgoing] -= 1\n        if counts[outgoing] == 0:\n            del counts[outgoing]\n        left += 1\n    return left',
    tests: [check('One shrink', 'counts = {"a": 2, "b": 1, "c": 1}\nassert shrink_window("abca", 0, 3, counts) == 1\nassert counts == {"a": 1, "b": 1, "c": 1}'), check('Needs while, not just if', 'counts = {"a": 1, "b": 2}\nassert shrink_window("abba", 0, 2, counts) == 2\nassert counts == {"b": 1}'), check('Already valid', 'counts = {"a": 1, "b": 1, "c": 1}\nassert shrink_window("abc", 0, 2, counts) == 0\nassert counts == {"a": 1, "b": 1, "c": 1}')],
    hints: ['Use while counts[text[right]] > 1. Removing one character may not remove the duplicate.', 'Decrement text[left], delete its key if the count reaches zero, then advance left.'],
    note: 'A variable-size window grows on the right and shrinks on the left when its constraint is broken. In "abba", removing "a" alone still leaves duplicate "b" characters.',
    takeaway: 'Shrink until valid, not just once. Both the left index and the counts must describe the same current window.',
    checkpoint: 'In "abba", why does left need to move twice when the second b arrives?',
  }),
  make({
    id: 'sw-longest-unique', title: '5. Apply it: longest unique substring', stage: 'Variable-size window',
    prompt: 'Write longest_unique(text), returning the length of the longest contiguous substring with no repeated characters. Combine right-side growth, left-side shrinking and a best length. An empty string returns 0. Write the complete function: previous exercise helpers are not automatically available.',
    starter: 'def longest_unique(text):\n    # Track left, character counts, and best length\n    pass\n',
    solution: 'def longest_unique(text):\n    counts = {}\n    left = 0\n    best = 0\n    for right, char in enumerate(text):\n        counts[char] = counts.get(char, 0) + 1\n        while counts[char] > 1:\n            outgoing = text[left]\n            counts[outgoing] -= 1\n            if counts[outgoing] == 0:\n                del counts[outgoing]\n            left += 1\n        best = max(best, right - left + 1)\n    return best',
    tests: [check('Repeated and all-same characters', 'assert longest_unique("abcabcbb") == 3\nassert longest_unique("bbbbb") == 1'), check('Must keep a contiguous window', 'assert longest_unique("pwwkew") == 3\nassert longest_unique("dvdf") == 3'), check('Shrinking and boundaries', 'assert longest_unique("abba") == 2\nassert longest_unique("") == 0\nassert longest_unique("a") == 1\nassert longest_unique("abcdef") == 6')],
    hints: ['After adding text[right], shrink while its count is greater than one.', 'Update best only after restoring validity. The inclusive window length is right - left + 1.'],
    note: 'Invariant after shrinking: every character in text[left:right + 1] occurs once. Each pointer only moves forward; under ordinary dictionary-operation assumptions, the approach is linear in string length.',
    takeaway: 'You built a full variable-window solution. Next, transfer the structure to a different validity condition.',
    checkpoint: 'Why is updating best before shrinking wrong? Why is this not the same as counting all distinct characters?',
  }),
  make({
    id: 'sw-at-most-k', title: '6. Transfer it: at most k distinct characters', stage: 'Recognize and transfer',
    prompt: 'Write longest_at_most_k(text, k), returning the longest contiguous substring length with at most k distinct characters. Assume k >= 0. Repeated characters are allowed. For "eceba" and k = 2, the answer is 3 ("ece"). Decide what now makes a window invalid.',
    starter: 'def longest_at_most_k(text, k):\n    # What condition should make the left pointer move?\n    pass\n',
    solution: 'def longest_at_most_k(text, k):\n    counts = {}\n    left = 0\n    best = 0\n    for right, char in enumerate(text):\n        counts[char] = counts.get(char, 0) + 1\n        while len(counts) > k:\n            outgoing = text[left]\n            counts[outgoing] -= 1\n            if counts[outgoing] == 0:\n                del counts[outgoing]\n            left += 1\n        best = max(best, right - left + 1)\n    return best',
    tests: [check('Repeats are allowed', 'assert longest_at_most_k("eceba", 2) == 3\nassert longest_at_most_k("aa", 1) == 2'), check('Transfer beyond the example', 'assert longest_at_most_k("abaccc", 2) == 4\nassert longest_at_most_k("abc", 3) == 3'), check('Empty and zero allowance', 'assert longest_at_most_k("", 2) == 0\nassert longest_at_most_k("abc", 0) == 0')],
    hints: ['The number of distinct characters is len(counts), if zero-count keys are removed.', 'Shrink while len(counts) > k. You no longer shrink just because a character repeats.'],
    note: 'The expand/shrink skeleton stays the same, but validity changes: the window may contain repeats as long as it uses no more than k different characters.',
    takeaway: 'Pattern transfer means adapting the validity rule, not copying the previous condition unchanged. Other pattern groups are intentionally outside this sample.',
    checkpoint: 'What stayed the same from longest_unique, and which exact condition changed? Would this window rule find a non-contiguous subsequence?',
  }),
].map((exercise, index) => {
  const [questionNumber, questionTitle, stepLetter, checkpointAnswer] = questions[index]
  return { ...exercise, questionNumber, questionTitle, stepLetter, checkpointAnswer, title: `${stepLetter}. ${exercise.title.slice(3)}` }
})
