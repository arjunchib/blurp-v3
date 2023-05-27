import { Controller, Schema } from ".";

export interface Route {
  schema: Schema;
  controller: new () => Controller<any>;
}

export class Router {
  constructor(private routes: Route[]) {}

  getSchema() {
    return this.routes.map((route) => route.schema);
  }

  getControllerClass(name: string) {
    return this.routes.find((route) => route.schema.name === name)?.controller;
  }

  createController(name: string) {
    const controllerClass = this.getControllerClass(name);
    if (!controllerClass) return undefined;
    return new controllerClass();
  }
}
