import { body, query, param } from 'express-validator';

// Article validation
export const validateArticleQuery = [
  query('category').optional().isIn(['Technology', 'Security', 'Privacy', 'Threats', 'Education', 'Policy'])
    .withMessage('Invalid category'),
  query('featured').optional().isBoolean()
    .withMessage('Featured must be true or false'),
  query('breaking').optional().isBoolean()
    .withMessage('Breaking must be true or false'),
  query('limit').optional().isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

export const validateArticleId = [
  param('id').isInt({ min: 1 }).withMessage('Article ID must be a positive integer')
];

// Resources validation
export const validateResourceQuery = [
  query('type').optional().isIn(['tool', 'guide', 'course', 'certification', 'documentation'])
    .withMessage('Invalid resource type'),
  query('category').optional().isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid category'),
  query('difficulty').optional().isIn(['easy', 'medium', 'hard'])
    .withMessage('Invalid difficulty level')
];

export const validateResourceId = [
  param('id').isInt({ min: 1 }).withMessage('Resource ID must be a positive integer')
];

// Newsletter validation
export const validateNewsletterSubscription = [
  body('email').isEmail().normalizeEmail({ gmail_remove_dots: false }).trim()
    .withMessage('Please provide a valid email address')
];

// Assessment validation
export const validateAssessmentId = [
  param('id').isInt({ min: 1 }).withMessage('Assessment ID must be a positive integer')
];

export const validateAssessmentSubmission = [
  body('sessionId').isLength({ min: 10, max: 50 }).trim()
    .withMessage('Session ID must be between 10 and 50 characters'),
  body('assessmentId').isInt({ min: 1 })
    .withMessage('Assessment ID must be a positive integer'),
  body('selectedAnswer').isInt({ min: 0, max: 10 })
    .withMessage('Selected answer must be between 0 and 10'),
  body('timeSpent').optional().isInt({ min: 0 })
    .withMessage('Time spent must be a positive integer'),
  body('username').optional().isLength({ min: 2, max: 50 }).trim().escape()
    .withMessage('Username must be between 2 and 50 characters')
];

// Search validation
export const validateSearchQuery = [
  query('q').isLength({ min: 2, max: 100 }).trim().escape()
    .withMessage('Search query must be between 2 and 100 characters')
];

// Cyber hygiene validation
export const validateCyberHygiene = [
  body('domain').matches(/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i)
    .withMessage('Please provide a valid domain name'),
  body('includeAdvanced').optional().isBoolean()
    .withMessage('Include advanced must be true or false')
];

// User score validation
export const validateUserScoreQuery = [
  query('sessionId').isLength({ min: 10, max: 50 }).trim()
    .withMessage('Session ID must be between 10 and 50 characters')
];

// General ID validation
export const validateIdParam = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer')
];

// Pagination validation
export const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

// General query sanitization
export const sanitizeStringInputs = [
  body('*').trim().escape(),
  query('*').trim().escape()
];