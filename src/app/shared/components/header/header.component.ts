import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Heart, User, MapPin, Menu, X, Plus , LogOut } from 'lucide-angular';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { LogOut as LogOutAction  } from '../../../store/user-state/user.actions';
// import { Salon } from '../../../../generated/graphql';
import { AddSalonModalComponent } from "../modals/add-salon-modal/add-salon-modal.component";
import { UserSelectors } from '../../../store/user-state/user.selector';
import { IUser } from '../../../store/user-state/user.model';
import { SalonType } from '../../../store/salon-state/salon-modal';
import { ConfirmModalComponent } from "../modals/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, AddSalonModalComponent, ConfirmModalComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  readonly user = this.store.selectSignal(UserSelectors.getUser);
  readonly isOrganizer = computed(() => this.user()?.role === 'ORGANIZATOR');

  user$!: Observable<IUser | null>;

  readonly HeartIcon = Heart;
  readonly UserIcon = User;
  readonly CloseIcon = X;
  readonly LogOutIcon = LogOut;
  readonly PlusIcon = Plus;
  
  isMenuOpen = false;
  showAddSalon = false;
  notloggedin = false;
  showLogoutConfirm = false;
  salons: SalonType[] = [];

  ngOnInit(): void {
    this.user$ = this.store.select(UserSelectors.getUser);
  }

  askLogout(): void {
    this.showLogoutConfirm = true;
  }

  logout() {
    this.showLogoutConfirm = false;
    this.store.dispatch(new LogOutAction());
    this.router.navigate(['/']);

  }
  
  askLogin(): void {
    this.notloggedin = true;
    console.log("opened modaal");
  }
  login() {
    this.notloggedin = false;
    this.router.navigate(['/auth/sign-in']);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
  openSalonModal(): void{
    this.showAddSalon = true;
  }
  onSalonCreated(salon: SalonType) {
  this.salons = [salon, ...this.salons]; // shows instantly, no refresh
}
}