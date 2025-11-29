// Let's stick to: Public read. If ?refresh=true, we expect them to be logged in.
// Since we can't easily conditionally apply middleware, we'll parse token manually in controller or make a "soft" auth middleware.
// OR: We just say refresh requires a separate POST endpoint? No, GET with query is fine.
// Let's assume for now we don't strictly enforce auth for *reading*, but we ignore refresh if not authed.
// Actually, to make it clean:
// We can use `authenticate` as an optional step? No.
// Let's just make it public. If they pass a token, we could verify it.
// For now, let's just make the endpoint public. If refresh is requested, we check `req.user`.
// But `req.user` is only set by `authenticate`.
// So we need a middleware that checks token if present, but doesn't error if missing.

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    return authenticate(req, res, next);
  }
  next();
};

router.get(
  "/:id/github",
  optionalAuth,
  validate(userIdSchema),
  githubController.getUserGithub
);

export default router;
