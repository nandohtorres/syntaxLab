// A teaching sequence, not a universal difficulty score. Dependencies come from
// the existing curriculum; related techniques build toward branching and DP.
export const patternLearningOrder = [
  'P02', // Array scans and running state
  'P01', // Sets and dictionaries
  'P03', // Stacks
  'P04', // Two pointers and palindrome expansion
  'P06', // Sliding windows: dictionaries + two pointers
  'P05', // Binary search
  'P13', // Intervals: array ordering and sorted ranges
  'P08', // Matrices: extend array indexing into two dimensions
  'P07', // Linked structures: pointers and node references
  'P09', // Trees and BSTs
  'P12', // Heaps: priority ordering after node structures
  'P10', // Graphs: generalize traversal and grid connectivity
  'P11', // Backtracking and tries
  'P15', // Bits: specialized integer techniques
  'P14', // DP and greedy reasoning: combine state and subproblems
]

const rank = new Map(patternLearningOrder.map((id, index) => [id, index]))
export function orderForLearning(questions) {
  return [...questions].sort((a, b) => (rank.get(a.unit) ?? Infinity) - (rank.get(b.unit) ?? Infinity))
}
