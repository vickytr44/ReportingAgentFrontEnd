import { Injectable } from '@angular/core';
import { Apollo, gql} from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client/core';
import { map, Observable } from 'rxjs';
import { AvailableField } from '../models/AvailableField';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {
  constructor(private apollo: Apollo) {}

  getAvailableEntities(): Observable<any> {
    const GET_Available_Entities = gql`
      query entity {
        availableEntities {
          id
          value
        }
      }
    `;

    return this.apollo.watchQuery<any>({
      query: GET_Available_Entities
    }).valueChanges;
  }

  getAvailableRelatedEntities(entity: string): Observable<any> {
    const GET_Available_Related_Entities = gql`
      query relatedEntities {
        availableRelatedEntities(entity: "${entity}") {
          id
          value
        }
      }
    `;

    return this.apollo.watchQuery<any>({
      query: GET_Available_Related_Entities
    }).valueChanges;
  }

  getAvailableFieldsFor(entity : string): Observable<any> {
    const GET_Available_Entity_Fields = gql`
      query entityFields {
        availableFields(entity: "${entity}") {
          name
          type
        }
      }
    `;

    return this.apollo.watchQuery<any>({
      query: GET_Available_Entity_Fields
    }).valueChanges;
  }
}
