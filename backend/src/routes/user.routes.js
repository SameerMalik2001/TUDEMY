import { Router } from 'express'
import { registerUser, updateProfessionalInfo, loginUser, logoutUser,updateInterest,checkCurrentPassword,deleteAccount, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, getCookies, tokenValidation } from '../controller/user.controllers.js'
import {verifyJWT} from '../middleware/auth.middleware.js'

const userRouter = Router()

userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(loginUser)
userRouter.route('/logout').post(verifyJWT, logoutUser)
userRouter.route('/refreshAccessToken').post(refreshAccessToken)
userRouter.route('/updateInterest').put(verifyJWT, updateInterest)
userRouter.route('/changePassword').put(verifyJWT, changeCurrentPassword)
userRouter.route('/checkPassword').post(verifyJWT, checkCurrentPassword)
userRouter.route('/getCurrentUser').put(verifyJWT, getCurrentUser)
userRouter.route('/deleteAccount').delete(verifyJWT, deleteAccount)
userRouter.route('/updateAccountDetails').put(verifyJWT, updateAccountDetails)
userRouter.route('/getCookies').get(getCookies)
userRouter.route('/tokenValidation').get(verifyJWT, tokenValidation)
userRouter.route('/updateProfessionalInfo').put(verifyJWT, updateProfessionalInfo)



export { userRouter }


// userRouter.route('/register').post(
//   // middleware injected
//   upload.fields([
//     {
//       name: "avatar",
//       maxCount: 1
//     }
//   ]),
//   registerUser
// )