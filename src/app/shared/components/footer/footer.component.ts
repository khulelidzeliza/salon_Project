import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ShieldCheck, MapPin, Headphones, Instagram, MessageCircle, Music2 } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  readonly ShieldIcon = ShieldCheck;
  readonly MapPinIcon = MapPin;
  readonly SupportIcon = Headphones;
  readonly InstagramIcon = Instagram;
  readonly WhatsappIcon = MessageCircle; 
  readonly TikTokIcon = Music2;          

  readonly currentYear = new Date().getFullYear();
}