export const getProtected = (req, res) => {
  res.json({
    message: 'Welcome to the protected route!',
    user: { id: req.user.id, email: req.user.email }
  })
}