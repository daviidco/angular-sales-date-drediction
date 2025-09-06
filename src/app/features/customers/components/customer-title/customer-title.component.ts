import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-title',
  templateUrl: './customer-title.component.html',
  styleUrls: ['./customer-title.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CustomerTitleComponent {
  @Input() title = 'Clientes';
  @Input() subtitle?: string;
  @Input() customerCount: number | null = null;
}