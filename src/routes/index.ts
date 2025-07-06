import { Request, Router, Response } from 'express'
import { userStatus } from '../common'
import gamesRoutes from './user/games'
// import { userRoutes } from './user'
// import { adminRoutes } from './admin'

const router = Router()
const accessControl = (req: Request, res: Response, next: any) => {
    req.headers.userType = userStatus[req.originalUrl.split('/')[1]]
    next()
}

// router.use('/admin', accessControl, adminRoutes)
router.use('/games', gamesRoutes)

export { router }   