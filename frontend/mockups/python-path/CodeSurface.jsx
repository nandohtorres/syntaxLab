import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState, Prec } from '@codemirror/state'
import { HighlightStyle, indentUnit, syntaxHighlighting } from '@codemirror/language'
import { indentWithTab } from '@codemirror/commands'
import { python } from '@codemirror/lang-python'
import { tags } from '@lezer/highlight'
import { indentationMarkers } from '@replit/codemirror-indentation-markers'
import { editorPalette, mono } from './editorSupport.js'
import { pythonBuiltins } from './pythonBuiltins.js'

// The one editor seam (ADR 0001): pages talk to CodeSurface, never to an editor library.
const TAB_SIZE = 4

function surfaceTheme(colors, { dark, fontSize, lineHeight, paddingTop, textInset }) {
  return [
    EditorView.theme({
      '&': { height: '100%', color: colors.foreground, backgroundColor: colors.background, fontSize: `${fontSize}px` },
      '&.cm-focused': { outline: 'none' },
      // Ligatures off like Monaco, so -> and == look exactly as typed.
      '.cm-scroller': { fontFamily: mono, lineHeight: `${lineHeight}px`, fontVariantLigatures: 'none', colorScheme: dark ? 'dark' : 'light' },
      '.cm-content': { paddingTop: `${paddingTop}px`, caretColor: colors.cursor },
      '.cm-cursor, .cm-dropCursor': { borderLeftColor: colors.cursor, borderLeftWidth: '2px' },
      '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: colors.selection },
      '.cm-activeLine': { backgroundColor: colors.activeLine },
      '.cm-gutters': { backgroundColor: colors.background, color: colors.gutter, border: 'none' },
      '.cm-activeLineGutter': { backgroundColor: 'transparent', color: colors.foreground },
      '.cm-lineNumbers .cm-gutterElement': { padding: '0 12px 0 16px', minWidth: '2ch' },
      '.cm-builtin': { color: colors.keyword },
      // Optional left inset for the text, so it can line up with an example shown above the editor.
      ...(textInset !== undefined && { '.cm-line': { paddingLeft: `${textInset}px` } }),
    }, { dark }),
    syntaxHighlighting(HighlightStyle.define([
      { tag: tags.comment, color: colors.comment, fontStyle: 'italic' },
      { tag: [tags.keyword, tags.controlKeyword, tags.definitionKeyword, tags.operatorKeyword, tags.bool, tags.null], color: colors.keyword },
      { tag: [tags.string, tags.special(tags.string)], color: colors.string },
      { tag: tags.number, color: colors.number },
      { tag: [tags.className, tags.typeName, tags.standard(tags.variableName)], color: colors.type },
    ])),
    // Monaco-style indent guides: faint lines per indent level, brighter for the block holding the cursor.
    indentationMarkers({ colors: { light: colors.indentGuide, dark: colors.indentGuide, activeLight: colors.activeIndentGuide, activeDark: colors.activeIndentGuide } }),
  ]
}

// Touch screens: focusing on open would pop the keyboard over the page, so only mouse devices auto-focus.
const canAutoFocus = () => globalThis.matchMedia?.('(pointer: fine)').matches ?? true

// Escape leaves the editor, so Tab-to-indent never traps keyboard users (WCAG 2.1.2).
const leaveEditor = view => { view.contentDOM.blur(); return true }
const NO_KEY_BINDINGS = []

const languageFor = name => name === 'python' ? [python(), pythonBuiltins] : []

// keyBindings: [{ key: 'Mod-Enter', run: () => true }]; they win over CodeMirror's defaults.
export default function CodeSurface({
  ref, value, onChange, language = 'python', mode = 'dark', readOnly = false, ariaLabel = 'Python code editor',
  keyBindings = NO_KEY_BINDINGS, lineNumbers = true, highlightActiveLine = true, autoFocus = false,
  fontSize = 16, lineHeight = 27, paddingTop = 15, textInset,
}) {
  const editorRef = useRef(null)
  // A stable change handler: the CodeMirror wrapper reconfigures every extension when onChange's identity changes.
  const latestOnChange = useRef(onChange)
  useEffect(() => { latestOnChange.current = onChange }, [onChange])
  const handleChange = useCallback(text => latestOnChange.current?.(text), [])
  useImperativeHandle(ref, () => ({
    focus: () => editorRef.current?.view?.focus(),
    getValue: () => editorRef.current?.view?.state.doc.toString() ?? '',
    insertText: text => {
      const view = editorRef.current?.view
      if (!view) return
      view.dispatch(view.state.replaceSelection(text))
      view.focus()
    },
  }), [])

  const extensions = useMemo(() => [
    ...languageFor(language),
    EditorState.tabSize.of(TAB_SIZE),
    indentUnit.of(' '.repeat(TAB_SIZE)),
    Prec.highest(keymap.of(keyBindings)),
    keymap.of([indentWithTab, { key: 'Escape', run: leaveEditor }]),
    // Phones: no autocorrect, autocapitalize or spellcheck inside code.
    EditorView.contentAttributes.of({ 'aria-label': ariaLabel, autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false' }),
    surfaceTheme(editorPalette[mode], { dark: mode === 'dark', fontSize, lineHeight, paddingTop, textInset }),
  ], [language, keyBindings, ariaLabel, mode, fontSize, lineHeight, paddingTop, textInset])

  const basicSetup = useMemo(() => ({
    lineNumbers, highlightActiveLine, highlightActiveLineGutter: highlightActiveLine, foldGutter: false,
    autocompletion: false, highlightSelectionMatches: false, searchKeymap: false, tabSize: TAB_SIZE,
  }), [lineNumbers, highlightActiveLine])

  return <CodeMirror ref={editorRef} value={value} onChange={handleChange} height="100%" style={{ height: '100%' }}
    theme="none" extensions={extensions} editable={!readOnly} readOnly={readOnly} autoFocus={autoFocus && canAutoFocus()} basicSetup={basicSetup} />
}
