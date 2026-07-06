import prisma from '../database/prisma.js';

// Services Controllers
export const getAllServices = async (req, res, next) => {
  try {
    const list = await prisma.service.findMany({
      include: { category: true, package: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

export const createService = async (req, res, next) => {
  try {
    const { name, description, price, duration, categoryId, packageId } = req.body;
    const item = await prisma.service.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        categoryId,
        packageId: packageId || null
      },
      include: { category: true }
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, duration, categoryId, packageId } = req.body;
    const item = await prisma.service.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        categoryId,
        packageId: packageId || null
      },
      include: { category: true }
    });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.service.delete({ where: { id } });
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Categories Controllers
export const getAllCategories = async (req, res, next) => {
  try {
    const list = await prisma.serviceCategory.findMany({
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const item = await prisma.serviceCategory.create({
      data: { name, description }
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// Packages Controllers
export const getAllPackages = async (req, res, next) => {
  try {
    const list = await prisma.package.findMany({
      include: { services: true },
      orderBy: { price: 'asc' }
    });
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

export const createPackage = async (req, res, next) => {
  try {
    const { name, price, description, serviceIds } = req.body;
    const item = await prisma.package.create({
      data: {
        name,
        price: parseFloat(price),
        description
      }
    });

    if (serviceIds && serviceIds.length > 0) {
      await Promise.all(
        serviceIds.map(sid =>
          prisma.service.update({
            where: { id: sid },
            data: { packageId: item.id }
          })
        )
      );
    }

    const updated = await prisma.package.findUnique({
      where: { id: item.id },
      include: { services: true }
    });

    res.status(201).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export default { getAllServices, createService, updateService, deleteService, getAllCategories, createCategory, getAllPackages, createPackage };
