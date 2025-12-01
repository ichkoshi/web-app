class WeRoutes extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Find all route elements and add them to the router
        this.querySelectorAll("we-route")
            .forEach(
                (route) => {
                    const path = route.getAttribute("path") || "/";
                    const component = route.getAttribute("component") || "we-home";
                    const attr = route.getAttribute("attr") || "";
                    const router = this.parentElement;
                    router.addRoute({ path, component, attr });
                }
            );
    }

    disconnectedCallback() {
      
    }

    attributeChangedCallback(name, oldVal, newVal) {
       
    }

    adoptedCallback() {
   
    }
}

window.customElements.define('we-routes', WeRoutes);