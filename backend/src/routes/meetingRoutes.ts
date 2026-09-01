import { Router } from 'express';
import { meetingController } from '../controllers/meetingController';

const router = Router();

router.get('/rooms', (req, res) => meetingController.getRooms(req, res));
router.get('/meetings', (req, res) => meetingController.getMeetings(req, res));
router.post('/meetings', (req, res) => meetingController.createMeeting(req, res));
router.delete('/meetings/:id', (req, res) => meetingController.deleteMeeting(req, res));

export default router;
