import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

// Interface banayein taake guard ko pata chale ke component mein kya check karna hai
export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LogoutConfirmGuard implements CanDeactivate<CanComponentDeactivate> {
  
  canDeactivate(component: CanComponentDeactivate): boolean {
    // Agar component mein canDeactivate function hai to usay call karein
    if (component.canDeactivate) {
      return component.canDeactivate();
    }
    return true;
  }
}