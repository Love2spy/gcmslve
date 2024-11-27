import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';
import type { 
  Opportunity, 
  BidAnalysis, 
  Template, 
  PricingCalculation,
  Milestone,
  Subcontractor,
  Proposal
} from '../types';

// Initial templates with professional content
const initialTemplates: Template[] = [
  // ... existing templates ...
];

interface Store {
  // ... existing store interface ...
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // ... existing store implementation ...
    }),
    {
      name: 'gcms-storage',
      partialize: (state) => {
        const userId = useAuthStore.getState().user?.id;
        // Only persist data if user is authenticated
        if (!userId) return {};
        
        return {
          // Namespace data with user ID
          [`opportunities-${userId}`]: state.opportunities,
          [`bidAnalyses-${userId}`]: state.bidAnalyses,
          [`templates-${userId}`]: state.templates,
          [`pricingCalculations-${userId}`]: state.pricingCalculations,
          [`milestones-${userId}`]: state.milestones,
          [`subcontractors-${userId}`]: state.subcontractors,
          [`proposals-${userId}`]: state.proposals,
        };
      },
      onRehydrateStorage: () => (state) => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) return;

        // Rehydrate data from user-specific namespace
        if (state) {
          set({
            opportunities: state[`opportunities-${userId}`] || [],
            bidAnalyses: state[`bidAnalyses-${userId}`] || [],
            templates: state[`templates-${userId}`] || initialTemplates,
            pricingCalculations: state[`pricingCalculations-${userId}`] || [],
            milestones: state[`milestones-${userId}`] || [],
            subcontractors: state[`subcontractors-${userId}`] || [],
            proposals: state[`proposals-${userId}`] || [],
          });
        }
      },
    }
  )
);