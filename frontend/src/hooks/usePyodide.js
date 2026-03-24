import { useState, useEffect, useRef } from 'react'

const PYODIDE_CDN_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs'

export function usePyodide() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const pyodideInstanceRef = useRef(null)

  useEffect(() => {
    async function loadPyodideRuntime() {
      try {
        // @vite-ignore is required here because Vite cannot statically analyse a dynamic
        // import whose path is a runtime variable (PYODIDE_CDN_URL). Without it, Vite
        // throws a build error. Pyodide must be loaded from its CDN at runtime — it cannot
        // be bundled — so a dynamic import with a variable URL is the only option.
        const { loadPyodide } = await import(/* @vite-ignore */ PYODIDE_CDN_URL)
        pyodideInstanceRef.current = await loadPyodide()
        setIsLoading(false)
      } catch (error) {
        setLoadError('Failed to load Python runtime: ' + error.message)
        setIsLoading(false)
      }
    }

    loadPyodideRuntime()
  }, [])

  return { pyodide: pyodideInstanceRef.current, isLoading, loadError }
}
