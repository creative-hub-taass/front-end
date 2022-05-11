declare var process: {
  env: {
    NG_APP_ENV: string;
    NG_APP_GATEWAY_URL: string;
    NG_GEOAPIFY_API_KEY: string;
    NG_MAP_STYLE: string;
    // Replace the line below with your environment variable for better type checking
    [key: string]: any;
  };
};
