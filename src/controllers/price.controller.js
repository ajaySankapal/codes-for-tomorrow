import { z } from "zod";
import prisma from "../lib/db.js";

const servicePriceSchema = z.object({
    duration: z.number(),
    price: z.number(),
    type: z.string()
})

export const createServicePrice = async (req, res) => {
    try {
        const { serviceId } = req.params
        const { duration, price, type } = req.body
        const service = await prisma.service.findUnique({ where: { id: serviceId } })

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'service not found'
            })
        }
        const validData = servicePriceSchema.safeParse(req.body)
        if (!validData) {
            return res.status(400).json({
                success: false,
                message: 'Data is invalid or missing'
            })

        }

        const servicePrice = await prisma.servicePrice.create({
            data: {
                serviceId,
                duration,
                price,
                type
            }
        })

        return res.status(201).json({
            success: true,
            servicePrice
        })
    } catch (error) {
        console.log("🔴 ERROR IN SERVICE PRICE")
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}