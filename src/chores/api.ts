// AUTO-GENERATED from the chores tag of this API's OpenAPI spec by @iambriansreed/api — do not edit.
// Run `npm run generate` in the api repo to update this file.

export interface ChoreStateResponse {
    checked: boolean;
    choreName: string;

    /** YYYY-MM-DD. */
    date: string;

    /** Who the chart had on the chore that day. Empty when the client sent no roster. */
    people: string[];
}

export interface UpsertChoreInput {
    checked: boolean;

    /** Identifies the chore. Trimmed, and half the (chore, date) key. */
    choreName: string;
    date: string;

    /**
     * Who the chart had on the chore that day. Optional: it is a record of the roster,
     * not part of the key, so a client that omits it still ticks the right job.
     *
     * Bounded on both axes — 50 names of 60 characters — so the array cannot be used to
     * push an arbitrary payload into the row.
     */
    people?: string[];
}

let baseUrl = 'https://api.iambrian.com';

/**
 * Points every call in this module at a different origin. A function rather than an
 * exported constant so regenerating this file cannot clobber an app's configuration.
 */
export function configure(options: { baseUrl: string }): void {
    baseUrl = options.baseUrl.replace(/\/+$/, '');
}

/** Thrown for any non-2xx response, carrying the status and whatever body came with it. */
export class ApiError extends Error {
    constructor(
        readonly status: number,
        readonly body: unknown,
    ) {
        super(`${status} from the iambrian API`);
        this.name = 'ApiError';
    }
}

function parse(text: string): unknown {
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

/**
 * Success is any 2xx. The API pins its POSTs to 200 rather than Nest's default 201, so
 * nothing here may assume a particular success code.
 *
 * `init` is spread last, so a caller can pass signal/headers/credentials and can also
 * deliberately override what was generated.
 */
async function request(
    method: string,
    path: string,
    params: unknown,
    queryKeys: string[],
    pathKeys: string[],
    bodyExcludes: string[] | null,
    init?: RequestInit,
): Promise<unknown> {
    // Widened here rather than at each call site: an interface has no index
    // signature, so asserting one straight to Record<string, unknown> is an error.
    const values = (params ?? {}) as Record<string, unknown>;

    let url = path;

    for (const key of pathKeys) {
        url = url.replace(`{${key}}`, encodeURIComponent(String(values[key])));
    }

    const search = new URLSearchParams();

    for (const key of queryKeys) {
        const value = values[key];
        if (value !== undefined && value !== null) search.set(key, String(value));
    }

    const query = search.toString();

    let body: string | undefined;

    if (bodyExcludes) {
        const payload: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(values)) {
            if (!bodyExcludes.includes(key)) payload[key] = value;
        }

        body = JSON.stringify(payload);
    }

    const response = await fetch(`${baseUrl}${url}${query ? `?${query}` : ''}`, {
        method,
        ...(body === undefined ? {} : { body }),
        ...init,
        headers: {
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
            ...init?.headers,
        },
    });

    const parsed = parse(await response.text());

    if (!response.ok) {
        throw new ApiError(response.status, parsed);
    }

    return parsed;
}

/** Returns only the rows that have been ticked or explicitly unticked for that date. */
export function list(params: { date?: string } = {}, init?: RequestInit): Promise<ChoreStateResponse[]> {
    return request(
        'GET',
        '/chores',
        params,
        ['date'],
        [],
        null,
        init,
    ) as Promise<ChoreStateResponse[]>;
}

export function upsert(params: UpsertChoreInput, init?: RequestInit): Promise<ChoreStateResponse> {
    return request(
        'POST',
        '/chores',
        params,
        [],
        [],
        [],
        init,
    ) as Promise<ChoreStateResponse>;
}
