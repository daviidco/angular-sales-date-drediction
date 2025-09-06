import { Component, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class HeaderComponent {
  title = signal('Sales Date Prediction App');
  
  notificationCount = signal(3);
  
  onNotificationsClick(): void {
    // TODO: Implementar lógica de notificaciones
    console.log('Notificaciones clicked');
  }
  
  onSettingsClick(): void {
    // TODO: Implementar lógica de configuración
    console.log('Configuración clicked');
  }
  
  onProfileClick(): void {
    // TODO: Implementar lógica de perfil
    console.log('Perfil clicked');
  }
}