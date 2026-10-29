// Small worked examples complement the existing concept illustrations.
// Each frame shows state after the action described, not a complete solution.
const frame = (title, values, active, note) => ({ title, values, active, note })
const example = (goal, steps, takeaway) => ({ goal, steps, takeaway })

export const patternWalkthroughs = {
  P01: example('Count each number in [4, 2, 4].', [
    frame('Read 4', ['4: 1'], [0], 'No count yet: start 4 at one.'),
    frame('Read 2', ['4: 1', '2: 1'], [1], 'A new key gets its own count.'),
    frame('Read 4 again', ['4: 2', '2: 1'], [0], 'Update the existing count. Do not scan the earlier items again.'),
  ], 'A set remembers whether something appeared. A dictionary can remember how often, where, or another useful value.'),
  P02: example('Build running totals for [2, 1, 3].', [
    frame('Start at zero', ['total = 0'], [0], 'Before reading any numbers, the total is zero.'),
    frame('Read 2, then 1', ['2', '3'], [1], 'The first total is 2. Adding 1 makes the next total 3.'),
    frame('Read 3', ['2', '3', '6'], [2], 'Add to the saved total: 3 + 3 = 6.'),
  ], 'State has a meaning: total is the sum of everything read so far. Update it once per item.'),
  P03: example('Check whether the brackets in ([]) are balanced.', [
    frame('Push opening brackets', ['bottom (', 'top ['], [1], 'Read ( and [, saving the most recent opening at the top.'),
    frame('Read ]', ['top ('], [0], 'It matches [. Pop that bracket and reveal (.'),
    frame('Read )', ['empty stack'], [0], 'Pop the matching (. No openings remain: the sequence is valid.'),
  ], 'A closing bracket must match the top immediately. A mismatch or leftover opening makes the sequence invalid.'),
  P04: example('Find two values totaling 10 in sorted [1, 3, 5, 7].', [
    frame('Start at the ends', ['L: 1', '3', '5', 'R: 7'], [0, 3], '1 + 7 = 8, which is too small.'),
    frame('Move left inward', ['1', 'L: 3', '5', 'R: 7'], [1, 3], 'With 1 fixed, even the largest partner was too small. Discard 1.'),
    frame('Check the new pair', ['3 + 7 = 10'], [0], 'The pair matches. If the sum were too large, move the right pointer left.'),
  ], 'Sorting gives pointer moves a reason. Without that relationship, this elimination rule is unsafe.'),
  P05: example('Find 11 in sorted [1, 3, 5, 7, 9, 11, 13].', [
    frame('Check the middle', ['1', '3', '5', '7', '9', '11', '13'], [3], '7 is below 11. Discard 7 and everything to its left.'),
    frame('Search the remaining half', ['9', '11', '13'], [1], 'The new middle is 11.'),
    frame('Return its position', ['index = 5'], [0], 'Use its index in the original list, not its position in this sketch.'),
  ], 'Each comparison removes a whole range. Keep shrinking until you find the target or the candidate range is empty.'),
  P06: example('Find the longest substring without repeated characters in abba.', [
    frame('Expand right', ['a', 'b'], [0, 1], 'ab has no repeats. Best length is now 2.'),
    frame('Add the next b, then shrink', ['a out', 'b out', 'b'], [2], 'abb repeats b. Remove from the left until the remaining window is valid.'),
    frame('Expand to the final a', ['b', 'a'], [0, 1], 'ba is valid with length 2. The overall answer stays 2.'),
  ], 'Maintain a valid contiguous window. For this longest-window problem, measure only after removing duplicates.'),
  P07: example('Reverse the links in 1 → 2 → 3 → None.', [
    frame('Save the next node', ['previous: None', 'node: 1', 'following: 2'], [2], 'Keep a reference to 2 before changing the link on 1.'),
    frame('Reverse one link', ['None ← 1', '2 → 3 → None'], [0], 'Point 1 backward. Advance previous to 1 and node to 2.'),
    frame('Repeat to the end', ['None ← 1 ← 2 ← 3'], [0], 'After processing 2 and 3, return previous: node 3 is the new head.'),
  ], 'The node values stay the same; the references change. Saving following prevents losing the unprocessed chain.'),
  P08: example('Visit the side-neighbors of center cell 5 in a 3 × 3 grid.', [
    frame('Locate the center', ['row = 1', 'col = 1'], [0, 1], 'Coordinates are zero-based. The center is (1, 1).'),
    frame('Try four directions', ['up: 2', 'right: 6', 'down: 8', 'left: 4'], [0, 1, 2, 3], 'Change either the row or column by one, not both.'),
    frame('Check before visiting', ['in bounds?', 'already seen?'], [0, 1], 'An edge cell has fewer neighbors. For traversal, mark discovered cells to avoid revisits.'),
  ], 'A grid is a graph in coordinate form. Define valid moves and bounds before writing the traversal.'),
  P09: example('Find the maximum depth of the illustrated tree rooted at 4.', [
    frame('Define the base case', ['depth(None) = 0'], [0], 'An empty subtree contributes no levels.'),
    frame('Solve the children', ['leaves: 1', 'node 2: 2', 'node 6: 2'], [1, 2], 'Each node returns 1 plus the larger depth of its children.'),
    frame('Combine at the root', ['1 + max(2, 2) = 3'], [0], 'The deepest root-to-leaf path contains three nodes.'),
  ], 'Give each recursive call a clear return meaning. Depth works on any binary tree; it does not require BST ordering.'),
  P10: example('Use BFS from A on the illustrated unweighted triangle graph.', [
    frame('Discover the start', ['queue: A', 'seen: A'], [0], 'A is zero edges from itself. Mark nodes when adding them to the queue.'),
    frame('Visit A’s neighbors', ['queue: B, C', 'distance: 1'], [0, 1], 'Both neighbors are one edge away. Each is queued once.'),
    frame('Finish the queue', ['queue: empty', 'seen: A, B, C'], [1], 'B and C lead back to discovered nodes, so the cycle adds no new work.'),
  ], 'BFS explores by distance in edges. With differing edge costs, the fewest edges may not be the cheapest path.'),
  P11: example('Build all subsets of [1, 2] by choosing and undoing.', [
    frame('Choose 1, then 2', ['path: [1, 2]'], [0], 'Explore a branch. Save a copy of the path when recording a subset.'),
    frame('Undo 2, then 1', ['[1, 2] → [1] → []'], [0], 'Restore earlier state before trying a sibling branch.'),
    frame('Explore without 1', ['path: [2]', 'subsets: [], [1], [1, 2], [2]'], [0], 'Visit each increasing-index choice once. The empty subset is included too.'),
  ], 'Backtracking explores choices; a trie shares prefixes. They can combine in word search: follow trie edges while choosing grid cells.'),
  P12: example('Read the smallest values from the illustrated min-heap.', [
    frame('Inspect the root', ['root = 1'], [0], 'Only the root is guaranteed to be the smallest.'),
    frame('Pop and repair', ['pop: 1', 'new root: 3'], [1], 'Remove 1, then restore parent ≤ child. Use heapq rather than repairing by hand.'),
    frame('Pop again', ['pop: 3', 'new root: 4'], [1], 'Repeated pops yield priority order without sorting the whole heap first.'),
  ], 'Choose a heap when you repeatedly need the next priority item. Iterating its underlying list is not sorted order.'),
  P13: example('Merge [1, 3], [2, 5] and [7, 8].', [
    frame('Sort by start', ['[1, 3]', '[2, 5]', '[7, 8]'], [0], 'Keep [1, 3] as the current merged interval.'),
    frame('Extend an overlap', ['[1, 5]', '[7, 8]'], [0], '2 ≤ 3, so the next range overlaps. Extend the end to max(3, 5).'),
    frame('Keep the gap', ['[1, 5]', '[7, 8]'], [1], '7 > 5, so start a separate interval. These are the final merged ranges.'),
  ], 'This example treats touching endpoints as overlapping. Check the problem’s endpoint rules before choosing < or ≤.'),
  P14: example('Count ways to climb four stairs using 1- or 2-step moves.', [
    frame('Set the base cases', ['ways[0] = 1', 'ways[1] = 1'], [0, 1], 'There is one empty way to climb zero stairs, and one way to climb one.'),
    frame('Reuse smaller answers', ['ways[2] = 2', 'ways[3] = 3'], [0, 1], 'The last move came from one stair below or two stairs below. Add those counts.'),
    frame('Solve four stairs', ['ways[4] = 3 + 2 = 5'], [0], 'Compute smaller states first so both required answers are ready.'),
  ], 'DP combines saved subanswers. Greedy commits to one local choice; use it only when you can justify that choice, not as a shortcut to DP.'),
  P15: example('Compute 6 XOR 3 using the four-bit view above.', [
    frame('Align the bits', ['6: 0110', '3: 0011'], [0, 1], 'Compare columns representing 8, 4, 2 and 1.'),
    frame('Mark differing columns', ['0 XOR 0: 0', '1 XOR 0: 1', '1 XOR 1: 0', '0 XOR 1: 1'], [1, 3], 'Equal bits produce 0; different bits produce 1.'),
    frame('Read the result', ['0101 = 4 + 1 = 5'], [0], 'The surviving bits represent 4 and 1.'),
  ], 'XOR cancels equal values: x ^ x = 0. Python integers can grow beyond this four-bit illustration.'),
}
