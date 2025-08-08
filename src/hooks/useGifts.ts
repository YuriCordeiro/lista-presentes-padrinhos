import { useState, useEffect, useCallback } from 'react';
import { SheetsService } from '../services/SheetsService';
import type { Gift, LoadingState, SyncState, ValidationResult } from '../types';

export const useGifts = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    message: 'Carregando nossa lista especial...',
  });
  const [syncState, setSyncState] = useState<SyncState>({
    isOnline: navigator.onLine,
    lastSync: null,
    syncStatus: 'idle',
  });

  const updateLoadingMessage = useCallback((message: string) => {
    setLoadingState(prev => ({ ...prev, message }));
  }, []);

  const addValidatedGift = useCallback((gift: Gift) => {
    setGifts(prevGifts => {
      // Check for duplicates
      const exists = prevGifts.some(g => g.id === gift.id);
      if (exists) return prevGifts;
      
      // Add and sort by order
      const newGifts = [...prevGifts, gift];
      return newGifts.sort((a, b) => a.order - b.order);
    });
  }, []);

  const validateAndAddGift = useCallback(async (gift: Gift, delay: number = 0) => {
    setTimeout(async () => {
      console.log(`🔍 Validating: ${gift.title}...`);
      
      const validation: ValidationResult = await SheetsService.validateGift(gift);
      
      if (validation.isValid) {
        addValidatedGift(gift);
        console.log(`✅ ${gift.title} - Valid image, added to list`);
      } else {
        console.warn(`❌ ${gift.title} - Invalid image, skipped`);
      }
    }, delay);
  }, [addValidatedGift]);

  const loadGiftsProgressively = useCallback(async () => {
    try {
      setLoadingState({
        isLoading: true,
        message: 'Conectando à base externa...',
      });

      setSyncState(prev => ({ ...prev, syncStatus: 'syncing' }));

      const allGifts = await SheetsService.fetchSheetData();
      
      if (allGifts.length === 0) {
        setLoadingState({
          isLoading: false,
          message: 'Nenhum presente encontrado',
        });
        return;
      }

      setLoadingState({
        isLoading: true,
        message: `Atualizando lista de produtos...`,
      });

      // Clear existing gifts for fresh load
      setGifts([]);

      // Validate and add gifts progressively
      allGifts.forEach((gift, index) => {
        const delay = index * 300; // 300ms between each validation
        validateAndAddGift(gift, delay);
      });

      // Update sync state
      setSyncState({
        isOnline: navigator.onLine,
        lastSync: Date.now(),
        syncStatus: 'success',
      });

      // Hide loading after all validations are scheduled
      setTimeout(() => {
        setLoadingState({
          isLoading: false,
          message: '',
        });
      }, allGifts.length * 300 + 2000);

    } catch (error) {
      console.error('Error loading gifts:', error);
      
      setLoadingState({
        isLoading: false,
        message: 'Erro ao carregar presentes',
      });
      
      setSyncState({
        isOnline: navigator.onLine,
        lastSync: null,
        syncStatus: 'error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, [validateAndAddGift]);

  const refreshGifts = useCallback(async () => {
    await loadGiftsProgressively();
  }, [loadGiftsProgressively]);

  // Initial load
  useEffect(() => {
    loadGiftsProgressively();
  }, [loadGiftsProgressively]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setSyncState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setSyncState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-sync every 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.onLine && syncState.syncStatus !== 'syncing') {
        console.log('🔄 Auto-sync triggered');
        refreshGifts();
      }
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(interval);
  }, [refreshGifts, syncState.syncStatus]);

  return {
    gifts,
    loadingState,
    syncState,
    refreshGifts,
    updateLoadingMessage,
  };
};
