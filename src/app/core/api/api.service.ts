import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG, API_ENDPOINTS, ApiEndpoint } from './api.config';
import { PaginatedResponse } from '../models/api-response.model';
import { ErrorHandlerService } from '../utils/error-handler';

export interface RequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?:
    | HttpParams
    | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  timeout?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private errorHandler = inject(ErrorHandlerService);

  private readonly baseUrl = API_CONFIG.baseUrl;

  // GET Methods
  get<T>(endpoint: ApiEndpoint | string, options?: RequestOptions): Observable<T> {
    return this.http.get<T>(this.buildUrl(endpoint), this.buildOptions(options)).pipe(
      catchError((error) => this.errorHandler.handleHttpError(error)),
    );
  }

  getPaginated<T>(
    endpoint: ApiEndpoint | string,
    pagination?: PaginationParams,
    options?: RequestOptions,
  ): Observable<PaginatedResponse<T>> {
    const params = this.buildPaginationParams(pagination);
    const finalOptions = {
      ...options,
      params: { ...options?.params, ...params },
    };

    return this.http
      .get<PaginatedResponse<T>>(this.buildUrl(endpoint), this.buildOptions(finalOptions))
      .pipe(catchError((error) => this.errorHandler.handleHttpError(error)));
  }

  getById<T>(endpoint: ApiEndpoint | string, id: string, options?: RequestOptions): Observable<T> {
    return this.get<T>(`${endpoint}/${id}`, options);
  }

  // POST Methods
  post<T>(endpoint: ApiEndpoint | string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .post<T>(this.buildUrl(endpoint), body, this.buildOptions(options))
      .pipe(
        catchError((error) => this.errorHandler.handleHttpError(error)),
      );
  }

  // PUT Methods
  put<T>(endpoint: ApiEndpoint | string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .put<T>(this.buildUrl(endpoint), body, this.buildOptions(options))
      .pipe(
        catchError((error) => this.errorHandler.handleHttpError(error)),
      );
  }

  putById<T>(
    endpoint: ApiEndpoint | string,
    id: string,
    body: unknown,
    options?: RequestOptions,
  ): Observable<T> {
    return this.put<T>(`${endpoint}/${id}`, body, options);
  }

  // PATCH Methods
  patch<T>(endpoint: ApiEndpoint | string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .patch<T>(this.buildUrl(endpoint), body, this.buildOptions(options))
      .pipe(
        catchError((error) => this.errorHandler.handleHttpError(error)),
      );
  }

  patchById<T>(
    endpoint: ApiEndpoint | string,
    id: string,
    body: unknown,
    options?: RequestOptions,
  ): Observable<T> {
    return this.patch<T>(`${endpoint}/${id}`, body, options);
  }

  // DELETE Methods
  delete<T = void>(endpoint: ApiEndpoint | string, options?: RequestOptions): Observable<T> {
    return this.http
      .delete<T>(this.buildUrl(endpoint), this.buildOptions(options))
      .pipe(
        catchError((error) => this.errorHandler.handleHttpError(error)),
      );
  }

  deleteById<T = void>(
    endpoint: ApiEndpoint | string,
    id: string,
    options?: RequestOptions,
  ): Observable<T> {
    return this.delete<T>(`${endpoint}/${id}`, options);
  }

  // File Upload
  uploadFile<T>(endpoint: ApiEndpoint | string, file: File, additionalData?: Record<string, unknown>): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, String(additionalData[key]));
      });
    }

    const options: RequestOptions = {
      reportProgress: true,
      responseType: 'json',
    };

    return this.post<T>(endpoint, formData, options);
  }

  // Utility Methods
  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    return `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  }

  private buildOptions(options?: RequestOptions): RequestOptions {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    return {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
    };
  }

  private buildPaginationParams(pagination?: PaginationParams): Record<string, string> {
    if (!pagination) return {};

    const params: Record<string, string> = {};

    if (pagination.page !== undefined) params['page'] = pagination.page.toString();
    if (pagination.limit !== undefined) params['limit'] = pagination.limit.toString();
    if (pagination.sortBy) params['sortBy'] = pagination.sortBy;
    if (pagination.sortOrder) params['sortOrder'] = pagination.sortOrder;

    return params;
  }

  // Health Check
  healthCheck(): Observable<{ status: string; timestamp: string }> {
    return this.get<{ status: string; timestamp: string }>('/health');
  }
}
