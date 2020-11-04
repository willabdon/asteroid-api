import { Request, Response } from 'express'
import Asteroid from '../models/Asteroid'
import User from '../models/User'
import * as neows from '../services/neows'
import admin from 'firebase-admin'


async function list(req: Request, res: Response) {
    const { data, status } = await neows.browse()
    return res.status(status).json(data)
}

async function search(req: Request, res: Response) {
    const { data, status } = await neows.search(req.query.id as string)
    return res.status(status).json(data)
}

async function nearest(req: Request, res: Response) {
    const params: neows.IDates = {
        start: req.query.start as string,
        end: req.query.end as string
    }
    const { data, status } = await neows.feed(params)
    return res.status(status).json(data)
}

async function favourite(req: Request, res: Response) {
    try {
        const decodedToken = await admin.auth().verifyIdToken(req.headers.authtoken as string)
        const user = await User.getById(decodedToken.uid)
        const asteroids = await Asteroid.getByIds(user.favourites)
        const data = asteroids.map( asteroid => {
            return asteroid.data
        })
        return res.json(data)
    }
    catch (error) {
        console.log(error)
    }
}

async function addFavourite(req: Request, res: Response) {
    try {
        const decodedToken = await admin.auth().verifyIdToken(req.headers.authtoken as string)
        const user = await User.getById(decodedToken.uid)
        const asteroid = await Asteroid.fetchOrAdd(req.body)
        user.addFavourite(asteroid.id)
        user.save()
        return res.json(asteroid.data)
    }
    catch (error) {
        console.log(error)
    }
}

async function removeFavourite(req: Request, res: Response) {
    try {
        const decodedToken = await admin.auth().verifyIdToken(req.headers.authtoken as string)
        const user = await User.getById(decodedToken.uid)
        const asteroid = await Asteroid.fetchOrAdd(req.body)
        user.removeFavourite(asteroid.id)
        user.save()
        return res.json(asteroid.data)
    }
    catch (error) {
        console.log(error)
    }
}

export {
    list,
    search,
    nearest,
    favourite,
    addFavourite,
    removeFavourite
}