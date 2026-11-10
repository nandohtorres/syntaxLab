import { RangeSetBuilder } from '@codemirror/state'
import { Decoration, ViewPlugin } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'

// Monaco colors Python's built-in names like keywords; CodeSurface matches that look (ADR 0001).
const BUILTINS = new Set([
  'abs', 'all', 'any', 'bool', 'dict', 'enumerate', 'filter', 'float', 'input', 'int', 'isinstance', 'len',
  'list', 'map', 'max', 'min', 'open', 'print', 'range', 'reversed', 'round', 'set', 'sorted', 'str', 'sum',
  'super', 'tuple', 'type', 'zip',
])
const builtinMark = Decoration.mark({ class: 'cm-builtin' })

// Only real names from the parse tree are marked, so "print" inside a string or comment stays plain.
function builtinDecorations(view) {
  const builder = new RangeSetBuilder()
  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter: node => {
        if (node.name === 'VariableName' && BUILTINS.has(view.state.doc.sliceString(node.from, node.to))) builder.add(node.from, node.to, builtinMark)
      },
    })
  }
  return builder.finish()
}

export const pythonBuiltins = ViewPlugin.fromClass(class {
  constructor(view) { this.decorations = builtinDecorations(view) }
  update(update) {
    if (update.docChanged || update.viewportChanged || syntaxTree(update.startState) !== syntaxTree(update.state)) this.decorations = builtinDecorations(update.view)
  }
}, { decorations: plugin => plugin.decorations })
