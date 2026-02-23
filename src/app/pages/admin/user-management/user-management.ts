import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin';
import { UserDTO, Role } from '../../../models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss',
})
export class UserManagement implements OnInit {
  private adminService = inject(AdminService);

  users = signal<UserDTO[]>([]);
  roles = signal<Role[]>([]);

  step = signal(1);
  isLoading = signal(false);
  isPageLoading = signal(true);
  showModal = signal(false);
  isEditMode = signal(false);
  searchTerm = signal('');

  newUser = signal<UserDTO>(this.initUser());

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.users().filter(u =>
      u.firstName?.toLowerCase().includes(term) ||
      u.lastName?.toLowerCase().includes(term) ||
      u.roleName?.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.refreshData();
  }

  initUser(): UserDTO {
    return { userName: '', email: '', firstName: '', lastName: '', roleName: '', authorities: [] };
  }

  refreshData() {
    this.isPageLoading.set(true);
    this.adminService.getUsers().subscribe({
      next: (res) => {
        this.users.set(res);
        this.isPageLoading.set(false);
      },
      error: () => this.isPageLoading.set(false)
    });
    this.adminService.getRoles().subscribe(res => this.roles.set(res));
  }

  // Fonction utilitaire pour extraire l'ID sans 'any'
  private getUserId(user: UserDTO): number | undefined {
    return user.Id ?? user.id;
  }

  openModal(user?: UserDTO) {
    if (user) {
      this.isEditMode.set(true);
      this.newUser.set({ ...user });
    } else {
      this.isEditMode.set(false);
      this.newUser.set(this.initUser());
    }
    this.step.set(1);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveUser() {
    const userId = this.getUserId(this.newUser());

    if (this.isEditMode() && userId === undefined) {
      alert("Erreur : Impossible de modifier l'utilisateur car son ID est manquant.");
      return;
    }

    this.isLoading.set(true);
    const obs = this.isEditMode()
      ? this.adminService.updateUser(userId!, this.newUser())
      : this.adminService.createUser(this.newUser());

    obs.subscribe({
      next: () => {
        this.refreshData();
        this.closeModal();
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  confirmDelete(user: UserDTO) {
    const idToUse = this.getUserId(user);

    if (!idToUse) {
      console.error('ID manquant pour l\'utilisateur:', user);
      alert("Erreur : L'identifiant de cet utilisateur est manquant.");
      return;
    }

    if (confirm(`Voulez-vous vraiment supprimer ${user.firstName} ?`)) {
      this.adminService.deleteUser(idToUse).subscribe({
        next: () => {
          alert('Utilisateur supprimé avec succès !');
          this.refreshData();
        },
        error: (err) => {
          console.error('Erreur API suppression :', err);
          alert('Échec de la suppression en base de données.');
        }
      });
    }
  }

  updateSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }
}
