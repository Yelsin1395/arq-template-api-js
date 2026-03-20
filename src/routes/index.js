import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import 'express-async-error';
import { notFoundMiddleware } from '../middlewares/notFound.middleware';
import { errorMiddleware } from '../middlewares/exception.middleware';

export default function ({ homeRoutes, catalogViewRoutes, catalogRoutes, geocodingRoutes }) {
  const router = express.Router();
  const apiRoutes = express.Router();
  const htmlViewRoutes = express.Router(); // ✅ Router separado SIN helmet

  // Middlewares base (sin helmet)
  const commonMiddlewares = [
    express.json(),
    express.urlencoded({ extended: false }),
    cors(),
    compression(),
    morgan('dev'),
  ];

  // Helmet SOLO para el API
  const helmetConfig = helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'cdn.jsdelivr.net'],
        'style-src': ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net', 'fonts.googleapis.com'],
        'font-src': ["'self'", 'fonts.gstatic.com'],
        'img-src': ["'self'", 'data:', 'res.cloudinary.com'],
        'connect-src': ["'self'"],
      },
    },
  });

  // ✅ htmlViewRoutes: SIN helmet, solo middlewares básicos
  htmlViewRoutes.use(commonMiddlewares);

  // ✅ apiRoutes: CON helmet
  apiRoutes.use(commonMiddlewares);
  apiRoutes.use(helmetConfig);

  // Rutas HTML puras (sin CSP)
  htmlViewRoutes.use('/catalog', catalogViewRoutes); // solo para view-temp

  // Rutas API protegidas
  apiRoutes.use('/', homeRoutes);
  apiRoutes.use('/catalog', catalogRoutes);
  apiRoutes.use('/geocoding', geocodingRoutes);

  // Montar ambos en el router principal
  router.use('', htmlViewRoutes); // primero el HTML view
  router.use('', apiRoutes);      // luego el API con helmet

  // Error handling
  router.use(notFoundMiddleware);
  router.use(errorMiddleware);

  return router;
}