import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvailableEntity } from '../../models/AvailableEntity';
import { GraphqlService } from '../../services/graphql.service';
import { AvailableField } from '../../models/AvailableField';
import { filter } from 'rxjs';

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
  availableFieldsForMainEntity: AvailableField[] = [];  

  entityFieldsMap: Record<string, AvailableField[]> = {};

  availableFields: Record<number, AvailableField[]> = {};

  availableRelatedEntities: AvailableEntity[] = [];

  constructor(private fb: FormBuilder, private graphqlService: GraphqlService) {
    this.reportForm = this.fb.group({
      mainEntity: ['', Validators.required],
      mainEntityFields: ['', Validators.required],
      relatedEntityAndFields: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.graphqlService.getAvailableEntities().subscribe(({ data }) => {
      this.availableEntities = data.availableEntities;
    });

    this.reportForm.get('mainEntity')?.valueChanges
    .pipe(filter(entity => !!entity))
    .subscribe(entity => {
      this.graphqlService.getAvailableFieldsFor(entity).subscribe(({ data }) => {
        this.availableFieldsForMainEntity = data.availableFields;      
      });

      this.graphqlService.getAvailableRelatedEntities(entity).subscribe(({ data }) => {
        this.availableRelatedEntities = data.availableRelatedEntities;
      });
    });
  }

  get relatedEntityAndFields(): FormArray {
    return this.reportForm.get('relatedEntityAndFields') as FormArray;
  }

  showRelatedEntityCard(): boolean{
    return this.relatedEntityAndFields.length !== 0;
  }

  getEntityGroup(index: number): FormGroup {
    return this.relatedEntityAndFields.at(index) as FormGroup;
  }

  onMainEntityChange(event: MatSelectChange) {
    const value = event.value ?? '';
    this.reportForm.get('mainEntity')?.setValue(value);
  }

  onMainEntityFieldChange(event: MatSelectChange) {
    const value = event.value ?? '';
    this.reportForm.get('mainEntityFields')?.setValue(value);
  }
  
  addRelatedEntity() {
    const entityGroup = this.fb.group({
      selectedEntity: new FormControl(),
      selectedFields: new FormControl([])
    });

    this.relatedEntityAndFields.push(entityGroup);
  }

  removeRelatedEntity(index: number) {
    this.relatedEntityAndFields.removeAt(index);
    delete this.availableFields[index]; // Remove associated fields
  }

  onEntityChange(index: number) {
    const selectedEntity = this.relatedEntityAndFields.at(index).get('selectedEntity')?.value;

    if(this.entityFieldsMap[selectedEntity])
    {
      this.availableFields[index] = this.entityFieldsMap[selectedEntity];
      return;
    }

    this.graphqlService.getAvailableFieldsFor(selectedEntity).subscribe(({ data }) => {
          this.entityFieldsMap[selectedEntity] = data.availableFields;
          this.availableFields[index] = this.entityFieldsMap[selectedEntity];
          console.log("reached here", selectedEntity)
        })

    this.relatedEntityAndFields.at(index).get('selectedFields')?.setValue([]); // Reset fields when entity changes
  }

  generateReport() {
    if (this.reportForm.valid) {
      console.log('Generating report with:', this.reportForm.value);
    } else {
      console.log('Form is invalid!');
    }
  }
}
