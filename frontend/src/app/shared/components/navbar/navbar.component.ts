import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

export type NavPage = 'home' | 'series' | 'films' | 'social' | 'watchlist' | 'none';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header 
      id="main-header" 
      class="fixed top-0 w-full z-[100] px-6 md:px-16 py-5 flex items-center justify-between transition-all duration-400"
      [class.bg-transparent]="!scrolled"
      [class.bg-black/95]="scrolled"
      [class.backdrop-blur-md]="scrolled">
      
      <div class="flex items-center space-x-10">
        <!-- Logo -->
        <a routerLink="/home" class="text-[#E50914] text-2xl md:text-4xl font-extrabold tracking-tighter uppercase cursor-pointer">
          Neo4flix
        </a>
        
        <!-- Navigation Links (authenticated users only) -->
        @if (authService.isLoggedIn()) {
          <nav class="hidden lg:flex space-x-8 text-base font-medium text-gray-300">
            <a routerLink="/home" 
               routerLinkActive="text-white"
               [routerLinkActiveOptions]="{exact: true}"
               class="hover:text-white transition">
              Accueil
            </a>
            <a routerLink="/series" 
               routerLinkActive="text-white"
               class="hover:text-white transition">
              Séries
            </a>
            <a routerLink="/films" 
               routerLinkActive="text-white"
               class="hover:text-white transition">
              Films
            </a>
            <a routerLink="/social" 
               routerLinkActive="text-white"
               class="hover:text-white transition">
              Social
            </a>
            <a routerLink="/watchlist" 
               routerLinkActive="text-white"
               class="hover:text-white transition">
              Ma liste
            </a>
          </nav>
        }
      </div>
      
      <div class="flex items-center space-x-6 text-xl">
        @if (authService.isLoggedIn()) {
          <!-- Search Button -->
          <button class="hover:text-gray-400 transition" aria-label="Rechercher">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
          
          <!-- User Profile Dropdown -->
          <div class="relative group">
            <div class="w-10 h-10 rounded bg-[#B20710] overflow-hidden border-2 border-transparent hover:border-white transition cursor-pointer shadow-lg">
              <img 
                [src]="'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (authService.username() || 'user')" 
                [alt]="authService.username() || 'User'"
                class="w-full h-full object-cover">
            </div>
            
            <!-- Dropdown Menu -->
            <div class="absolute right-0 top-full mt-2 w-48 bg-black/95 border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div class="py-2">
                <div class="px-4 py-2 border-b border-white/10">
                  <p class="text-sm text-white font-medium">{{ authService.username() }}</p>
                  <p class="text-xs text-gray-400">{{ authService.user()?.email }}</p>
                </div>
                <a routerLink="/profile" class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition">
                  <i class="fa-solid fa-user mr-2"></i>Mon Profil
                </a>
                <button 
                  (click)="logout()" 
                  class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition">
                  <i class="fa-solid fa-sign-out-alt mr-2"></i>Déconnexion
                </button>
              </div>
            </div>
          </div>
        } @else {
          <!-- Login/Register buttons for guests -->
          <a routerLink="/login" 
             class="text-sm font-medium text-gray-300 hover:text-white transition">
            S'identifier
          </a>
          <a routerLink="/register" 
             class="bg-[#E50914] hover:bg-[#B20710] text-white px-4 py-2 rounded text-sm font-semibold transition-colors">
            S'inscrire
          </a>
        }
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NavbarComponent {
  @Input() activePage: NavPage = 'none';
  
  readonly authService = inject(AuthService);
  
  scrolled = false;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.scrolled = window.scrollY > 50;
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
