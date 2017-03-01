import { Component, OpaqueToken, Injectable, Inject } from "@angular/core";
export interface ApplicationConfig {
  appName: string;
  apiEndpoint: string;
}

// Configuration values for our app
export const MY_CONFIG: ApplicationConfig = {
  appName: 'Spry',
  apiEndpoint: 'http://67.205.169.3/spry/webservice/'
};

// Create a config token to avoid naming conflicts
export const MY_CONFIG_TOKEN = new OpaqueToken('config');