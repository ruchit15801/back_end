import { Request, Router, Response } from 'express'
import { userStatus } from '../common'
import gamesRoutes from './user/games'
import adminRoutes from './admin'
// import { userRoutes } from './user'

const router = Router()
const accessControl = (req: Request, res: Response, next: any) => {
    req.headers.userType = userStatus[req.originalUrl.split('/')[1]]
    next()
}

router.use('/admin', adminRoutes)
router.use('/games', gamesRoutes)

export { router }   