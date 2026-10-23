import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import BrandPanelComponent from './brand-panel/brand-panel.component';
import { LiquidBackgroundComponent } from './liquid-background/liquid-background.component';

@Component({
  selector: 'app-sign-up-in',
  standalone: true,
  templateUrl: './sign-up-in.component.html',
  styleUrls: ['./sign-up-in.component.scss'],
  imports: [BrandPanelComponent, RouterOutlet, LiquidBackgroundComponent],
})
export default class SignUpInComponent {

  readonly backgroundUrl = '/background.jpg';
}
