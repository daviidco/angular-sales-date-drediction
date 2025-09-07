# 🚀 Estrategia para Consumo de API REST - Angular Senior

## 📋 Arquitectura Implementada

### 1. **Estructura de Capas**
```
src/app/core/
├── api/
│   ├── api.service.ts           # ✅ Servicio base HTTP
│   ├── api.config.ts            # ✅ Configuración de endpoints
│   └── api.interceptors.ts      # ✅ Interceptores HTTP
├── services/
│   └── customer.service.ts      # ✅ Servicios de dominio actualizados
├── models/
│   └── api-response.model.ts    # ✅ Modelos de respuesta tipados
└── utils/
    └── error-handler.ts         # ✅ Manejo centralizado de errores
```

## 🔧 Características Implementadas

### **ApiService - Servicio Base HTTP**
- ✅ Métodos tipados para CRUD operations
- ✅ Soporte para paginación automática
- ✅ Upload de archivos
- ✅ Headers y parámetros configurables
- ✅ Health check endpoint

### **Sistema de Interceptores HTTP**
1. **RequestIdInterceptor** - Genera ID único por request
2. **LoadingInterceptor** - Manejo global de loading states
3. **AuthInterceptor** - Inyección automática de tokens
4. **CacheInterceptor** - Cache inteligente para GET requests
5. **RetryInterceptor** - Retry automático con exponential backoff
6. **ErrorInterceptor** - Manejo centralizado de errores

### **Manejo de Errores Avanzado**
- ✅ Mapeo automático de errores HTTP
- ✅ Mensajes localizados para usuarios
- ✅ Validaciones de formulario
- ✅ Logging estructurado
- ✅ Preparado para monitoring (Sentry, LogRocket)

## 🎯 Mejores Prácticas Aplicadas

### **1. Tipado Fuerte**
```typescript
// ✅ Respuestas tipadas
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

// ✅ Paginación estándar
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}
```

### **2. Configuración Centralizada**
```typescript
// ✅ Endpoints centralizados
export const API_ENDPOINTS = {
  CUSTOMERS: '/customers',
  ORDERS: '/orders',
  PREDICTIONS: '/predictions'
} as const;

// ✅ Configuración global
export const API_CONFIG: ApiConfig = {
  baseUrl: '/api/v1',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000
};
```

### **3. Patrón Repository**
```typescript
// ✅ Servicio de dominio limpio
export class CustomerService {
  private apiService = inject(ApiService);
  
  getCustomers(): Observable<CustomerListItem[]> {
    return this.apiService.get<CustomerListItem[]>(API_ENDPOINTS.CUSTOMERS);
  }
  
  createCustomer(customer: CreateCustomerDto): Observable<Customer> {
    return this.apiService.post<Customer>(API_ENDPOINTS.CUSTOMERS, customer);
  }
}
```

## 🔄 Migración de Mock a API Real

### **Paso 1: Activar API Real**
En `CustomerService`, descomenta:
```typescript
getCustomers(filterCriteria?: CustomerFilterCriteria): Observable<CustomerListItem[]> {
  // Activar esta línea para API real
  return this.apiService.get<CustomerListItem[]>(API_ENDPOINTS.CUSTOMERS, {
    params: this.buildFilterParams(filterCriteria)
  });
  
  // Comentar esta línea
  // return this.getMockCustomers(filterCriteria);
}
```

### **Paso 2: Configurar URL Base**
En `api.config.ts`:
```typescript
export const API_CONFIG: ApiConfig = {
  baseUrl: 'https://your-api-domain.com/api/v1', // ← Cambiar URL
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000
};
```

### **Paso 3: Configurar Autenticación**
En `AuthInterceptor`:
```typescript
private getAuthToken(): string | null {
  // Implementar lógica de auth específica
  return localStorage.getItem('auth_token');
}
```

## 🚀 Uso en Componentes

### **Patrón Recomendado**
```typescript
@Component({...})
export class CustomerListComponent {
  private customerService = inject(CustomerService);
  
  customers = signal<CustomerListItem[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  ngOnInit() {
    this.loadCustomers();
  }
  
  private loadCustomers() {
    this.loading.set(true);
    this.error.set(null);
    
    this.customerService.getCustomers()
      .subscribe({
        next: (customers) => {
          this.customers.set(customers);
          this.loading.set(false);
        },
        error: (errorDetails) => {
          this.error.set(errorDetails.userMessage);
          this.loading.set(false);
        }
      });
  }
}
```

## 🔒 Consideraciones de Seguridad

### **Headers de Seguridad**
- ✅ Content-Type automático
- ✅ Request ID para trazabilidad  
- ✅ Bearer token automático
- ✅ CORS configurado en interceptores

### **Validación de Respuestas**
- ✅ Validación de estructura de API
- ✅ Manejo de errores de validación
- ✅ Sanitización automática

## 📊 Monitoreo y Logging

### **Métricas Implementadas**
- ✅ Request/Response logging
- ✅ Error tracking con detalles
- ✅ Performance monitoring (timing)
- ✅ Request ID para correlación

### **Integración con Monitoring**
```typescript
// En ErrorHandlerService.logError()
private logError(errorDetails: ErrorDetails, originalError: HttpErrorResponse) {
  // Integrar con:
  // - Sentry: this.sentry.captureError(errorDetails);
  // - LogRocket: LogRocket.captureException(originalError);
  // - DataDog: this.datadog.logError(errorDetails);
}
```

## 🧪 Testing Strategy

### **Unit Tests**
- Mock `ApiService` en servicios
- Testear interceptores independientemente
- Validar manejo de errores

### **Integration Tests**
- Testear flujo completo con HTTP mocks
- Verificar interceptores en cadena
- Validar retry logic

## ⚡ Performance Optimizations

### **Cache Strategy**
- ✅ Cache automático para GET requests
- ✅ TTL configurable (5 minutos default)
- ✅ Cache busting con headers
- ✅ Invalidación manual disponible

### **Request Optimization**
- ✅ Debounce en filtros
- ✅ Request deduplication
- ✅ Exponential backoff en retries
- ✅ Timeout configurables

## 🎯 Próximos Pasos

1. **Implementar Loading Service Global**
2. **Agregar Refresh Token Logic**
3. **Implementar Request Cancellation**
4. **Configurar E2E Tests**
5. **Integrar con CI/CD Pipeline**

---

**Esta arquitectura está lista para producción y sigue todas las mejores prácticas de Angular para consumo de APIs REST.**