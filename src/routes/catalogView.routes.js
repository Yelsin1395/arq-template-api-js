import { Router } from 'express';

export default function ({ catalogController }) {
  const router = Router();
  router.get('/view-temp', catalogController.catalogTempHtml);
  return router;
}