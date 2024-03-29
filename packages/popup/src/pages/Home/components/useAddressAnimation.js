import {useState, useEffect, useRef} from 'react'

const DURATION = 2000

const useAddressAnimation = address => {
  const ref = useRef(null)
  const [addressAnimateStyle, setAddressAnimateStyle] = useState('')

  useEffect(() => {
    let timer = null
    if (address && ref.current) {
      setAddressAnimateStyle('animate-address-change-blink')
      timer = setTimeout(() => {
        setAddressAnimateStyle('')
      }, DURATION)
    }
    ref.current = address

    return () => {
      timer && clearTimeout(timer)
    }
  }, [address])

  return addressAnimateStyle
}

export default useAddressAnimation
