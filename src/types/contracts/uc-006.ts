// AUTO-GENERATED from the materialized contract snapshot. Do not edit.
export interface paths {
    "/reservations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List the authenticated employee's own active and upcoming reservations (desks and rooms) */
        get: operations["listMyReservations"];
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
        MyReservations: {
            /** @description The caller's active and upcoming reservations across resource types (desks and rooms); empty when none */
            reservations: components["schemas"]["ReservationSummary"][];
        };
        ReservationSummary: {
            /**
             * Format: uuid
             * @example b2c4a1e0-7f3d-4a9b-8c11-0d2e5f6a7b8c
             */
            id: string;
            /**
             * @description Which kind of resource this reservation is for
             * @example desk
             * @enum {string}
             */
            resourceType: "desk" | "room";
            /**
             * @description Floor label (may be negative, e.g. -1)
             * @example 2
             */
            floor: string;
            /**
             * Format: date
             * @example 2026-07-27
             */
            date: string;
            /**
             * @example active
             * @enum {string}
             */
            status: "active" | "cancelled" | "no_show";
            /**
             * @description Desk identifier — present when resourceType is desk
             * @example desk-2b-014
             */
            deskId?: string;
            /**
             * @description Zone of the desk — present when resourceType is desk
             * @example zone-2b
             */
            zoneId?: string;
            granularity?: components["schemas"]["Granularity"];
            /**
             * @description Check-in flag — present only when resourceType is desk; room reservations have no check-in state
             * @example not_checked_in
             * @enum {string}
             */
            checkInState?: "not_checked_in" | "checked_in";
            /**
             * @description Room identifier — present when resourceType is room
             * @example room-3-201
             */
            roomId?: string;
            /**
             * Format: date-time
             * @description Inclusive start of the reserved slot range — present when resourceType is room
             * @example 2026-07-27T10:00:00+02:00
             */
            startsAt?: string;
            /**
             * Format: date-time
             * @description Exclusive end of the reserved slot range — present when resourceType is room
             * @example 2026-07-27T11:00:00+02:00
             */
            endsAt?: string;
        };
        /**
         * @description Booking granularity — a full day, or the morning or afternoon half-day
         * @example FULL_DAY
         * @enum {string}
         */
        Granularity: "FULL_DAY" | "MORNING" | "AFTERNOON";
        Error: {
            /**
             * @description Machine-readable error code (SCREAMING_SNAKE_CASE — STD-002). One of: SESSION_EXPIRED, UNAUTHENTICATED.
             * @example SESSION_EXPIRED
             */
            code: string;
            /**
             * @description Human-readable message, safe to display to end users
             * @example Your session has expired. Please sign in again.
             */
            message: string;
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
    listMyReservations: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The caller's reservations (may be empty) */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MyReservations"];
                };
            };
            /** @description No valid session — the caller is unauthenticated (UNAUTHENTICATED) or the session has expired (SESSION_EXPIRED) */
            401: {
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
