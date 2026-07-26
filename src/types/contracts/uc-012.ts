// AUTO-GENERATED from the materialized contract snapshot. Do not edit.
export interface paths {
    "/reservations/{reservationId}/check-in": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Check in to the caller's own desk reservation within its check-in window, confirming occupancy */
        post: operations["checkInToReservation"];
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
        CheckInResult: {
            /**
             * Format: uuid
             * @description Unique reservation identifier
             * @example b2c4a1e0-7f3d-4a9b-8c11-0d2e5f6a7b8c
             */
            id: string;
            /**
             * @description The desk this reservation holds
             * @example desk-2b-014
             */
            deskId: string;
            /**
             * Format: date
             * @example 2026-07-27
             */
            date: string;
            granularity: components["schemas"]["Granularity"];
            /**
             * @description Reservation lifecycle status; check-in keeps it active
             * @example active
             * @enum {string}
             */
            status: "active";
            /**
             * @description Check-in flag after the operation
             * @example checked_in
             * @enum {string}
             */
            checkInState: "checked_in";
            /**
             * Format: date-time
             * @description The recorded moment of check-in; on an idempotent re-check-in this is the original check-in time
             * @example 2026-07-27T08:45:00+02:00
             */
            checkedInAt: string;
            /**
             * @description True when the reservation was already checked in and this call was an idempotent no-op; false on a fresh check-in
             * @example false
             */
            alreadyCheckedIn: boolean;
        };
        /**
         * @description Booking granularity — a full day, or the morning or afternoon half-day. Anchors the reservation start used to derive the check-in window.
         * @example FULL_DAY
         * @enum {string}
         */
        Granularity: "FULL_DAY" | "MORNING" | "AFTERNOON";
        Error: {
            /**
             * @description Machine-readable error code (SCREAMING_SNAKE_CASE — STD-002). One of: UNAUTHENTICATED, SESSION_EXPIRED (401); NOT_RESERVATION_OWNER (403); RESERVATION_NOT_FOUND (404); RESERVATION_NOT_ACTIVE, RESERVATION_ALREADY_ENDED (409); NOT_A_DESK_RESERVATION, CHECK_IN_NOT_OPEN, CHECK_IN_WINDOW_EXPIRED (422).
             * @example CHECK_IN_WINDOW_EXPIRED
             */
            code: string;
            /**
             * @description Human-readable message, safe to display to end users
             * @example This reservation has expired as a no-show and can no longer be checked in.
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
    checkInToReservation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description Identifier of the desk reservation to check in to
                 * @example res-5501
                 */
                reservationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Checked in. Also returned for an idempotent re-check-in of an already-checked-in reservation (alreadyCheckedIn is true). */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CheckInResult"];
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
            /** @description The reservation is not held by the caller */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Reservation not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Check-in conflicts with the reservation's current state — it is in a terminal state (cancelled or no-show), or its time range has already ended */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Check-in violates a business rule — the reservation is a room booking (check-in is desks only), or the current time is outside the check-in window (not yet open, or expired as a no-show) */
            422: {
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
