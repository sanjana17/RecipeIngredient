// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  dev: true,
  firebaseConfig: {
    apiKey: "AIzaSyB1JSIvCrkz_82kvSkqTM-1gzJROSg16fk",
    authDomain: "myrecipesearch-c52aa.firebaseapp.com",
    databaseURL: "https://myrecipesearch-c52aa.firebaseio.com",
    projectId: "myrecipesearch-c52aa",
    storageBucket: "",
    messagingSenderId: "1041313927441"
  },
  googleCreds: {
    key: "API_KEY",
    secret: "API_SECRET_KEY"
  },
  googleCloudVisionAPIKey: "AIzaSyCUiiGFM9vbof_TTe9bcN1sCKUQ6mnGJv4",

};
