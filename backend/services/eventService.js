const { RsvpStatus } = require("@prisma/client");
const { prisma, RoleType } = require("../prisma/prisma");
const BadRequestError = require("../utils/errors/badRequestError");
const ExpiredError = require("../utils/errors/expiredError");
const NotFoundError = require("../utils/errors/notFoundError");

class EventService {
  static async createEvent(
    name,
    description,
    location,
    startTime,
    endTime,
    capacity,
    points,
    creatorId,
  ) {
    const newEvent = await prisma.event.create({
      data: {
        name: name,
        startTime: startTime,
        endTime: endTime,
        description: description,
        location: location,
        capacity: capacity,
        points: points,
        pointsRemain: points,
        createdBy: { connect: { id: creatorId } },
        organizers: {
          connect: { id: creatorId },
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
        startTime: true,
        endTime: true,
        capacity: true,
        pointsRemain: true,
        pointsAwarded: true,
        published: true,
        organizers: true,
      },
    });

    return {
      ...newEvent,
      guests: [],
    };
  }

  static async getFilteredEvents(
    search,
    name,
    location,
    started,
    ended,
    showFull,
    page = 1,
    limit = 10,
    published,
    role,
    orderBy,
  ) {
    const filterDetails = {};

    filterDetails.AND = [];

    let tempFilterDetail = { OR: [] };

    if (search) {
      tempFilterDetail.OR.push({ name: { contains: search } });
      tempFilterDetail.OR.push({ description: { contains: search } });
      tempFilterDetail.OR.push({ location: { contains: search } });
    }

    if (name) {
      tempFilterDetail.OR.push({ name: { contains: name } });
    }

    if (location) {
      tempFilterDetail.OR.push({ location: { contains: location }});
    }

    if (tempFilterDetail.OR.length !== 0) {
      filterDetails.AND.push(tempFilterDetail);
    }

    tempFilterDetail = { OR: [] };

    const currDate = new Date();
    if (started === "true") {
      filterDetails.startTime = { lt: currDate };
      filterDetails.endTime = { gt: currDate };
    } else if (started === "false") {
      filterDetails.startTime = { gte: currDate };
    }

    if (ended === "true") {
      filterDetails.endTime = { lte: currDate };
    } else if (ended === "false") {
      filterDetails.endTime = { gt: currDate };
    }

    if (published === "true") {
      filterDetails.published = true;
    } else if (published === "false") {
      filterDetails.published = false;
    }

    if (showFull === "true") {
      tempFilterDetail.OR = [];
      filterDetails.NOT = { capacity: null };
      filterDetails.numGuests = { gt: prisma.event.fields.capacity };
    } else if (showFull === "false") {
      tempFilterDetail.OR.push({ capacity: null });
      tempFilterDetail.OR.push({
        numGuests: { lt: prisma.event.fields.capacity },
      });
    }

    if (role === RoleType.regular || role === RoleType.cashier) {
      filterDetails.published = true;
      tempFilterDetail.OR = [];
      filterDetails.NOT = { capacity: null };
      filterDetails.numGuests = { lt: prisma.event.fields.capacity };
    }

    filterDetails.AND.push(tempFilterDetail);

    const selectDetails = {
      id: true,
      name: true,
      location: true,
      description: true,
      points: true,
      startTime: true,
      endTime: true,
      capacity: true,
      numGuests: true,
      published: true,
      createdAt: true,
    };

    if (role === RoleType.manager || role === RoleType.superuser) {
      selectDetails.pointsRemain = true;
      selectDetails.pointsAwarded = true;
      selectDetails.published = true;
    }

    const [count, results] = await prisma.$transaction([
      prisma.event.count({ where: filterDetails }),
      prisma.event.findMany({
        where: filterDetails,
        take: limit,
        skip: (page - 1) * limit,
        select: selectDetails,
        orderBy: orderBy || undefined,
      }),
    ]);
    console.log(filterDetails);
    console.log(results);
    return {
      count: count,
      results: results,
    };
  }

  static async getSpecificEvent(eventId, userId, role) {
    const returnData = {
      id: true,
      name: true,
      description: true,
      location: true,
      startTime: true,
      endTime: true,
      capacity: true,
      points: true,
      pointsAwarded: true,
      pointsRemain: true,
      published: true,
      organizers: {
        select: {
          id: true,
          utorid: true,
          name: true,
          avatarUrl: true,
        }
      },
      numGuests: true,
      createdAt: true,
    };

    const specificEvent = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
        select: returnData,
      });

      if (!event) {
        throw new NotFoundError("event not found");
      }

      const rsvp = await tx.rsvp.findMany({
        where: { eventId: eventId },
        select: { user: { select: { id: true, utorid: true, name: true, avatarUrl: true, points: true } } },
      });

      return { ...event, guests: rsvp };
    });

    const isAnOrganizer = specificEvent.organizers.some(
      (item) => item.id === userId,
    );

    if (
      (role === RoleType.regular || role === RoleType.cashier) &&
      !isAnOrganizer
    ) {
      delete specificEvent.pointsRemain;
      delete specificEvent.pointsAwarded;
    }

    return specificEvent;
  }

  static async getSpecificEventUsers(eventId, userId, role) {
    const userSelectFields = {
      id: true,
      name: true,
      utorid: true,
      email: true,
      points: true,
    };

    const eventData = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        organizers: {
          select: userSelectFields,
        },
        rsvps: {
          select: {
            user: {
              select: userSelectFields,
            },
          },
        },
      },
    });

    if (!eventData) {
      throw new Error("Event not found");
    }

    // 3. Transform the data to the desired format
    // Prisma returns rsvps as [ { user: { ... } }, { user: { ... } } ]
    // We map over it to extract just the user objects into a flat array.
    return {
      organizers: eventData.organizers,
      guests: eventData.rsvps.map((rsvp) => rsvp.user),
    };
  }

  static async updateEvent(id, updateParams) {
    const copy = Object.fromEntries(
      Object.keys(updateParams).map((key) => [key, true]),
    );

    const selectParams = {
      ...copy,
      id: true,
      name: true,
      location: true,
    };

    if (selectParams.points) {
      selectParams.pointsRemain = true;
      updateParams.pointsRemain = updateParams.points;
    }

    const updatedEvent = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: id },
      });

      if (!event) {
        throw new NotFoundError("event not found");
      }

      const now = new Date();

      // check if updates to endTime are made after the event has already ended
      if (updateParams.endTime && updateParams.endTime < now) {
        throw new BadRequestError("event has already ended");
      }

      // check if updates to name, desc, loc, startTime, or cap are made after event has already started
      if (
        (updateParams.name ||
          updateParams.description ||
          updateParams.location ||
          updateParams.capacity) &&
        event.startTime < now
      ) {
        throw new BadRequestError("event has already started");
      }

      if (updateParams.startTime && updateParams.endTime) {
        if (updateParams.endTime < updateParams.startTime) {
          throw new BadRequestError("startTime must be before endTime");
        }
      } else if (updateParams.startTime) {
        if (updateParams.startTime > event.endTime) {
          throw new BadRequestError("startTime must be before endTime");
        }
      } else if (updateParams.endTime) {
        if (event.startTime > updateParams.endTime) {
          throw new BadRequestError("startTime must be before endTime");
        }
      }

      // check if capacity reduction is greater than the number of guests already going
      const currCapacity = event.numGuests;
      if (updateParams.capacity && updateParams.capacity < currCapacity) {
        throw new BadRequestError(
          "number of guests exceeds capacity reduction",
        );
      }

      // check if change to points makes pointsAvailable negative
      if (
        updateParams.points &&
        updateParams.points - event.pointsAwarded < 0
      ) {
        throw new BadRequestError("points change is invalid");
      }

      const update = await tx.event.update({
        where: { id: id },
        data: updateParams,
        select: selectParams,
      });

      return update;
    });

    return updatedEvent;
  }

  static async deleteEvent(id) {
    const retVal = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: id },
      });

      if (!event) throw new NotFoundError("event not found");
      if (event.published)
        throw new BadRequestError("event has already been published");
      const deletedEvent = await tx.event.delete({
        where: { id: id },
      });
      return 0;
    });
    return retVal;
  }

  static async rsvpForEvent(eventId, userId) {
    const signedUpUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          utorid: true,
          name: true,
        },
      });
      if (!user) throw new NotFoundError("user not found");

      const event = await tx.event.findUnique({
        where: { id: eventId },
        select: {
          name: true,
          location: true,
          endTime: true,
          numGuests: true,
        },
      });
      if (!event) throw new NotFoundError("event not found");

      const now = new Date();
      if (event.endTime < now)
        throw new BadRequestError("event has already ended");

      const userAlreadyRSVP = await tx.rsvp.findUnique({
        where: {
          userId_eventId: {
            userId: user.id,
            eventId: eventId,
          },
        },
      });
      if (userAlreadyRSVP)
        throw new BadRequestError("user is already in guest list");

      // create an rsvp for user
      await tx.rsvp.create({
        data: {
          status: RsvpStatus.confirmed,
          eventId: eventId,
          userId: userId,
        },
      });

      // add 1 to numGuests
      const updateNumGuests = await tx.event.update({
        where: {
          id: eventId,
        },
        data: {
          numGuests: {
            increment: 1,
          },
        },
      });

      const response = {
        id: eventId,
        name: event.name,
        location: event.location,
        guestAdded: user,
        numGuests: updateNumGuests.numGuests,
      };

      return response;
    });
    return signedUpUser;
  }

  static async removeFromEvent(eventId, userId) {
    const retVal = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          utorid: true,
          name: true,
        },
      });
      if (!user) return 2;

      const event = await tx.event.findUnique({
        where: { id: eventId },
        select: {
          name: true,
          location: true,
          endTime: true,
          numGuests: true,
        },
      });
      if (!event) throw new NotFoundError("Event not found!");
      const now = new Date();
      if (now > event.endTime) return 1;

      // remove 1 to numGuests
      await tx.event.update({
        where: { id: eventId },
        data: {
          numGuests: {
            decrement: 1,
          },
        },
      });

      // remove user from event
      await tx.rsvp.delete({
        where: {
          userId_eventId: {
            userId: userId,
            eventId: eventId,
          },
        },
      });

      return 0;
    });

    return retVal;
  }

  static async addEventOrganizer(eventId, utorid) {
    let event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });
    const user = await prisma.user.findUnique({
      where: {
        utorid,
      },
    });
    if (!event) throw new NotFoundError("Event not found!");
    if (!user) throw new NotFoundError("User not found!");
    const isGuest = await prisma.rsvp.findUnique({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId,
        },
      },
      select: { id: true },
    });
    if (isGuest) throw new BadRequestError("User is a guest of the event.");
    const now = Date.now();
    if (event.endTime < now) throw new ExpiredError("Event has ended");
    const updatedEvent = await prisma.$transaction(async (tx) => {
      if (!user.isEventOrganizer) {
        await tx.user.update({
          where: { utorid },
          data: {
            isEventOrganizer: true,
          },
        });
      }

      const event = await tx.event.update({
        where: { id: eventId },
        data: {
          organizers: {
            connect: { id: user.id },
          },
        },
        select: {
          id: true,
          name: true,
          location: true,
          organizers: {
            select: {
              id: true,
              utorid: true,
              name: true,
            },
          },
        },
      });

      return event;
    });

    return updatedEvent;
  }

  static async removeEventOrganizer(eventId, userId) {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!event) throw new NotFoundError("Event not found!");
    if (!user) throw new NotFoundError("User not found!");

    const updatedEvent = await prisma.$transaction(async (tx) => {
      const updatedEventData = await tx.event.update({
        where: { id: eventId },
        data: {
          organizers: {
            disconnect: { id: userId },
          },
        },
      });

      const organizedEventsCount = await tx.event.count({
        where: {
          organizers: {
            some: {
              id: userId,
            },
          },
        },
      });

      if (organizedEventsCount === 0) {
        await tx.user.update({
          where: { id: userId },
          data: {
            isEventOrganizer: false,
          },
        });
      }

      return updatedEventData;
    });

    return updatedEvent;
  }

  static async addEventGuest(eventId, utorid) {
    const response = await prisma.$transaction(async (tx) => {
      let event = await tx.event.findUnique({
        where: {
          id: eventId,
        },
      });

      const user = await tx.user.findUnique({
        where: {
          utorid,
        },
      });
      if (!event) throw new NotFoundError("Event not found!");
      if (!user) throw new NotFoundError("User not found!");
      const isOrganizer = await tx.event.findUnique({
        where: {
          id: eventId,
          organizers: {
            some: {
              id: user.id,
            },
          },
        },
        select: { id: true },
      });
      if (isOrganizer)
        throw new BadRequestError("User is an organizer of the event.");

      const now = Date.now();
      if (event.endTime < now || event.numGuests === event.capacity)
        throw new ExpiredError("Gone.");
      if (!event.published)
        throw new NotFoundError("Event is not visible to organizers yet");

      // add 1 to numGuests
      await tx.event.update({
        where: {
          id: eventId,
        },
        data: {
          numGuests: {
            increment: 1,
          },
        },
      });

      await tx.rsvp.create({
        data: {
          status: RsvpStatus.confirmed,
          eventId: eventId,
          userId: user.id,
        },
      });

      const response = {
        id: event.id,
        name: event.name,
        location: event.location,
        guestAdded: {
          id: user.id,
          utorid: user.utorid,
          name: user.name,
        },
        numGuests: event.numGuests,
      };

      return response;
    });

    return response;
  }

  static async removeEventGuest(eventId, userId) {
    await prisma.$transaction(async (tx) => {
      let event = await tx.event.findUnique({
        where: {
          id: eventId,
        },
      });
      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },
      });
      const rsvp = await tx.rsvp.findUnique({
        where: {
          userId_eventId: {
            userId: userId,
            eventId: eventId,
          },
        },
      });

      if (!event) throw new NotFoundError("Event not found!");
      if (!user) throw new NotFoundError("User not found!");
      if (!rsvp) throw new NotFoundError("rsvp not found!");
      const rsvpId = rsvp.id;

      // remove 1 from numGuests
      await tx.event.update({
        where: { id: eventId },
        data: {
          numGuests: {
            decrement: 1,
          },
        },
      });

      // delete RSVP
      await tx.rsvp.delete({
        where: {
          id: rsvpId,
        },
      });
    });
  }
  static async retrieveEvents(
    userId,
    name,
    location,
    started,
    ended,
    page,
    limit,
    orderBy,
  ) {
    const filters = {};

    if (name && typeof name !== "string") {
      throw new BadRequestError("invalid event name");
    } else if (name) {
      filters.name = name;
    }

    if (location && typeof location !== "string") {
      throw new BadRequestError("invalid location");
    } else if (location) {
      filters.location = location;
    }

    if (started !== undefined && typeof started !== "boolean") {
      throw new BadRequestError("invalid started value");
    } else if (started === true || started === false) {
      filters.started = started;
    }

    if (ended !== undefined && typeof ended !== "boolean") {
      throw new BadRequestError("invalid ended value");
    } else if (ended === true || ended === false) {
      filters.ended = ended;
    }

    const take = limit;
    const skip = (page - 1) * take;
    const select = {
      id: true,
      name: true,
      description: true,
      location: true,
      points: true,
      startTime: true,
      endTime: true,
      numGuests: true,
      capacity: true,
    };

    const { count, events } = await prisma.$transaction(async (tx) => {
      filters.rsvps = { some: { userId } };

      const count = await tx.event.count({ where: filters });
      const events = await tx.event.findMany({
        where: filters,
        skip,
        take,
        select,
        orderBy: orderBy ? orderBy : { startTime: "asc" },
      });

      return { count, events };
    });

    return { count, results: events };
  }

  static async getMyInvitedFilteredEvents(
    userId,
    role,
    search,
    name,
    location,
    started,
    ended,
    showFull,
    page = 1,
    limit = 10,
    published,
    orderBy,
  ) {
    const filterDetails = {};
    filterDetails.AND = [];
    let tempFilterDetail = { OR: [] };

    if (search) {
      tempFilterDetail.OR.push({ name: { contains: search } });
      tempFilterDetail.OR.push({ description: { contains: search } });
      tempFilterDetail.OR.push({ location: { contains: search }});
    }

    if (name) {
      tempFilterDetail.OR.push({ name: { contains: name }});
    }

    if (location) {
      tempFilterDetail.OR.push({ location: { contains: location }});
    }

    if (tempFilterDetail.OR.length > 0) {
      filterDetails.AND.push(tempFilterDetail);
    }

    tempFilterDetail = { OR: [] }; // Reset for the next set of OR conditions

    const currDate = new Date();
    if (started === "true") {
      filterDetails.startTime = { lt: currDate };
    } else if (started === "false") {
      filterDetails.startTime = { gte: currDate };
    }

    if (ended === "true") {
      filterDetails.endTime = { lte: currDate };
    } else if (ended === "false") {
      filterDetails.endTime = { gt: currDate };
    }

    if (published === "true") {
      filterDetails.published = true;
    } else if (published === "false") {
      filterDetails.published = false;
    }

    if (showFull === "false") {
      tempFilterDetail.OR.push({ capacity: null });
      tempFilterDetail.OR.push({
        numGuests: { lt: prisma.event.fields.capacity },
      });
    } else if (showFull === "true") {
      filterDetails.NOT = { capacity: null };
      filterDetails.numGuests = { gte: prisma.event.fields.capacity };
    }

    if (role === RoleType.regular || role === RoleType.cashier) {
      filterDetails.published = true;
      // This block was causing issues. Let's assume regular users should only see non-full events.
      tempFilterDetail.OR.push({ capacity: null });
      tempFilterDetail.OR.push({
        numGuests: { lt: prisma.event.fields.capacity },
      });
    }

    if (tempFilterDetail.OR.length > 0) {
      filterDetails.AND.push(tempFilterDetail);
    }

    // If AND is empty after all filters, remove it to avoid issues.
    if (filterDetails.AND.length === 0) {
      delete filterDetails.AND;
    }

    const selectDetails = {
      id: true,
      name: true,
      location: true,
      startTime: true,
      endTime: true,
      capacity: true,
      numGuests: true,
      points: true,
      published: true,
      description: true,
      createdAt: true,
    };

    if (role === RoleType.manager || role === RoleType.superuser) {
      selectDetails.pointsRemain = true;
      selectDetails.pointsAwarded = true;
    }

    filterDetails.rsvps = { some: { userId: userId } };

    const [count, results] = await prisma.$transaction([
      prisma.event.count({ where: filterDetails }),
      prisma.event.findMany({
        where: filterDetails,
        take: limit,
        skip: (page - 1) * limit,
        select: selectDetails,
        orderBy: orderBy ? orderBy : {},
      }),
    ]);

    return {
      count: count,
      results: results,
    };
  }

  static async getMyManagedFilteredEvents(
    userId,
    role,
    search,
    name,
    location,
    started,
    ended,
    showFull,
    page = 1,
    limit = 10,
    published,
    orderBy,
  ) {
    const filterDetails = {};

    filterDetails.AND = [];

    let tempFilterDetail = { OR: [] };

    if (search) {
      tempFilterDetail.OR.push({ name: { contains: search } });
      tempFilterDetail.OR.push({ description: { contains: search } });
      tempFilterDetail.OR.push({ location: { contains: search } });
    }

    if (name) {
      tempFilterDetail.OR.push({ name: { contains: name } });
    }

    if (location) {
      tempFilterDetail.OR.push({ location: { contains: location } });
    }

    if (tempFilterDetail.OR.length > 0) {
      filterDetails.AND.push(tempFilterDetail);
    }
    tempFilterDetail = { OR: [] };

    const currDate = new Date();
    if (started === "true") {
      filterDetails.startTime = { lt: currDate };
    } else if (started === "false") {
      filterDetails.startTime = { gte: currDate };
    }

    if (ended === "true") {
      filterDetails.endTime = { lte: currDate };
    } else if (ended === "false") {
      filterDetails.endTime = { gt: currDate };
    }

    if (published === "true") {
      filterDetails.published = true;
    } else if (published === "false") {
      filterDetails.published = false;
    }

    if (showFull === "true") {
      tempFilterDetail.OR = [];
      filterDetails.NOT = { capacity: null };
      filterDetails.numGuests = { equals: prisma.event.fields.capacity };
    } else if (showFull === "false") {
      tempFilterDetail.OR.push({ capacity: null });
      tempFilterDetail.OR.push({
        numGuests: { lt: prisma.event.fields.capacity },
      });
    }

    if (role === RoleType.regular || role === RoleType.cashier) {
      filterDetails.published = true;
      tempFilterDetail.OR = [];
      filterDetails.NOT = { capacity: null };
      filterDetails.numGuests = { gt: prisma.event.fields.capacity };
    }

    const selectDetails = {
      id: true,
      name: true,
      location: true,
      startTime: true,
      endTime: true,
      capacity: true,
      numGuests: true,
      points: true,
      description: true,
      published: true,
      createdAt: true,
    };

    if (role === RoleType.manager || role === RoleType.superuser) {
      selectDetails.pointsRemain = true;
      selectDetails.pointsAwarded = true;
      selectDetails.published = true;
    }

    filterDetails.organizers = { some: { id: userId } };

    const [count, results] = await prisma.$transaction([
      prisma.event.count({ where: filterDetails }),
      prisma.event.findMany({
        where: filterDetails,
        take: limit,
        skip: (page - 1) * limit,
        select: selectDetails,
        orderBy: orderBy ? orderBy : { createdAt: "desc" },
      }),
    ]);

    return {
      count: count,
      results: results,
    };
  }
}

module.exports = { EventService };
