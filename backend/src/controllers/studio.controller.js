import StudioService from '../services/studio.service.js';

export class StudioController {
  // ── Templates ───────────────────────────────────────────────────────────────

  static getTemplates = async (req, res, next) => {
    try {
      const { category, search, isPremium, isTrending, isFeatured, isNew, skip, take } = req.query;
      const filters = {
        category,
        search,
        isPremium: isPremium !== undefined ? isPremium === 'true' : undefined,
        isTrending: isTrending === 'true',
        isFeatured: isFeatured === 'true',
        isNew: isNew === 'true',
        skip: skip ? parseInt(skip) : 0,
        take: take ? parseInt(take) : 60,
      };
      const templates = await StudioService.getTemplates(filters);
      res.json({ success: true, data: { templates, count: templates.length } });
    } catch (err) { next(err); }
  };

  static getTemplate = async (req, res, next) => {
    try {
      const template = await StudioService.getTemplate(req.params.id);
      res.json({ success: true, data: { template } });
    } catch (err) { next(err); }
  };

  static getCategories = async (req, res, next) => {
    try {
      const categories = await StudioService.getCategories();
      res.json({ success: true, data: { categories } });
    } catch (err) { next(err); }
  };

  static seedTemplates = async (req, res, next) => {
    try {
      const result = await StudioService.seedTemplates();
      res.json({ success: true, message: 'Templates seeded', data: result });
    } catch (err) { next(err); }
  };

  // ── Designs ─────────────────────────────────────────────────────────────────

  static getUserDesigns = async (req, res, next) => {
    try {
      const designs = await StudioService.getUserDesigns(req.user.id);
      res.json({ success: true, data: { designs } });
    } catch (err) { next(err); }
  };

  static getDesign = async (req, res, next) => {
    try {
      const design = await StudioService.getDesign(req.params.id, req.user.id);
      res.json({ success: true, data: { design } });
    } catch (err) { next(err); }
  };

  static createDesign = async (req, res, next) => {
    try {
      const design = await StudioService.createDesign(req.user.id, req.body);
      res.status(201).json({ success: true, message: 'Design saved', data: { design } });
    } catch (err) { next(err); }
  };

  static updateDesign = async (req, res, next) => {
    try {
      const design = await StudioService.updateDesign(req.params.id, req.user.id, req.body);
      res.json({ success: true, message: 'Design updated', data: { design } });
    } catch (err) { next(err); }
  };

  static deleteDesign = async (req, res, next) => {
    try {
      await StudioService.deleteDesign(req.params.id, req.user.id);
      res.json({ success: true, message: 'Design deleted' });
    } catch (err) { next(err); }
  };

  static duplicateDesign = async (req, res, next) => {
    try {
      const design = await StudioService.duplicateDesign(req.params.id, req.user.id);
      res.status(201).json({ success: true, message: 'Design duplicated', data: { design } });
    } catch (err) { next(err); }
  };

  // ── Assets ──────────────────────────────────────────────────────────────────

  static getAssets = async (req, res, next) => {
    try {
      const assets = await StudioService.getAssets(req.user.id, req.query.type);
      res.json({ success: true, data: { assets } });
    } catch (err) { next(err); }
  };

  static createAsset = async (req, res, next) => {
    try {
      const asset = await StudioService.createAsset(req.user.id, req.body);
      res.status(201).json({ success: true, data: { asset } });
    } catch (err) { next(err); }
  };

  static deleteAsset = async (req, res, next) => {
    try {
      await StudioService.deleteAsset(req.params.id, req.user.id);
      res.json({ success: true, message: 'Asset deleted' });
    } catch (err) { next(err); }
  };
}

export default StudioController;
