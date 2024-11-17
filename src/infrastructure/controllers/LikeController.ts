import { Request, Response } from "express";
import { LikeService } from "../../application/services/likeService";

export class LikeController {
  constructor(private likeService: LikeService) {}

  async addLike(req: Request, res: Response) {
    try {
      const { userId, postId } = req.body;
      const like = await this.likeService.addLike(userId, postId);
      res.status(201).json(like);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Unknown error' });
      }
    }
  }

  async removeLike(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.likeService.removeLike(Number(id));
      res.status(200).json({ message: 'Like removed successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Unknown error' });
      }
    }
  }

  async getLikesByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const likes = await this.likeService.getLikesByUserId(Number(userId));
      res.status(200).json(likes);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Unknown error' });
      }
    }
  }

  async getLikesByPostId(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const likes = await this.likeService.getLikesByPostId(Number(postId));
      res.status(200).json(likes);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Unknown error' });
      }
    }
  }

  async countLikesByPostId(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const count = await this.likeService.countLikesByPostId(Number(postId));
      res.status(200).json({ count });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Unknown error' });
      }
    }
  }

  async countLikesByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const count = await this.likeService.countLikesByUserId(Number(userId));
      res.status(200).json({ count });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Unknown error' });
      }
    }
  }
}

export default LikeController;