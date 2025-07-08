import { Request, Router, Response } from 'express'
import { userStatus } from '../common'
import gamesRoutes from './user/games'
import contactRoutes from './user/contact'
import adsRoutes from './user/ads'
import adminRoutes from './admin'
// import { userRoutes } from './user'

const router = Router()
const accessControl = (req: Request, res: Response, next: any) => {
    req.headers.userType = userStatus[req.originalUrl.split('/')[1]]
    next()
}

router.use('/admin', adminRoutes)
router.use('/games', gamesRoutes)
router.use('/contact', contactRoutes)
router.use('/ads', adsRoutes)

export { router }   