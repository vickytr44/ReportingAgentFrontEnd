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
    xField: string;
    yField: string;
    mainEntityFields: string[];
    relatedEntityAndFields: RelatedEntity[];
    andConditions: Condition[];
    orConditions: Condition[];
    sortConditions: SortCondition[];
  };
  
  export const transformToPayload = (data: InputData) => {
    const payload: any = {
      main_entity: data.mainEntity,
      fields_to_fetch_from_main_entity: data.mainEntityFields?.join(", "),
    };

    if (data.xField != null && data.yField != null) {
      payload.fields_to_fetch_from_main_entity = data.xField.charAt(0).toLowerCase() + data.xField.slice(1) + ", " + data.yField.charAt(0).toLowerCase() + data.yField.slice(1);
      payload.x_label = data.xField.charAt(0).toLowerCase() + data.xField.slice(1);
      payload.y_label = data.yField.charAt(0).toLowerCase() + data.yField.slice(1);
      payload.title = data.mainEntity;
    }
  
    if (data.orConditions?.length) {
      payload.or_conditions = data.orConditions.map(
        (c) => `${c.selectedEntity}.${c.selectedFields} ${c.selectedOperator} '${c.value}'`
      );
    }
  
    if (data.andConditions?.length) {
      payload.and_conditions = data.andConditions.map(
        (c) => `${c.selectedEntity}.${c.selectedFields} ${c.selectedOperator} '${c.value}'`
      );
    }
  
    if (data.relatedEntityAndFields?.length) {
      payload.related_entity_fields = Object.fromEntries(
        data.relatedEntityAndFields.map((r) => [
          r.selectedEntity,
          r.selectedFields.join(", "),
        ])
      );
    }
  
    if (data.sortConditions?.length) {
      payload.sort_field_order = Object.fromEntries(
        data.sortConditions.map((s) => [
          `${s.selectedEntity} ${s.selectedFields}`,
          s.value,
        ])
      );
    }
  
    return payload;
  };