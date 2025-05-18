export const trackSearch = (searchTerm, searchResultsCount) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'search_event',
    search_term: searchTerm,
    search_results_count: searchResultsCount
  });
};

export const trackJsError = (errorMessage, errorLine) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'js_error_event',
    error_message: errorMessage,
    error_line: errorLine
  });
};



export const setupErrorTracking = () => {
  window.addEventListener('error', (event) => {
    trackJsError(
      event.message,
      event.lineno
    );
  });
};




 

