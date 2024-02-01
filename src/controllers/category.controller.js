import prisma from "../lib/db.js";
import { z } from 'zod';

const categorySchema = z.object({
    name: z.string()
})

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const validData = categorySchema.safeParse(req.body)
        if (!validData) {
            return res.status(400).json({
                success: false,
                message: 'Data is invalid or missing'
            })
        }
        const category = await prisma.category.create({
            data: {
                name
            }
        })

        return res.status(201).json({
            success: true,
            category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const { categoryId } = req.params
        const validData = categorySchema.safeParse(req.body)
        if (!validData) {
            return res.status(400).json({
                success: false,
                message: 'Data is invalid or missing'
            })
        }

        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: { services: true }
        })

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'category not found'
            })
        }

        const updateCategory = await prisma.category.update({
            where: { id: categoryId },
            data: {
                name
            }
        })

        return res.status(201).json({
            success: true,
            category: updateCategory
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}




export const listCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: { services: true }
        })
        return res.status(200).json({
            success: true,
            categories
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const removeCategory = async (req, res) => {
    try {
        const { categoryId } = req.params

        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: { services: true }
        })

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'category not found'
            })
        }

        if (category && category?.services?.length > 0) {
            return res.status(404).json({
                success: false,
                message: 'This category has services in it.Please remove them before deleting the category.'
            })
        }

        const removedCategory = await prisma.category.delete({ where: { id: categoryId } })

        return res.status(200).json({
            success: true,
            message: 'Category removed',
            categoryId: removedCategory.id
        })
    } catch (error) {
        console.log('🔴 REMOVE CATEGORY ERROR', error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

