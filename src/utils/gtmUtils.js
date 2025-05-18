
export const trackGTMEvent = (eventName, data = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...data
  });
};
