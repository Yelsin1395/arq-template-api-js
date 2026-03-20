import { Router } from 'express';

export default function ({ geocodingController }) {
  const router = Router();

  router.post('/geolocation', geocodingController.processGeolocation);

  return router;
}
