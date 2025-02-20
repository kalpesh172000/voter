import express from 'express'
import { getPoll, votePoll } from '../controllers/voteController.ts'

const router = express.Router()

router.get('', getPoll)
router.post('/:candidate', votePoll)

export default router
