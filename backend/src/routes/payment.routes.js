import { Router } from 'express'
import { payment } from '../controller/payment.controllers.js'
import {verifyJWT} from '../middleware/auth.middleware.js'

const paymentRouter = Router()

paymentRouter.route('/paymentDone').post(verifyJWT, payment)



export { paymentRouter }