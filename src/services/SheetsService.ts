import axios from 'axios';
import type { Gift, ValidationResult, CacheData } from '../types';

export class SheetsService {
  private static readonly SPREADSHEET_ID = '1IYr_m43FUPYilTQz_bICKZjHTPg7CUWVXVlS09N-LJI';
  private static readonly CACHE_KEY = 'giftsData';
  private static readonly SYNC_TIME_KEY = 'lastSyncTime';
  private static readonly CACHE_TIMEOUT = 15000; // 15 seconds

  private static readonly CORS_PROXIES = [
    // 'https://api.allorigins.win/get?url=',
    // 'https://api.allorigins.win/raw?url=',
    // 'https://cors-anywhere.herokuapp.com/',
    'https://api.codetabs.com/v1/proxy?quest=',
  ];

  private static getSheetUrls(): string[] {
    const baseUrl = `https://docs.google.com/spreadsheets/d/${this.SPREADSHEET_ID}/export?format=csv&gid=0`;
    
    return [
      ...this.CORS_PROXIES.map(proxy => `${proxy}${encodeURIComponent(baseUrl)}`),
      baseUrl, // Direct access as fallback
    ];
  }

  static async fetchSheetData(): Promise<Gift[]> {
    // Check cache first
    const cachedData = this.getCachedData();
    if (cachedData && this.isCacheValid()) {
      console.log('📦 Using cached data');
      return cachedData.presentes;
    }

    console.log('🔄 Fetching fresh data from Google Sheets...');
    
    const urls = this.getSheetUrls();
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      
      try {
        console.log(`📡 Attempt ${i + 1}/${urls.length}: ${this.getProxyName(url)}`);
        
        const response = await axios.get(url, {
          timeout: 10000,
          headers: {
            'Accept': 'text/plain, text/csv, */*',
          },
        });
        
        if (response.status === 200 && response.data) {
          let csvText = response.data;
          
          // Handle AllOrigins JSON wrapper
          if (url.includes('api.allorigins.win/get') && typeof csvText === 'object') {
            csvText = csvText.contents;
          }
          
          if (this.isValidCsv(csvText)) {
            const gifts = await this.parseCSV(csvText);
            
            if (gifts.length > 0) {
              this.cacheData(gifts, url);
              console.log(`✅ Successfully loaded ${gifts.length} gifts via ${this.getProxyName(url)}`);
              return gifts;
            }
          }
        }
      } catch (error) {
        console.log(`❌ Failed with proxy ${i + 1}:`, this.getErrorMessage(error));
        continue;
      }
    }
    
    // If all proxies fail, return cached data if available
    if (cachedData) {
      console.log('⚠️ All proxies failed, using stale cached data');
      return cachedData.presentes;
    }
    
    throw new Error('Failed to load data from Google Sheets');
  }

  private static getProxyName(url: string): string {
    // if (url.includes('allorigins.win/get')) return 'AllOrigins (JSON)';
    // if (url.includes('allorigins.win/raw')) return 'AllOrigins (Raw)';
    // if (url.includes('cors-anywhere')) return 'CORS Anywhere';
    if (url.includes('codetabs')) return 'CodeTabs';
    return 'Direct';
  }

  private static isValidCsv(csvText: string): boolean {
    return typeof csvText === 'string' && 
           csvText.includes(',') && 
           csvText.split('\n').length > 1;
  }

  private static async parseCSV(csvText: string): Promise<Gift[]> {
    const lines = csvText.split('\n');
    const gifts: Gift[] = [];
    let hiddenItemsCount = 0;
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const columns = this.parseCSVLine(line);
      
      if (columns.length >= 3 && columns[0] && columns[1] && columns[2]) {
        // Check visibility column (column 4, index 4)
        // Expected values: "Sim" = show, "Não" = hide
        const visibilityValue = columns[4] ? columns[4].trim().toLowerCase() : 'sim';
        const isVisible = visibilityValue === 'sim' || visibilityValue === 'yes' || visibilityValue === 's';
        
        const gift: Gift = {
          id: this.generateUniqueId(columns[0].trim()),
          title: columns[0].trim(),
          productUrl: columns[1].trim(),
          imageUrl: columns[2].trim(),
          order: columns[3] ? parseInt(columns[3].trim()) || 999 : 999,
          visible: isVisible,
          timestamp: Date.now(),
          createdAt: new Date().toISOString(),
          source: 'google_sheets',
        };
        
        // Only include gifts that are visible and have valid URLs
        if (gift.visible && this.isValidUrl(gift.productUrl) && this.isValidUrl(gift.imageUrl)) {
          gifts.push(gift);
        } else if (!gift.visible) {
          hiddenItemsCount++;
          console.log(`🚫 Item oculto: "${gift.title}" (configurado para não exibir)`);
        }
      }
    }
    
    if (hiddenItemsCount > 0) {
      console.log(`📋 Total de itens ocultos: ${hiddenItemsCount}`);
    }
    
    // Sort by order
    gifts.sort((a, b) => a.order - b.order);
    
    return gifts;
  }

  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  private static generateUniqueId(title: string): string {
    const cleanTitle = title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      const char = title.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return `gift-${cleanTitle}-${Math.abs(hash)}`;
  }

  private static isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  static async validateImage(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      
      // Set timeout for slow images
      setTimeout(() => resolve(false), 5000);
      
      img.src = url;
    });
  }

  static async validateGift(gift: Gift): Promise<ValidationResult> {
    try {
      const isValid = await this.validateImage(gift.imageUrl);
      return { gift, isValid };
    } catch (error) {
      return { 
        gift, 
        isValid: false, 
        error: this.getErrorMessage(error) 
      };
    }
  }

  private static getCachedData(): CacheData | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  private static isCacheValid(): boolean {
    try {
      const lastSync = localStorage.getItem(this.SYNC_TIME_KEY);
      if (!lastSync) return false;
      
      const syncTime = parseInt(lastSync);
      const now = Date.now();
      
      return (now - syncTime) < this.CACHE_TIMEOUT;
    } catch {
      return false;
    }
  }

  private static cacheData(gifts: Gift[], source: string): void {
    try {
      const dataToCache: CacheData = {
        presentes: gifts,
        lastUpdate: Date.now(),
        source,
      };
      
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(dataToCache));
      localStorage.setItem(this.SYNC_TIME_KEY, Date.now().toString());
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }

  private static getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Unknown error occurred';
  }
}
