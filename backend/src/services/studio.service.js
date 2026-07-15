import TemplateRepository from '../repositories/template.repository.js';
import DesignRepository from '../repositories/design.repository.js';
import AssetRepository from '../repositories/asset.repository.js';
import { STUDIO_CATEGORIES, STUDIO_TEMPLATES } from '../data/studioSeedData.js';

export class StudioService {
  // ── Template operations ─────────────────────────────────────────────────────

  static async getTemplates(filters) {
    return TemplateRepository.findAll(filters);
  }

  static async getTemplate(id) {
    const template = await TemplateRepository.findById(id);
    if (!template) {
      const err = new Error('Template not found');
      err.statusCode = 404;
      throw err;
    }
    await TemplateRepository.incrementUsage(id);
    return template;
  }

  static async getCategories() {
    return TemplateRepository.findCategories();
  }

  // ── Design operations ───────────────────────────────────────────────────────

  static async getUserDesigns(userId) {
    return DesignRepository.findByUserId(userId);
  }

  static async createDesign(userId, body) {
    const { templateId, title, dimensions, background, layers, thumbnail, status } = body;
    return DesignRepository.create({ userId, templateId, title, dimensions, background, layers, thumbnail, status });
  }

  static async updateDesign(id, userId, body) {
    const owned = await DesignRepository.verifyOwnership(id, userId);
    if (!owned) {
      const err = new Error('Design not found or access denied');
      err.statusCode = 404;
      throw err;
    }
    return DesignRepository.update(id, body);
  }

  static async deleteDesign(id, userId) {
    const owned = await DesignRepository.verifyOwnership(id, userId);
    if (!owned) {
      const err = new Error('Design not found or access denied');
      err.statusCode = 404;
      throw err;
    }
    return DesignRepository.delete(id);
  }

  static async duplicateDesign(id, userId) {
    const owned = await DesignRepository.verifyOwnership(id, userId);
    if (!owned) {
      const err = new Error('Design not found or access denied');
      err.statusCode = 404;
      throw err;
    }
    return DesignRepository.duplicate(id, userId);
  }

  static async getDesign(id, userId) {
    const design = await DesignRepository.findById(id);
    if (!design || design.userId !== userId) {
      const err = new Error('Design not found');
      err.statusCode = 404;
      throw err;
    }
    return design;
  }

  // ── Asset operations ────────────────────────────────────────────────────────

  static async getAssets(userId, type) {
    return AssetRepository.findByUserId(userId, type);
  }

  static async createAsset(userId, { type, name, url, size, mimeType }) {
    return AssetRepository.create({ userId, type, name, url, size, mimeType });
  }

  static async deleteAsset(id, userId) {
    const deleted = await AssetRepository.delete(id, userId);
    if (!deleted) {
      const err = new Error('Asset not found or access denied');
      err.statusCode = 404;
      throw err;
    }
    return deleted;
  }

  // ── Seed operations ─────────────────────────────────────────────────────────

  static async seedTemplates() {
    let categoriesCreated = 0;
    let templatesCreated = 0;

    for (const cat of STUDIO_CATEGORIES) {
      await TemplateRepository.upsertCategory(cat);
      categoriesCreated++;
    }

    const categories = await TemplateRepository.findCategories();
    const categoryMap = {};
    for (const c of categories) categoryMap[c.name] = c.id;

    for (const tpl of STUDIO_TEMPLATES) {
      const catId = categoryMap[tpl.category];
      if (!catId) continue;
      const existing = await TemplateRepository.count({ title: tpl.title, categoryId: catId });
      if (existing === 0) {
        const { category: _cat, ...rest } = tpl;
        await TemplateRepository.create({ ...rest, categoryId: catId });
        templatesCreated++;
      }
    }

    return { categoriesCreated, templatesCreated };
  }
}

export default StudioService;
