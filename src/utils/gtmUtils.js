
export const initDataLayer = () => {
  window.dataLayer = window.dataLayer || [];
};


export const pushToDataLayer = (event) => {
  initDataLayer();
  window.dataLayer.push(event);
};

