import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="bg-black text-white font-sans min-h-screen flex flex-col relative overflow-x-hidden">
      
      <!-- Background with poster grid -->
      <div class="fixed inset-0 z-0 bg-black overflow-hidden">
        <div class="grid-overlay">
          @for (poster of posterImages; track $index) {
            <div class="poster-item" [style.background-image]="'url(' + poster + ')'"></div>
          }
        </div>
        <!-- Dark overlay -->
        <div class="absolute inset-0 bg-black/25 z-10"></div>
      </div>

      <!-- Header Logo -->
      <nav class="relative z-20 w-full px-6 py-6 md:px-12">
        <a routerLink="/" class="text-4xl font-black text-[#E50914] tracking-tighter uppercase">
          Neo4flix
        </a>
      </nav>

      <!-- Login Form -->
      <main class="relative z-20 flex-grow flex items-center justify-center px-4 pb-20">
        <div class="bg-black/25 md:bg-black/25 w-full max-w-[450px] p-8 md:p-16 rounded-md shadow-2xl backdrop-blur-sm border border-white/5">
          <h1 class="text-3xl font-bold mb-8">S'identifier</h1>

          <!-- Error Message -->
          @if (authService.error()) {
            <div class="bg-[#E50914]/20 border border-[#E50914] text-white px-4 py-3 rounded mb-6 flex items-center gap-3">
              <i class="fa-solid fa-circle-exclamation text-[#E50914]"></i>
              <span class="text-sm">{{ authService.error() }}</span>
            </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <!-- Username/Email Field -->
            <div class="relative">
              <input 
                type="text" 
                id="login" 
                formControlName="username"
                placeholder=" "
                class="block w-full px-5 pt-6 pb-2 text-white bg-black/50 rounded border-0 focus:ring-2 focus:ring-white/50 peer appearance-none"
                [class.ring-2]="isFieldInvalid('username')"
                [class.ring-[#E50914]]="isFieldInvalid('username')" />
              <label 
                for="login"
                class="absolute text-[#8c8c8c] duration-200 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">
                Nom d'utilisateur ou e-mail
              </label>
              @if (isFieldInvalid('username')) {
                <p class="text-[#E50914] text-xs mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  Veuillez entrer un nom d'utilisateur valide.
                </p>
              }
            </div>

            <!-- Password Field -->
            <div class="relative">
              <input 
                [type]="showPassword() ? 'text' : 'password'" 
                id="password" 
                formControlName="password"
                placeholder=" "
                class="block w-full px-5 pt-6 pb-2 pr-12 text-white bg-black/50 rounded border-0 focus:ring-2 focus:ring-white/50 peer appearance-none"
                [class.ring-2]="isFieldInvalid('password')"
                [class.ring-[#E50914]]="isFieldInvalid('password')" />
              <label 
                for="password"
                class="absolute text-[#8c8c8c] duration-200 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">
                Mot de passe
              </label>
              <!-- Toggle password visibility -->
              <button 
                type="button"
                (click)="togglePasswordVisibility()"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c8c8c] hover:text-white transition">
                <i [class]="showPassword() ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
              @if (isFieldInvalid('password')) {
                <p class="text-[#E50914] text-xs mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  Le mot de passe doit contenir entre 4 et 60 caractères.
                </p>
              }
            </div>

            <!-- Submit Button -->
            <button 
              type="submit"
              [disabled]="authService.isLoading()"
              class="w-full bg-[#E50914] hover:bg-[#B20710] disabled:bg-[#E50914]/50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded transition-colors mt-6 shadow-lg flex items-center justify-center gap-2">
              @if (authService.isLoading()) {
                <i class="fa-solid fa-spinner fa-spin"></i>
                <span>Connexion en cours...</span>
              } @else {
                <span>S'identifier</span>
              }
            </button>

            <!-- Options -->
            <div class="flex items-center justify-between text-xs text-[#b3b3b3] mt-2">
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="remember"
                  formControlName="rememberMe"
                  class="rounded bg-[#737373] border-none text-[#737373] focus:ring-0 mr-1 w-4 h-4">
                <label for="remember" class="cursor-pointer">Se souvenir de moi</label>
              </div>
              <a href="#" class="hover:underline">Besoin d'aide ?</a>
            </div>
          </form>

          <!-- Footer -->
          <div class="mt-16 text-[#737373]">
            <p class="text-base">
              Première visite sur Neo4flix ?
              <a routerLink="/register" class="text-white hover:underline font-medium">S'inscrire maintenant</a>.
            </p>
            <p class="text-xs mt-4 leading-tight">
              Cette page est protégée par Google reCAPTCHA pour nous assurer que vous n'êtes pas un robot.
              <a href="#" class="text-[#0071eb] hover:underline">En savoir plus.</a>
            </p>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="relative z-20 bg-black/70 text-[#737373] py-10 px-6 md:px-12 border-t border-white/10 mt-auto">
        <div class="max-w-4xl mx-auto">
          <p class="mb-6 hover:underline cursor-pointer">Des questions ? Appelez le 0805-543-064</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <a href="#" class="hover:underline">FAQ</a>
            <a href="#" class="hover:underline">Conditions d'utilisation</a>
            <a href="#" class="hover:underline">Confidentialité</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .grid-overlay {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 10px;
      position: absolute;
      top: -10%;
      left: -10%;
      width: 120%;
      height: 120%;
      z-index: 0;
      opacity: 0.8;
      transform: rotate(-15deg);
      pointer-events: none;
      overflow: hidden;
    }

    .poster-item {
      background-size: cover;
      background-position: center;
      border-radius: 4px;
      aspect-ratio: 2/3;
      filter: brightness(0.7);
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);

  readonly showPassword = signal(false);
  private submitted = false;

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]],
    rememberMe: [false]
  });

  // Generate poster images for background
  readonly posterImages = Array.from({ length: 70 }, (_, i) => 
    `https://picsum.photos/id/${1011 + (i % 60)}/300/450`
  );

  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  onSubmit(): void {
    this.submitted = true;
    this.authService.clearError();

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login({ username, password }).subscribe({
      next: () => {
        // Navigate to the stored return URL or /home
        this.authService.navigateToReturnUrl();
      },
      error: () => {
        // Error is already handled by AuthService and displayed in template
      }
    });
  }
}
