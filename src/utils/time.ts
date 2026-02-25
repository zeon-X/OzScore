export const getDeviceTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};