import { Response, Request, NextFunction, Router, RequestHandler } from 'express';

// HTTP methods
export enum Methods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
};

// Route interface for each route in `routes` field of `Controller` class.
interface IRoute {
    path: string;
    method: Methods;
    handler: (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
    localMiddleware: ((req: Request, res: Response, next: NextFunction) => void)[]
};

export default abstract class Controller {
    // Router instance for mapping routes
    public router: Router = Router();

    public abstract path: string;
    // Array of objects which implement IRoutes interface
    protected abstract readonly routes: Array<IRoute>;

    public setRoutes = (): Router => {
    // Set HTTP method, middleware, and handler for each route
    // Returns Router object, which we will use in Server class
        for (const route of this.routes) {
            for (const mw of route.localMiddleware) {
                this.router.use(route.path, mw)
            };
            switch (route.method) {
                case 'GET':
                    this.router.get(route.path, route.handler);
                    break;
                case 'POST':
                    this.router.post(route.path, route.handler);
                    break;
                case 'PUT':
                    this.router.put(route.path, route.handler);
                    break;
                case 'DELETE':
                    this.router.delete(route.path, route.handler);
                    break;
                default:
                    throw Error("Unsupported HTTP method");
            };
        };   
        return this.router;
    };
};