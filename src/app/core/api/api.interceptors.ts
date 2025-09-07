import { Injectable, inject } from '@angular/core';
import { 
  HttpInterceptor, 
  HttpRequest, 
  HttpHandler, 
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { 
  catchError, 
  retry, 
  retryWhen, 
  concatMap, 
  finalize,
  tap
} from 'rxjs/operators';
import { ErrorHandlerService } from '../utils/error-handler';

// Loading Interceptor
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.activeRequests++;
    this.updateLoadingState(true);
    
    return next.handle(req).pipe(
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.updateLoadingState(false);
        }
      })
    );
  }
  
  private updateLoadingState(isLoading: boolean): void {
    // Emitir estado de loading global
    // this.loadingService.setLoading(isLoading);
  }
}

// Auth Interceptor
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip auth for login endpoints
    if (req.url.includes('/auth/login')) {
      return next.handle(req);
    }
    
    const token = this.getAuthToken();
    
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(authReq);
    }
    
    return next.handle(req);
  }
  
  private getAuthToken(): string | null {
    // Obtener token del localStorage, sessionStorage o servicio de auth
    return localStorage.getItem('auth_token');
  }
}

// Error Interceptor
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private errorHandler = inject(ErrorHandlerService);
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.errorHandler.handleHttpError(error);
      })
    );
  }
}

// Retry Interceptor
@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  private readonly retryableStatuses = [500, 502, 503, 504];
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // No retry para métodos que modifican datos
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      return next.handle(req);
    }
    
    return next.handle(req).pipe(
      retryWhen(errors =>
        errors.pipe(
          concatMap((error: HttpErrorResponse, index) => {
            if (
              index >= this.maxRetries ||
              !this.retryableStatuses.includes(error.status)
            ) {
              return throwError(() => error);
            }
            
            console.warn(`Retry attempt ${index + 1} for ${req.url}`);
            return timer(this.retryDelay * Math.pow(2, index)); // Exponential backoff
          })
        )
      )
    );
  }
}

// Cache Interceptor
@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, { response: HttpResponse<any>, timestamp: number }>();
  private readonly cacheTTL = 5 * 60 * 1000; // 5 minutos
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Solo cachear GET requests
    if (req.method !== 'GET') {
      return next.handle(req);
    }
    
    // Skip cache si tiene header no-cache
    if (req.headers.has('Cache-Control') && req.headers.get('Cache-Control')?.includes('no-cache')) {
      return next.handle(req);
    }
    
    const cacheKey = this.getCacheKey(req);
    const cachedResponse = this.getFromCache(cacheKey);
    
    if (cachedResponse) {
      return new Observable(observer => {
        observer.next(cachedResponse);
        observer.complete();
      });
    }
    
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.addToCache(cacheKey, event);
        }
      })
    );
  }
  
  private getCacheKey(req: HttpRequest<any>): string {
    return `${req.method}:${req.urlWithParams}`;
  }
  
  private getFromCache(key: string): HttpResponse<any> | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > this.cacheTTL;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.response.clone();
  }
  
  private addToCache(key: string, response: HttpResponse<any>): void {
    this.cache.set(key, {
      response: response.clone(),
      timestamp: Date.now()
    });
  }
  
  clearCache(): void {
    this.cache.clear();
  }
}

// Request ID Interceptor
@Injectable()
export class RequestIdInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const requestId = this.generateRequestId();
    
    const reqWithId = req.clone({
      headers: req.headers.set('X-Request-ID', requestId)
    });
    
    return next.handle(reqWithId);
  }
  
  private generateRequestId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}