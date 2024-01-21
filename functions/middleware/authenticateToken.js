async function authenticateToken(req, res, next) {
    // Extract the session cookie from the cookies
    const sessionCookie = req.cookies.session;

    if (!sessionCookie) {
        return res.sendStatus(401);
    }

    try {
        // Verify the session cookie
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        // Set req.user to the decoded claims
        req.user = decodedClaims;

        next();
    } catch (error) {
        console.error('Error verifying session cookie:', error);
        res.sendStatus(403);
    }
}
module.exports = authenticateToken;