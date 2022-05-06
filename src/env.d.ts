declare var process: {
  env: {
    NG_APP_ENV: string;
    NG_APP_GATEWAY_URL: string;
    // Replace the line below with your environment variable for better type checking
    [key: string]: any;
  };
};
