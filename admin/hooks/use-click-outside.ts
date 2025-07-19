import { useEffect, useRef } from "react"

const useClickOutside = <T extends HTMLElement>(callback: () => void) => {
  const ref = useRef<T>(null)

  const handleEvent = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback()
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleEvent)

    return () => {
      document.removeEventListener("mousedown", handleEvent)
    }
  }, [callback, ref])

  return ref
}
export default useClickOutside
