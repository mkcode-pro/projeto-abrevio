import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/store/contexts/AuthContext'
import { SessionManager, sanitizeInput, validatePasswordStrength } from '@/lib/security'
import { toast } from 'sonner'

export function useSessionTimeout() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleTimeout = useCallback(() => {
    toast.error('Sessão expirada por inatividade')
    logout()
    navigate('/login')
  }, [logout, navigate])

  useEffect(() => {
    const resetTimer = () => {
      SessionManager.resetTimeout(handleTimeout)
    }

    // Reset timer on user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true)
    })

    // Initial timer
    resetTimer()

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true)
      })
      SessionManager.clearTimeout()
    }
  }, [handleTimeout])
}

export function useInputSanitizer() {
  const sanitize = useCallback((input: string) => {
    return sanitizeInput(input)
  }, [])

  return { sanitize }
}

export function usePasswordValidator() {
  const validate = useCallback((password: string) => {
    return validatePasswordStrength(password)
  }, [])

  return { validate }
}