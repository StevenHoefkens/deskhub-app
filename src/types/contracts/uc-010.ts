// AUTO-GENERATED from the materialized contract snapshot. Do not edit.
export interface paths {
    "/rooms": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Search rooms available for a date and 15-minute slot range, filtered by capacity and tags */
        get: operations["searchAvailableRooms"];
        put?: never;
        post?: never;
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
        RoomSearchResults: {
            /**
             * Format: date
             * @example 2026-07-27
             */
            date: string;
            /** @example 10:00 */
            startTime: string;
            /** @example 11:00 */
            endTime: string;
            /** @description Rooms available for the full requested range matching the filters; empty when none match */
            rooms: components["schemas"]["AvailableRoom"][];
        };
        AvailableRoom: {
            /** @example room-3-201 */
            roomId: string;
            /**
             * @description Floor label (may be negative, e.g. -1)
             * @example 3
             */
            floor: string;
            /**
             * @description Maximum capacity of the room; informational (shown and filterable), not enforced at booking
             * @example 8
             */
            maxCapacity: number;
            /**
             * @example [
             *       "beamer",
             *       "video-conference"
             *     ]
             */
            tags: string[];
        };
        Error: {
            /**
             * @description Machine-readable error code (SCREAMING_SNAKE_CASE — STD-002). One of: INVALID_DATE, INVALID_SLOT_RANGE.
             * @example INVALID_SLOT_RANGE
             */
            code: string;
            /**
             * @description Human-readable message, safe to display to end users
             * @example Times must fall on 15-minute boundaries (:00, :15, :30, :45).
             */
            message: string;
            /** @description Field-level validation errors (HTTP 400 — STD-001 Rule 8) */
            details?: {
                /** @example startTime */
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
    searchAvailableRooms: {
        parameters: {
            query: {
                /**
                 * @description Search date; the slot range must not be in the past. No upper horizon.
                 * @example 2026-07-27
                 */
                date: string;
                /**
                 * @description Inclusive start of the slot range, aligned to a 15-minute boundary (:00, :15, :30, :45)
                 * @example 10:00
                 */
                startTime: string;
                /**
                 * @description Exclusive end of the slot range, aligned to a 15-minute boundary and strictly after startTime
                 * @example 11:00
                 */
                endTime: string;
                /**
                 * @description Minimum maximum-capacity a room must meet or exceed
                 * @example 6
                 */
                minCapacity?: number;
                /**
                 * @description Facility tag filters; a room must carry ALL supplied tags (AND semantics)
                 * @example [
                 *       "beamer",
                 *       "video-conference"
                 *     ]
                 */
                tags?: string[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Search results (may be empty) */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RoomSearchResults"];
                };
            };
            /** @description Validation error — date/range in the past, or a range not aligned to 15-minute boundaries */
            400: {
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
