// AUTO-GENERATED from the materialized contract snapshot. Do not edit.
export interface paths {
    "/rooms/{roomId}/reservations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Book a room for a contiguous range of 15-minute slots */
        post: operations["reserveRoom"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        ReserveRoomRequest: {
            /**
             * Format: date
             * @description Booking date; the slot range must not be in the past. No upper horizon.
             * @example 2026-07-27
             */
            date: string;
            /**
             * @description Inclusive start of the slot range, local wall-clock, aligned to a 15-minute boundary (:00, :15, :30, :45)
             * @example 10:00
             */
            startTime: string;
            /**
             * @description Exclusive end of the slot range, aligned to a 15-minute boundary and strictly after startTime
             * @example 11:00
             */
            endTime: string;
        };
        RoomReservation: {
            /**
             * Format: uuid
             * @description Unique reservation identifier
             * @example d7f1a2b3-4c5e-4f60-9a71-2b3c4d5e6f70
             */
            id: string;
            /** @example room-3-201 */
            roomId: string;
            /**
             * @description Floor label of the room (may be negative, e.g. -1)
             * @example 3
             */
            floor: string;
            /**
             * Format: date
             * @example 2026-07-27
             */
            date: string;
            /**
             * Format: date-time
             * @description Inclusive start of the reserved slot range
             * @example 2026-07-27T10:00:00+02:00
             */
            startsAt: string;
            /**
             * Format: date-time
             * @description Exclusive end of the reserved slot range
             * @example 2026-07-27T11:00:00+02:00
             */
            endsAt: string;
            /**
             * @description The user who made the booking
             * @example user-2231
             */
            bookerId: string;
            /**
             * @description The user who will occupy the room; equal to bookerId in MVP (self-only)
             * @example user-2231
             */
            occupantId: string;
            /**
             * @description Reservation lifecycle status; a room reservation is never marked no_show (rooms are excluded from check-in / no-show)
             * @example active
             * @enum {string}
             */
            status: "active" | "cancelled";
        };
        Error: {
            /**
             * @description Machine-readable error code (SCREAMING_SNAKE_CASE — STD-002). One of: INVALID_DATE, INVALID_SLOT_RANGE, ROOM_NOT_FOUND, ROOM_NOT_AVAILABLE.
             * @example ROOM_NOT_AVAILABLE
             */
            code: string;
            /**
             * @description Human-readable message, safe to display to end users
             * @example One or more of the selected time slots is no longer available.
             */
            message: string;
            /** @description Field-level validation errors (HTTP 400 — STD-001 Rule 8) */
            details?: {
                /** @example endTime */
                field: string;
                /** @example alignment */
                rule: string;
                /** @example Times must fall on 15-minute boundaries (:00, :15, :30, :45). */
                message: string;
            }[];
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    reserveRoom: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description Identifier of the room to book
                 * @example room-3-201
                 */
                roomId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReserveRoomRequest"];
            };
        };
        responses: {
            /** @description Room reservation created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RoomReservation"];
                };
            };
            /** @description Validation error — date/range in the past, or a range that is not contiguous and aligned to 15-minute boundaries */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Room not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description One or more slots in the range are unavailable — already taken, out of service, within a blackout, or just taken under contention */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
}
