import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-landing',
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

      <!-- Navigation -->
      <nav class="relative z-20 w-full px-6 py-5 md:px-12 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <a routerLink="/" class="text-3xl font-black text-[#E50914] tracking-tighter uppercase">
            Neo4flix
          </a>
        </div>
        <div class="flex items-center gap-4">
          <a 
            routerLink="/login" 
            class="bg-[#E50914] hover:bg-[#B20710] text-white px-4 py-1.5 rounded text-sm font-semibold transition-colors duration-200">
            S'identifier
          </a>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="relative z-20 flex-grow flex flex-col justify-center items-center text-center px-4 sm:px-8 mt-10 mb-20">
        <div class="max-w-4xl mx-auto space-y-6 animate-fade-in">
          
          <!-- Hero Title -->
          <h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
            Films, séries et animes <br class="hidden md:block" />
            <span class="text-transparent bg-clip-text bg-gradient-to-b from-[#E50914] to-white/80">
              en illimité.
            </span>
          </h1>
          
          <!-- Subtitle -->
          <p class="text-xl md:text-2xl text-gray-200 font-medium max-w-2xl mx-auto">
            Où que vous soyez. Annulable à tout moment.
          </p>
          
          <!-- Description -->
          <p class="text-base md:text-lg text-gray-400 max-w-xl mx-auto pb-4">
            Prêt à regarder Neo4flix ? Saisissez votre adresse e-mail pour vous abonner ou réactiver votre abonnement.
          </p>
          
          
        </div>
      </main>

      <!-- Features Section -->
      <section class="relative z-20 py-20 border-t border-gray-800">
        <div class="max-w-6xl mx-auto px-6">
          <div class="grid md:grid-cols-3 gap-8">
            
            <!-- Feature 1 -->
            <div class="text-center p-6">
              <div class="w-16 h-16 mx-auto mb-4 bg-[#E50914]/20 rounded-full flex items-center justify-center">
                <i class="fa-solid fa-tv text-[#E50914] text-2xl"></i>
              </div>
              <h3 class="text-xl font-bold mb-2">Regardez partout</h3>
              <p class="text-gray-400">
                Regardez sur votre TV, smartphone, tablette ou ordinateur.
              </p>
            </div>

            <!-- Feature 2 -->
            <div class="text-center p-6">
              <div class="w-16 h-16 mx-auto mb-4 bg-[#E50914]/20 rounded-full flex items-center justify-center">
                <i class="fa-solid fa-users text-[#E50914] text-2xl"></i>
              </div>
              <h3 class="text-xl font-bold mb-2">Recommandations sociales</h3>
              <p class="text-gray-400">
                Découvrez ce que vos amis regardent et partagez vos coups de cœur.
              </p>
            </div>

            <!-- Feature 3 -->
            <div class="text-center p-6">
              <div class="w-16 h-16 mx-auto mb-4 bg-[#E50914]/20 rounded-full flex items-center justify-center">
                <i class="fa-solid fa-wand-magic-sparkles text-[#E50914] text-2xl"></i>
              </div>
              <h3 class="text-xl font-bold mb-2">IA personnalisée</h3>
              <p class="text-gray-400">
                Notre algorithme apprend vos goûts pour des recommandations sur-mesure.
              </p>
            </div>
          </div>
        </div>
      </section>
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
      opacity: 0.4;
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

    .animate-fade-in {
      animation: fadeIn 1s ease-out;
    }

    .animate-slide-up {
      animation: slideUp 0.8s ease-out;
    }

    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }

    @keyframes slideUp {
      0% { transform: translateY(20px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class LandingComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  private submitted = false;

  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.email]]
  });

  // Generate poster images for background
  readonly posterImages = Array.from({ length: 70 }, (_, i) => 
    `https://picsum.photos/id/${1011 + (i % 60)}/300/450`
  );

  isEmailInvalid(): boolean {
    const email = this.emailForm.get('email');
    return !!(email && email.invalid && email.value && (email.dirty || email.touched || this.submitted));
  }

  onSubmit(): void {
    this.submitted = true;
    
    const email = this.emailForm.get('email')?.value;
    
    if (email && this.emailForm.valid) {
      // Navigate to register with email pre-filled
      this.router.navigate(['/register'], { queryParams: { email } });
    } else {
      // Navigate to login page
      this.router.navigate(['/login']);
    }
  }
}
