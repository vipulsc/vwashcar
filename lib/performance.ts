// Performance monitoring utilities
//u can measure the performance of the app by using this file
//u can use the following functions to measure the performance of the app
//usePerformanceMeasure(componentName)
//measureAsync(operation, operationName)
//measureDatabaseQuery(query, queryName)
//cleanupMemory()
//logPerformance()

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 100; // Keep last 100 metrics

  startTimer(): () => number {
    const start = performance.now();
    return () => performance.now() - start;
  }

  measureLoadTime(): number {
    if (typeof window !== "undefined") {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      return navigation
        ? navigation.loadEventEnd - navigation.loadEventStart
        : 0;
    }
    return 0;
  }

  measureMemoryUsage(): number {
    if (typeof window !== "undefined" && "memory" in performance) {
      const memory = (performance as { memory?: { usedJSHeapSize: number } })
        .memory;
      return memory ? memory.usedJSHeapSize / 1024 / 1024 : 0; // MB
    }
    return 0;
  }

  addMetric(metric: Partial<PerformanceMetrics>): void {
    const fullMetric: PerformanceMetrics = {
      loadTime: metric.loadTime || 0,
      renderTime: metric.renderTime || 0,
      memoryUsage: metric.memoryUsage || this.measureMemoryUsage(),
      timestamp: Date.now(),
    };

    this.metrics.push(fullMetric);

    // Keep only the last maxMetrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  getAverageMetrics(): PerformanceMetrics {
    if (this.metrics.length === 0) {
      return {
        loadTime: 0,
        renderTime: 0,
        memoryUsage: 0,
        timestamp: Date.now(),
      };
    }

    const sum = this.metrics.reduce(
      (acc, metric) => ({
        loadTime: acc.loadTime + metric.loadTime,
        renderTime: acc.renderTime + metric.renderTime,
        memoryUsage: acc.memoryUsage + metric.memoryUsage,
        timestamp: Date.now(),
      }),
      { loadTime: 0, renderTime: 0, memoryUsage: 0, timestamp: 0 }
    );

    const count = this.metrics.length;
    return {
      loadTime: sum.loadTime / count,
      renderTime: sum.renderTime / count,
      memoryUsage: sum.memoryUsage / count,
      timestamp: Date.now(),
    };
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  logPerformance(): void {
    const avg = this.getAverageMetrics();
    console.log("Performance Metrics:", {
      averageLoadTime: `${avg.loadTime.toFixed(2)}ms`,
      averageRenderTime: `${avg.renderTime.toFixed(2)}ms`,
      averageMemoryUsage: `${avg.memoryUsage.toFixed(2)}MB`,
      totalMetrics: this.metrics.length,
    });
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for measuring component render time
export function usePerformanceMeasure(componentName: string) {
  const startTime = performance.now();

  return () => {
    const renderTime = performance.now() - startTime;
    performanceMonitor.addMetric({ renderTime });

    if (process.env.NODE_ENV === "development") {
      console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
    }
  };
}

// Utility for measuring async operations
export async function measureAsync<T>(
  operation: () => Promise<T>,
  operationName: string = "Async operation"
): Promise<T> {
  const startTime = performance.now();

  try {
    const result = await operation();
    const duration = performance.now() - startTime;

    if (process.env.NODE_ENV === "development") {
      console.log(`${operationName} completed in ${duration.toFixed(2)}ms`);
    }

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(
      `${operationName} failed after ${duration.toFixed(2)}ms:`,
      error
    );
    throw error;
  }
}

// Utility for measuring database queries
export function measureDatabaseQuery<T>(
  query: () => Promise<T>,
  queryName: string = "Database query"
): Promise<T> {
  return measureAsync(query, queryName);
}

// Performance optimization utilities
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Memory management utilities
export function cleanupMemory(): void {
  if (typeof window !== "undefined" && "gc" in window) {
    (window as { gc?: () => void }).gc?.();
  }
}

// Export default instance
export default performanceMonitor;
