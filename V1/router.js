export class Router{
  constructor({routes, onChange}){
    this.routes = new Set(routes);
    this.onChange = onChange;
    window.addEventListener("hashchange", ()=> this.handle());
  }
  go(route){
    if(!this.routes.has(route)) route = "home";
    if(location.hash.slice(1) !== route){
      location.hash = route;
    }else{
      this.handle();
    }
  }
  handle(){
    let r = location.hash.replace(/^#/, "");
    if(!this.routes.has(r)) r = "home";
    this.onChange?.(r);
  }
}