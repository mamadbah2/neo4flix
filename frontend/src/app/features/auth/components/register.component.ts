import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
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

      <!-- Register Form -->
      <main class="relative z-20 flex-grow flex items-center justify-center px-4 pb-20">
        <div class="bg-black/25 md:bg-black/25 w-full max-w-[450px] p-8 md:p-16 rounded-md shadow-2xl backdrop-blur-sm border border-white/5">
          <h1 class="text-3xl font-bold mb-8">S'inscrire</h1>

          <!-- Success Message -->
          @if (successMessage()) {
            <div class="bg-green-500/20 border border-green-500 text-white px-4 py-3 rounded mb-6 flex items-center gap-3">
              <i class="fa-solid fa-check-circle text-green-500"></i>
              <span class="text-sm">{{ successMessage() }}</span>
            </div>
          }

          <!-- Error Message -->
          @if (errorMessage()) {
            <div class="bg-[#E50914]/20 border border-[#E50914] text-white px-4 py-3 rounded mb-6 flex items-center gap-3">
              <i class="fa-solid fa-circle-exclamation text-[#E50914]"></i>
              <span class="text-sm">{{ errorMessage() }}</span>
            </div>
          }

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <!-- Username Field -->
            <div class="relative">
              <input 
                type="text" 
                id="username" 
                formControlName="username"
                placeholder=" "
                class="block w-full px-5 pt-6 pb-2 text-white bg-black/50 rounded border-0 focus:ring-2 focus:ring-white/50 peer appearance-none"
                [class.ring-2]="isFieldInvalid('username')"
                [class.ring-[#E50914]]="isFieldInvalid('username')" />
              <label 
                for="username"
                class="absolute text-[#8c8c8c] duration-200 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">
                Nom d'utilisateur
              </label>
              @if (isFieldInvalid('username')) {
                <p class="text-[#E50914] text-xs mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  @if (registerForm.get('username')?.errors?.['required']) {
                    Le nom d'utilisateur est requis.
                  } @else if (registerForm.get('username')?.errors?.['minlength']) {
                    Le nom d'utilisateur doit contenir au moins 3 caractères.
                  }
                </p>
              }
            </div>

            <!-- Email Field -->
            <div class="relative">
              <input 
                type="email" 
                id="email" 
                formControlName="email"
                placeholder=" "
                class="block w-full px-5 pt-6 pb-2 text-white bg-black/50 rounded border-0 focus:ring-2 focus:ring-white/50 peer appearance-none"
                [class.ring-2]="isFieldInvalid('email')"
                [class.ring-[#E50914]]="isFieldInvalid('email')" />
              <label 
                for="email"
                class="absolute text-[#8c8c8c] duration-200 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">
                Adresse e-mail
              </label>
              @if (isFieldInvalid('email')) {
                <p class="text-[#E50914] text-xs mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  @if (registerForm.get('email')?.errors?.['required']) {
                    L'adresse e-mail est requise.
                  } @else if (registerForm.get('email')?.errors?.['email']) {
                    Veuillez entrer une adresse e-mail valide.
                  }
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
              <button 
                type="button"
                (click)="togglePasswordVisibility()"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c8c8c] hover:text-white transition">
                <i [class]="showPassword() ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
              @if (isFieldInvalid('password')) {
                <p class="text-[#E50914] text-xs mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  @if (registerForm.get('password')?.errors?.['required']) {
                    Le mot de passe est requis.
                  } @else if (registerForm.get('password')?.errors?.['minlength']) {
                    Le mot de passe doit contenir au moins 8 caractères.
                  }
                </p>
              }
            </div>

            <!-- Confirm Password Field -->
            <div class="relative">
              <input 
                [type]="showConfirmPassword() ? 'text' : 'password'" 
                id="confirmPassword" 
                formControlName="confirmPassword"
                placeholder=" "
                class="block w-full px-5 pt-6 pb-2 pr-12 text-white bg-black/50 rounded border-0 focus:ring-2 focus:ring-white/50 peer appearance-none"
                [class.ring-2]="isFieldInvalid('confirmPassword')"
                [class.ring-[#E50914]]="isFieldInvalid('confirmPassword')" />
              <label 
                for="confirmPassword"
                class="absolute text-[#8c8c8c] duration-200 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">
                Confirmer le mot de passe
              </label>
              <button 
                type="button"
                (click)="toggleConfirmPasswordVisibility()"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c8c8c] hover:text-white transition">
                <i [class]="showConfirmPassword() ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
              @if (isFieldInvalid('confirmPassword')) {
                <p class="text-[#E50914] text-xs mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  @if (registerForm.get('confirmPassword')?.errors?.['required']) {
                    Veuillez confirmer votre mot de passe.
                  } @else if (registerForm.get('confirmPassword')?.errors?.['passwordMismatch']) {
                    Les mots de passe ne correspondent pas.
                  }
                </p>
              }
            </div>

            <!-- Submit Button -->
            <button 
              type="submit"
              [disabled]="isLoading()"
              class="w-full bg-[#E50914] hover:bg-[#B20710] disabled:bg-[#E50914]/50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded transition-colors mt-6 shadow-lg flex items-center justify-center gap-2">
              @if (isLoading()) {
                <i class="fa-solid fa-spinner fa-spin"></i>
                <span>Inscription en cours...</span>
              } @else {
                <span>S'inscrire</span>
              }
            </button>

            <!-- Terms -->
            <p class="text-xs text-[#737373] mt-4">
              En cliquant sur S'inscrire, vous acceptez nos 
              <a href="#" class="text-[#0071eb] hover:underline">Conditions d'utilisation</a> et notre 
              <a href="#" class="text-[#0071eb] hover:underline">Politique de confidentialité</a>.
            </p>
          </form>

          <!-- Footer -->
          <div class="mt-10 text-[#737373]">
            <p class="text-base">
              Vous avez déjà un compte ?
              <a routerLink="/login" class="text-white hover:underline font-medium">S'identifier</a>.
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
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  
  private submitted = false;

  registerForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  // Generate poster images for background
  readonly posterImages = Array.from({ length: 70 }, (_, i) => 
    `https://picsum.photos/id/${1011 + (i % 60)}/300/450`
  );

  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(show => !show);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const { username, email, password } = this.registerForm.value;

    // Note: Keycloak doesn't have a direct registration endpoint via password grant.
    // Registration is typically handled via:
    // 1. Admin API (requires admin token)
    // 2. Self-registration form (redirect to Keycloak)
    // 3. Custom backend endpoint
    // For now, we'll simulate a redirect to login after showing success message.
    
    // Simulate registration (in production, call your backend registration endpoint)
    setTimeout(() => {
      this.isLoading.set(false);
      this.successMessage.set('Compte créé avec succès ! Redirection vers la page de connexion...');
      
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }, 1500);
  }
}
