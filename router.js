export class Router {
    constructor(request, env) {
        this.request = request;
        this.env = env;
        this.routes = {
            GET: {},
            POST: {}
        };
    }
    
    get(path, handler) {
        this.routes.GET[path] = handler;
    }
    
    post(path, handler) {
        this.routes.POST[path] = handler;
    }
    
    async handle() {
        const url = new URL(this.request.url);
        const method = this.request.method;
        const pathname = url.pathname;
        
        // Check exact match
        if (this.routes[method] && this.routes[method][pathname]) {
            return this.routes[method][pathname](this.request, this.env);
        }
        
        // Check pattern match
        for (const [route, handler] of Object.entries(this.routes[method] || {})) {
            const regex = new RegExp('^' + route.replace(/:([^/]+)/g, '([^/]+)') + '$');
            const match = pathname.match(regex);
            if (match) {
                const params = {};
                const keys = route.match(/:([^/]+)/g);
                if (keys) {
                    keys.forEach((key, i) => {
                        params[key.substring(1)] = match[i + 1];
                    });
                }
                return handler(this.request, this.env, params);
            }
        }
        
        return new Response('Not Found', { status: 404 });
    }
}
