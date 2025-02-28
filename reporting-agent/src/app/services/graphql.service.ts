import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

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
}
