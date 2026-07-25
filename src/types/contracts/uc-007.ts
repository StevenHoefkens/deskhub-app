// AUTO-GENERATED from the materialized contract snapshot. Do not edit.
export interface paths {
    "/reservations/{reservationId}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Cancel the caller's own reservation before its range ends and free the desk */
        post: operations["cancelReservation"];
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
        CancelResult: {
            /**
             * Format: uuid
             * @example b2c4a1e0-7f3d-4a9b-8c11-0d2e5f6a7b8c
             */
            id: string;
            /**
             * @description Lifecycle status after cancellation
             * @example cancelled
             * @enum {string}
             */
            status: "cancelled";
            /**
             * @description The desk freed by the cancellation
             * @example desk-2b-014
             */
            deskId: string;
            /**
             * Format: date
             * @example 2026-07-27
             */
            date: string;
            granularity: components["schemas"]["Granularity"];
        };
        /**
         * @description Booking granularity — a full day, or the morning or afternoon half-day
         * @example FULL_DAY
         * @enum {string}
         */
        Granularity: "FULL_DAY" | "MORNING" | "AFTERNOON";
        Error: {
            /**
             * @description Machine-readable error code (SCREAMING_SNAKE_CASE — STD-002). One of: RESERVATION_NOT_FOUND, NOT_RESERVATION_OWNER, RESERVATION_ALREADY_ENDED, RESERVATION_NOT_ACTIVE.
             * @example RESERVATION_ALREADY_ENDED
             */
            code: string;
            /**
             * @description Human-readable message, safe to display to end users
             * @example This reservation has already ended and can no longer be cancelled.
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
    cancelReservation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description Identifier of the reservation to cancel
                 * @example res-5501
                 */
                reservationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reservation cancelled */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CancelResult"];
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
            /** @description Reservation cannot be cancelled — its range has already ended, or it is not active */
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
