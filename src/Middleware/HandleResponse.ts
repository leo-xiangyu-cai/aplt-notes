import { RouterContext } from "koa-router";
export const handleResponse = (ctx: RouterContext, status: number, message: string, data?: any): void => {
    ctx.status = status;
    ctx.body = {
        message,
        data
    };
};