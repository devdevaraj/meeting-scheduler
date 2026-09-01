import { Request, Response } from 'express';
import { schedulerService } from '../services/schedulerService';
import { z } from 'zod';

const createMeetingSchema = z.object({
  title: z.string().trim().min(1, 'Meeting title is required'),
  startTime: z.string().datetime({ message: 'Start time must be a valid ISO date-time string' }),
  endTime: z.string().datetime({ message: 'End time must be a valid ISO date-time string' })
});

export class MeetingController {
  public getRooms(_req: Request, res: Response): void {
    const rooms = schedulerService.getRooms();
    res.status(200).json({
      success: true,
      message: 'Retrieved meeting rooms successfully.',
      data: rooms
    });
  }

  public async getMeetings(_req: Request, res: Response): Promise<void> {
    try {
      const meetings = await schedulerService.getAllMeetings();
      res.status(200).json({
        success: true,
        message: 'Retrieved scheduled meetings successfully.',
        data: meetings
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve meetings',
        error: error.message
      });
    }
  }

  public async createMeeting(req: Request, res: Response): Promise<void> {
    const parseResult = createMeetingSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map((e) => e.message).join(', ');
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errorMsg
      });
      return;
    }

    const { title, startTime, endTime } = parseResult.data;

    try {
      const scheduleResult = await schedulerService.scheduleMeeting({
        title,
        startTime,
        endTime
      });

      if (!scheduleResult.success) {
        res.status(409).json({
          success: false,
          message: scheduleResult.message
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: scheduleResult.message,
        data: scheduleResult.meeting
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to schedule meeting',
        error: error.message
      });
    }
  }

  public async deleteMeeting(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Meeting ID parameter is required.'
      });
      return;
    }

    try {
      const result = await schedulerService.cancelMeeting(id);

      if (!result.success) {
        res.status(404).json({
          success: false,
          message: result.message
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to cancel meeting',
        error: error.message
      });
    }
  }
}

export const meetingController = new MeetingController();
