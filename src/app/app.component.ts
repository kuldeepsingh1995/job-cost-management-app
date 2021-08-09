import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
declare var $ : any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Rate Galaxy';
  
  constructor(private router:Router, private activatedRoute: ActivatedRoute) { 
      
    this.router.events.subscribe((evt) => {
      $('#loading').show();
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
  });
    
  }
  
}
