import { useCallback, useEffect, useRef, useState } from 'react'

export default function usePracticeRunner() {
  const worker = useRef(null)
  const sequence = useRef(0)
  const timer = useRef(null)
  const [status, setStatus] = useState('loading')
  const [result, setResult] = useState(null)
  const [generation, setGeneration] = useState(0)

  useEffect(() => {
    setStatus('loading')
    const instance = new Worker(new URL('./python.worker.js', import.meta.url), { type: 'module' })
    worker.current = instance
    const startup = setTimeout(() => {
      instance.terminate()
      setStatus('unavailable')
    }, 45000)
    instance.onmessage = ({ data }) => {
      if (data.type === 'ready') {
        clearTimeout(startup)
        setStatus('ready')
      } else if (data.type === 'load-error') {
        clearTimeout(startup)
        setStatus('unavailable')
      } else if (data.id === sequence.current) {
        clearTimeout(timer.current)
        setStatus('ready')
        setResult(data.type === 'result' ? data.result : {
          passed: false, title: 'Let’s try that again', message: 'The code could not finish. Reset the runner and try again.',
        })
      }
    }
    instance.onerror = () => {
      clearTimeout(startup)
      clearTimeout(timer.current)
      setStatus('unavailable')
    }
    return () => {
      clearTimeout(startup)
      clearTimeout(timer.current)
      instance.terminate()
    }
  }, [generation])

  const restart = useCallback(() => {
    sequence.current += 1
    clearTimeout(timer.current)
    worker.current?.terminate()
    setStatus('loading')
    setGeneration(value => value + 1)
  }, [])

  const stop = useCallback(() => {
    setResult({ passed: false, title: 'Run stopped', message: 'Your code is still here. The Python runner is restarting so you can try again.' })
    restart()
  }, [restart])

  const run = useCallback(code => {
    if (status !== 'ready') return
    if (code.length > 4000) {
      setResult({ passed: false, title: 'Keep this rep small', message: 'This first exercise only needs a line or two.' })
      return
    }
    setStatus('running')
    setResult(null)
    const id = ++sequence.current
    worker.current.postMessage({ type: 'run', id, code })
    timer.current = setTimeout(() => {
      setResult({ passed: false, title: 'That run took too long', message: 'This rep should finish immediately. Check for an endless loop, then try again.' })
      restart()
    }, 5000)
  }, [restart, status])

  return { status, result, run, stop, restart, clearResult: () => setResult(null) }
}
