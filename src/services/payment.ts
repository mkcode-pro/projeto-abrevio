import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export interface PricingPlan {
  id: string
  name: string
  price: number
  interval: 'monthly' | 'yearly'
  features: string[]
  stripePriceId?: string
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
}

class PaymentService {
  private stripePromise: Promise<any> | null = null

  async initializeStripe() {
    if (!this.stripePromise) {
      this.stripePromise = import('@stripe/stripe-js').then(({ loadStripe }) => 
        loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')
      )
    }
    return this.stripePromise
  }

  async createCheckoutSession(planId: string, interval: 'monthly' | 'yearly') {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          planId, 
          interval,
          userId: user.id,
          email: user.email,
          successUrl: `${window.location.origin}/dashboard?payment=success`,
          cancelUrl: `${window.location.origin}/pricing`
        }
      })

      if (error) throw error
      
      const stripe = await this.initializeStripe()
      if (!stripe) throw new Error('Stripe not initialized')

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      })

      if (stripeError) throw stripeError

    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Erro ao processar pagamento')
      throw error
    }
  }

  async createPortalSession() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: { 
          userId: user.id,
          returnUrl: `${window.location.origin}/dashboard/settings`
        }
      })

      if (error) throw error
      
      window.location.href = data.url

    } catch (error) {
      console.error('Portal error:', error)
      toast.error('Erro ao acessar portal de pagamento')
      throw error
    }
  }

  async getCurrentSubscription(): Promise<Subscription | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null // No subscription found
        throw error
      }

      return {
        id: data.id,
        userId: data.user_id,
        planId: data.plan_id,
        status: data.status,
        currentPeriodStart: new Date(data.current_period_start),
        currentPeriodEnd: new Date(data.current_period_end),
        cancelAtPeriodEnd: data.cancel_at_period_end
      }
    } catch (error) {
      console.error('Get subscription error:', error)
      return null
    }
  }

  async cancelSubscription() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase.functions.invoke('cancel-subscription', {
        body: { userId: user.id }
      })

      if (error) throw error
      
      toast.success('Assinatura cancelada com sucesso')
      return true

    } catch (error) {
      console.error('Cancel subscription error:', error)
      toast.error('Erro ao cancelar assinatura')
      return false
    }
  }

  async resumeSubscription() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase.functions.invoke('resume-subscription', {
        body: { userId: user.id }
      })

      if (error) throw error
      
      toast.success('Assinatura reativada com sucesso')
      return true

    } catch (error) {
      console.error('Resume subscription error:', error)
      toast.error('Erro ao reativar assinatura')
      return false
    }
  }

  isPro(subscription: Subscription | null): boolean {
    return subscription?.status === 'active'
  }

  getDaysUntilRenewal(subscription: Subscription | null): number {
    if (!subscription) return 0
    const now = new Date()
    const end = new Date(subscription.currentPeriodEnd)
    const diff = end.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }
}

export const paymentService = new PaymentService()