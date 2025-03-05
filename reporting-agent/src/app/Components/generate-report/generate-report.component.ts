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
import { AvailableOperator } from '../../models/AvailableOperator';

@Component({
  selector: 'app-generate-report',
  imports: [ReactiveFormsModule,MatCardModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatOption, MatSelect],
  templateUrl: './generate-report.component.html',
  styleUrl: './generate-report.component.scss',
  standalone: true
})

export class GenerateReportComponent implements OnInit {
  reportForm: FormGroup;

  entityFieldsMap: Record<string, AvailableField[]> = {};

  fieldOperatorMap: Record<string, AvailableOperator[]> = {};

  availableEntities: AvailableEntity[] = [] ;
  availableFieldsForMainEntity: AvailableField[] = [];  

  availableRelatedEntities: AvailableEntity[] = [];
  availableFieldsForRelatedEntity: Record<number, AvailableField[]> = {};
  
  availableFieldsForAndCondition: Record<number, AvailableField[]> = {};
  availableOperatorsForAndCondition: Record<number, AvailableOperator[]> = {};

  constructor(private fb: FormBuilder, private graphqlService: GraphqlService) {
    this.reportForm = this.fb.group({
      mainEntity: ['', Validators.required],
      mainEntityFields: ['', Validators.required],
      relatedEntityAndFields: this.fb.array([]),
      andConditions: this.fb.array([]),
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
        this.entityFieldsMap[entity] = data.availableFields;
        this.availableFieldsForMainEntity = this.entityFieldsMap[entity];      
      });

      this.graphqlService.getAvailableRelatedEntities(entity).subscribe(({ data }) => {
        this.availableRelatedEntities = data.availableRelatedEntities;
      });
    });
  }

  get mainEntity(): FormControl {
    return this.reportForm.get('mainEntity') as FormControl;
  }

  get relatedEntityAndFields(): FormArray {
    return this.reportForm.get('relatedEntityAndFields') as FormArray;
  }

  get andConditions(): FormArray {
    return this.reportForm.get('andConditions') as FormArray;
  }

  //main entity
  onMainEntityChange(event: MatSelectChange) {
    const value = event.value ?? '';
    this.reportForm.get('mainEntity')?.setValue(value);
  }

  onMainEntityFieldChange(event: MatSelectChange) {
    const value = event.value ?? '';
    this.reportForm.get('mainEntityFields')?.setValue(value);
  }

  //realted entity
  showRelatedEntityCard(): boolean{
    return this.relatedEntityAndFields.length !== 0;
  }

  getRelatedEntityGroup(index: number): FormGroup {
    return this.relatedEntityAndFields.at(index) as FormGroup;
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
    delete this.availableFieldsForRelatedEntity[index]; // Remove associated fields
  }

  onRelatedEntityChange(index: number) {
    const selectedEntity = this.relatedEntityAndFields.at(index).get('selectedEntity')?.value;

    if(this.entityFieldsMap[selectedEntity])
    {
      this.availableFieldsForRelatedEntity[index] = this.entityFieldsMap[selectedEntity];
      return;
    }

    this.graphqlService.getAvailableFieldsFor(selectedEntity).subscribe(({ data }) => {
          this.entityFieldsMap[selectedEntity] = data.availableFields;
          this.availableFieldsForRelatedEntity[index] = this.entityFieldsMap[selectedEntity];
        })

    this.relatedEntityAndFields.at(index).get('selectedFields')?.setValue([]); // Reset fields when entity changes
  }


  //And conditions
  availableEntitiesForFilterAndSort() : AvailableEntity[]{
    const mainEntity = this.availableEntities.filter(x => x.value === this.mainEntity.value)
    return [...this.availableRelatedEntities, ...mainEntity];
  }

  showAndFilterCard(): boolean{
    return this.andConditions.length !== 0;
  }

  getAndFilterEntityGroup(index: number): FormGroup {
    return this.andConditions.at(index) as FormGroup;
  }

  addAndCondition() {
    const entityGroup = this.fb.group({
      selectedEntity: new FormControl(),
      selectedFields: new FormControl(),
      selectedOperator: new FormControl(),
      value: new FormControl()
    });

    this.andConditions.push(entityGroup);
  }

  removeAndCondition(index: number) {
    this.andConditions.removeAt(index);
    delete this.availableFieldsForAndCondition[index]; // Remove associated fields
    delete this.availableOperatorsForAndCondition[index]; // Remove associated operator
  }

  onAndConditionEntityChange(index: number) {
    const selectedEntity = this.andConditions.at(index).get('selectedEntity')?.value;

    if(this.entityFieldsMap[selectedEntity])
    {
      this.availableFieldsForAndCondition[index] = this.entityFieldsMap[selectedEntity];
      return;
    }

    this.graphqlService.getAvailableFieldsFor(selectedEntity).subscribe(({ data }) => {
          this.entityFieldsMap[selectedEntity] = data.availableFields;
          this.availableFieldsForAndCondition[index] = this.entityFieldsMap[selectedEntity];
        })

    this.andConditions.at(index).get('selectedFields')?.setValue(''); // Reset fields when entity changes
    this.andConditions.at(index).get('selectedOperator')?.setValue(''); // Reset operator when entity changes
    this.andConditions.at(index).get('value')?.setValue(''); // Reset operator when entity changes
  }

  onAndConditionFieldChange(index: number) {
    const selectedEntity = this.andConditions.at(index).get('selectedEntity')?.value;
    const selectedField = this.andConditions.at(index).get('selectedFields')?.value;

    const fieldOperatorMapkey = selectedEntity + '-' + selectedField

    if(this.fieldOperatorMap[fieldOperatorMapkey])
    {
      this.availableOperatorsForAndCondition[index] = this.fieldOperatorMap[fieldOperatorMapkey];
      return;
    }

    this.graphqlService.getAvailableOperatorFor(selectedEntity, selectedField).subscribe(({ data }) => {
          this.fieldOperatorMap[fieldOperatorMapkey] = data.availableOperators;
          this.availableOperatorsForAndCondition[index] = this.fieldOperatorMap[fieldOperatorMapkey];
        })

    this.andConditions.at(index).get('selectedOperator')?.setValue(''); // Reset fields when entity changes
    this.andConditions.at(index).get('value')?.setValue(''); // Reset fields when entity changes
  }

  generateReport() {
    if (this.reportForm.valid) {
      console.log('Generating report with:', this.reportForm.value);
    } else {
      console.log('Form is invalid!');
    }
  }
}
