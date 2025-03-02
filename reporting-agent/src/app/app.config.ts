import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideApollo } from 'apollo-angular';
import { provideHttpClient } from '@angular/common/http';
import { InMemoryCache, HttpLink } from '@apollo/client/core';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()), provideNoopAnimations(),
    provideHttpClient(),
    provideApollo(() => {
      return {
        link: new HttpLink({ uri: 'https://localhost:7075/graphql/' }),
        cache: new InMemoryCache(),
      };
    })
]
};
