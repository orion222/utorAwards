const jwt = require("jsonwebtoken");
const { prisma } = require("../prisma/prisma");

const verifyToken = async (req, res, next) => {
  const cookieToken = req.cookies?.auth_token;
  const headerToken = req.headers["authorization"]?.split(" ")[1];
  const token = cookieToken || headerToken;
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

const checkClearance = (requiredRoles) => {
  return async (req, res, next) => {
    const { role, id } = req.user;
    if (requiredRoles.includes(role)) {
      return next();
    }

    if (requiredRoles.includes("organizer")) {
      const eventId = req.eventId;

      const event = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
        include: {
          organizers: true,
        },
      });

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const isOrganizer = event.organizers.some(
        (organizer) => organizer.id === id,
      );

      if (!isOrganizer) {
        return res
          .status(403)
          .json({ error: "Forbidden: User is not an organizer" });
      }

      return next();
    }

    return res
      .status(403)
      .json({ error: "Forbidden: User does not have the correct clearance" });
  };
};

module.exports = { verifyToken, checkClearance };
