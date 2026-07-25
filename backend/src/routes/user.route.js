import express from 'express';
import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  test,
  updateUser,
  requestAuthorAccess,
  getAuthorRequests,
  approveAuthorRequest,
  rejectAuthorRequest,
  requestAdminAccess,
  getAdminRequests,
  approveAdminRequest,
  rejectAdminRequest,
  setAdminStatus,
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers);
router.put('/request-author/:userId', verifyToken, requestAuthorAccess);
router.get('/author-requests', verifyToken, getAuthorRequests);
router.put('/approve-author/:userId', verifyToken, approveAuthorRequest);
router.put('/reject-author/:userId', verifyToken, rejectAuthorRequest);
router.put('/request-admin/:userId', verifyToken, requestAdminAccess);
router.get('/admin-requests', verifyToken, getAdminRequests);
router.put('/approve-admin/:userId', verifyToken, approveAdminRequest);
router.put('/reject-admin/:userId', verifyToken, rejectAdminRequest);
router.put('/set-admin/:userId', verifyToken, setAdminStatus);
router.get('/:userId', getUser);

export default router;
