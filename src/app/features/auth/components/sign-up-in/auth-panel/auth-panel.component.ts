import { Component, signal } from '@angular/core';
import LoginComponent from '../login/login.component';
import RegisterComponent from '../register/register.component';

type AuthTab = 'login' | 'register';

@Component({
  selector: 'app-auth-panel',
  standalone: true,
  imports: [LoginComponent, RegisterComponent],
  templateUrl: './auth-panel.component.html',
  styleUrl: './auth-panel.component.scss',
})
export default class AuthPanelComponent {
  readonly activeTab = signal<AuthTab>('login');

  select(tab: AuthTab): void {
    this.activeTab.set(tab);
  }
}
