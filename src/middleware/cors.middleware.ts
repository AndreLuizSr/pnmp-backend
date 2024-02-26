import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as cors from 'cors';

export class CorsMiddleware implements NestMiddleware {
  private corsMiddleware = cors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.corsMiddleware(req, res, next);
  }
}
