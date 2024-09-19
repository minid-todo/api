import type { Context } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';
import { DateJS } from './date';

type IDataResponse = undefined | null | object | Array<[]>;

export class Responder {
  constructor(private c: Context) {}

  public success(data: IDataResponse, message = 'Success', code = 200) {
    const jsonStructure = {
      status: 'success',
      code,
      message,
      ts: DateJS.toUnix(),
      data,
    };

    this.c.status(code as StatusCode);
    return this.c.json(jsonStructure);
  }

  public created(data: IDataResponse, message: string) {
    return this.success(data, message, 201);
  }

  public badRequest(message: string) {
    return this.error(undefined, message, 400);
  }

  public unauthorized(message: string) {
    return this.error(undefined, message, 401);
  }

  public forbidden(message: string) {
    return this.error(undefined, message, 403);
  }

  public notFound(message: string) {
    return this.error(undefined, message, 404);
  }

  public conflict(message: string) {
    return this.error(undefined, message, 409);
  }

  public internalServerError(message: string) {
    return this.error(undefined, message, 500);
  }

  public error(data: IDataResponse, message: string, code = 500) {
    const jsonStructure = {
      status: 'error',
      code,
      message,
      ts: DateJS.toUnix(),
      data,
    };

    this.c.status(code as StatusCode);
    return this.c.json(jsonStructure);
  }
}
