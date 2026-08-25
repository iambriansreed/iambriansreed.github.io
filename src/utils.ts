export const getApiOriginScript = () =>
    raw(
        `window.API_ORIGIN = "https://${process.env.API_HOST || 'api.iambrian.com'}";`,
    );
