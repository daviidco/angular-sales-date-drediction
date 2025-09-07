import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ApiError, ValidationError } from '../models/api-response.model';

export interface ErrorDetails {
  code: string;
  message: string;
  userMessage: string;
  details?: Record<string, any>;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  
  handleHttpError(error: HttpErrorResponse): Observable<never> {
    const errorDetails = this.mapHttpErrorToDetails(error);
    
    // Log error for monitoring
    this.logError(errorDetails, error);
    
    return throwError(() => errorDetails);
  }
  
  private mapHttpErrorToDetails(error: HttpErrorResponse): ErrorDetails {
    // Error de conexión/red
    if (error.status === 0) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network connection error',
        userMessage: 'No se pudo conectar con el servidor. Verifique su conexión.'
      };
    }
    
    // Errores del servidor con estructura de API
    if (error.error && typeof error.error === 'object') {
      const apiError = error.error as ApiError;
      
      if (this.isValidationError(apiError)) {
        return this.mapValidationError(apiError as ValidationError);
      }
      
      if (apiError.error) {
        return {
          code: apiError.error.code || `HTTP_${error.status}`,
          message: apiError.error.message,
          userMessage: this.getLocalizedMessage(apiError.error.code, error.status),
          details: apiError.error.details
        };
      }
    }
    
    // Errores HTTP estándar
    return {
      code: `HTTP_${error.status}`,
      message: error.message,
      userMessage: this.getHttpErrorMessage(error.status),
      details: { statusText: error.statusText }
    };
  }
  
  private isValidationError(error: ApiError): boolean {
    return 'validationErrors' in error.error;
  }
  
  private mapValidationError(error: ValidationError): ErrorDetails {
    const fieldErrors = error.error.validationErrors
      .map(ve => `${ve.field}: ${ve.message}`)
      .join(', ');
    
    return {
      code: 'VALIDATION_ERROR',
      message: `Validation failed: ${fieldErrors}`,
      userMessage: 'Hay errores en el formulario. Por favor, corríjalos.',
      details: { validationErrors: error.error.validationErrors }
    };
  }
  
  private getHttpErrorMessage(status: number): string {
    const messages: Record<number, string> = {
      400: 'Los datos enviados no son válidos.',
      401: 'No tiene permisos para realizar esta acción.',
      403: 'Acceso prohibido.',
      404: 'El recurso solicitado no fue encontrado.',
      409: 'El recurso ya existe o hay un conflicto.',
      422: 'Los datos no pudieron ser procesados.',
      429: 'Demasiadas peticiones. Intente más tarde.',
      500: 'Error interno del servidor.',
      502: 'Servidor no disponible.',
      503: 'Servicio temporalmente no disponible.',
      504: 'Tiempo de espera agotado.'
    };
    
    return messages[status] || 'Ha ocurrido un error inesperado.';
  }
  
  private getLocalizedMessage(code: string, httpStatus: number): string {
    const messages: Record<string, string> = {
      'CUSTOMER_NOT_FOUND': 'Cliente no encontrado.',
      'INVALID_CREDENTIALS': 'Credenciales inválidas.',
      'TOKEN_EXPIRED': 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
      'INSUFFICIENT_PERMISSIONS': 'No tiene permisos suficientes.',
      'RATE_LIMIT_EXCEEDED': 'Ha excedido el límite de peticiones.'
    };
    
    return messages[code] || this.getHttpErrorMessage(httpStatus);
  }
  
  private logError(errorDetails: ErrorDetails, originalError: HttpErrorResponse): void {
    console.error('API Error:', {
      code: errorDetails.code,
      message: errorDetails.message,
      userMessage: errorDetails.userMessage,
      status: originalError.status,
      url: originalError.url,
      details: errorDetails.details,
      timestamp: new Date().toISOString()
    });
    
    // Aquí integrarías con servicios de monitoring como Sentry, LogRocket, etc.
    // this.monitoringService.captureError(errorDetails, originalError);
  }
}