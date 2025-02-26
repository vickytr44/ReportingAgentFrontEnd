import { Component } from '@angular/core';
import { GenerateReportComponent } from './Components/generate-report/generate-report.component';

@Component({
  selector: 'app-root',
  imports: [GenerateReportComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'reporting-agent';
}
