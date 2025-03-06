type Condition = {
    selectedEntity: string;
    selectedFields: string;
    selectedOperator: string;
    value: string;
  };
  
  type RelatedEntity = {
    selectedEntity: string;
    selectedFields: string[];
  };
  
  type SortCondition = {
    selectedEntity: string;
    selectedFields: string;
    value: string;
  };
  
  type InputData = {
    mainEntity: string;
    mainEntityFields: string[];
    relatedEntityAndFields: RelatedEntity[];
    andConditions: Condition[];
    orConditions: Condition[];
    sortConditions: SortCondition[];
  };
  
  export const transformToPayload = (data: InputData) => {
    return {
      main_entity: data.mainEntity,
      fields_to_fetch_from_main_entity: data.mainEntityFields.join(", "),
      or_conditions: data.orConditions.map(
        (c) => `${c.selectedEntity}.${c.selectedFields} ${c.selectedOperator} '${c.value}'`
      ),
      and_conditions: data.andConditions.map(
        (c) => `${c.selectedEntity} ${c.selectedFields} ${c.selectedOperator} '${c.value}'`
      ),
      related_entity_fields: Object.fromEntries(
        data.relatedEntityAndFields.map((r) => [
          `${r.selectedEntity}`, `${r.selectedFields.join(", ")}`,
        ])
      ),
      sort_field_order: Object.fromEntries(
        data.sortConditions.map((s) => [
          `${s.selectedEntity} ${s.selectedFields}`, `${s.value}`,
        ])
      ),
    };
  };