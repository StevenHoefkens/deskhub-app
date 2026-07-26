// AUTO-GENERATED from the materialized contract snapshot. Do not edit.
export interface paths {
    "/reservations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List the authenticated employee's own active and upcoming desk reservations */
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
            /** @description The caller's active and upcoming desk reservations; empty when none */
            reservations: components["schemas"]["ReservationSummary"][];
        };
        ReservationSummary: {
            /**
             * Format: uuid
             * @example b2c4a1e0-7f3d-4a9b-8c11-0d2e5f6a7b8c
             */
            id: string;
            /** @example desk-2b-014 */
            deskId: string;
            /** @example zone-2b */
            zoneId: string;
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
            granularity: components["schemas"]["Granularity"];
            /**
             * @example active
             * @enum {string}
             */
            status: "active" | "cancelled" | "no_show";
            /**
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
             * @description Machine-readable error code (SCREAMING_SNAKE_CASE — STD-002). One of: SESSION_EXPIRED.
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
            /** @description No valid session — the caller is unauthenticated or the session has expired */
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
