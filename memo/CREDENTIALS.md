# CREDENTIALS

No credentials to be kept secret is not includedin this GitHub repository.

GitHub has below information as secrets:

| Name | Is Secret | Usage |
|:---|:---|:---|
| `FB_APIKEY` | No | Firebase project API key |
| `FB_AUTHDOMAIN` | No | Firebase authorization domain  |
| `FB_PROJECTID` |  No | Firebase project ID  |
| `FB_STORAGEBUCKET` | No | not used |
| `FB_MESSAGINGSENDERID` | No | not used |
| `FB_APPID` | No | Firebase application ID |
| `FB_MEASUREMENTID` | No | not used |
| `FIREBASE_SERVICE_ACCOUNT_WYWIWYA` | Yes | GCP service account secret |

- If `Is Secret` is `No`, there is no need to keep it secret essentially.
  - But Google and GitGuradian annoy me by saying that the secrets are leaked, if they are hardcoded.
  - Hence, these secrets are also loaded via `.env` file and GitHub secrets.
