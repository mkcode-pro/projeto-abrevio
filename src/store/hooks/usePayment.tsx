import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { paymentService, Subscription } from '@/services/payment'
import { useAuth } from '@/store/contexts/AuthContext'

export function useSubscription() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: subscription, isLoading, error } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: () => paymentService.getCurrentSubscription(),
    enabled: !!user,
    refetchInterval: 60000, // Refetch every minute
  })

  const cancelMutation = useMutation({
    mutationFn: () => paymentService.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
    }
  })

  const resumeMutation = useMutation({
    mutationFn: () => paymentService.resumeSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
    }
  })

  return {
    subscription,
    isLoading,
    error,
    isPro: paymentService.isPro(subscription || null),
    daysUntilRenewal: paymentService.getDaysUntilRenewal(subscription || null),
    cancelSubscription: cancelMutation.mutate,
    resumeSubscription: resumeMutation.mutate,
    isCanceling: cancelMutation.isPending,
    isResuming: resumeMutation.isPending
  }
}

export function useCheckout() {
  const [isProcessing, setIsProcessing] = useState(false)

  const checkout = async (planId: string, interval: 'monthly' | 'yearly') => {
    setIsProcessing(true)
    try {
      await paymentService.createCheckoutSession(planId, interval)
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const openPortal = async () => {
    setIsProcessing(true)
    try {
      await paymentService.createPortalSession()
    } catch (error) {
      console.error('Portal error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    checkout,
    openPortal,
    isProcessing
  }
}