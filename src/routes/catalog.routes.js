import { Router } from 'express';

export default function ({ catalogController }) {
  const router = Router();

  router.post('/generate-temp', catalogController.generate);
  router.get('/view-temp', catalogController.catalogTempHtml);

  return router;
}
