import express from 'express'
import {getPoll} from '../controllers/voteController.ts'

const router = express.Router()

router.get('', getPoll)


export default router
