// AUTO-GENERATED from the materialized contract snapshot. Do not edit.
export interface paths {
    "/auth/sso/callback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Complete SSO login: validate the IdP response, provision or re-sync the User, and establish a session
         * @description Processes the identity-provider authentication response. On success the service establishes a session (delivered to the client as a redirect with a session cookie); the schema below describes the resolved session summary.
         */
        post: operations["authenticateViaSsoCallback"];
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
        SsoCallbackRequest: {
            /**
             * @description The authorization code (or assertion) issued by the identity provider for this login.
             * @example eyJ0eXAiOiJKV1QiLCJhbGciOi...
             */
            authorizationCode: string;
            /**
             * @description Opaque anti-forgery token issued when login was initiated; the recorded return URL is bound to it server-side.
             * @example s-9f2a1c7b-4e10-4d33-9a52-0c1b2d3e4f56
             */
            state: string;
        };
        AuthenticatedSession: {
            /**
             * @description Stable identity-provider identifier associated with the session.
             * @example idp|okta|8a1f-employee-2231
             */
            userId: string;
            /**
             * @description Current SSO role carried on the session; null when the IdP supplied no role claim.
             * @example employee
             */
            ssoRole?: string | null;
            /**
             * @description User's language preference, seeded from the IdP locale claim, defaulting to English.
             * @example nl
             * @enum {string}
             */
            languagePreference: "en" | "nl";
            /**
             * @description True when this login created the User (JIT provisioning); false on a returning login.
             * @example true
             */
            firstLogin: boolean;
            /**
             * @description False when the session carries no SSO role, meaning no bookable-zone access until a manager grants it.
             * @example true
             */
            hasBookableAccess: boolean;
            /**
             * @description Internal path to redirect to after login; the recorded requested URL, or '/' when none was recorded.
             * @example /desks?date=2026-07-27
             */
            returnUrl: string;
        };
        Error: {
            /**
             * @description Machine-readable error code (SCREAMING_SNAKE_CASE — STD-002).
             * @example AUTH_RESPONSE_INVALID
             */
            code: string;
            /**
             * @description Human-readable message, safe to display to end users.
             * @example We could not verify your sign-in. Please try again.
             */
            message: string;
            /** @description Field-level detail; omitted for authentication failures. */
            details?: {
                /** @example authorizationCode */
                field: string;
                /** @example invalid */
                rule: string;
                /** @example The authentication response could not be validated. */
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
    authenticateViaSsoCallback: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SsoCallbackRequest"];
            };
        };
        responses: {
            /** @description Authentication succeeded and a session was established */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthenticatedSession"];
                };
            };
            /** @description The identity-provider response is invalid, expired, or tampered */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "code": "AUTH_RESPONSE_INVALID",
                     *       "message": "We could not verify your sign-in. Please try again."
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Provisioning refused — the response lacks a stable user identifier */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "code": "PROVISIONING_MISSING_IDENTIFIER",
                     *       "message": "We could not complete your sign-in. Please contact facility management."
                     *     }
                     */
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
}
