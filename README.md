# Plutonication Server

- Flask version of Plutonication Server.

Used for reliable connection between dApps and Wallets.

Passes payloads between Wallets and dApps.

# Low-level docs

In case you were interested in making your own Plutonication clients, consider reading these docs: https://plutonication.com/docs.

# In code docs

In code docs for each method are included.

<img width="760" alt="Screenshot 2023-11-10 at 22 34 23" src="https://github.com/RostislavLitovkin/PlutonicationServer/assets/77352013/0489922d-b27b-4a19-98c7-4a3e8af1a731">

# Running locally

## Installation
```
# use pip3 on MacOS and Linux
pip install -r requirements.txt
```
## Start local plutonication server
```
waitress-serve --listen=127.0.0.1:8000 main:app
```

# Docker
You can also dockerize it with these commands:

```
docker build --tag plutonication .

docker run plutonication
```

# Testing
The following tests have been tested using Node v16.17.1

Tests are located in the `tests` directory.
```
cd tests
```

## Installation
```
npm i
```

## Run all tests
Before running the tests, make sure that you have the Plutonication Server running locally.

```
npx playwright test
```

Running all tests runs the limiter test that tries to overwhelm the server, which results in banning the client for 1 hours.

Make sure to restart the Plutonication server to remove the ban without waiting 1 hour.

## Run unit tests
Before running unit tests, make sure that you have the Plutonication Server running locally.

```
npx playwright test events.spec.js
```

## Run limiter test
Before running the limitern test, make sure that you have the Plutonication Server running locally.

```
npx playwright test limiter.spec.js
```

Running the limiter test tries to overwhelm the server, which should result in banning the client for 1 hours.

Make sure to restart the Plutonication server to remove the ban without waiting 1 hour.
