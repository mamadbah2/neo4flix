import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <div class="bg-black text-white min-h-screen">
      <!-- Navbar -->
      <app-navbar activePage="home" />
      
      <!-- Hero Section Placeholder -->
      <section class="relative w-full h-[90vh] overflow-hidden flex items-center">
        <!-- Background -->
        <div class="absolute inset-0 z-0">
          <div 
            class="absolute inset-0 bg-cover bg-center" 
            style="background-image: url('https://picsum.photos/id/10/1920/1080');">
          </div>
        </div>
        
        <!-- Gradients -->
        <div class="absolute inset-0 z-10 bg-gradient-to-r from-black via-transparent to-transparent opacity-90"></div>
        <div class="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/10 to-transparent"></div>

        <!-- Content -->
        <div class="relative z-20 px-6 md:px-16 max-w-4xl space-y-8">
          <div class="flex items-center space-x-3">
            <span class="bg-[#E50914] text-white text-xs font-bold px-2 py-1 rounded">TOP 10</span>
            <span class="text-[#E50914] font-bold uppercase tracking-widest text-sm">Film tendance</span>
          </div>
          
          <h2 class="text-5xl md:text-7xl font-black leading-tight drop-shadow-2xl">
            Bienvenue {{ authService.username() }} !
          </h2>
          
          <p class="text-lg md:text-xl text-gray-300 max-w-2xl">
            Découvrez les derniers films et séries tendances. Votre aventure cinématographique commence ici.
          </p>
          
          <div class="flex items-center space-x-4">
            <button class="bg-white text-black px-8 py-3 rounded font-bold text-lg flex items-center gap-2 hover:bg-gray-200 transition">
              <i class="fa-solid fa-play"></i>
              Lecture
            </button>
            <button class="bg-gray-500/50 text-white px-8 py-3 rounded font-bold text-lg flex items-center gap-2 hover:bg-gray-500/70 transition">
              <i class="fa-solid fa-circle-info"></i>
              Plus d'infos
            </button>
          </div>
        </div>
      </section>

      <!-- Content Rows Placeholder -->
      <div class="relative z-30 -mt-40 space-y-12 pb-24 px-6 md:px-16">
        
        <!-- Row 1: Top 10 -->
        <section>
          <h3 class="text-xl md:text-2xl font-bold mb-4">Top 10 des films en France</h3>
          <div class="flex gap-4 overflow-x-auto no-scrollbar pb-4">
            @for (i of [1,2,3,4,5,6,7,8,9,10]; track i) {
              <div class="flex-shrink-0 relative">
                <span class="absolute -left-8 bottom-0 text-[8rem] font-black text-transparent [-webkit-text-stroke:3px_#333] z-0">
                  {{ i }}
                </span>
                <div class="w-[150px] h-[225px] bg-gray-800 rounded-lg overflow-hidden relative z-10 ml-8">
                  <img 
                    [src]="'https://picsum.photos/id/' + (1010 + i) + '/300/450'" 
                    alt="Movie"
                    class="w-full h-full object-cover" />
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Row 2: Recommended -->
        <section>
          <h3 class="text-xl md:text-2xl font-bold mb-4">Recommandé pour vous</h3>
          <div class="flex gap-4 overflow-x-auto no-scrollbar pb-4">
            @for (i of [1,2,3,4,5,6,7,8]; track i) {
              <div class="flex-shrink-0 w-[200px] h-[300px] bg-gray-800 rounded-lg overflow-hidden group cursor-pointer transition-transform hover:scale-105 hover:z-50">
                <img 
                  [src]="'https://picsum.photos/id/' + (1020 + i) + '/300/450'" 
                  alt="Movie"
                  class="w-full h-full object-cover" />
              </div>
            }
          </div>
        </section>

        <!-- Row 3: New Releases -->
        <section>
          <h3 class="text-xl md:text-2xl font-bold mb-4">Nouveautés</h3>
          <div class="flex gap-4 overflow-x-auto no-scrollbar pb-4">
            @for (i of [1,2,3,4,5,6,7,8]; track i) {
              <div class="flex-shrink-0 w-[200px] h-[300px] bg-gray-800 rounded-lg overflow-hidden group cursor-pointer transition-transform hover:scale-105 hover:z-50">
                <img 
                  [src]="'https://picsum.photos/id/' + (1030 + i) + '/300/450'" 
                  alt="Movie"
                  class="w-full h-full object-cover" />
              </div>
            }
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class HomeComponent {
  readonly authService = inject(AuthService);
}
