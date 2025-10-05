import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getProductByPriceId } from '../stripe-config';

interface Subscription {
  plan: 'free' | 'basic' | 'pro';
  templatesUsed: number;
  maxTemplates: number;
  hasAIAccess: boolean;
  stripeStatus?: string;
  currentPeriodEnd?: number;
}

export function useSubscription(user: any) {
  const [subscription, setSubscription] = useState<Subscription>({
    plan: 'free',
    templatesUsed: 0,
    maxTemplates: 1,
    hasAIAccess: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserSubscription = async () => {
    if (!user || !supabase) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      
      // Get Stripe subscription data
      const { data: stripeData, error: stripeError } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (stripeError && stripeError.code !== 'PGRST116') {
        throw stripeError;
      }

      // Get template count
      const { count, error: countError } = await supabase
        .from('templates')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (countError) {
        throw countError;
      }

      let plan: 'free' | 'basic' | 'pro' = 'free';
      let stripeStatus: string | undefined;
      let currentPeriodEnd: number | undefined;

      // Determine plan based on Stripe subscription
      if (stripeData?.subscription_status === 'active' && stripeData.price_id) {
        const product = getProductByPriceId(stripeData.price_id);
        if (product) {
          plan = product.name.toLowerCase() as 'basic' | 'pro';
          stripeStatus = stripeData.subscription_status;
          currentPeriodEnd = stripeData.current_period_end;
        }
      }

      const templatesUsed = count || 0;

      let maxTemplates = 1;
      let hasAIAccess = false;

      switch (plan) {
        case 'basic':
          maxTemplates = 10;
          hasAIAccess = false;
          break;
        case 'pro':
          maxTemplates = Infinity;
          hasAIAccess = true;
          break;
        default:
          maxTemplates = 1;
          hasAIAccess = false;
      }

      setSubscription({
        plan,
        templatesUsed,
        maxTemplates,
        hasAIAccess,
        stripeStatus,
        currentPeriodEnd
      });
    } catch (err: any) {
      console.error('Error fetching subscription:', err);
      setError(err.message || 'Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const canCreateTemplate = () => {
    return subscription.templatesUsed < subscription.maxTemplates;
  };

  const refreshSubscription = async () => {
    setLoading(true);
    await fetchUserSubscription();
  };

  useEffect(() => {
    fetchUserSubscription();
  }, [user]);

  return {
    subscription,
    loading,
    error,
    canCreateTemplate,
    refreshSubscription
  };
}