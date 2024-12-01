import { Router } from "express";
import { getAnalyticsByAlias, getAnalyticsByTopic, getOverAllAnalytics } from "../controller/analytics";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get('/overall', authenticate, getOverAllAnalytics);
router.get('/topic/:topicId', authenticate, getAnalyticsByTopic);
router.get('/:alias', authenticate, getAnalyticsByAlias);
export default router;
