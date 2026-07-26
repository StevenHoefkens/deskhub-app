// AUTO-GENERATED from the materialized contract snapshot. Do not edit.
export interface paths {
    "/reservations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reserve an available desk for a date and granularity */
        post: operations["reserveDesk"];
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
        ReserveDeskRequest: {
            /**
             * @description Identifier of the desk to reserve
             * @example desk-2b-014
             */
            deskId: string;
            /**
             * Format: date
             * @description Reservation date; must be today or later and within the rolling 30-day horizon
             * @example 2026-07-27
             */
            date: string;
            granularity: components["schemas"]["Granularity"];
        };
        Reservation: {
            /**
             * Format: uuid
             * @description Unique reservation identifier
             * @example b2c4a1e0-7f3d-4a9b-8c11-0d2e5f6a7b8c
             */
            id: string;
            /** @example desk-2b-014 */
            deskId: string;
            /**
             * @description Zone the desk belongs to
             * @example zone-2b
             */
            zoneId: string;
            /**
             * @description Floor label of the desk (may be negative, e.g. -1)
             * @example 2
             */
            floor: string;
            /**
             * Format: date
             * @example 2026-07-27
             */
            date: string;
            granularity: components["schemas"]["Granularity"];
            /**
             * Format: date-time
             * @description Reservation start, derived from the shared clock boundaries for the granularity
             * @example 2026-07-27T09:00:00+02:00
             */
            startsAt: string;
            /**
             * Format: date-time
             * @description Reservation end, derived from the shared clock boundaries for the granularity
             * @example 2026-07-27T18:00:00+02:00
             */
            endsAt: string;
            /**
             * @description The user who made the reservation
             * @example user-2231
             */
            bookerId: string;
            /**
             * @description The user who will occupy the desk; equal to bookerId in MVP (self-only)
             * @example user-2231
             */
            occupantId: string;
            /**
             * @description Reservation lifecycle status
             * @example active
             * @enum {string}
             */
            status: "active" | "cancelled" | "no_show";
            /**
             * @description Check-in flag on an active reservation; a new reservation is created not-checked-in
             * @example not_checked_in
             * @enum {string}
             */
            checkInState: "not_checked_in" | "checked_in";
        };
        /**
         * @description Booking granularity — a full day, or the morning or afternoon half-day
         * @example FULL_DAY
         * @enum {string}
         */
        Granularity: "FULL_DAY" | "MORNING" | "AFTERNOON";
        Error: {
            /**
             * @description Machine-readable error code (SCREAMING_SNAKE_CASE — STD-002). One of: INVALID_DATE, ZONE_NOT_ACCESSIBLE, DESK_NOT_FOUND, DESK_NOT_AVAILABLE, OVERLAPPING_RESERVATION.
             * @example DESK_NOT_AVAILABLE
             */
            code: string;
            /**
             * @description Human-readable message, safe to display to end users
             * @example This desk is no longer available for the selected time.
             */
            message: string;
            /** @description Field-level validation errors (HTTP 400 — STD-001 Rule 8) */
            details?: {
                /** @example date */
                field: string;
                /** @example horizon */
                rule: string;
                /** @example Date must be within the next 30 days. */
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
    reserveDesk: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReserveDeskRequest"];
            };
        };
        responses: {
            /** @description Reservation created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Reservation"];
                };
            };
            /** @description Validation error — date in the past or beyond the rolling 30-day horizon */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description The desk's zone is not in the employee's effective bookable-zone set */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Desk not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Desk not available, or the employee already holds an overlapping reservation, or the desk was just taken under contention */
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
