import vine from '@vinejs/vine'

export const createReservationValidator = vine.compile(
  vine.object({
    resourceType: vine.string(),
    resourceId: vine.string(),
    startDate: vine.date(),
    endDate: vine.date(),
    amount: vine.number().positive(),
    notes: vine.string().optional(),
  })
)

export const updateReservationValidator = vine.compile(
  vine.object({
    startDate: vine.date().optional(),
    endDate: vine.date().optional(),
    notes: vine.string().optional(),
  })
)
