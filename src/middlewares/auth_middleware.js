
const AuthentificationService = require('./../services/authentification/service/authentification_service');

const authMiddleware = (roles) => {
    return async (req, res, next) => {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            // Verify the token
            const decodedToken = await AuthentificationService.verifyToken(token);

            // Check if the decoded token's role matches any of the required roles
            if (!roles.includes(decodedToken.role)) {
                return res.status(403).json({ error: 'Youn are not allowed to access this route' });
            }

            // Extract user information from the token and stock them in req
            req.userId = decodedToken.userId;
            req.role = decodedToken.role;

            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    };
};

module.exports = authMiddleware;
