import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  features = [
    'Predicción en tiempo real',
    'Análisis de tendencias',
    'Reportes detallados',
    'Dashboard interactivo'
  ];

  contactInfo = {
    email: 'support@salesprediction.com',
    phone: '+1 (555) 123-4567'
  };

  socialLinks = [
    { icon: 'link', tooltip: 'LinkedIn', url: '#' },
    { icon: 'alternate_email', tooltip: 'Twitter', url: '#' },
    { icon: 'code', tooltip: 'GitHub', url: '#' }
  ];

  techStack = [
    'Angular 20',
    '.NET Core',
    'Material Design'
  ];

  onSocialLinkClick(platform: string, url: string): void {
    // TODO: Implementar navegación a redes sociales
    console.log(`Navigating to ${platform}: ${url}`);
  }

  onContactClick(type: 'email' | 'phone', value: string): void {
    // TODO: Implementar acciones de contacto
    if (type === 'email') {
      window.location.href = `mailto:${value}`;
    } else if (type === 'phone') {
      window.location.href = `tel:${value}`;
    }
  }
}