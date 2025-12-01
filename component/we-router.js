import './we-route.js';
import './we-routes.js';

class WeRouter extends HTMLElement {
    constructor() {
        super();
        this.routes = new Map();
    }

    addRoute(route) { 
        this.routes.set(route.path, { comp: route.component, attr: route.attr });
    }

    navigate(path) {
       
        if (this.routes.has(path)) {
            history.pushState({}, '', path);
            this.updateUI(path);
        }
    }

    updateUI(path) {
        console.log("Updating UI for path:", path);
        
        if (!this.routes.has(path)) {
            console.log("No route found for path:", path);
          
            path = "/";
        }
    
        const comp = this.routes.get(path);
        console.log("Component to load:", comp);
        
        const mainContent = document.querySelector("#main-content");
        if (!mainContent) {
            console.error("Main content element not found!");
            return;
        }
    
      
        mainContent.innerHTML = '';
        
        try {
           
            const componentElement = document.createElement(comp.comp);
            mainContent.appendChild(componentElement);
            console.log("Component added to DOM:", comp.comp);
        } catch (err) {
            console.error("Error creating component:", err);
        }
    }

    connectedCallback() {
    
        window.addEventListener('popstate', () => {
            console.log("Popstate event, location:", document.location);
            this.updateUI(document.location.pathname);
        });
        
       
        console.log("Router connected, initializing with path:", window.location.pathname);
    
        setTimeout(() => {
            this.updateUI(window.location.pathname);
        }, 0);
    }
}

window.customElements.define('we-router', WeRouter);