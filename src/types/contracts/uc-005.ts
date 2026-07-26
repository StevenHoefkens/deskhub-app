// AUTO-GENERATED from the materialized contract snapshot. Do not edit.
export interface paths {
    "/desks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Search available desks for a date, granularity and tag filters, scoped to the employee's bookable zones */
        get: operations["searchAvailableDesks"];
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
        DeskSearchResults: {
            /**
             * Format: date
             * @example 2026-07-27
             */
            date: string;
            granularity: components["schemas"]["Granularity"];
            /**
             * @description True when the employee's effective bookable-zone set is empty; desks is then empty
             * @example false
             */
            noBookingAccess: boolean;
            /** @description Available desks matching the search; empty when none match or the employee has no access */
            desks: components["schemas"]["AvailableDesk"][];
        };
        AvailableDesk: {
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
             * @example [
             *       "standing",
             *       "dual-monitor"
             *     ]
             */
            tags: string[];
        };
        /**
         * @description Booking granularity — a full day, or the morning or afternoon half-day
         * @example FULL_DAY
         * @enum {string}
         */
        Granularity: "FULL_DAY" | "MORNING" | "AFTERNOON";
        Error: {
            /**
             * @description Machine-readable error code (SCREAMING_SNAKE_CASE — STD-002). One of: INVALID_DATE.
             * @example INVALID_DATE
             */
            code: string;
            /**
             * @description Human-readable message, safe to display to end users
             * @example Date must be within the next 30 days.
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
    searchAvailableDesks: {
        parameters: {
            query: {
                /**
                 * @description Search date; must be today or later and within the rolling 30-day horizon
                 * @example 2026-07-27
                 */
                date: string;
                /** @description Booking granularity to check availability for */
                granularity: components["schemas"]["Granularity"];
                /**
                 * @description Tag filters; a desk must carry ALL supplied tags (AND semantics)
                 * @example [
                 *       "standing",
                 *       "dual-monitor"
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
                    "application/json": components["schemas"]["DeskSearchResults"];
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
        };
    };
}
