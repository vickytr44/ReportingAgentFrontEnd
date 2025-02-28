import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvailableEntity } from '../../models/AvailableEntity';
import { GraphqlService } from '../../services/graphql.service';

@Component({
  selector: 'app-generate-report',
  imports: [ReactiveFormsModule,MatCardModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatOption, MatSelect],
  templateUrl: './generate-report.component.html',
  styleUrl: './generate-report.component.scss',
  standalone: true
})

export class GenerateReportComponent implements OnInit {
  reportForm: FormGroup;

  availableEntities: AvailableEntity[] = [] ;

  availableRelatedEntities: AvailableEntity[] = [
    {id: 'Account', value: 'accounts'},
    {id: 'Customer', value: 'customers'},
  ];

  constructor(private fb: FormBuilder, private graphqlService: GraphqlService) {
    this.reportForm = this.fb.group({
      mainEntity: ['', Validators.required],
      fields: ['', Validators.required],
      relatedEntityAndFields: this.fb.control({}) as FormControl<Record<string, string>>,
    });
  }

  ngOnInit(): void {
    this.graphqlService.getAvailableEntities().subscribe(({ data }) => {
      console.log('Available entities:', data.availableEntities);
      this.availableEntities = data.availableEntities;
    });
  }

  get relatedEntityAndFields() {
    return this.reportForm.get('relatedEntityAndFields')?.value || {};
  }

  relatedEntitiesKeys(): string[] {
    return Object.keys(this.relatedEntityAndFields);
  }

  addRelatedEntity() {
    const updatedEntities = { ...this.relatedEntityAndFields, '': '' };
    this.reportForm.get('relatedEntityAndFields')?.setValue(updatedEntities);
  }

  onRelatedEntityChange(event: MatSelectChange, key: string) {
    const value = event.value ?? '';
    this.updateKey(key, value);
  }

  onEntityChange(event: MatSelectChange) {
    const value = event.value ?? '';
    this.reportForm.get('mainEntity')?.setValue(value);
  }
  
  onValueInput(event: Event, key: string) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.updateValue(key, inputValue);
  }

  updateKey(oldKey: string, newKey: string) {
    if (!newKey || oldKey === newKey) return;
  
    const updatedEntities = { ...this.relatedEntityAndFields };
    updatedEntities[newKey] = updatedEntities[oldKey]; // Copy value to new key
    delete updatedEntities[oldKey]; // Remove old key
  
    this.reportForm.patchValue({ relatedEntityAndFields: updatedEntities });
  }

  updateValue(key: string, value: string) {
    const updatedEntities = { ...this.relatedEntityAndFields, [key]: value };
    this.reportForm.get('relatedEntityAndFields')?.setValue(updatedEntities);
  }

  removeRelatedEntity(key: string) {
    const updatedEntities = { ...this.relatedEntityAndFields };
    delete updatedEntities[key];
    this.reportForm.get('relatedEntityAndFields')?.setValue(updatedEntities);
  }

  generateReport() {
    if (this.reportForm.valid) {
      console.log('Generating report with:', this.reportForm.value);
    } else {
      console.log('Form is invalid!');
    }
  }
}
