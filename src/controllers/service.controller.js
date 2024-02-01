import prisma from "../lib/db.js";
import { string, z } from 'zod'

const servicesSchema = z.object({
    serviceName: z.string(),
    type: z.string()
})

export const createService = async (req, res) => {
    try {
        const { categoryId } = req.params
        const { serviceName, type, prices } = req.body;

        const category = await prisma.category.findUnique({ where: { id: categoryId } })

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'category not found'
            })
        }

        const service = await prisma.service.create({
            data: {
                categoryId,
                serviceName,
                type,
                // prices
            }
        })

        return res.status(201).json({
            success: true,
            service
        })

    } catch (error) {
        console.log('🔴 CREATE SERVICE ERROR', error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getService = async (req, res) => {
    try {
        const { categoryId, serviceId } = req.params
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        })

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'category not found'
            })
        }

        const service = await prisma.service.findUnique({
            where: { id: serviceId },
            include: { prices: true }
        })

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'service not found'
            })
        }

        return res.status(200).json({
            success: true,
            service
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const listServices = async (req, res) => {
    try {
        const services = await prisma.service.findMany()
        return res.status(200).json({
            success: true,
            services,
            message: "here"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateOrDeleteService = async (req, res) => {
    try {
        const { categoryId, serviceId } = req.params
        const { type, prices, serviceName } = req.body
        const { action } = req.query

        const category = await prisma.category.findUnique({ where: { id: categoryId } })

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'category not found'
            })
        }

        const service = await prisma.service.findUnique({ where: { id: serviceId } })

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'service not found'
            })
        }

        if (action === 'remove') {
            const removeService = await prisma.service.delete({ where: { id: serviceId } })

            return res.status(200).json({
                success: true,
                message: 'Service removed successfully',
                serviceId: removeService.id
            })
        } else if (action === 'update') {
            const updateService = await prisma.service.update({
                where: { id: serviceId },
                data: {
                    type: type || service.type,
                    serviceName: serviceName || service.serviceName,
                    prices: prices || service.prices
                }
            })
            return res.status(200).json({
                success: true,
                service: updateService
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



export const removeServiceFromCategory = async (req, res) => {
    try {
        const { categoryId, serviceId } = req.params

        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: { services: true }
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'category not found'
            })
        }

        const service = await prisma.service.findUnique({ where: { id: serviceId } })

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'service not found'
            })
        }
        const updatedServices = category.services.filter(service => service.id !== serviceId);

        console.log(category)

        // console.log(filteredServices, 'FILTERED SERVICE')

        await prisma.service.update({
            where: { id: serviceId },
            data: { categoryId: null },
        });

        const removeService = await prisma.category.update({
            where: { id: categoryId },
            data: {
                services: {
                    set: updatedServices
                }
            }
        }
        )

        return res.status(200).json({
            success: true,
            message: 'Service removed from category',
            serviceId: removeService.id
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


