import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import SlidingWindowGuide from '../SlidingWindowGuide.jsx'

function Cells({ values, active = [], muted = [] }) {
  return <Stack direction="row" sx={{ gap: 0.75, flexWrap: 'wrap', justifyContent: 'center', my: 2 }}>
    {values.map((value, index) => <Box key={index} sx={{ minWidth: 36, px: 0.75, py: 1, border: '2px solid', borderColor: active.includes(index) ? 'primary.main' : 'divider', bgcolor: active.includes(index) ? 'action.selected' : 'background.paper', borderRadius: 1.5, textAlign: 'center', fontFamily: 'Consolas, monospace', fontWeight: 650, opacity: muted.includes(index) ? 0.35 : 1 }}>{value}</Box>)}
  </Stack>
}

function Diagram({ nodes, edges, label }) {
  const theme = useTheme()
  return <Box component="svg" role="img" aria-label={label} viewBox="0 0 260 150" sx={{ width: '100%', maxWidth: 420, height: 180, display: 'block', mx: 'auto' }}>
    {edges.map(([from, to], index) => <line key={index} x1={nodes[from][1]} y1={nodes[from][2]} x2={nodes[to][1]} y2={nodes[to][2]} stroke={theme.palette.text.secondary} strokeWidth="2" />)}
    {nodes.map(([value, x, y], index) => <g key={index}><circle cx={x} cy={y} r="15" fill={theme.palette.background.paper} stroke={index === 0 ? theme.palette.primary.main : theme.palette.divider} strokeWidth="2" /><text x={x} y={y + 4} textAnchor="middle" fill={theme.palette.text.primary} fontSize="12" fontFamily="Consolas, monospace">{value}</text></g>)}
  </Box>
}

const Caption = ({ children }) => <Typography sx={{ textAlign: 'center', fontSize: 12, color: 'text.secondary', lineHeight: 1.7, mt: 1 }}>{children}</Typography>
const treeEdges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]]
const treeNodes = values => values.map((value, index) => [value, [130, 70, 190, 35, 100, 160, 225][index], [22, 72, 72, 125, 125, 125, 125][index]])

export default function PatternVisual({ unit, binaryTree = false, focus, problemId }) {
  if (unit === 'P14' && problemId && problemId !== 70) {
    const examples = {
      322: [[0, '∞', 1, '∞', 2], [0, 2, 4], 'With coin 2, amounts 0 through 4 need 0, impossible, 1, impossible, 2 coins. Unreachable is not zero.'],
      300: [[3, 1, 2], [1, 2], 'The subsequence 1, 2 skips the first value. Best lengths ending at these positions are 1, 1, 2.'],
      1143: [['A', 'B', 'C'], [0, 2], 'ABC and AC share the subsequence AC. Order matters; contiguity is not required.'],
      139: [['leet', 'code'], [0, 1], 'A reachable leet prefix plus the dictionary word code makes leetcode reachable.'],
      198: [[2, 7, 9, 3, 1], [0, 2, 4], 'Take houses 2, 9 and 1 for 12. Adjacent houses cannot both be taken.'],
      213: [[2, 3, 2], [1], 'These three houses form a circle: the two endpoint houses are also adjacent. The best total is 3.'],
      91: [['2 | 2 | 6', '22 | 6', '2 | 26'], [0, 1, 2], '226 has three valid decodings. A zero cannot form a one-digit code.'],
      55: [[3, 2, 1, 0, 4], [0, 1, 2, 3], 'The reachable frontier stops at index 3. The final 4 cannot help because its position is unreachable.'],
    }
    if (problemId === 62) return <><Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 48px)', gap: 0.75, justifyContent: 'center', my: 2 }}>{[1,1,1,2,1,3].map((value, index) => <Box key={index} sx={{ p: 1, textAlign: 'center', border: '1px solid', borderColor: 'primary.main', borderRadius: 1 }}>{value}</Box>)}</Box><Caption>Route counts on a 3 × 2 grid. Each cell combines the counts above and to its left; the final count is 3.</Caption></>
    const example = examples[problemId]
    if (example) return <><Cells values={example[0]} active={example[1]} /><Caption>{example[2]}</Caption></>
  }
  switch (unit) {
    case 'P01': return <><Cells values={[4, 2, 4]} active={[0, 2]} /><Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, maxWidth: 280, mx: 'auto', textAlign: 'center' }}><Typography sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>4 → count 2</Typography><Typography sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>2 → count 1</Typography></Box><Caption>A dictionary remembers a count for each value.</Caption></>
    case 'P02': return <><Cells values={[2, 1, 3]} /><Typography sx={{ textAlign: 'center', fontSize: 12 }}>Running total after each item</Typography><Cells values={[2, 3, 6]} active={[2]} /><Caption>Keep the state you need instead of starting over.</Caption></>
    case 'P03': return <><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, my: 2 }}><Stack sx={{ width: 65, borderBottom: '3px solid', borderColor: 'primary.main', p: 0.5, gap: 0.5 }}>{['[', '('].map(value => <Box key={value} sx={{ p: 1, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>{value}</Box>)}</Stack><Typography sx={{ fontSize: 13 }}>] arrives<br />pop [ from the top</Typography></Box><Caption>The newest unresolved opening bracket is matched first.</Caption></>
    case 'P04': return <><Cells values={[1, 3, 5, 7]} active={[0, 3]} /><Caption>Left = 1, right = 7. Their sum matches target 8.<br />Move pointers only when the problem gives a safe reason.</Caption></>
    case 'P05': return <><Cells values={[1, 3, 5, 7, 9, 11, 13]} active={[3, 5]} muted={[0, 1, 2]} /><Caption>Target 11 is above midpoint 7. Keep only the range to its right.</Caption></>
    case 'P06': return <SlidingWindowGuide exercise={{ id: 'hub-window', stage: 'Sliding Window' }} />
    case 'P07': return <><Cells values={['1 →', '2 →', '3 →', 'None']} active={[1]} /><Caption>Each node holds a value and a reference to the next node.</Caption></>
    case 'P08': return <><Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 42px)', gap: 0.75, justifyContent: 'center', my: 2 }}>{Array.from({ length: 9 }, (_, index) => <Box key={index} sx={{ textAlign: 'center', py: 1, border: '2px solid', borderColor: index === 4 ? 'primary.main' : 'divider', bgcolor: [1, 3, 5, 7].includes(index) ? 'action.selected' : 'transparent', borderRadius: 1 }}>{index + 1}</Box>)}</Box><Caption>The center cell has four side-neighbors. Edge cells need bounds checks.</Caption></>
    case 'P09': return <><Diagram nodes={treeNodes(binaryTree ? [4, 9, 2, 1, 3, 6, 7] : [4, 2, 6, 1, 3, 5, 7])} edges={treeEdges} label={binaryTree ? "Binary tree with up to two child references per node" : "Binary search tree: root 4, smaller values left, larger values right"} /><Caption>{binaryTree ? 'A binary tree has up to two children per node. Its values need not be ordered.' : 'This BST keeps smaller values to the left and larger values to the right.'}</Caption></>
    case 'P10': return <><Diagram nodes={['A', 'B', 'C'].map((value, i) => [value, [55, 130, 205][i], [110, 30, 110][i]])} edges={[[0, 1], [1, 2], [2, 0]]} label="Three-node graph with a cycle" /><Caption>A → B → C → A forms a cycle. Track visited nodes to avoid repeating work.</Caption></>
    case 'P11': return <>{focus !== 'trie' && <><Cells values={['Choose', 'Explore', 'Undo']} active={[1]} /><Caption>Backtracking restores state before trying another branch.</Caption></>}{focus !== 'backtrack' && <><Diagram nodes={[["c", 130, 20], ["a", 130, 65], ["r", 85, 120], ["t", 175, 120]]} edges={[[0, 1], [1, 2], [1, 3]]} label="Trie: car and cat share prefix ca" /><Caption>A trie shares the prefix ca between car and cat.</Caption></>}</>
    case 'P12': return <><Diagram nodes={treeNodes([1, 3, 5, 4, 7, 9, 8])} edges={treeEdges} label="Min-heap: every parent is no larger than its children" /><Caption>A min-heap exposes 1 first. The rest is not a fully sorted sequence.</Caption></>
    case 'P13': return <><Cells values={['[1, 3]', '[2, 5]', '[7, 8]']} active={[0, 1]} /><Typography sx={{ textAlign: 'center', color: 'primary.main', fontWeight: 700 }}>↓ merge overlapping ranges</Typography><Cells values={['[1, 5]', '[7, 8]']} active={[0]} /><Caption>Only the first two intervals overlap.</Caption></>
    case 'P14': return <><Typography sx={{ textAlign: 'center', fontSize: 12 }}>Ways to climb 0, 1, 2, 3, 4 stairs</Typography><Cells values={[1, 1, 2, 3, 5]} active={[2, 3, 4]} /><Caption>With 1- or 2-step moves: ways[n] = ways[n−1] + ways[n−2].<br />DP reuses subanswers; greedy instead needs a provably safe local choice.</Caption></>
    case 'P15': return <><Box sx={{ maxWidth: 300, mx: 'auto', fontFamily: 'Consolas, monospace' }}>{[['6', '0 1 1 0'], ['XOR 3', '0 0 1 1'], ['= 5', '0 1 0 1']].map(([label, bits]) => <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', p: 1, borderBottom: '1px solid', borderColor: 'divider' }}><span>{label}</span><Box component="span" sx={{ color: 'primary.main', whiteSpace: 'pre' }}>{bits}</Box></Box>)}</Box><Caption>XOR produces a 1 where the input bits differ. Four bits are shown for this example.</Caption></>
    default: return null
  }
}
