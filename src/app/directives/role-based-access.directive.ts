import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../components/auth/auth.service';

@Directive({
  selector: '[appRoleBasedAccess]'
})
export class RoleBasedAccessDirective {
  private currentUserRole: string;

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {
    this.currentUserRole = this.authService.getCurrentUserRole();
  }

  @Input() set appRoleBasedAccess(allowedRoles: string[]) {
    if (allowedRoles.includes(this.currentUserRole)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}